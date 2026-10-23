"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tipsterApi, billingApi } from "@/lib/tipster-api";
import { apiErrorMessage, hasAuthSession } from "@/lib/auth-api";
import { TipsterShell, Notice, TipIcon } from "./TipsterUI";
type Form = {
    sport: string;
    competition: string;
    home: string;
    away: string;
    predictionTitle: string;
    predictionDescription: string;
    detailedAnalysis: string;
    analysisSnippet: string;
    predictionCategory: string;
    confidenceLevel: string;
    odds: string;
    matchDate: string;
    kickoffTime: string;
    visibility: string;
    premiumPrice: string;
    scheduledPublishAt: string;
};
const initial: Form = {
    sport: "Football",
    competition: "",
    home: "",
    away: "",
    predictionTitle: "",
    predictionDescription: "",
    detailedAnalysis: "",
    analysisSnippet: "",
    predictionCategory: "Match Winner",
    confidenceLevel: "High",
    odds: "1.9",
    matchDate: "",
    kickoffTime: "",
    visibility: "Free",
    premiumPrice: "4.99",
    scheduledPublishAt: "",
};
export default function TipEditor({ id }: {
    id?: string;
}) {
    const router = useRouter();
    const [competitions, setCompetitions] = useState<string[]>([]);
    const [currency, setCurrency] = useState("aud");
    const [manualCompetition, setManualCompetition] = useState(false);
    const [optionsError, setOptionsError] = useState("");
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [stripeReady, setStripeReady] = useState(false);
    const [form, setForm] = useState(initial), [allowed, setAllowed] = useState(false), [loading, setLoading] = useState(true), [busy, setBusy] = useState(""), [error, setError] = useState("");
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                if (!hasAuthSession()) {
                    window.location.assign(`/login?role=tipster&next=${encodeURIComponent(id ? "/tipster/edit-tip/" + id : "/tipster/create-tip")}`);
                    return;
                }
                const p = await tipsterApi.me();
                if (!active)
                    return;
                setAllowed(Boolean(p.profile?.canPublish));
                if (!id && p.profile?.canPublish) {
                    const account = await billingApi.connectAccountStatus();
                    if (!active) return;
                    setStripeReady(account.accountStatus === "ready");
                }
                if (id) {
                    const { tip } = await tipsterApi.tip(id);
                    if (!active)
                        return;
                    if (tip.tipsterId !== p.profile?.id)
                        throw new Error("This tip belongs to another Tipster.");
                    setForm({
                        ...initial,
                        ...tip,
                        home: tip.teams.home,
                        away: tip.teams.away,
                        predictionDescription: tip.predictionDescription || "",
                        detailedAnalysis: tip.detailedAnalysis || "",
                        analysisSnippet: tip.analysisSnippet || "",
                        odds: String(tip.odds),
                        premiumPrice: String(tip.premiumPrice || 4.99),
                        scheduledPublishAt: tip.scheduledPublishAt
                            ? new Date(new Date(tip.scheduledPublishAt).getTime() -
                                new Date(tip.scheduledPublishAt).getTimezoneOffset() *
                                    60000)
                                .toISOString()
                                .slice(0, 16)
                            : "",
                    });
                }
            }
            catch (e) {
                if (active)
                    setError(e instanceof Error ? e.message : apiErrorMessage(e));
            }
            finally {
                if (active)
                    setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, [id]);
    useEffect(() => {
        let active = true;
        tipsterApi.editorOptions(form.sport).then(r => { if (active) {
            setCompetitions(r.competitions);
            setCurrency(r.currency);
            setOptionsError("");
        } }).catch(() => { if (active) {
            setCompetitions([]);
            setOptionsError("Competition list is unavailable. You can enter the competition name below.");
        } });
        return () => { active = false; };
    }, [form.sport]);
    const set = (key: keyof Form, value: string) => setForm((p) => ({ ...p, [key]: value, ...(key === "sport" ? { competition: "" } : {}) }));
    const submit = async (status: string) => {
        setBusy(status);
        setError("");
        try {
            const body = {
                ...form,
                predictionDescription: form.predictionDescription || form.detailedAnalysis || form.predictionTitle,
                teams: { home: form.home, away: form.away },
                status,
                scheduledPublishAt: status === "Scheduled" && form.scheduledPublishAt
                    ? new Date(form.scheduledPublishAt).toISOString()
                    : null,
            };
            if (id)
                await tipsterApi.update(id, body);
            else
                await tipsterApi.create(body);
            router.push("/tipster/my-tips");
        }
        catch (e) {
            setError(apiErrorMessage(e));
            setBusy("");
        }
    };
    const input = (key: keyof Form, label: string, type = "text") => (<div className={key === "predictionTitle" ? "col-12" : key === "odds" || key === "confidenceLevel" ? "col-md-3" : "col-md-6"} key={key}>
      <label className="form-label" htmlFor={key}>
        {label}
      </label>
      <input placeholder={key === "home" ? "e.g. Arsenal" : key === "away" ? "e.g. Chelsea" : key === "predictionTitle" ? "e.g. Over 2.5 Total Goals & Both Teams To Score" : key === "kickoffTime" ? "e.g. 20:00 AEST" : undefined} id={key} type={type} step={type === "number" ? "0.01" : undefined} value={form[key]} onChange={(e) => set(key, e.target.value)} className="form-control"/>
    </div>);
    const select = (key: keyof Form, label: string, options: string[]) => (<div className={key === "predictionTitle" ? "col-12" : key === "odds" || key === "confidenceLevel" ? "col-md-3" : "col-md-6"} key={key}>
      <label className="form-label" htmlFor={key}>
        {label}
      </label>
      <select id={key} value={form[key]} onChange={(e) => set(key, e.target.value)} className="form-select">
        {options.map((o) => (<option key={o}>{o}</option>))}
      </select>
    </div>);
    return (<TipsterShell className="tip-editor-page" navigation="studio" title={id ? "EDIT SPORTS PREDICTION" : "CREATE SPORTS PREDICTION"} subtitle="Publish a Free Tip to build your audience or a Premium Tip to sell your analysis.">
      <Notice error={error}/>
      {loading ? (<p role="status">Loading editor…</p>) : !allowed ? (<div className="membership-card">
          <p>
            Your Tipster dashboard is available, but an approved profile and
            active Tipster subscription are required to create, edit or publish tips.
          </p>
          <Link href="/tipster-subscription" className="btn btn-success">
            Choose a subscription
          </Link>
        </div>) : !id && !stripeReady ? (<div className="membership-card">
          <h2>Complete your Stripe setup</h2>
          <p>Set up your Stripe account before creating free or paid tips, including drafts.</p>
          <Link href="/tipster/dashboard#stripe-payouts" className="tip-primary">Set up Stripe</Link>
        </div>) : (<form className="membership-card tip-form" onSubmit={(e) => {
                e.preventDefault();
                void submit("Published");
            }}>
          <p className="form-label">1. SELECT TIP VISIBILITY *</p>
          <div className="tip-visibility" role="group" aria-label="Tip visibility">
            {(["Free", "Premium"] as const).map(v => <button type="button" key={v} className={`${v === "Premium" ? "premium" : ""} ${form.visibility === v ? "selected" : ""}`} aria-pressed={form.visibility === v} onClick={() => set("visibility", v)}><span className="tip-status">{v.toUpperCase()} TIP</span> <strong>{v === "Free" ? "Open Access" : "Paid Unlock"}</strong><small>{v === "Free" ? "Free for registered Sports Verge users. Build your audience with your analysis." : "Full prediction and analysis are locked until the reader pays."}</small></button>)}
          </div>
          {form.visibility === "Premium" && <div className="tip-price-box"><div className="row g-3 align-items-end">{input("premiumPrice", `Premium unlock price (${currency.toUpperCase()}) *`, "number")}<div className="col-md-6"><label className="form-label">Quick select presets</label><div className="d-flex gap-2 flex-wrap">{[2.99, 4.99, 9.99, 14.99, 19.99].map(v => <button key={v} type="button" className={`tip-pill ${Number(form.premiumPrice) === v ? "active" : ""}`} onClick={() => set("premiumPrice", String(v))}>{v.toFixed(2)}</button>)}</div><small className="muted">Readers pay securely with Stripe to unlock this prediction.</small></div></div></div>}
          <h2 className="tip-form-section"><i className="bi bi-trophy text-warning me-2"></i> 2. Sport &amp; Match Details</h2>
          <div className="row g-4">
            {select("sport", "Sport *", ["Football", "Cricket", "NFL", "AFL"])}
            <div className="col-md-6"><label className="form-label" htmlFor="competition-list">Competition / League *</label><select id="competition-list" className="form-select" value={manualCompetition ? "__manual" : form.competition} onChange={e => { setManualCompetition(e.target.value === "__manual"); if (e.target.value !== "__manual")
            set("competition", e.target.value); }}><option value="">Select competition</option>{[...new Set([...competitions, ...(form.competition ? [form.competition] : [])])].map(c => <option key={c}>{c}</option>)}<option value="__manual">Other / Enter manually</option></select>{(manualCompetition || optionsError) && <><label className="form-label mt-2" htmlFor="competition">Competition name</label><input id="competition" className="form-control" value={form.competition} onChange={e => set("competition", e.target.value)} placeholder="Enter competition name"/></>}{optionsError && <small className="muted">{optionsError}</small>}</div>
            {input("home", "Home team *")}{input("away", "Away team *")}
            {input("matchDate", "Match date *", "date")}{input("kickoffTime", "Kick-off time (include timezone) *")}
          </div>
          <h2 className="tip-form-section"><i className="bi bi-fire text-danger me-2"></i> 3. Prediction &amp; Odds</h2>
          <div className="row g-4">
            {select("predictionCategory", "Prediction category *", ["Match Winner", "Over/Under", "Both Teams To Score", "Handicap", "Toss Winner", "First Goal Scorer", "Player Prop", "Outright"])}
            {input("odds", "Decimal odds *", "number")}
            {select("confidenceLevel", "Confidence *", ["Low", "Medium", "High"])}
            {input("predictionTitle", "Prediction title / Main pick *")}
            {(["analysisSnippet", "predictionDescription", "detailedAnalysis"] as const).map(key => <div className="col-12" key={key}>{key === "predictionDescription" ? <details><summary className="muted small">Additional prediction details</summary><label className="visually-hidden" htmlFor={key}>Full prediction</label><textarea id={key} rows={4} className="form-control mt-2" value={form[key]} onChange={e=>set(key,e.target.value)} /></details> : <><label className="form-label" htmlFor={key}>{key === "analysisSnippet" ? "Prediction summary / Public preview" : `Detailed analysis & staking discipline ${form.visibility === "Premium" ? "(Locked content)" : "(Optional)"}`}</label><textarea id={key} rows={key === "analysisSnippet" ? 2 : 4} className="form-control" value={form[key]} onChange={e => set(key, e.target.value)} placeholder={key === "analysisSnippet" ? "Public summary highlighting the reason for your selection..." : "Write your match breakdown and prediction..."}/></>}</div>)}
            {scheduleOpen && input("scheduledPublishAt", "Publish at (your local time)", "datetime-local")}
          </div>
          <div className="tip-form-actions">
            <button className="tip-pill" type="button" disabled={Boolean(busy)} onClick={() => submit("Draft")}>
              <i className="bi bi-file-earmark me-1"></i> Save as Draft
            </button>
            <button className="tip-pill" type="button" disabled={Boolean(busy)} onClick={() => { if (!scheduleOpen) {
            setScheduleOpen(true);
            return;
        } if (!form.scheduledPublishAt) {
            setError("Choose a publish date and time first.");
            return;
        } void submit("Scheduled"); }}>
              <i className="bi bi-calendar3 me-1"></i> Schedule Tip
            </button>
            <button className="tip-primary" type="submit" disabled={Boolean(busy)}>
              <i className="bi bi-send-fill me-1"></i>{busy ? "Saving…" : "Publish Tip Now"}
            </button>
          </div>
        </form>)}
    </TipsterShell>);
}

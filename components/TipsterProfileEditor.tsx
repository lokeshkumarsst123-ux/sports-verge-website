"use client";
import { useEffect, useState, type ReactNode } from "react";
import { tipsterApi, tipsterRequest } from "@/lib/tipster-api";
import { apiErrorMessage, hasAuthSession } from "@/lib/auth-api";
import type { TipsterProfile, SportType } from "@/types/tipster";
import Link from "next/link";
import ProfileAvatar from "./ProfileAvatar";
import { TipsterShell, Notice, ProfileHero, StatsGrid } from "./TipsterUI";
function EditorFrame({embedded,children}:{embedded:boolean;children:ReactNode}) {
    return embedded ? <section id="tipster-profile" className="tip-module tip-account-editor"><h3 className="h5 mb-3">Tipster Profile Details</h3><p className="muted small">Manage your public profile and sports expertise. Your account name, email and password are managed above.</p>{children}</section> : <TipsterShell title="" navigation="none">{children}</TipsterShell>;
}
export default function TipsterProfileEditor({embedded=false,accountEmail}:{embedded?:boolean;accountEmail?:string}) {
    const [photoBusy,setPhotoBusy]=useState(false);
    const [editing, setEditing] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("edit") === "tipster");
    const [snapshot, setSnapshot] = useState<TipsterProfile | null>(null);
    const [profile, setProfile] = useState<TipsterProfile | null>(null), [error, setError] = useState(""), [saved, setSaved] = useState(false), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true);
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                if (!hasAuthSession()) {
                    window.location.assign("/login?next=%2Ftipster%2Fprofile");
                    return;
                }
                const r = await tipsterApi.me();
                if (active) {
                    setProfile(r.profile);
                    setSnapshot(r.profile);
                }
            }
            catch (e) {
                if (active)
                    setError(apiErrorMessage(e));
            }
            finally {
                if (active)
                    setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);
    const uploadPhoto=async(file?:File)=>{if(!file)return;if(file.size>2*1024*1024||!["image/jpeg","image/png","image/webp"].includes(file.type)){setError("Choose a JPG, PNG or WebP photo smaller than 2 MB.");return;}setPhotoBusy(true);setError("");try{const result=await tipsterApi.uploadPhoto(file);setProfile(p=>p?{...p,avatarUrl:result.avatarUrl}:p);setSnapshot(p=>p?{...p,avatarUrl:result.avatarUrl}:p);}catch(e){setError(apiErrorMessage(e));}finally{setPhotoBusy(false);}};
    const save = async () => {
        if (!profile)
            return;
        setBusy(true);
        setSaved(false);
        setError("");
        try {
            const r = await tipsterRequest<{
                profile: TipsterProfile;
            }>("/tipster/profile", { method: "PATCH", body: profile });
            setProfile(r.profile);
            setSaved(true);
            setSnapshot(r.profile);
            setEditing(false);
        }
        catch (e) {
            setError(apiErrorMessage(e));
        }
        finally {
            setBusy(false);
        }
    };
    return (<EditorFrame embedded={embedded}>
      {profile && <div className="tip-toolbar mb-4"><Link className="tip-pill" href="/tipster/dashboard">Back to Dashboard</Link><div className="d-flex gap-2 flex-wrap">{profile.verificationStatus === "verified" && !profile.isSuspended && <Link className="tip-pill" href={`/tipsters/${profile.id}`}>View Public Profile</Link>}{!editing && <button className="tip-primary" onClick={() => {setSaved(false);setEditing(true);}}>Edit Profile</button>}</div></div>}
      <Notice error={error}/>
      {saved && <p role="status" className="alert alert-success">Your profile has been updated.</p>}
      {loading ? (<p role="status">Loading profile…</p>) : profile && !editing ? (<>
          <ProfileHero profile={profile} owner><button className="tip-pill" onClick={() => setEditing(true)}>Edit Profile</button></ProfileHero>
          <StatsGrid items={[{ label: "Win Rate", value: profile.stats.winRate == null ? "\u2014" : `${profile.stats.winRate}%`, detail: "Verified prediction results", color: "#16A34A", icon: "bi bi-trophy" }, { label: "Total Tips", value: profile.stats.publishedTips ?? profile.stats.totalTips, detail: "Published predictions", color: "#1C1F22", icon: "bi bi-journal-check" }, { label: "Followers", value: profile.stats.followersCount, detail: "People following your profile", color: "#2563EB", icon: "bi bi-people-fill" }]}/>
          <div className="tip-two-col"><section className="tip-panel"><div className="tip-heading"><h2>Profile Details</h2></div><dl className="tip-detail-list"><dt>Public Display Name:</dt><dd>{profile.displayName}</dd><dt>Username:</dt><dd>@{profile.username}</dd><dt>Email Address:</dt><dd>{accountEmail || profile.email}</dd><dt>Mobile Number:</dt><dd>{profile.mobileNumber || "Not provided"}</dd><dt>Country:</dt><dd>{profile.country}</dd><dt>Experience:</dt><dd>{profile.yearsOfExperience} Years</dd><dt>Verification:</dt><dd>{profile.verificationStatus}</dd><dt>Subscription Plan:</dt><dd><span className="tip-status">{profile.subscriptionPlan || "No plan"} ({profile.subscriptionStatus})</span></dd></dl></section><section className="tip-panel"><div className="tip-heading"><h2>Connected Social Channels</h2></div><dl className="tip-detail-list">{(["twitter", "telegram", "youtube", "instagram"] as const).map(key => <div key={key} style={{ display: "contents" }}><dt>{key === "twitter" ? "Twitter / X" : key.charAt(0).toUpperCase() + key.slice(1)}:</dt><dd>{profile.socialLinks?.[key] ? <a className="text-success" href={profile.socialLinks[key]} target="_blank" rel="noopener noreferrer">{profile.socialLinks[key]?.replace(/^https:\/\//, "")}</a> : "Not linked"}</dd></div>)}</dl><button className="tip-pill w-100" onClick={() => setEditing(true)}>Update Social Links &amp; Bio</button></section></div>
        </>) : profile ? (<form className="membership-card tip-form" onSubmit={(e) => {
                e.preventDefault();
                void save();
            }}>
          <div className="row g-4">
            {([
                "displayName",
                "username",
                "mobileNumber",
                "country",
                "yearsOfExperience",
            ] as const).map((key) => (<div className="col-md-6" key={key}>
                <label htmlFor={key} className="form-label">
                  {key === "displayName"
                    ? "Display name"
                    : key === "mobileNumber"
                        ? "Mobile number"
                        : key === "yearsOfExperience"
                            ? "Years of experience"
                            : key}
                </label>
                <input required={key !== "mobileNumber"} id={key} min={key === "yearsOfExperience" ? 0 : undefined} max={key === "yearsOfExperience" ? 80 : undefined} step={key === "yearsOfExperience" ? 1 : undefined} type={key === "yearsOfExperience" ? "number" : key === "mobileNumber" ? "tel" : "text"} className="form-control" value={profile[key] ?? ""} onChange={(e) => setProfile((p) => p
                    ? {
                        ...p,
                        [key]: key === "yearsOfExperience"
                            ? Number(e.target.value)
                            : e.target.value,
                    }
                    : p)}/>
              </div>))}
            <div className="col-12">
              <label htmlFor="bio" className="form-label">
                Short bio
              </label>
              <textarea required minLength={20} maxLength={400} id="bio" rows={5} className="form-control" value={profile.shortBio} onChange={(e) => setProfile((p) => p ? { ...p, shortBio: e.target.value } : p)}/>
            </div>
            <fieldset className="col-12">
              <legend className="h6">Preferred sports</legend>
              <div className="d-flex gap-4 flex-wrap">
                {(["Cricket", "Football", "NFL", "AFL"] as SportType[]).map((s) => (<label key={s}>
                      <input type="checkbox" className="form-check-input me-2" checked={profile.preferredSports.includes(s)} onChange={(e) => setProfile((p) => p
                    ? {
                        ...p,
                        preferredSports: e.target.checked
                            ? [...p.preferredSports, s]
                            : p.preferredSports.filter((v) => v !== s),
                    }
                    : p)}/>
                      {s}
                    </label>))}
              </div>
            </fieldset>
            <div className="col-12"><label className="form-label" htmlFor="profile-photo">Your profile photo</label><div className="d-flex align-items-center gap-3 flex-wrap"><ProfileAvatar name={profile.displayName} url={profile.avatarUrl} size={64}/><div className="flex-grow-1 min-w-0"><input id="profile-photo" type="file" accept="image/jpeg,image/png,image/webp" disabled={photoBusy||busy} className="form-control" onChange={e=>{void uploadPhoto(e.target.files?.[0]);e.target.value="";}}/><small className="muted">{photoBusy?"Uploading your photo...":"JPG, PNG or WebP, up to 2 MB. Your photo is saved when the upload completes."}</small></div></div></div>
            {(["twitter", "telegram", "youtube", "instagram"] as const).map(key => <div key={key} className="col-md-6"><label className="form-label" htmlFor={`social-${key}`}>{key} channel (optional)</label><input id={`social-${key}`} type="url" className="form-control" placeholder="https://..." value={profile.socialLinks?.[key] || ""} onChange={e => setProfile(p => p ? { ...p, socialLinks: { ...p.socialLinks, [key]: e.target.value } } : p)}/></div>)}
          </div>
          <div className="d-flex gap-2 flex-wrap mt-4">
            <button className="tip-primary" disabled={busy||photoBusy}>
              {busy ? "Saving…" : "Save profile"}
            </button>
            <button type="button" className="tip-pill" disabled={busy||photoBusy} onClick={() => { setProfile(snapshot); setEditing(false); }}>Cancel</button>
          </div>
          {saved && (<p role="status" className="text-success mt-3">
              Profile saved.
            </p>)}
        </form>) : !embedded ? (<p>Complete Tipster registration first.</p>) : (<p>You have not joined as a Tipster yet. <Link href="/tipster-register" className="text-success">Set up your Tipster profile</Link></p>)}
    </EditorFrame>);
}

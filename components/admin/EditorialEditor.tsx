"use client";
import { useState } from "react";
import { tipsterRequest } from "@/lib/tipster-api";
import type { EditorialLayout } from "@/lib/content-api";
const frameworks = ["Gladiator Edge", "Analytical Velocity", "Rooster Pivot"];
export default function EditorialEditor({
  articleId,
  initial,
}: {
  articleId: string;
  initial?: EditorialLayout;
}) {
  const [texts, setTexts] = useState(
    frameworks.map(
      (f) => initial?.perspectives?.find((p) => p.framework === f)?.text || "",
    ),
  );
  const [question, setQuestion] = useState(initial?.poll?.question || ""),
    [options, setOptions] = useState(initial?.poll?.options.join("\n") || ""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const save = async () => {
    setBusy(true);
    setMessage("");
    try {
      await tipsterRequest(`/content/articles/${articleId}/editorial`, {
        method: "PUT",
        admin: true,
        body: {
          perspectives: frameworks.flatMap((framework, i) =>
            texts[i].trim() ? [{ framework, text: texts[i] }] : [],
          ),
          ...(question.trim()
            ? {
                poll: {
                  question,
                  options: options
                    .split("\n")
                    .map((o) => o.trim())
                    .filter(Boolean),
                },
              }
            : {}),
        },
      });
      setMessage("Editorial layout saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to save.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="admin-card mt-4">
      <div className="admin-card-header">
        <strong>Article perspectives & reader poll</strong>
      </div>
      <div className="admin-card-body">
        <p className="text-secondary">
          Add individual perspectives to display them as three article blocks.
          Leave a perspective empty to omit it.
        </p>
        <div className="row g-3">
          {frameworks.map((f, i) => (
            <div key={f} className="col-lg-4">
              <label className="admin-form-label" htmlFor={`perspective-${i}`}>
                {f}
              </label>
              <textarea
                id={`perspective-${i}`}
                rows={7}
                className="form-control admin-form-control"
                value={texts[i]}
                onChange={(e) =>
                  setTexts((t) =>
                    t.map((v, n) => (n === i ? e.target.value : v)),
                  )
                }
              />
            </div>
          ))}
        </div>
        <label className="admin-form-label mt-4" htmlFor="poll-question">
          Poll question (optional)
        </label>
        <input
          id="poll-question"
          className="form-control admin-form-control"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <label className="admin-form-label mt-3" htmlFor="poll-options">
          Options — one per line (2–6)
        </label>
        <textarea
          id="poll-options"
          className="form-control admin-form-control"
          rows={3}
          value={options}
          onChange={(e) => setOptions(e.target.value)}
        />
        <p className="text-secondary small mt-2">
          Changing the question or options resets votes for this poll.
        </p>
        <button
          type="button"
          className="btn btn-success"
          onClick={save}
          disabled={busy}
        >
          {busy ? "Saving…" : "Save article layout"}
        </button>
        {message && (
          <p className="mt-3 mb-0" role="status">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}

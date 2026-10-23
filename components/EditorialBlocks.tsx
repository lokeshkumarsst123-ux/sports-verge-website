"use client";
import { useEffect, useState } from "react";
import { tipsterRequest } from "@/lib/tipster-api";
import type { EditorialLayout } from "@/lib/content-api";
type Poll = { counts: number[]; total: number; myVote: number | null };
export default function EditorialBlocks({
  articleId,
  layout,
}: {
  articleId: string;
  layout: EditorialLayout;
}) {
  const [poll, setPoll] = useState<Poll | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const configured = Boolean(
    layout.poll?.question && layout.poll.options?.length,
  );
  useEffect(() => {
    let active = true;
    if (configured)
      tipsterRequest<Poll>(`/content/articles/${articleId}/poll`)
        .then((p) => {
          if (active) setPoll(p);
        })
        .catch(() => {
          if (active) setError("Unable to load poll.");
        });
    return () => {
      active = false;
    };
  }, [articleId, configured]);
  const vote = async (optionIndex: number) => {
    setBusy(true);
    setError("");
    try {
      setPoll(
        await tipsterRequest<Poll>(`/content/articles/${articleId}/poll`, {
          method: "POST",
          body: { optionIndex },
        }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save vote.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="my-4">
      {!!layout.perspectives?.length && (
        <section aria-label="Editorial perspectives">
          <h2 className="h4 mb-4">Three perspectives. One story.</h2>
          <div className="row g-3">
            {layout.perspectives.map((block, index) => (
              <div key={block.framework} className="col-lg-4">
                <article
                  className={`editorial-perspective perspective-${index}`}
                >
                  <span className="text-uppercase small fw-bold">
                    Perspective 0{index + 1}
                  </span>
                  <h3 className="h5 mt-2">{block.framework}</h3>
                  <p className="editorial-copy mb-0">{block.text}</p>
                </article>
              </div>
            ))}
          </div>
        </section>
      )}
      {configured && (
        <section className="membership-card mt-4" aria-label="Reader poll">
          <span className="text-success text-uppercase small fw-bold">
            Have your say
          </span>
          <h2 className="h4 mt-2">{layout.poll?.question}</h2>
          <p className="text-secondary small">
            One vote per reader. {poll?.total || 0} votes
          </p>
          <div className="d-grid gap-2">
            {layout.poll?.options.map((option, i) => (
              <button
                key={i}
                className={`btn text-start ${poll?.myVote === i ? "btn-success" : "btn-outline-success"}`}
                disabled={busy || !poll || poll.myVote !== null}
                onClick={() => vote(i)}
              >
                {option}
                {poll && poll.myVote !== null && (
                  <span className="float-end">
                    {poll.total
                      ? Math.round(((poll.counts[i] || 0) / poll.total) * 100)
                      : 0}
                    %
                  </span>
                )}
              </button>
            ))}
          </div>
          {poll?.myVote !== null && poll && (
            <p className="text-success small mt-3 mb-0" role="status">
              Your vote has been recorded.
            </p>
          )}
          {error && (
            <p className="text-danger mt-2" role="alert">
              {error}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

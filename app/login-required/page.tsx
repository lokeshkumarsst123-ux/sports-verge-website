"use client";

const safeNextPath = () => {
  if (typeof window === "undefined") return "";
  const requestedNext = new URLSearchParams(window.location.search).get("next");
  return requestedNext && requestedNext.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "";
};

export default function LoginRequiredPage() {
  const goTo = (path: "/login" | "/register") => {
    const nextPath = safeNextPath();
    const next = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    window.location.assign(`${path}${next}`);
  };

  return (
    <main className="font-outfit text-white">
      <div className="container custom-container py-5">
        <div className="mx-auto text-center p-4 p-md-5 bg-card border border-dark rounded-4 shadow-lg" style={{ maxWidth: "520px" }}>
          <div
            className="d-flex align-items-center justify-content-center mx-auto mb-4 rounded-circle"
            style={{ width: "68px", height: "68px", color: "#86efac", background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.28)", fontSize: "1.6rem" }}
          >
            <i className="bi bi-lock-fill" />
          </div>
          <h2 className="fw-bold mb-2 text-white">Login required</h2>
          <p className="text-muted mb-4">Please log in or create an account to manage your favorites.</p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <button type="button" onClick={() => goTo("/login")} className="btn btn-success fw-bold px-4 py-2 rounded-pill">Log in to continue</button>
            <button type="button" onClick={() => goTo("/register")} className="btn btn-outline-success fw-semibold px-4 py-2 rounded-pill">Create account</button>
          </div>
        </div>
      </div>
    </main>
  );
}

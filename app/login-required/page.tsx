"use client";

const safeNextPath = () => {
  if (typeof window === "undefined") return "";
  const requestedNext = new URLSearchParams(window.location.search).get("next");
  return requestedNext && requestedNext.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "";
};

export default function LoginRequiredPage() {
  const goTo = (path: "/login" | "/register" | "/signup") => {
    const nextPath = safeNextPath();
    const next = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    window.location.assign(`${path}${next}`);
  };

  return (
    <main className="font-outfit" style={{ background: "#FFFDF9", minHeight: "100vh" }}>
      <div className="container custom-container py-5">
        <div className="mx-auto text-center p-4 p-md-5 rounded-4 shadow-sm" style={{ maxWidth: "520px", background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
          <div
            className="d-flex align-items-center justify-content-center mx-auto mb-4 rounded-circle"
            style={{ width: "68px", height: "68px", color: "#1C1F22", background: "#FFCC00", fontSize: "1.6rem" }}
          >
            <i className="bi bi-lock-fill" />
          </div>
          <h2 className="fw-bold mb-2 font-space-grotesk" style={{ color: "#1C1F22" }}>Login required</h2>
          <p className="small mb-4" style={{ color: "#5C646D" }}>Please log in or create an account to manage your favorites.</p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <button
              type="button"
              onClick={() => goTo("/login")}
              className="btn fw-bold px-4 py-2 rounded-pill shadow-sm"
              style={{ background: "#FFCC00", color: "#1C1F22", border: "none" }}
            >
              Log in to continue
            </button>
            <button
              type="button"
              onClick={() => goTo("/signup")}
              className="btn fw-semibold px-4 py-2 rounded-pill"
              style={{ background: "#FAF6EF", border: "1px solid #EAE5DC", color: "#1C1F22" }}
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

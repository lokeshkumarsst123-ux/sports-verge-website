import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Terms of Use – The SportsVerge" };

const terms = [
  { icon: "bi-check-circle-fill", title: "Acceptance of Terms", body: "By accessing and using The SportsVerge platform, you accept and agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree, please do not use our services." },
  { icon: "bi-person-fill", title: "User Accounts", body: "To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be at least 13 years old to create an account." },
  { icon: "bi-file-earmark-text-fill", title: "Content Usage", body: "All content on The SportsVerge, including articles, images, scores, and statistics, is protected by copyright and intellectual property laws. You may not reproduce, distribute, or commercially exploit our content without express written permission." },
  { icon: "bi-hand-thumbs-up-fill", title: "Acceptable Use", body: "You agree not to use our platform for any unlawful purposes, to post abusive or defamatory content, to attempt unauthorized access to our systems, or to engage in any conduct that could harm other users or our platform's reputation." },
  { icon: "bi-exclamation-triangle-fill", title: "Disclaimer of Warranties", body: "The SportsVerge provides its services on an 'as is' and 'as available' basis. We do not warrant that the service will be uninterrupted, error-free, or completely secure. Sports data including scores and statistics may occasionally be delayed or inaccurate." },
  { icon: "bi-arrow-repeat", title: "Changes to Terms", body: "We reserve the right to modify these Terms of Use at any time. We will notify users of significant changes. Continued use of the platform after changes constitutes acceptance of the updated terms." },
];

export default function TermsOfUsePage() {
  return (
    <main className="font-outfit">
      <div className="container custom-container" style={{ maxWidth: "820px" }}>
        {/* Header */}
        <PageHeader
          title="Terms of Use"
          subtitle="Last updated: July 2026  ·  Please read carefully before using our services"
          className="mb-5 px-0"
        />

        {/* Intro */}
        <div className="rounded-4 p-4 mb-5" style={{ background: "rgba(26,140,61,0.08)", border: "1px solid rgba(26,140,61,0.2)" }}>
          <p className="text-muted lh-lg mb-0" style={{ fontSize: "14px" }}>
            These Terms of Use govern your use of <strong className="text-white">The SportsVerge</strong> platform and services. By using our platform, you agree to these terms. Please read them carefully.
          </p>
        </div>

        <div className="d-flex flex-column gap-4">
          {terms.map((t, i) => (
            <div key={i} className="rounded-4 p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: "44px", height: "44px", background: "rgba(26,140,61,0.12)", flexShrink: 0 }}>
                  <i className={`bi ${t.icon}`} style={{ fontSize: "1.2rem", color: "#86efac" }}></i>
                </div>
                <h5 className="fw-bold text-white mb-0 font-space-grotesk" style={{ fontSize: "16px" }}>{i + 1}. {t.title}</h5>
              </div>
              <p className="text-muted lh-lg mb-0" style={{ fontSize: "14px" }}>{t.body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-4 p-4 mt-4 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
          <p className="text-muted mb-2" style={{ fontSize: "13px" }}>Questions about our Terms of Use? Contact us at:</p>
          <a href="mailto:legal@sportsverge.com" className="fw-semibold text-decoration-none" style={{ fontSize: "14px", color: "#86efac" }}>
            legal@sportsverge.com
          </a>
        </div>
      </div>
    </main>
  );
}

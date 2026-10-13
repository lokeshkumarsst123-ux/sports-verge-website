import PageHeader from "@/components/PageHeader";

type LegalDocumentProps = {
  title: string;
  subtitle: string;
  content: string;
  contactText: string;
  contactEmail: string;
};

export default function LegalDocument({ title, subtitle, content, contactText, contactEmail }: LegalDocumentProps) {
  const sections = content.split(/\n\s*\n/).map((section) => section.trim()).filter(Boolean).map((section) => {
    const lines = section.split("\n").map((line) => line.trim()).filter(Boolean);
    return { heading: lines.length > 1 ? lines[0] : "", body: lines.length > 1 ? lines.slice(1).join("\n") : lines[0] };
  });

  return (
    <main className="font-outfit">
      <div className="container custom-container" style={{ maxWidth: "940px", paddingRight: "24px", paddingLeft: "24px" }}>
        <PageHeader title={title} subtitle={subtitle} className="mb-5 px-0" />
        <div className="rounded-4 p-4 mb-5" style={{ background: "rgba(26,140,61,0.08)", border: "1px solid rgba(26,140,61,0.2)" }}>
          <p className="text-muted lh-lg mb-0" style={{ fontSize: "14px" }}>
            Please read this document carefully. It explains the rules and information that apply when you use The SportsVerge platform.
          </p>
        </div>
        <div className="d-flex flex-column gap-4">
          {sections.map((section, index) => (
            <section key={`${section.heading}-${index}`} className="rounded-4 p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
              {section.heading && <h5 className="fw-bold text-white mb-3 font-space-grotesk" style={{ fontSize: "16px" }}>{index + 1}. {section.heading}</h5>}
              {section.body && <p className="text-muted lh-lg mb-0" style={{ fontSize: "14px", whiteSpace: "pre-wrap" }}>{section.body}</p>}
            </section>
          ))}
        </div>
        <div className="rounded-4 p-4 mt-4 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
          <p className="text-muted mb-2" style={{ fontSize: "13px" }}>{contactText}</p>
          <a href={`mailto:${contactEmail}`} className="text-success fw-semibold text-decoration-none" style={{ fontSize: "14px" }}>{contactEmail}</a>
        </div>
      </div>
    </main>
  );
}

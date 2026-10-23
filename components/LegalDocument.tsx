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
    <main className="font-outfit" style={{ background: "#FFFDF9", minHeight: "100vh", paddingBottom: "80px" }}>
      <div className="container custom-container" style={{ maxWidth: "940px", paddingRight: "24px", paddingLeft: "24px" }}>
        <PageHeader title={title} subtitle={subtitle} className="mb-5 px-0" />
        <div className="rounded-4 p-4 mb-4 shadow-sm" style={{ background: "#FAF6EF", border: "1px solid #EAE5DC" }}>
          <div className="d-flex align-items-center gap-3">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "36px", height: "36px", background: "#FFCC00", color: "#1C1F22" }}>
              <i className="bi bi-info-circle-fill"></i>
            </div>
            <p className="lh-lg mb-0" style={{ color: "#1C1F22", fontSize: "14px", fontWeight: 500 }}>
              Please read this document carefully. It explains the rules and information that apply when you use The SportsVerge platform.
            </p>
          </div>
        </div>
        <div className="d-flex flex-column gap-4">
          {sections.map((section, index) => (
            <section key={`${section.heading}-${index}`} className="rounded-4 p-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
              {section.heading && (
                <h5 className="fw-bold mb-3 font-space-grotesk" style={{ color: "#1C1F22", fontSize: "17px", letterSpacing: "-0.01em" }}>
                  {index + 1}. {section.heading}
                </h5>
              )}
              {section.body && (
                <p className="lh-lg mb-0" style={{ color: "#5C646D", fontSize: "15px", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                  {section.body}
                </p>
              )}
            </section>
          ))}
        </div>
        <div className="rounded-4 p-4 mt-4 text-center shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
          <p className="mb-2" style={{ color: "#5C646D", fontSize: "14px" }}>{contactText}</p>
          <a href={`mailto:${contactEmail}`} className="fw-bold text-decoration-none" style={{ color: "#4A90E2", fontSize: "15px" }}>
            {contactEmail}
          </a>
        </div>
      </div>
    </main>
  );
}

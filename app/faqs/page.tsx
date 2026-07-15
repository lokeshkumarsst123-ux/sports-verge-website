"use client";
import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";

const faqGroups = [
  {
    group: "General", icon: "bi-question-circle-fill", color: "#22c55e",
    faqs: [
      { q: "What is The SportsVerge?", a: "A comprehensive sports platform offering live scores, news, fixtures, and standings across Cricket, Football, NFL, AFL, and more." },
      { q: "Is SportsVerge free to use?", a: "Yes! Core features are completely free. Browse live scores, read news, and explore standings without any subscription." },
      { q: "Which sports does SportsVerge cover?", a: "Cricket, Football, NFL, AFL, and General Sports. More sports are being added regularly." },
    ]
  },
  {
    group: "Account", icon: "bi-person-fill", color: "#3b82f6",
    faqs: [
      { q: "How do I create an account?", a: "Click 'Register' in the navigation and fill in your details. Account creation is free and takes under a minute." },
      { q: "Can I use SportsVerge without an account?", a: "Yes. Most features are accessible without logging in. An account lets you personalize your experience and enable notifications." },
      { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page and enter your email. You will receive a reset link within a few minutes." },
    ]
  },
  {
    group: "Live Scores", icon: "bi-broadcast", color: "#f59e0b",
    faqs: [
      { q: "How live are the scores?", a: "Scores update in near real-time with a refresh rate under 30 seconds for most sports." },
      { q: "Why are some scores delayed?", a: "Occasional delays can occur due to data provider issues. We work continuously to minimize this." },
      { q: "Can I enable score notifications?", a: "Yes — after creating an account, visit Notification Settings to enable alerts for your favorite teams." },
    ]
  },
];

export default function FAQsPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const toggle = (key: string) => setOpenItem(openItem === key ? null : key);

  return (
    <main className="font-outfit">
      <div className="container custom-container" style={{ maxWidth: "780px" }}>
        {/* Header */}
        <PageHeader
          title="FAQs"
          subtitle="Can't find what you're looking for? Check our Help Center or Contact Us."
          className="mb-5 px-0"
        />

        {faqGroups.map((group) => (
          <div key={group.group} className="mb-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className={`bi ${group.icon}`} style={{ color: group.color, fontSize: "1.1rem" }}></i>
              <h5 className="fw-bold text-white mb-0 font-space-grotesk">{group.group}</h5>
            </div>
            <div className="d-flex flex-column gap-2">
              {group.faqs.map((faq, i) => {
                const key = `${group.group}-${i}`;
                const isOpen = openItem === key;
                return (
                  <div key={key} className="rounded-3 overflow-hidden" style={{ border: `1px solid ${isOpen ? group.color + "40" : "var(--border-dark)"}`, background: isOpen ? `${group.color}08` : "var(--bg-card)" }}>
                    <button className="w-100 d-flex align-items-center justify-content-between gap-3 p-3 text-start border-0" style={{ background: "none", color: isOpen ? "#fff" : "var(--text-muted)", fontSize: "14px", fontWeight: isOpen ? 600 : 400, cursor: "pointer" }} onClick={() => toggle(key)}>
                      <span style={{ color: isOpen ? "#white" : "inherit" }}>{faq.q}</span>
                      <i className={`bi ${isOpen ? "bi-dash-lg" : "bi-plus-lg"} flex-shrink-0`} style={{ color: group.color, fontSize: "14px" }}></i>
                    </button>
                    {isOpen && <div className="px-3 pb-3"><p className="text-muted mb-0 lh-lg" style={{ fontSize: "13px" }}>{faq.a}</p></div>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

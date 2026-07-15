import React from "react";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Privacy Policy – The SportsVerge" };

const sections = [
  {
    icon: "bi-shield-lock-fill",
    title: "Information We Collect",
    content: "We collect information you provide directly, such as when you create an account, subscribe to our newsletter, or contact us. This may include your name, email address, and preferences. We also automatically collect certain information when you use our platform, including your IP address, browser type, pages visited, and time spent on each page."
  },
  {
    icon: "bi-gear-fill",
    title: "How We Use Your Information",
    content: "We use the information we collect to provide, maintain, and improve our services; send you sports news updates and notifications you have subscribed to; respond to your comments and questions; monitor and analyze usage patterns; and detect and prevent fraudulent or unauthorized activity."
  },
  {
    icon: "bi-share-fill",
    title: "Information Sharing",
    content: "We do not sell, rent, or share your personal information with third parties for their marketing purposes. We may share your information with trusted service providers who assist us in operating our platform, but they are required to keep your information confidential and may only use it to perform services on our behalf."
  },
  {
    icon: "bi-cookie",
    title: "Cookies & Tracking",
    content: "We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies help us remember your preferences, analyze site traffic, and personalize content. You can control cookie settings through your browser settings, though some features may not function properly if cookies are disabled."
  },
  {
    icon: "bi-lock-fill",
    title: "Data Security",
    content: "We take the security of your personal information seriously and implement appropriate technical and organizational measures to protect it against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
  },
  {
    icon: "bi-person-check-fill",
    title: "Your Rights",
    content: "You have the right to access, update, or delete your personal information at any time. You may also opt out of receiving promotional emails by following the unsubscribe instructions in any email we send. For requests regarding your data, please contact us through our Contact Us page."
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="font-outfit">
      <div className="container custom-container" style={{ maxWidth: "820px" }}>
        {/* Header */}
        <PageHeader
          title="Privacy Policy"
          subtitle="Last updated: July 2026  ·  Effective immediately"
          className="mb-5 px-0"
        />

        {/* Intro */}
        <div className="rounded-4 p-4 mb-5" style={{ background: "rgba(26,140,61,0.08)", border: "1px solid rgba(26,140,61,0.2)" }}>
          <p className="text-muted lh-lg mb-0" style={{ fontSize: "14px" }}>
            At <strong className="text-white">The SportsVerge</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform. Please read this policy carefully.
          </p>
        </div>

        <div className="d-flex flex-column gap-4">
          {sections.map((s, i) => (
            <div key={i} className="rounded-4 p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: "44px", height: "44px", background: "rgba(26,140,61,0.12)", flexShrink: 0 }}>
                  <i className={`bi ${s.icon} text-success`} style={{ fontSize: "1.2rem" }}></i>
                </div>
                <h5 className="fw-bold text-white mb-0 font-space-grotesk" style={{ fontSize: "16px" }}>
                  {i + 1}. {s.title}
                </h5>
              </div>
              <p className="text-muted lh-lg mb-0" style={{ fontSize: "14px" }}>{s.content}</p>
            </div>
          ))}
        </div>

        <div className="rounded-4 p-4 mt-4 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
          <p className="text-muted mb-2" style={{ fontSize: "13px" }}>
            If you have questions about this Privacy Policy, contact us at:
          </p>
          <a href="mailto:privacy@sportsverge.com" className="text-success fw-semibold text-decoration-none" style={{ fontSize: "14px" }}>
            privacy@sportsverge.com
          </a>
        </div>
      </div>
    </main>
  );
}

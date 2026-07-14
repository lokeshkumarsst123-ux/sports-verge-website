"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "Received" | "Under Review" | "Resolved";
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [lastSubmittedInquiry, setLastSubmittedInquiry] = useState<Inquiry | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Load inquiries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sportsverge_contact_inquiries");
    if (saved) {
      try {
        setInquiries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load inquiries", e);
      }
    }
  }, []);

  // Validate form
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required.";
    }

    if (!formData.message.trim()) {
      errors.message = "Message content is required.";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters long.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setConsoleLogs([]);

    // Step 1: Simulate inquiry processing and storage
    setTimeout(() => {
      const ticketId = `SV-${Math.floor(100000 + Math.random() * 900000)}`;
      const newInquiry: Inquiry = {
        id: ticketId,
        fullName: formData.fullName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        date: new Date().toLocaleString(),
        status: "Received",
      };

      // Store in localStorage
      const updatedInquiries = [newInquiry, ...inquiries];
      localStorage.setItem("sportsverge_contact_inquiries", JSON.stringify(updatedInquiries));
      setInquiries(updatedInquiries);
      setLastSubmittedInquiry(newInquiry);

      setConsoleLogs((prev) => [...prev, `[SYSTEM] Inquiry stored successfully under Ticket #${ticketId}.`]);

      // Step 2: Simulate administrator notification dispatch
      setTimeout(() => {
        setConsoleLogs((prev) => [
          ...prev,
          `[ADMIN NOTIFICATION] Alert sent to system administrators: New ticket #${ticketId} created by ${formData.fullName} (${formData.email}) - Category: "${formData.subject}". Routing to support queue...`,
        ]);

        // Step 3: Simulate customer confirmation email delivery
        setTimeout(() => {
          setConsoleLogs((prev) => [
            ...prev,
            `[EMAIL DISPATCH] Confirmation email generated. Dispatched to user inbox: ${formData.email}.`,
          ]);
          setIsSubmitting(false);
          setSuccessMessage(`Thank you, ${formData.fullName}! Your message has been sent successfully.`);
          setShowEmailModal(true);

          // Clear form fields
          setFormData({
            fullName: "",
            email: "",
            subject: "",
            message: "",
          });
        }, 1000);

      }, 1000);

    }, 1200);
  };

  const clearHistory = () => {
    localStorage.removeItem("sportsverge_contact_inquiries");
    setInquiries([]);
  };

  return (
    <main className="min-vh-100 bg-dark-theme text-white py-5">
      <div className="container py-4">
        {/* Breadcrumb / Header */}
        <div className="row mb-5 text-center text-lg-start">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center justify-content-lg-start mb-2">
                <li className="breadcrumb-item"><Link href="/" className="text-success text-decoration-none small">Home</Link></li>
                <li className="breadcrumb-item active text-muted small" aria-current="page">Contact Us</li>
              </ol>
            </nav>
            <h1 className="text-white fw-extrabold display-5 mb-2">Get in Touch</h1>
            <p className="text-muted lead max-w-600">
              Have questions, feedback, or support inquiries? Fill out the form below and our administrators will get back to you shortly.
            </p>
          </div>
        </div>

        <div className="row g-4">
          {/* Left Column: Form Section */}
          <div className="col-lg-7">
            <div className="card border-0 rounded-3 p-4 contact-card">
              <h4 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-envelope-paper-fill text-success"></i>
                Send Us a Message
              </h4>

              {successMessage && (
                <div className="alert alert-success bg-success bg-opacity-15 border border-success border-opacity-30 text-white rounded-3 p-3 mb-4 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success fs-5"></i>
                    <span>{successMessage}</span>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-success border-0 px-2 text-white" 
                    onClick={() => setShowEmailModal(true)}
                  >
                    View Email Receipt <i className="bi bi-eye ms-1"></i>
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-medium mb-1 text-uppercase">Full Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`form-control bg-dark text-white fw-medium border-0 custom-input px-3 py-2.5 ${formErrors.fullName ? "is-invalid" : ""}`}
                      placeholder="e.g. John Doe"
                    />
                    {formErrors.fullName && <div className="invalid-feedback d-block small mt-1">{formErrors.fullName}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-medium mb-1 text-uppercase">Email Address <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-control bg-dark text-white fw-medium border-0 custom-input px-3 py-2.5 ${formErrors.email ? "is-invalid" : ""}`}
                      placeholder="e.g. john@example.com"
                    />
                    {formErrors.email && <div className="invalid-feedback d-block small mt-1">{formErrors.email}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label text-muted small fw-medium mb-1 text-uppercase">Subject <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`form-control bg-dark text-white fw-medium border-0 custom-input px-3 py-2.5 ${formErrors.subject ? "is-invalid" : ""}`}
                      placeholder="What is this inquiry regarding?"
                    />
                    {formErrors.subject && <div className="invalid-feedback d-block small mt-1">{formErrors.subject}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label text-muted small fw-medium mb-1 text-uppercase">Message Content <span className="text-danger">*</span></label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`form-control bg-dark text-white fw-medium border-0 custom-input px-3 py-2.5 ${formErrors.message ? "is-invalid" : ""}`}
                      placeholder="Describe your issue or feedback in detail..."
                    ></textarea>
                    {formErrors.message && <div className="invalid-feedback d-block small mt-1">{formErrors.message}</div>}
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-success fw-bold px-4 py-2.5 rounded-1 w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Processing Inquiry...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill"></i> Submit Inquiry
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Console log simulator */}
              {(isSubmitting || consoleLogs.length > 0) && (
                <div className="mt-4 pt-3 border-top border-white-05">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted text-xs text-uppercase fw-semibold d-flex align-items-center gap-1">
                      <i className="bi bi-terminal-fill text-success"></i> Real-time Server Log
                    </span>
                    <span className="badge bg-dark text-success font-monospace px-2 py-0.5 rounded border border-success border-opacity-10 fs-10">
                      {isSubmitting ? "ONLINE" : "STANDBY"}
                    </span>
                  </div>
                  <div className="bg-dark p-3 rounded border border-dark font-monospace small text-start overflow-auto max-h-180" style={{ backgroundColor: "#04070c !important" }}>
                    {consoleLogs.map((log, idx) => (
                      <div key={idx} className="mb-1">
                        <span className="text-success font-monospace me-1">&gt;</span>
                        <span className={log.includes("ADMIN") ? "text-warning" : log.includes("EMAIL") ? "text-info" : "text-light"}>{log}</span>
                      </div>
                    ))}
                    {isSubmitting && (
                      <div className="text-muted fs-11 italic blink mt-1">Processing event stream...</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details & Inquiry History */}
          <div className="col-lg-5">
            {/* Quick Contact info */}
            <div className="card border-0 rounded-3 p-4 contact-card mb-4">
              <h4 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-info-circle-fill text-success"></i>
                Support Center
              </h4>
              
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-start gap-3">
                  <div className="contact-info-icon bg-success bg-opacity-10 text-success rounded p-2.5 flex-shrink-0">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <div>
                    <span className="text-muted text-xs text-uppercase d-block mb-0.5">Call Support</span>
                    <span className="text-white fw-semibold small">+1 (800) 555-0199</span>
                    <span className="text-muted text-xs d-block mt-0.5">Toll-free, Mon-Fri 9AM - 6PM EST</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="contact-info-icon bg-success bg-opacity-10 text-success rounded p-2.5 flex-shrink-0">
                    <i className="bi bi-envelope-at-fill"></i>
                  </div>
                  <div>
                    <span className="text-muted text-xs text-uppercase d-block mb-0.5">Email Admin</span>
                    <span className="text-white fw-semibold small">admin@sportsverge.com</span>
                    <span className="text-muted text-xs d-block mt-0.5">Direct ticket routing for enterprise users</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="contact-info-icon bg-success bg-opacity-10 text-success rounded p-2.5 flex-shrink-0">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div>
                    <span className="text-muted text-xs text-uppercase d-block mb-0.5">Headquarters</span>
                    <span className="text-white fw-semibold small">SportsVerge Inc.</span>
                    <span className="text-muted text-xs d-block mt-0.5">100 Tech Plaza, Suite 400, New York, NY 10001</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiries History Section */}
            <div className="card border-0 rounded-3 p-4 contact-card">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-white fw-bold mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-clock-history text-success"></i>
                  Your Sent Inquiries
                </h4>
                {inquiries.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="btn btn-sm btn-outline-danger border-0 py-0.5 px-2 fs-11 fw-semibold"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-4 border border-dashed border-secondary border-opacity-25 rounded-3">
                  <i className="bi bi-folder2-open text-muted fs-3 mb-2 d-block"></i>
                  <span className="text-muted small">No past inquiries found on this device.</span>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3 overflow-auto max-h-350 pe-1">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="bg-dark p-3 rounded border border-dark hover-bg-dark transition-all position-relative" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="font-monospace text-success fw-bold fs-11">#{inq.id}</span>
                        <span className="badge bg-success bg-opacity-15 text-success rounded-pill px-2 py-0.5 fs-10">
                          {inq.status}
                        </span>
                      </div>
                      <h6 className="text-white fw-bold small mb-1 text-truncate">{inq.subject}</h6>
                      <p className="text-muted fs-11 text-truncate mb-2">{inq.message}</p>
                      <div className="d-flex justify-content-between align-items-center pt-2 border-top border-white-05">
                        <span className="text-muted text-xs">{inq.date}</span>
                        <button 
                          onClick={() => {
                            setLastSubmittedInquiry(inq);
                            setShowEmailModal(true);
                          }}
                          className="btn btn-sm btn-link text-success p-0 fs-11 text-decoration-none fw-semibold"
                        >
                          View Receipt <i className="bi bi-arrow-right ms-0.5"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Email Receipt Modal Popup */}
      {showEmailModal && lastSubmittedInquiry && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-card border border-dark rounded-3 shadow-lg">
              <div className="modal-header border-bottom border-white-05 px-4 py-3 d-flex justify-content-between align-items-center">
                <h5 className="modal-title text-white fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-envelope-check-fill text-info"></i>
                  Simulated Confirmation Email
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowEmailModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4 bg-dark text-start" style={{ backgroundColor: "#06090e !important" }}>
                {/* Simulated Email Header */}
                <div className="email-client-wrapper border border-dark rounded-3 p-3 bg-card" style={{ backgroundColor: "#111822" }}>
                  <div className="pb-3 border-bottom border-white-05">
                    <div className="d-flex flex-column gap-1.5 fs-12">
                      <div><strong className="text-muted">From:</strong> SportsVerge Support &lt;noreply@sportsverge.com&gt;</div>
                      <div><strong className="text-muted">To:</strong> {lastSubmittedInquiry.fullName} &lt;{lastSubmittedInquiry.email}&gt;</div>
                      <div><strong className="text-muted">Subject:</strong> Inquiry Confirmation: [{lastSubmittedInquiry.subject}] (Ticket #{lastSubmittedInquiry.id})</div>
                      <div><strong className="text-muted">Date:</strong> {lastSubmittedInquiry.date}</div>
                    </div>
                  </div>

                  {/* Simulated Email Body */}
                  <div className="py-4 text-light fs-13 lh-lg">
                    <p className="mb-3">Hi <strong>{lastSubmittedInquiry.fullName}</strong>,</p>
                    <p className="mb-3">
                      We have successfully received your inquiry regarding <strong>"{lastSubmittedInquiry.subject}"</strong>. A support ticket has been created with ID <strong>#{lastSubmittedInquiry.id}</strong>.
                    </p>
                    <p className="mb-3">
                      Our system administrators and support team have been notified. We will review your request and get back to you shortly (typically within 1 business day).
                    </p>

                    <div className="my-4 p-3 rounded bg-dark bg-opacity-30 border border-white-05 font-monospace text-xs">
                      <div className="fw-bold mb-2 border-bottom border-white-05 pb-1 text-uppercase text-muted">Copy of Inquiry:</div>
                      <div><strong className="text-muted">Ticket:</strong> #{lastSubmittedInquiry.id}</div>
                      <div><strong className="text-muted">Sender:</strong> {lastSubmittedInquiry.fullName}</div>
                      <div><strong className="text-muted">Subject:</strong> {lastSubmittedInquiry.subject}</div>
                      <div className="mt-2 text-white border-start border-success border-3 ps-2 italic">{lastSubmittedInquiry.message}</div>
                    </div>

                    <p className="mb-0">
                      Best regards,<br />
                      <strong>SportsVerge Support Team</strong>
                    </p>
                  </div>

                  {/* Simulated Email Footer */}
                  <div className="pt-3 border-top border-white-05 text-center text-muted fs-11">
                    This is an automated receipt confirmation from SportsVerge Support. Please do not reply directly to this email.
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top border-white-05 px-4 py-3">
                <button 
                  type="button" 
                  className="btn btn-success fw-semibold px-4" 
                  onClick={() => setShowEmailModal(false)}
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

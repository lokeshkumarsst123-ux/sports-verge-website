"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAds } from "@/components/AdContext";

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
  const { getAdByType } = useAds();
  const [contactAd, setContactAd] = useState<any>(null);

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
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (getAdByType) {
      setContactAd(getAdByType("Sidebar Advertisement"));
    }
  }, [getAdByType]);

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

    // Simulate inquiry processing and storage
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
      const saved = typeof window !== "undefined" ? localStorage.getItem("sportsverge_contact_inquiries") : null;
      let currentInquiries: Inquiry[] = [];
      if (saved) {
        try {
          currentInquiries = JSON.parse(saved);
        } catch (e) { }
      }
      const updatedInquiries = [newInquiry, ...currentInquiries];
      localStorage.setItem("sportsverge_contact_inquiries", JSON.stringify(updatedInquiries));
      setLastSubmittedInquiry(newInquiry);

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
    }, 800);
  };

  return (
    <main className="bg-page text-white py-5 font-outfit">
      <div className="container py-4">
        {/* Header */}
        <div className="row mb-5 text-center text-lg-start">
          <div className="col-12">
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
              <h4 className="text-white fw-normal mb-4 d-flex align-items-center gap-2">
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
                      className={`form-control bg-dark text-white fw-normal border-0 custom-input px-3 py-2.5 ${formErrors.fullName ? "is-invalid" : ""}`}
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
                      className={`form-control bg-dark text-white fw-normal border-0 custom-input px-3 py-2.5 ${formErrors.email ? "is-invalid" : ""}`}
                      placeholder="e.g. john@example.com"
                    />
                    {formErrors.email && <div className="invalid-feedback d-block small mt-1">{formErrors.email}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label text-muted small fw-normal mb-1 text-uppercase">Subject <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`form-control bg-dark text-white fw-normal border-0 custom-input px-3 py-2.5 ${formErrors.subject ? "is-invalid" : ""}`}
                      placeholder="What is this inquiry regarding?"
                    />
                    {formErrors.subject && <div className="invalid-feedback d-block small mt-1">{formErrors.subject}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label text-muted small fw-normal mb-1 text-uppercase">Message Content <span className="text-danger">*</span></label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`form-control bg-dark text-white fw-normal border-0 custom-input px-3 py-2.5 ${formErrors.message ? "is-invalid" : ""}`}
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
            </div>
          </div>

          {/* Right Column: Details & Inquiry History */}
          <div className="col-lg-5">
            {/* Quick Contact info */}
            <div className="card border-0 rounded-3 p-4 contact-card mb-4">
              <h4 className="text-white fw-normal mb-4 d-flex align-items-center gap-2">
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

            {/* Dynamic Ad Placement */}
            {contactAd && (
              <aside className="ad-section ad-1-contact-page rounded-3 border border-dark overflow-hidden mb-4 position-relative d-flex align-items-end" style={{ minHeight: "440px" }}>
                <a href={contactAd.redirectUrl} target="_blank" rel="noopener noreferrer" className="w-100 h-100 d-block position-relative">
                  <img
                    src={contactAd.image}
                    alt={contactAd.title}
                    className="w-100 h-100 object-fit-cover ad-bg-img"
                    style={{ position: "absolute", inset: 0 }}
                  />
                </a>
                <span className="position-absolute top-0 end-0 badge bg-dark text-muted font-monospace fs-10 border border-secondary border-opacity-10 m-2 z-1">
                  SPONSOR
                </span>
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* Success Confirmation Modal Popup */}
      {showEmailModal && lastSubmittedInquiry && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(4px)" }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "450px" }}>
            <div className="modal-content bg-card border border-dark rounded-4 shadow-lg text-center p-4">
              <div className="modal-header border-0 p-0 justify-content-end">
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEmailModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-0 mt-2">
                {/* Success Animated Checkmark Icon */}
                <div className="success-checkmark-wrapper mb-4 d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle" style={{ width: "80px", height: "80px" }}>
                  <i className="bi bi-patch-check-fill display-4 text-success"></i>
                </div>

                <h3 className="text-white fw-bold mb-2">Message Sent!</h3>
                <p className="text-muted small px-3 mb-4">
                  Thank you for reaching out to SportsVerge. Your inquiry has been logged in our system. A support administrator will contact you shortly.
                </p>

                {/* Ticket details summary */}
                <div className="bg-dark bg-opacity-40 border border-dark rounded-3 px-3 py-1 mb-4 text-start">
                  <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-white-05">
                    <span className="text-muted text-xs text-uppercase fw-semibold">Ticket ID</span>
                    <span className="font-monospace text-success fw-bold text-end">#{lastSubmittedInquiry.id}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-white-05">
                    <span className="text-muted text-xs text-uppercase fw-semibold">Subject</span>
                    <span className="text-white small fw-medium text-truncate text-end d-inline-block max-w-200px">{lastSubmittedInquiry.subject.trim()}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-white-05">
                    <span className="text-muted text-xs text-uppercase fw-semibold">Date Submitted</span>
                    <span className="text-muted small text-end">{lastSubmittedInquiry.date.split(",")[0].trim()}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-3">
                    <span className="text-muted text-xs text-uppercase fw-semibold">Status</span>
                    <span className="badge rounded-pill px-2.5 py-1 fs-11 text-end" style={{ backgroundColor: "rgba(25, 135, 84, 0.15)", color: "#2abf70", border: "1px solid rgba(42, 191, 112, 0.2)" }}>
                      Received
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-success fw-bold px-5 py-2.5 rounded-1 w-100"
                  onClick={() => setShowEmailModal(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

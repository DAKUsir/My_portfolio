"use client";

import { useState, type FormEvent } from "react";
import type { ContactField, ContactFieldErrors } from "@/lib/contact";

const recipient = "chauhan.aditya.tech@gmail.com";
type ContactResponse = {
  ok?: boolean;
  code?: string;
  message?: string;
  errors?: ContactFieldErrors;
};

export function ContactForm() {
  const [status, setStatus] = useState("");
  const [statusIsError, setStatusIsError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [fallbackHref, setFallbackHref] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const mailto = `mailto:${recipient}?subject=${subject}&body=${body}`;

    setIsSubmitting(true);
    setStatus("Sending your message…");
    setStatusIsError(false);
    setFieldErrors({});
    setFallbackHref("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          website: String(formData.get("website") ?? ""),
        }),
      });
      const result = (await response.json().catch(() => null)) as ContactResponse | null;

      if (response.ok) {
        setStatus(result?.message ?? "Thanks — your message has been sent.");
        form.reset();
        return;
      }

      setStatus(result?.message ?? "Your message could not be sent. Please try again.");
      setStatusIsError(true);
      if (result?.errors) {
        setFieldErrors(result.errors);
        const firstInvalidField = Object.keys(result.errors)[0] as ContactField | undefined;
        if (firstInvalidField) {
          document.getElementById(`contact-${firstInvalidField}`)?.focus();
        }
      }
      if (response.status >= 500 || response.status === 429) setFallbackHref(mailto);
    } catch {
      setStatus("We could not reach the contact service. You can open an email draft instead.");
      setStatusIsError(true);
      setFallbackHref(mailto);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form aria-busy={isSubmitting} className="contact-form" onSubmit={submitContact}>
      <label className="contact-trap-label" aria-hidden="true" htmlFor="contact-website">
        Leave this field blank
        <input
          autoComplete="off"
          id="contact-website"
          name="website"
          tabIndex={-1}
          type="text"
        />
      </label>

      <label htmlFor="contact-name">Your name</label>
      <input
        aria-describedby={fieldErrors.name ? "contact-name-error" : "contact-form-note"}
        aria-invalid={Boolean(fieldErrors.name)}
        autoComplete="name"
        id="contact-name"
        maxLength={80}
        minLength={2}
        name="name"
        onChange={() => setFieldErrors((current) => ({ ...current, name: undefined }))}
        placeholder="Jane Smith"
        required
      />
      {fieldErrors.name && <span className="contact-field-error" id="contact-name-error">{fieldErrors.name}</span>}

      <label htmlFor="contact-email">Email address</label>
      <input
        aria-describedby={fieldErrors.email ? "contact-email-error" : "contact-form-note"}
        aria-invalid={Boolean(fieldErrors.email)}
        autoComplete="email"
        id="contact-email"
        maxLength={254}
        name="email"
        onChange={() => setFieldErrors((current) => ({ ...current, email: undefined }))}
        placeholder="jane@example.com"
        required
        type="email"
      />
      {fieldErrors.email && <span className="contact-field-error" id="contact-email-error">{fieldErrors.email}</span>}

      <label htmlFor="contact-message">What would you like to talk about?</label>
      <textarea
        aria-describedby={fieldErrors.message ? "contact-message-error" : "contact-form-note"}
        aria-invalid={Boolean(fieldErrors.message)}
        id="contact-message"
        maxLength={2000}
        minLength={10}
        name="message"
        onChange={() => setFieldErrors((current) => ({ ...current, message: undefined }))}
        placeholder="A few details about your idea, role, or question..."
        required
        rows={4}
      />
      {fieldErrors.message && <span className="contact-field-error" id="contact-message-error">{fieldErrors.message}</span>}

      <button className="button button-light contact-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Sending…" : "Send message"}
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 12 12 4M5 4h7v7" />
        </svg>
      </button>
      <p className="contact-form-note" id="contact-form-note">
        Messages are emailed when delivery is configured; this site does not store them.
      </p>
      <p aria-live={statusIsError ? "assertive" : "polite"} className="contact-form-status" role={statusIsError ? "alert" : "status"}>
        {status}
      </p>
      {fallbackHref && (
        <a className="contact-fallback" href={fallbackHref}>
          Open your email app instead
        </a>
      )}
    </form>
  );
}

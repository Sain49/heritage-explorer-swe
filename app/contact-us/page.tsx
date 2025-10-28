"use client";

import { useContactForm } from "@/lib/hooks/use-contact-form";
import FormField from "@/components/form-field";
import ContactSuccessMessage from "@/components/contact-success-message";

export default function ContactUs() {
  // custom hook: manages form state, validation, and submission
  const {
    name,
    email,
    message,
    setName,
    setEmail,
    setMessage,
    isSubmitted,
    errors,
    handleSubmit,
    reset,
  } = useContactForm();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8 uppercase tracking-wide text-amber-900 border-b border-amber-900 pb-4">
        Contact Us
      </h1>

      {isSubmitted ? (
        <ContactSuccessMessage onReset={reset} />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 border border-stone-400 p-6 bg-stone-50"
        >
          <FormField
            id="name"
            label="Name"
            type="text"
            value={name}
            onChange={setName}
            error={errors.name}
            required
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            required
          />

          <FormField
            id="message"
            label="Message"
            type="textarea"
            value={message}
            onChange={setMessage}
            error={errors.message}
            required
            rows={5}
          />

          <button
            type="submit"
            className="w-full px-6 py-3 border border-amber-900 bg-amber-900 text-white hover:bg-amber-800 hover:border-amber-800 focus:outline-none focus:bg-amber-800 transition-colors duration-200 uppercase tracking-wide text-sm font-medium"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}

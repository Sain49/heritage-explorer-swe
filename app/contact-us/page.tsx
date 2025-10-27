"use client";

import { useState } from "react";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!email.includes("@"))
      newErrors.email = "Please enter a valid email";
    if (!message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8 uppercase tracking-wide text-amber-900 border-b border-amber-900 pb-4">
        Contact Us
      </h1>

      {isSubmitted ? (
        <div className="p-8 border-2 border-amber-900 bg-amber-50">
          <h2 className="text-lg font-semibold text-amber-900 mb-2 uppercase tracking-wide">
            Message Sent
          </h2>
          <p className="text-stone-800 mb-6">
            Thank you for contacting us. We'll get back to you soon.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-6 py-3 bg-amber-900 text-white hover:bg-amber-800 transition-colors uppercase tracking-wide text-sm border border-amber-900"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 border border-stone-400 p-6 bg-stone-50"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-stone-800 mb-2 uppercase tracking-wide"
            >
              Name <span className="text-red-800">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 border bg-white focus:outline-none transition-colors duration-200 ${
                errors.name
                  ? "border-red-800 focus:border-red-800"
                  : "border-stone-400 focus:border-stone-800"
              }`}
              required
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-900 border-l-2 border-red-800 pl-3">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-stone-800 mb-2 uppercase tracking-wide"
            >
              Email <span className="text-red-800">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border bg-white focus:outline-none transition-colors duration-200 ${
                errors.email
                  ? "border-red-800 focus:border-red-800"
                  : "border-stone-400 focus:border-stone-800"
              }`}
              required
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-900 border-l-2 border-red-800 pl-3">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-stone-800 mb-2 uppercase tracking-wide"
            >
              Message <span className="text-red-800">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className={`w-full px-4 py-3 border bg-white focus:outline-none transition-colors duration-200 resize-none ${
                errors.message
                  ? "border-red-800 focus:border-red-800"
                  : "border-stone-400 focus:border-stone-800"
              }`}
              required
            />
            {errors.message && (
              <p className="mt-2 text-sm text-red-900 border-l-2 border-red-800 pl-3">
                {errors.message}
              </p>
            )}
          </div>

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

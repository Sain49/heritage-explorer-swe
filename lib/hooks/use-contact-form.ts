import { useState } from "react";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function useContactForm() {
  // form field states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // UI states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // validate name
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    // validate email
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

    // validate message
    if (!message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);

    // return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // only submit if validation passes
    if (!validateForm()) {
      return;
    }

    // mark as submitted and reset form
    setIsSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
  };

  // reset to initial state
  const reset = () => {
    setIsSubmitted(false);
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
  };

  return {
    // form field values
    name,
    email,
    message,

    // form field setters
    setName,
    setEmail,
    setMessage,

    // UI state
    isSubmitted,
    errors,

    // actions
    handleSubmit,
    reset,
  };
}

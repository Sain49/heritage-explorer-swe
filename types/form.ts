// type definitions for form components and validation

// form field validation error
export type FormError = {
  field: string;
  message: string;
};

// contact form field errors
export type ContactFormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

// contact form data
export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

// generic form field props
export type FormFieldType = "text" | "email" | "textarea" | "password" | "tel";

export type FormFieldProps = {
  id: string;
  label: string;
  type?: FormFieldType;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
};

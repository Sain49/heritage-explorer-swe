// Success message displayed after form submission, separates success UI from main form component

interface ContactSuccessMessageProps {
  onReset: () => void;
}

export default function ContactSuccessMessage({
  onReset,
}: ContactSuccessMessageProps) {
  return (
    <div className="p-8 border-2 border-amber-900 bg-amber-50">
      <h2 className="text-lg font-semibold text-amber-900 mb-2 uppercase tracking-wide">
        Message Sent
      </h2>
      <p className="text-stone-800 mb-6">
        Thank you for contacting us. We&apos;ll get back to you soon.
      </p>
      <button
        onClick={onReset}
        className="px-6 py-3 bg-amber-900 text-white hover:bg-amber-800 transition-colors uppercase tracking-wide text-sm border border-amber-900"
      >
        Send Another Message
      </button>
    </div>
  );
}

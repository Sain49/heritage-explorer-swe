interface ErrorMessageProps {
  message: string;
  children?: React.ReactNode;
}

export default function ErrorMessage({ message, children }: ErrorMessageProps) {
  return (
    <div className="p-6 border-2 border-red-800 bg-red-50">
      <p className="text-red-900 font-medium mb-4">{message}</p>
      {children}
    </div>
  );
}

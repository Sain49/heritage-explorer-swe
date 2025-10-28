interface SiteDetailsFieldProps {
  label: string;
  children: React.ReactNode;
}

export default function SiteDetailsField({
  label,
  children,
}: SiteDetailsFieldProps) {
  return (
    <>
      <span className="font-medium whitespace-nowrap uppercase tracking-wide text-xs text-stone-700">
        {label}:
      </span>
      <span className="text-stone-900 break-words mb-3 sm:mb-0">
        {children}
      </span>
    </>
  );
}

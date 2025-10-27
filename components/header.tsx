import Link from "next/link";

// Greek temple logo svg code
const TempleIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block mr-2"
  >
    <path
      d="M2 9L12 3L22 9H2Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
    />
    <rect x="4" y="9" width="1.5" height="10" fill="currentColor" />
    <rect x="8" y="9" width="1.5" height="10" fill="currentColor" />
    <rect x="12" y="9" width="1.5" height="10" fill="currentColor" />
    <rect x="16" y="9" width="1.5" height="10" fill="currentColor" />
    <rect x="20" y="9" width="1.5" height="10" fill="currentColor" />
    <rect x="2" y="19" width="20" height="2" fill="currentColor" />
  </svg>
);

export default function Header() {
  return (
    <header className="bg-white border-b-2 border-amber-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-amber-900 uppercase tracking-wide">
            <Link
              href="/"
              className="hover:text-amber-700 transition-colors flex items-center"
            >
              <TempleIcon />
              Heritage Explorer
            </Link>
          </h1>
          <nav>
            <ul className="flex space-x-8">
              <li>
                <Link
                  href="/"
                  className="text-stone-800 hover:text-amber-900 transition-colors font-medium uppercase tracking-wide text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/my-route"
                  className="text-stone-800 hover:text-amber-900 transition-colors font-medium uppercase tracking-wide text-sm"
                >
                  My Route
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-stone-800 hover:text-amber-900 transition-colors font-medium uppercase tracking-wide text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-gray-900">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Heritage Explorer
            </Link>
          </h1>
          <nav>
            <ul className="flex space-x-8">
              <li>
                <Link
                  href="/site-explorer"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Explore Sites
                </Link>
              </li>
              <li>
                <Link
                  href="/my-route"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  My Route
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
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

import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div>
        <h1>
          <Link href="/">Heritage Explorer</Link>
        </h1>
        <nav>
          <ul>
            <li>
              <Link href="/site-explorer">Explore Sites</Link>
            </li>
            <li>
              <Link href="/my-route">My Route</Link>
            </li>
            <li>
              <Link href="/contact-us">Contact Us</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

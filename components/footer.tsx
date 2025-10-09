import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div>
        <ul>
          <li>© 2025 Heritage Explorer. All rights reserved.</li>
          <li>
            <Link href="https://docs.visitsweden.com/en/"></Link>Data sourced
            from Visit Sweden National API
          </li>
          <li>
            <Link href="/contact-us">Contact Us</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

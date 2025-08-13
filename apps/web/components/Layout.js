import Link from 'next/link';
import header from './Header.module.css';

export default function Layout({ children }) {
  return (
    <>
      <header className="container">
        <div className={header.bar}>
          <Link href="/">
            <img src="/logo.svg" alt="Senisko" className={header.logo} />
          </Link>
        </div>
      </header>

      <main className="container">{children}</main>

      <footer className="container" style={{padding:16}}>
        © {new Date().getFullYear()} Senisko
      </footer>
    </>
  );
}
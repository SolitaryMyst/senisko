import Link from 'next/link';
import styles from '../components/Button.module.css';

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Senisko</h1>
      <p>Frontend OK. API check: <code>https://api.senisko.com/health</code></p>
      <Link href="/contact" legacyBehavior>
        <a className={styles.btn}>Contact</a>
      </Link>
    </main>
  );
}
import Link from 'next/link';
import btn from '../components/Button.module.css';
import hero from '../components/Hero.module.css';

export default function Home(){
  return (
    <div className="container">
      <section className={styles.hero}>
        <div>
          <h1>Senisko</h1>
          <p>Responsive layout demo.</p>
          <Link href="/contact" className={styles.btn}>Contact</Link>
        </div>
        <img src="/hero.jpg" alt="" />
      </section>
    </div>
  );
}

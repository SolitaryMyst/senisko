import Link from 'next/link';
import btn from '../components/Button.module.css';
import hero from '../components/Hero.module.css';

export default function Home(){
  return (
      <section className={hero.container}>
        <div>
          <h1>Welcome</h1>
          <p>Layout demo.</p>
          <Link href="/contact" className={btn.btn}>Contact</Link>
          <Link href="/contact" className={btn.btn}>Library</Link>
        </div>
        <img src="/hero.svg" alt="" />
      </section>
  );
}

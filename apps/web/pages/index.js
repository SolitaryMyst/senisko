import Link from 'next/link';
import hero from '../components/Hero.module.css';
import button from '../components/Button.module.css';

export default function Home() {
  return (
    <section className={`${hero.hero} container`}>
      <div>
        <h1>Welcome</h1>
        <p>Layout demo.</p>
        <Link href="/contact" className={button.btn}>Contact</Link>
        <span style={{display:'inline-block', width:12}} />
        <Link href="/library" className={button.btn}>Library</Link>
      </div>
      {/* add this file at apps/web/public/hero.svg or remove the img */}
      {/* <img src="/hero.svg" alt="" /> */}
    </section>
  );
}
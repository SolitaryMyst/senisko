import Image from 'next/image';
import PDFThumb from './PDFThumb';
import styles from './FileTile.module.css';

export default function FileTile({ href, title, src, ext }) {
  const isPdf = (ext||'').toLowerCase()==='pdf';
  return (
    <a href={href} className={styles.card} target="_blank" rel="noreferrer">
      <div className={styles.wrap}>
        {isPdf
          ? <PDFThumb src={src} className={styles.thumb} />
          : <Image src={src} alt={title} width={800} height={600} className={styles.thumb} />
        }
        <span className={styles.badge}>{(ext||'').toUpperCase()}</span>
      </div>
      <div className={styles.body}><p className={styles.title}>{title}</p></div>
    </a>
  );
}

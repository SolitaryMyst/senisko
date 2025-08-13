import path from 'path';
import fs from 'fs/promises';
import FileTile from '../components/FileTile';
import grid from '../components/FileTile.module.css';

export default function Library({ items }) {
  return (
    <main className="container" style={{ padding: '24px 0' }}>
      <h1>Library</h1>
      <div className={grid.grid}>
        {items.map(f => (
          <FileTile key={f.href} href={f.href} title={f.title} ext={f.ext} src={f.href} size={f.size} />
        ))}
      </div>
    </main>
  );
}

export async function getStaticProps() {
  const dir = path.join(process.cwd(), 'public', 'docs');   // apps/web/public/docs
  let names = [];
  try { names = await fs.readdir(dir); } catch { /* empty */ }

  const allow = new Set(['pdf','jpg','jpeg','png','webp']);
  const items = (await Promise.all(names.map(async name => {
    const full = path.join(dir, name);
    const stat = await fs.stat(full);
    if (!stat.isFile()) return null;
    const ext = name.split('.').pop().toLowerCase();
    if (!allow.has(ext)) return null;
    return {
      href: `/docs/${name}`,
      title: name.replace(/\.[^/.]+$/, ''),
      ext,
      size: `${(stat.size/1024/1024).toFixed(2)} MB`,
    };
  }))).filter(Boolean);

  return { props: { items } };
}

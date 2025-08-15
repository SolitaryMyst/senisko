'use client';
import { useEffect, useRef } from 'react';

export default function PDFThumb({ src, className }) {
  const ref = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf');           // v3 API
      pdfjs.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const pdf = await pdfjs.getDocument(src).promise;
      const page = await pdf.getPage(1);

      const canvas = ref.current;
      const ctx = canvas.getContext('2d');

      const resize = async () => {
        if (!canvas) return;
        const box = canvas.parentElement?.getBoundingClientRect();
        const maxW = Math.max(200, box?.width || 300);
        const viewport = page.getViewport({ scale: 1 });
        const scale = maxW / viewport.width;
        const vp = page.getViewport({ scale });
        canvas.width = vp.width;
        canvas.height = vp.height;
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
      };

      await resize();
      const ro = new ResizeObserver(() => resize());
      ro.observe(canvas.parentElement);
      if (cancelled) ro.disconnect();
    })().catch(console.error);
    return () => { cancelled = true; };
  }, [src]);

  return <canvas ref={ref} className={className} />;
}

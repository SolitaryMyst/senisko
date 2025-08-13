'use client';
import { useEffect, useRef, useState } from 'react';

export default function PDFThumb({ src, className }) {
  const ref = useRef(null);
  const [ready,setReady]=useState(false);

  useEffect(() => {
    let cancelled=false;
    (async () => {
      const pdfjsLib = await import('pdfjs-dist/build/pdf');
      const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = worker;

      const pdf = await pdfjsLib.getDocument(src).promise;
      const page = await pdf.getPage(1);

      const canvas = ref.current;
      const context = canvas.getContext('2d');

      // scale to tile width
      const viewport = page.getViewport({ scale: 1 });
      const maxW = canvas.parentElement.clientWidth || 300;
      const scale = maxW / viewport.width;
      const vp = page.getViewport({ scale });

      canvas.width = vp.width;
      canvas.height = vp.height;
      await page.render({ canvasContext: context, viewport: vp }).promise;
      if (!cancelled) setReady(true);
    })().catch(() => {});
    return () => { cancelled=true; };
  }, [src]);

  return <canvas ref={ref} className={className} aria-hidden={!ready} />;
}

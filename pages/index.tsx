// pages/index.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';

type SvgAsset = {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
  bytes?: number;
};

type ApiResponse = {
  resources: SvgAsset[];
  next_cursor?: string | null;
  total_count?: number;
};

export default function HomePage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<null | string>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/images');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ApiResponse = await res.json();
        setData(json);
      } catch (e: any) {
        setErr(e?.message || 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <>
      <Head>
        <title>Galeri SVG</title>
        <meta name="description" content="Galeri SVG yang bisa diunduh sebagai SVG, PNG, dan JPG" />
      </Head>

      <main style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 12 }}>Galeri SVG</h1>
        <p style={{ color: '#555', marginTop: 0 }}>
          Sumber gambar dari Cloudinary (folder <code>svg</code>). Klik tombol untuk mengunduh.
        </p>

        {loading && <p>Loading…</p>}
        {err && (
          <div style={{ padding: 12, background: '#fff3f3', border: '1px solid #ffd6d6', borderRadius: 8 }}>
            <strong>Gagal memuat:</strong> {err}. Coba refresh halaman.
          </div>
        )}

        {!loading && !err && (
          <>
            {(!data || data.resources.length === 0) ? (
              <div style={{ padding: 16, border: '1px dashed #bbb', borderRadius: 8, color: '#666' }}>
                Belum ada gambar SVG di Cloudinary (folder <code>svg</code>) atau ENV belum benar.
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gap: 16,
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  alignItems: 'start',
                }}
              >
                {data.resources.map((item) => {
                  const hrefBase = `/api/download/${encodeURI(item.public_id)}`;
                  return (
                    <div key={item.public_id} style={{ border: '1px solid #eee', borderRadius: 10, padding: 12 }}>
                      {/* Thumbnail: pakai <img> biasa supaya sederhana */}
                      <img
                        src={item.secure_url}
                        alt={item.public_id}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />

                      <div style={{ marginTop: 10 }}>
                        <div
                          style={{
                            fontSize: 12,
                            color: '#666',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={item.public_id}
                        >
                          {item.public_id}
                        </div>
                      </div>

                      <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <a className="btn" href={`${hrefBase}?format=svg`}>Download SVG</a>
                        <a className="btn" href={`${hrefBase}?format=png&width=2048`}>Download PNG</a>
                        <a className="btn" href={`${hrefBase}?format=jpg&width=2048`}>Download JPG</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <style jsx>{`
          .btn {
            background: #111;
            color: #fff;
            padding: 8px 12px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
          }
          .btn:hover {
            background: #222;
          }
        `}</style>
      </main>
    </>
  );
}

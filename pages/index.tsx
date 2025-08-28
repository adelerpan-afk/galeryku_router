// pages/index.tsx
import useSWR from 'swr';
import Head from 'next/head';

type SvgAsset = {
  public_id: string;
  secure_url: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR<{ resources: SvgAsset[] }>('/api/images', fetcher);

  if (error) return <p>Gagal memuat data.</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>Galeri SVG</title>
      </Head>
      <main style={{ padding: '20px' }}>
        <h1>Galeri SVG</h1>
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {data.resources.map((item) => (
            <div key={item.public_id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
              <img src={item.secure_url} alt={item.public_id} style={{ width: '100%' }} />
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <a href={`/api/download/${encodeURIComponent(item.public_id)}?format=svg`} className="btn">SVG</a>
                <a href={`/api/download/${encodeURIComponent(item.public_id)}?format=png&width=2048`} className="btn">PNG</a>
                <a href={`/api/download/${encodeURIComponent(item.public_id)}?format=jpg&width=2048`} className="btn">JPG</a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

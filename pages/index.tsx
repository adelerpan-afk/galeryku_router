import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js Empty Starter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Starter kosong untuk deploy di Vercel" />
      </Head>
      <main style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>Next.js Empty Starter</h1>
          <p style={{ color: '#6b7280', marginTop: 8 }}>Siap untuk dimodifikasi dan di-deploy ke Vercel.</p>
        </div>
      </main>
    </>
  );
}

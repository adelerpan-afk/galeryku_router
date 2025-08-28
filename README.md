# Next.js Empty Starter

Proyek Next.js + TypeScript kosong, siap di-*deploy* ke **Vercel**.

## File penting
- `package.json` — script & dependencies
- `tsconfig.json` — konfigurasi TypeScript
- `next.config.js` — konfigurasi Next (opsional)
- `.eslintrc.json` — konfigurasi ESLint
- `.gitignore`
- `pages/index.tsx` — halaman awal sederhana

## Cara deploy (tanpa dev lokal)
1. Buat repo GitHub kosong.
2. Upload semua file proyek ini ke repo tersebut.
3. Di **Vercel Dashboard** → **Add New → Project** → pilih repo → **Deploy**.
4. Setiap commit/push ke GitHub akan otomatis trigger deploy baru.

Catatan: `next-env.d.ts` akan dibuat otomatis oleh Next saat build.

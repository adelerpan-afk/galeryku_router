// pages/api/images.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary dari ENV (aman karena berjalan di server/API route)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Tipe data sederhana untuk respons
type SvgAsset = {
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  secure_url: string;
  folder?: string;
  tags?: string[];
};

type ApiResponse = {
  resources: SvgAsset[];
  next_cursor: string | null;
  total_count?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { message: string; error?: string }>
) {
  // Batasi metode
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Parameter opsional: pagination sederhana
  const { perPage, cursor } = req.query;
  const max_results = Math.min(Number(perPage) || 50, 100); // Cloudinary batasi 100

  // Jika kamu set folder di ENV, kita filter folder + format:svg
  // Kalau tidak, kita ambil semua berformat svg
  const folder = process.env.CLOUDINARY_GALLERY_FOLDER;
  const expression = folder
    ? `folder:${folder} AND format:svg`
    : `format:svg`;

  try {
    // Build query
    let search = cloudinary.search
      .expression(expression)
      .sort_by('public_id', 'asc')
      .max_results(max_results);

    // Pagination dengan next_cursor (opsional)
    if (typeof cursor === 'string' && cursor.trim()) {
      search = search.next_cursor(cursor);
    }

    const result: any = await search.execute();

    const resources: SvgAsset[] = (result.resources || []).map((r: any) => ({
      public_id: r.public_id,
      format: r.format,
      width: r.width,
      height: r.height,
      bytes: r.bytes,
      secure_url: r.secure_url,
      folder: r.folder,
      tags: r.tags,
    }));

    // Cache di Edge (CDN Vercel) supaya cepat
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    return res.status(200).json({
      resources,
      next_cursor: result.next_cursor ?? null,
      total_count: result.total_count ?? resources.length,
    });
  } catch (err: any) {
    console.error('Cloudinary search error:', err);
    return res
      .status(500)
      .json({ message: 'Failed to fetch assets from Cloudinary', error: err?.message });
  }
}

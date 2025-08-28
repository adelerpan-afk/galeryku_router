import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ALLOWED = new Set(['svg', 'png', 'jpg', 'jpeg']);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const raw = req.query.publicId;
  if (!raw) return res.status(400).json({ message: 'publicId is required' });

  const publicId = Array.isArray(raw) ? raw.join('/') : raw; // contoh: "svg/logo-masjid"

  const fmtParam = String(req.query.format || 'svg').toLowerCase();
  const format = fmtParam === 'jpeg' ? 'jpg' : fmtParam;
  if (!ALLOWED.has(format)) {
    return res.status(400).json({ message: 'format must be svg|png|jpg' });
  }

  const width = req.query.width ? Number(req.query.width) : undefined;
  if (width && (isNaN(width) || width < 1 || width > 5000)) {
    return res.status(400).json({ message: 'width must be 1..5000' });
  }

  const transformation: any[] = [];
  if (width) transformation.push({ width, crop: 'limit' });

  const url = cloudinary.url(publicId, {
    resource_type: 'image',
    format,
    quality: 'auto',
    secure: true,
    flags: 'attachment',
    transformation,
  });

  res.setHeader('Cache-Control', 's-maxage=31536000, immutable');
  return res.redirect(302, url);
}

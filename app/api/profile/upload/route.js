import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = 'force-dynamic'; // Edge runtime compatibility

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(base64String, {
        folder: 'expense-tracker',
        resource_type: 'auto',
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
} 
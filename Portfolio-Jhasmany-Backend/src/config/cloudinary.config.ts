import { v2 as cloudinary } from 'cloudinary';

// Configuración de Cloudinary
// Agrega estas variables al .env o docker-compose:
// CLOUDINARY_CLOUD_NAME=tu_cloud_name
// CLOUDINARY_API_KEY=tu_api_key
// CLOUDINARY_API_SECRET=tu_api_secret

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dyvkdwzcj',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export default cloudinary;

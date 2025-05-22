import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

dotenv.config();

// Initialize Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});

// Configure multer
const memoryStorage = multer.memoryStorage();
export const upload = multer({
    storage: memoryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Enhanced upload function with error handling
export const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        if (!buffer || buffer.length === 0) {
            return reject(new Error('Empty file buffer'));
        }

        const uploadStream = cloudinary.uploader.upload_stream({
                folder: 'eventEase',
                resource_type: 'auto',
                timeout: 60000
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.on('error', (error) => {
            console.error('Upload stream error:', error);
            reject(error);
        });

        uploadStream.end(buffer);
    });
};
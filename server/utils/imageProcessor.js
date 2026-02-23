import cloudinary from '../config/cloudinary.js';

/**
 * Upload buffer to Cloudinary and return URL
 */
const uploadToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
        stream.end(buffer);
    });
};

/**
 * Process and upload book images to Cloudinary
 * Cloudinary handles resizing via URL transformations, so we only upload once
 */
export const processBookImages = async (files) => {
    if (!files || files.length === 0) return [];

    const processedImages = [];

    for (const file of files) {
        try {
            const result = await uploadToCloudinary(file.buffer, {
                folder: 'lingoland/books',
                resource_type: 'image',
                format: 'webp',
                quality: 'auto',
            });

            // Use Cloudinary URL transformations for different sizes
            const baseUrl = result.secure_url;
            const publicId = result.public_id;

            processedImages.push({
                thumbnail: cloudinary.url(publicId, { width: 200, height: 200, crop: 'fill', format: 'webp', quality: 80 }),
                medium: cloudinary.url(publicId, { width: 800, height: 800, crop: 'limit', format: 'webp', quality: 85 }),
                original: baseUrl,
            });
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
        }
    }

    return processedImages;
};

/**
 * Delete images from Cloudinary
 */
export const deleteBookImages = async (imagePaths) => {
    for (const imagePath of imagePaths) {
        try {
            // Extract public_id from Cloudinary URL
            const match = imagePath.match(/\/lingoland\/books\/([^.]+)/);
            if (match) {
                await cloudinary.uploader.destroy(`lingoland/books/${match[1]}`);
            }
        } catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
        }
    }
};

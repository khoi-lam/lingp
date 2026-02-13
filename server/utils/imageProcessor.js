import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Process and optimize uploaded images
 * Creates multiple sizes: thumbnail (200x200), medium (800x800), original
 */
export const processBookImages = async (files) => {
    if (!files || files.length === 0) return [];

    const processedImages = [];

    for (const file of files) {
        try {
            const filename = path.parse(file.filename).name;
            const uploadsDir = path.join(__dirname, '../uploads/books');

            // Generate thumbnail (200x200)
            const thumbnailPath = path.join(uploadsDir, `${filename}-thumb.webp`);
            await sharp(file.path)
                .resize(200, 200, { fit: 'cover' })
                .webp({ quality: 80 })
                .toFile(thumbnailPath);

            // Generate medium size (800x800)
            const mediumPath = path.join(uploadsDir, `${filename}-medium.webp`);
            await sharp(file.path)
                .resize(800, 800, { fit: 'inside' })
                .webp({ quality: 85 })
                .toFile(mediumPath);

            // Convert original to WebP
            const originalPath = path.join(uploadsDir, `${filename}-original.webp`);
            await sharp(file.path)
                .webp({ quality: 90 })
                .toFile(originalPath);

            // Delete original uploaded file
            await fs.unlink(file.path);

            // Store relative paths
            processedImages.push({
                thumbnail: `/uploads/books/${filename}-thumb.webp`,
                medium: `/uploads/books/${filename}-medium.webp`,
                original: `/uploads/books/${filename}-original.webp`
            });
        } catch (error) {
            console.error('Error processing image:', error);
            // Clean up on error
            try {
                await fs.unlink(file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
    }

    return processedImages;
};

/**
 * Delete image files
 */
export const deleteBookImages = async (imagePaths) => {
    const uploadsDir = path.join(__dirname, '../uploads/books');

    for (const imagePath of imagePaths) {
        try {
            // Delete all sizes
            const filename = path.basename(imagePath, path.extname(imagePath));
            const baseFilename = filename.replace(/-thumb|-medium|-original$/, '');

            await fs.unlink(path.join(uploadsDir, `${baseFilename}-thumb.webp`)).catch(() => { });
            await fs.unlink(path.join(uploadsDir, `${baseFilename}-medium.webp`)).catch(() => { });
            await fs.unlink(path.join(uploadsDir, `${baseFilename}-original.webp`)).catch(() => { });
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    }
};

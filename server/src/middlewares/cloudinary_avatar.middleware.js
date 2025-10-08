const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadToCloudinary = (fileBuffer, resourceType) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });

async function cloudinaryAvatarUploadMiddleware(req, res, next) {
  try {
    if (req.file) {
      const uploadedImageUrl = await uploadToCloudinary(
        req.file.buffer,
        'image',
        {
          folder: 'avatars',
        }
      );
      req.file.secure_url = uploadedImageUrl; 
    }

    next();
  } catch (err) {
    console.error('Cloudinary avatar upload error:', err);
    res.status(500).json({ message: 'Avatar upload failed' });
  }
}

module.exports = cloudinaryAvatarUploadMiddleware;

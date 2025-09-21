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

async function cloudinaryUploadMiddleware(req, res, next) {
  try {
    const images = req.files['images'] || [];
    let videoLink = null;

    const uploadedImages = await Promise.all(
      images.map(file => uploadToCloudinary(file.buffer, 'image'))
    );

    console.log(req.files['video']);
    

    if (req.files['video'] && req.files['video'][0]) {
      videoLink = await uploadToCloudinary(req.files['video'][0].buffer, 'video');
    }

    console.log(videoLink);
    

    req.body.images = uploadedImages;
    if (videoLink) req.body.videoLink = videoLink;

    next();
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ message: 'File upload failed' });
  }
}

module.exports = cloudinaryUploadMiddleware;

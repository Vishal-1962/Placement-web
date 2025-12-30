// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config(); 

// 1. Configure the Cloudinary 'keys'
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure the 'storage'
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'placement-portal-profiles', 
    allowed_formats: ['jpg', 'png', 'jpeg'], 
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

// 3. Create the multer 'upload' middleware
const upload = multer({ storage: storage });

// 4. --- IMPLEMENTING YOUR PING TEST ---
console.log('--- Checking Cloudinary Connection ---');

cloudinary.api.ping()
  .then(() => console.log("✅ Cloudinary Connection OK"))
  .catch((err) => {
    console.error("❌ Cloudinary Connection Failed:");
    console.error("Full Error Object:", JSON.stringify(err, null, 2)); // Your fix
    console.error("Error Message:", err?.message || "No message");
    console.error("Error Name:", err?.name || "No name");
  });
// --- END OF PING TEST ---

module.exports = upload; // This line is already there

module.exports = upload;
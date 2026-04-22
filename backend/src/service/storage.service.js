const Imagekit = require("@imagekit/nodejs");
const dotenv = require('dotenv').config();

const imagekit = new Imagekit({
    // publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    // urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadImage(buffer, fileName = "image.jpg") {
    try {
        const result = await imagekit.files.upload({
            file: buffer.toString("base64"),
            fileName: fileName
        });
        return result;
    } catch (error) {
        console.error("Image upload failed:", error.message);
        throw error;
    }
}

module.exports = uploadImage;
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');
const writeFileAsync = promisify(fs.writeFile);
const { Product, User, ReviewProduct } = require('../model/Modal'); // Import the Product model
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

const s3Client = new S3Client({

    region: 'eu-north-1',
    credentials: {
        accessKeyId: 'AKIAZ4BXAKBS6X32REP6',
        secretAccessKey: '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',
    }
});


const AdminUpdateProduct = async (req, res) => {
    console.log(req.body);
    const productId = req.body.productId;
    const productName = req.body.productName;
    const productDescription = req.body.productDescription;
    const price = req.body.price;
    const file = req.file; // Use req.file to access the uploaded file

    try {
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update the product details
        product.productName = productName;
        product.productDescription = productDescription;
        product.price = price;

        if (file) {
            const fileExtension = path.extname(file.originalname).toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                return res.status(400).json({ message: 'Invalid image file type' });
            }

            const params = {
                Bucket: 'careerleap', // Replace with your S3 bucket name
                Key: `${uuidv4()}${fileExtension}`, // Generate a unique key for the file
                Body: file.buffer,
            };

            const command = new PutObjectCommand(params);

            try {
                await s3Client.send(command);
                const imageUrl = `https://careerleap.s3.eu-north-1.amazonaws.com/${params.Key}`;
                product.image = imageUrl; // Update the product image with the new URL
            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to upload image' });
            }
        }

        // Save the updated product
        await product.save();

        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const MemberUpdateProduct = async (req, res) => {
    try {
        const productId = req.body.productId;
        const productName = req.body.productName;
        const productDescription = req.body.productDescription;
        const price = req.body.price;
        const imagefile = req.body.file
        const file = req.file; // Use req.file to access the uploaded file
        const email = req.body.email
        console.log(req.body);
        console.log(file);
        const userExist = await User.findOne({ email: email });

        const review = new ReviewProduct({
            status: "Pending",
            productid: productId,
            userid: userExist._id,
            product: {
                productName,
                productDescription,
                price,
            },
            useraccounttype: userExist.accounttype,
        });


        if (file) {
            const fileExtension = path.extname(file.originalname).toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                return res.status(400).json({ message: 'Invalid image file type' });
            }

            const params = {
                Bucket: 'careerleap', // Replace with your S3 bucket name
                Key: `${uuidv4()}${fileExtension}`, // Generate a unique key for the file
                Body: file.buffer,
            };

            const command = new PutObjectCommand(params);

            try {
                await s3Client.send(command);
                const imageUrl = `https://careerleap.s3.eu-north-1.amazonaws.com/${params.Key}`;
                review.image = imageUrl; // Update the product image with the new URL
            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to upload image' });
            }
        } else {
            review.image = imagefile
        }


        // Save the review to the database
        await review.save();


        res.status(200).json({ message: 'Product update submitted for review' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    MemberUpdateProduct,
    AdminUpdateProduct,
};

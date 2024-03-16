const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');
const writeFileAsync = promisify(fs.writeFile);
const { Product, User, ReviewProduct } = require('../model/Modal'); // Import the Product model

const fetchAndSaveProducts = async (req, res) => {
    try {
        const originalproductid = req.query.originalproductid
        console.log(originalproductid);
        if (originalproductid) {
            const getoriginalproduct = await Product.findById(originalproductid)
            res.json(getoriginalproduct)
        } else {
            const getproduct = await Product.find()
            res.json(getproduct)
        }
        console.log('Products saved successfully.');
    } catch (error) {
        console.error('Error fetching and saving products:', error);
    }
};




const deleteProduct = async (req, res) => {
    const { productid } = req.query;

    try {
        // Find the product by ID and delete it
        await Product.findByIdAndDelete(id);

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const AdminUpdateReviewProduct = async (req, res) => {
    try {
        // Extract product data from request body
        const { productName, productDescription, price, statusofapproval, croppedImage } = req.body.productData;
        console.log(req.body.productData);
        // Find the product by its ID (assuming you have an ID for the product)
        const productId = req.body.productData.productId; // Make sure you send productId from the client-side
        console.log(req.body);
        if (statusofapproval === "Approved") {
            const product = await Product.findById(productId);
            const reviewedproduct = await ReviewProduct.findById(req.body.id)
            // Update the product details
            reviewedproduct.status = statusofapproval
            product.productName = productName;
            product.productDescription = productDescription;
            product.price = price;
            product.image = croppedImage
            // Save the updated product
            await reviewedproduct.save()
            await product.save();

            // If a cropped image is provided, save it to the filesystem
            if (croppedImage && croppedImage.startsWith('data:image/jpeg;base64,')) {
                // Remove the data URL prefix to get the base64 data
                const base64Data = croppedImage.replace(/^data:image\/jpeg;base64,/, '');
                const imagePath = path.join(__dirname, '../views/assets', `${productId}.jpg`);

                // Write the image data to the filesystem
                fs.writeFileSync(imagePath, base64Data, 'base64');

                // Update the product's image path in the database
                product.image = `/assets/${productId}.jpg`;
                await product.save();

                res.status(200).json({ message: 'Product updated successfully' });
            }
        } else {
            console.log(req.body.id);
            const reviewedproduct = await ReviewProduct.findById(req.body.id)
            // Update the product details
            console.log(reviewedproduct);
            reviewedproduct.status = statusofapproval
            // Save the updated product
            await reviewedproduct.save()
            res.status(200).json({ message: 'Product Rejected successfully' });

        }
        // Respond with success message

    } catch (error) {
        // Handle errors
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



const AdminUpdateProduct = async (req, res) => {
    const { productData } = req.body;
    const { productId, productName, price, croppedImage, productDescription } = req.body.productData;
    console.log(req.body.productData);
    console.log(croppedImage);
    try {
        if (productData) {
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Update the product details
            product.productName = productName;
            product.productDescription = productDescription;
            product.price = price;

            await product.save();
            // If a cropped image is provided, save it to the filesystem
            if (croppedImage && croppedImage.startsWith('data:image/jpeg;base64,')) {
                // Remove the data URL prefix to get the base64 data
                const base64Data = croppedImage.replace(/^data:image\/jpeg;base64,/, '');
                const imagePath = path.join(__dirname, '../views/assets', `${productId}.jpg`);

                // Write the image data to the filesystem
                fs.writeFileSync(imagePath, base64Data, 'base64');

                // Update the product's image path in the database
                product.image = `/assets/${productId}.jpg`;
            } else if (croppedImage) {
                const base64Data = croppedImage
                const imagePath = path.join(__dirname, '../views/assets', `${productId}.jpg`);

                fs.writeFileSync(imagePath, base64Data, 'base64');

                // Update the product's image path in the database
                product.image = `/assets/${productId}.jpg`;
            }

            // Save the updated product
            await product.save();

            res.status(200).json({ message: 'Product updated successfully' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const MemberUpdateProduct = async (req, res) => {
    try {
        const { productName, productDescription, price, croppedImage } = req.body.productData;
        const { email } = req.body;
        const productId = req.body.productData.productId;
        console.log(req.body.productData);
        console.log(croppedImage);
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

        await review.save();

        const isBase64 = (str) => {
            // Check if the string starts with the base64 prefix
            return str.startsWith('data:image') && str.includes(';base64,');
        };

        if (croppedImage && croppedImage.startsWith('data:image/jpeg;base64,')) {
            // Generate a unique product ID
            const randomProductId = uuidv4();
            const base64Data = croppedImage.replace(/^data:image\/jpeg;base64,/, '');
            const imagePath = path.join(__dirname, '../views/assets', `${randomProductId}.jpg`);

            // Decode base64 and write to file
            await writeFileAsync(imagePath, base64Data, 'base64');

            // Save the image path in the review document
            review.image = `/assets/${randomProductId}.jpg`;
        } else if (isBase64(croppedImage)) {
            // If croppedImage is in base64 format, perform the necessary actions
            const randomProductId = uuidv4();
            const imagePath = path.join(__dirname, '../views/assets', `${randomProductId}.jpg`);
        
            // Decode base64 and write to file
            await writeFileAsync(imagePath, base64Data, 'base64');
        
            // Save the image path in the review document
            review.image = `/assets/${randomProductId}.jpg`;
        } else {
            // If croppedImage is not in base64 format, assume it's already an image path
            review.image = croppedImage;
        }
        

        // Save the review to the database
        await review.save();


        res.status(200).json({ message: 'Product update submitted for review' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getReviewedProduct = async (req, res) => {
    try {
        const { email } = req.query; // Access the email property directly

        if (email) {
            // Find the user by email
            const user = await User.findOne({ email });
            console.log(user);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Find reviewed products by user ID
            const reviewedProducts = await ReviewProduct.find({ userid: user._id });
            console.log(reviewedProducts);
            res.json({ MemberReviewedProducts: reviewedProducts });
        } else {
            // No email provided, fetch all reviewed products
            const reviewedProducts = await ReviewProduct.find();
            res.json({ MemberReviewedProducts: reviewedProducts });
        }
    } catch (error) {
        console.error('Error retrieving reviewed products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getRequestCount = async (req, res) => {
    try {
        const email = req.query
        // Get counts of requests with different statuses
        const user = await User.findOne(email)

        if (email && user.accounttype === "Member") {
            const pendingCount = await ReviewProduct.countDocuments({ userid: user._id, status: "Pending" });
            const approvedCount = await ReviewProduct.countDocuments({ userid: user._id, status: "Approved" });
            const rejectedCount = await ReviewProduct.countDocuments({ userid: user._id, status: "Rejected" });
            res.json({ pendingCount, approvedCount, rejectedCount, accounttype: user.accounttype });
        } else {
            const pendingCount = await ReviewProduct.countDocuments({ status: "Pending" });
            const approvedCount = await ReviewProduct.countDocuments({ status: "Approved" });
            const rejectedCount = await ReviewProduct.countDocuments({ status: "Rejected" });
            res.json({ pendingCount, approvedCount, rejectedCount });
        }
        // Send the counts in the response

    } catch (error) {
        console.error('Error retrieving reviewed products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {
    fetchAndSaveProducts,
    AdminUpdateProduct,
    AdminUpdateReviewProduct,
    MemberUpdateProduct,
    getReviewedProduct,
    deleteProduct,
    getRequestCount
};
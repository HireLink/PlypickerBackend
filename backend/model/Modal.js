const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    email: { type: String },
    password: { type: String },
    accounttype: { type: String },
    accountstatus: { type: String, default: "Active" }
});

const productSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    image: String,
    productDescription: String,
});


const reviewProductUpdate = new mongoose.Schema({
    status: { type: String, default: "Pending" },
    productid: { type: mongoose.Types.ObjectId, ref: 'Product' },
    userid: { type: mongoose.Types.ObjectId, ref: 'User' },
    product: [productSchema],
    image: String,
    useraccounttype: { type: String }
})


const ReviewProduct = mongoose.model('Review', reviewProductUpdate);
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model("User", UserSchema);

module.exports = { User, Product, ReviewProduct };

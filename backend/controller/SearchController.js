const { Product } = require("../model/Modal");

const SearchFilter = async (req, res) => {
    try {
        // Get search query and filter parameters from the request
        const { title } = req.body;
        console.log(req.body);

        // Fetch products from the database
        const allProducts = await Product.find();

        // Filter products based on search criteria
        const filteredProducts = allProducts.filter(product => {
            // Convert both the search query and product title to lowercase for case-insensitive comparison
            const lowerCaseTitle = title.toLowerCase();
            const lowerCaseProductTitle = product.productName.toLowerCase();

            // Check if the product title contains the search query
            return lowerCaseProductTitle.includes(lowerCaseTitle);
        });

        console.log(filteredProducts);
        res.json({ productData: filteredProducts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving data' });
    }
};

module.exports = { SearchFilter };

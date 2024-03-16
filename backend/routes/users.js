const express = require('express');
const router = express.Router();
const Sign = require("../controller/SignLoginController");
const { fetchAndSaveProducts, getRequestCount, getReviewedProduct, AdminUpdateReviewProduct, deleteProduct } = require('../controller/ProductController');
const { getUserTypeData, getUserStatusData, updateuserstatus } = require('../controller/UserController');
const { refreshtoken } = require('../Auth/tokenrefresh');
const { SearchFilter } = require('../controller/SearchController');
const { AdminUpdateProduct, MemberUpdateProduct } = require('../controller/ProductUpdateController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//Auth
router.post('/api/auth/login', Sign.loginUser);
router.post('/api/auth/signup', Sign.signupUser);

//Products
router.get('/fetch-and-save-products', fetchAndSaveProducts);
router.delete('/deleteproduct', deleteProduct)

//AdminDirectUpdate
router.post('/updateproduct', upload.single('file'), AdminUpdateProduct);

//AdminRequestUpdate
router.post('/updatereviewproduct', AdminUpdateReviewProduct);

//TeamMemberUpdate
router.post('/memberupdateproduct', upload.single('file'), MemberUpdateProduct);

//AccountStatus
router.get('/api/getuserdata', getUserTypeData)

//Requested Products
router.get('/api/reviewedproduct', getReviewedProduct)

//RequestCount
router.get('/api/requestcount', getRequestCount)


router.get('/api/userdata', getUserStatusData)

//Update User Status
router.post('/api/updateuserstatus', updateuserstatus)

//Token Refresh
router.post('/api/refreshtoken', refreshtoken)


//Search
router.post('/api/search', SearchFilter)

module.exports = router;
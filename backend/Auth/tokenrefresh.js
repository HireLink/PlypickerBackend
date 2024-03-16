const jwt = require('jsonwebtoken');
const { User } = require('../model/Modal');


const refreshtoken = async (req, res) => {
    try {
        const { expiredToken, email } = req.body;
        console.log(expiredToken);
        // Verify the expired token
        const decodedToken = jwt.verify(expiredToken, secretKey);

        // Find the user by email
        const user = await User.findOne({ email });

        if (user && user._id === decodedToken._id) {
            // Generate a new token for the user
            const newToken = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '1h' });

            res.status(200).json({ token: newToken });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({ message: 'Token refresh failed' });
    }
};



module.exports = {
    refreshtoken
}
const { User } = require("../model/Modal")

const getUserTypeData = async (req, res) => {
    try {
        const { email } = req.query;
        console.log(email);
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ accountStatus: user.accounttype });
    } catch (error) {
        console.error('Error getting user data:', error);
        res.status(500).json({ message: 'Error getting user data' });
    }
};


const getUserStatusData = async (req, res) => {
    try {
        const user = await User.find({ accounttype: 'Member' });
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ userData: user });
    } catch (error) {
        console.error('Error getting user data:', error);
        res.status(500).json({ message: 'Error getting user data' });
    }
};



const updateuserstatus = async (req, res) => {
    try {
        const { email, status } = req.body;


        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's account status
        user.accountstatus = status;
        await user.save();

        // Respond with the updated user data
        res.status(200).json({ userData: user });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Error updating user status' });
    }
};




module.exports = {
    getUserTypeData,
    getUserStatusData,
    updateuserstatus
}
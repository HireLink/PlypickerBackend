const { User, Company } = require("../model/Modal");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const signupUser = async (req, res) => {
    try {
        const { email, password, accounttype } = req.body;
        console.log(accounttype);
        console.log(email);

        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(400).json({ message: 'User Already Exists, Try another mail' });
        }

        const hashpassword = await bcrypt.hash(password, 10);

        const user = new User({
            email: email,
            accounttype: accounttype,
            password: hashpassword
        });
        await user.save();

        res.json({ message: "Registered Successfully" });
    } catch (e) {
        console.log(e);
        res.json({ message: "Error occurred while signing up" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user.accountstatus === "Blocked") {
            return res.status(400).json({ message: 'Account is Blocked! Contact Admin for further' });
        }

        if (user) {

            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) {
                const token = jwt.sign({ _id: user._id }, "secret-key", { expiresIn: '1h' });

                // Include the token's expiration time in the response
                const expiresIn = new Date().getTime() + 60 * 60 * 1000; // 1 hour from now

                return res.status(200).json({
                    message: 'Logged in Successfully',
                    token,
                    expiresIn,
                    useremail: email
                });
            } else {
                return res.status(400).json({ message: 'Password Incorrect' });
            }
        }

        return res.status(400).json({ message: 'Email not found, please sign up' });
    } catch (e) {
        res.status(500).json({ error: e.message || "Error occurred while logging in" });
    }
}




module.exports = { signupUser, loginUser };

import User from "../../model/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import transporter from "../../config/sendEmail.js"
import bcrtpt from "bcrypt"

// auth controller  
const signup = async (req, res) => {
    try {
        const { userName, email, password, cPassword, phone, gender } = req.body
        const user = await User.findOne({ email })
        if (user) {
            return res.ststus(400).json({ message: "email is aleardy registerd" })
        }

        if (password != cPassword) {
            return res.status(400).json({ message: "Password and confirm password do not match" });
        }
        const hash = await bcrtpt.hash(password, 8)
        console.log(hash)
        const newUser = new User({
            userName, email, password: hash, phone, gender
        })
        const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY)
        console.log(token)
        const mailOptions = {
            from: '"verify your account 👻"',
            to: `${email}`,
            subject: 'Verification Email',
            text: `Please verify your email address by clicking on the link below:`,
            html: `<div>
                   <a href="http://localhost:${process.env.PORT}/user/verify/${token}">verify</a>
                    </div>`, // html body
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                // Handle the error and return a response to the client
                return res.status(500).json({ message: "Error sending verification email", error });
            }
        });
        await newUser.save();
        res.status(201).json({ message: "Registration successful and verification email is sended" });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.isDeleted) {
            return res.status(404).json({ message: "Email not found or account deleted" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your account" });
        }

        const token = jwt.sign(
            { id: user._id, isVerified: user.isVerified, email, isAdmin: user.isAdmin, isDeleted: user.isDeleted },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '3d' }
        );

        res.status(200).json({ message: "Welcome", token });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
const verifyAccount = async (req, res) => {
    const { token } = req.params;
    try {
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded)
        const user = await User.findOne({ email: decoded.email });
        console.log(user)

        if (!user) {
            return res.status(404).json({ message: 'Invalid verification token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ message: 'Account verified successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};
//end auth

// crud controller
const softDeletedUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ID
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        // Find user by ID
        const user = await User.findById(id);
        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if user is already soft-deleted
        if (user.isDeleted) {
            // Permanently delete user
            await User.findByIdAndDelete(id);
            return res.status(200).json({ message: "User is permanently deleted" });
        }
        // Move user to soft-deleted state
        const updatedUser = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        // Send response with updated user
        res.status(200).json({ message: "User is moved to soft-deleted state", user: updatedUser });
    } catch (error) {
        // Handle errors
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const updateUser = async (req, res) => {
    try {
        const dataPayload = req.body;
        const { id } = req.params;
        // Valiate ID
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        // Find user by ID and update
        const updatedUser = await User.findByIdAndUpdate(id, dataPayload, { new: true });
        // Check if user exists
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Send response with updated user
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        // Handle errors
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const getAllUsers = async (req, res) => {
    const query = req.query.new;
    try {
        const users = query
            ? await User.find({ isDeleted: false }).sort({ _id: -1 }).limit(5)
            : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}
const getAllUsersDeleted = async (req, res) => {
    const query = req.query.new;
    try {
        const users = query
            ? await User.find({ isDeleted }).sort({ _id: -1 }).limit(5)
            : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}
// end crud

export {
    login, signup, updateUser, verifyAccount, softDeletedUser, getAllUsers, getAllUsersDeleted
}
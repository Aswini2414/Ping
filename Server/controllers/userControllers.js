const User = require('../Models/userModel');
const generateToken = require("../config/generateToken");

const registerUser = async (req, res) => {
    const { name, email, password, confirm, image } = req.body;
    console.log(req.body);
    if (!name || !email || !password ) {
        res.status(400).json({ message: "Please enter all the fields" });
    } 
    const preUser = await User.findOne({ email });
    if (preUser) {
        res.status(400).json({ message: "User already exists" });
    } else {
        const newUser = await User.create({ name, email, password, image });
        await newUser.save()
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            image: newUser.image,
            token:generateToken(newUser._id)
        });
    }
}

const authUser = async (req, res) => {
    const { email, password } = req.body;

    const preUser = await User.findOne({ email });
    if (preUser && (await preUser.matchPassword(password))) {
        const user_data = {
          _id: preUser._id,
          name: preUser.name,
          email: preUser.email,
          image: preUser.image,
          token: generateToken(preUser._id),
        };
         res.status(200).json(user_data);
     }
}

const allUsers = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select("-password");
    res.send(users);
};


module.exports = { registerUser,authUser,allUsers};
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/UserModal");
const registerUser = asyncHandler( async(req,res) => {
    const { email, username, password } = req.body;

    if(!username || !email || !password) {
        res.status(400)
        throw new Error("Please add all fields");
    }

    // check if the user exists
    const userExists = await User.findOne({ email });

    if( userExists ) {
        res.status(400)
        throw new Error("User already exists");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if(user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
});


const loginUser = asyncHandler( async ( req, res ) => {
    const { email, password } = req.body;
    //check if user exists
    const user = await User.findOne({ email });

    if( user && ( await bcrypt.compare(password, user.password))) {
        res.json( {
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400)
        throw new Error("Invalid Credentials")
    }

});

const getCredentials = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
  })
// generate token

function generateToken(id) {
    return jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: '30d'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getCredentials
}
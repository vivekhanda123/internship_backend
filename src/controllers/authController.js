const User = require("../models/user");
const Demo = require("../models/demo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
require('dotenv').config();

require("../common/auth");

const input = process.env.DEMO;

exports.signUp = async (req, res) => {
  try {
    const {
      first_name,
      second_name,
      email,
      dob,
      city,
      country,
      address,
      phone_number,
      password,
      status,
    } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Check if any detail is not filled
    if (
      !first_name ||
      !second_name ||
      !email ||
      !dob ||
      !city ||
      !country ||
      !address ||
      !phone_number ||
      !password ||
      !status
    ) {
      return res.status(402).json({ error: "Please fill all details" });
    }

    // Create new user
    const addingUserRecords = new User(req.body);
    // Hash the password
    const userCreated = await addingUserRecords.save();
    // User.password = undefined ;
    return res.status(200).send(userCreated);
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e.message);
  }
};

exports.login = async (req, res) => {
  try {
    console.log(input);
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).send("Send all the data");
    }

    // Check if user exists in DB
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate User Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id },"shhhh", { expiresIn: "1h" });

    // Set cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days and 24 hours, 60 minutes, 60 seconds, and 1000 milliseconds
      httpOnly: true, //changed by the browser only
      secure: true, // Only set the cookie for HTTPS connections
    };

    // Set the token cookie
    res.cookie("token", token, options);

    // Clear sensitive user data
    user.token = token;
    user.password = undefined;

    // Send response with token and user details
    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error: " + error.message);
  }
};

exports.forgot = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    //   const resetToken = jwt.sign({email},"shhhh",{expiresIn:'1h'});
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "vivekhandaindore@gmail.com", // EMAIL_USER
        pass: "ggtp ugpi mqks sywf", // EMAIL_PASS
      },
    });
    const mailOptions = {
      from: "vivek@yopmail.com",
      to: email,
      subject: "Password Reset Email",

      html: `<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <p>${"http://localhost:5173"}/reset/${user._id.toString()}</p> 
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      // /signUp/id
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Email not send" });
      }
      console.log("Reset email sent:", info.response);
      res.status(200).json({ message: "Reset email sent successfully" });
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.reset = async (req, res) => {
  try {
    const { password,_id } = req.body;
    // const _id = req.params.id;

    if (!_id || _id.trim() === '') {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findOne({ _id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const requestingUserId = req.userId; // User ID extracted from JWT token
    const { _id, new_password } = req.body;

    // Check if the user making the request is authorized to change
    if (requestingUserId !== _id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to change password for this user" });
    }

    // Update the user's password in the database
    const hashedPassword = await bcrypt.hash(new_password, 12);
    await User.findByIdAndUpdate(_id, { password: hashedPassword });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const requestingUserId = req.userId;
    const _id = req.params.id;
    const updateData = req.body;

    if (requestingUserId !== _id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update the information" });
    }
    
    // Updation code
    const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    // User not found
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found or data not updated " });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Something went wrong");
  }
};

exports.delete = async (req, res) => {
  try {
    const _id = req.params.id;
    const requestingUserId = req.userId;
    if (requestingUserId !== _id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete details" });
    }
    const updateData = await User.updateOne(
      { _id: _id },
      { $set: { status: "inactive" } }
    );

    // Updation code
    const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not set to inactive" });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", user: updatedUser });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Something went wrong");
  }
};

exports.userList = async (req, res) => {
  try {
    let { page, size, search } = req.query;
    const requestingUserId = req.userId;

    if (!page) {
      page = 1; // Default page number
    }
    if (!size) {
      size = 5; // Default page size
    }
    const limit = parseInt(size); //convert strint value to integer 
    const skip = (page - 1) * size;

    // Constructing the search query based on the 'search' parameter
    const searchQuery = search ? { $or: [
      { email: { $regex: search, $options: 'i' } },      //searching and replacing 
      { first_name: { $regex: search, $options: 'i' } },
      { last_name: { $regex: search, $options: 'i' } }
    ] } : {};

    // Exclude the logged-in user details from the list
    if (requestingUserId) {
      searchQuery._id = { $ne: requestingUserId };
    }

    const count = await User.countDocuments(searchQuery);
    const users = await User.find(searchQuery)
      .select('first_name second_name last_name phone_number country')
      .sort({ first_name: 1, second_name: 1, last_name: 1, phone_number: 1, country: 1 })
      .skip(skip)
      .limit(limit);

    res.send([users]);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Something went wrong");
  }
};

exports.userData = async(req,res) =>{
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(400).send( user);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Something went wrong");
  }
}

// Addtional controllers

exports.additionalData = async (req, res) => {
  const { email, hobbies, skills, achievements, nickname } = req.body;
  // Check if any detail is not filled
  if (!email || !hobbies || !skills || !achievements || !nickname) {
    return res.status(402).json({ error: "Please fill all details" });
  }
  try {
    const addingUserRecords = new Demo(req.body);
    const userCreated = await addingUserRecords.save();
    return res.status(201).send(userCreated);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Something went wrong");
  }
};

exports.individualDetails = async (req, res) => {
  try {
    // const _id = req.params.id;
    const findData = await User.aggregate([ // User is the parent collection  
      {
        $lookup: {
          from: "demos", // demos is the child collection 
          localField: "email", // its there in parent collection 
          foreignField: "email", // its there in the child collection
          as: "Extra details",  // represented as 
        },
      },
    ]);
    res.send(findData);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Something went wrong");
  }
};

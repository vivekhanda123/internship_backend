const express = require("express");
const router = new express.Router();
const userData = require("../models/user");
const authController = require("../controllers/authController");
const authenticateToken = require('../common/auth');
require('dotenv').config();


// To take the user details for signup page
router.post("/signUp",authController.signUp);

// to take the user details for login page 
router.post("/login",authController.login);

// Forgot password details 
router.post("/forgotPassword",authController.forgot);

// Reset password
router.put("/reset/:id",authController.reset);

// Update user account
router.put("/update",authenticateToken,authController.update); //"id"

// Soft delete a user form database means make the user inactive
router.put("/delete/:id",authenticateToken,authController.delete);

// Change password link for passing in email 
router.put('/changePassword',authenticateToken,authController.changePassword);

// Display details of the user + pagination + search
router.get("/userList",authenticateToken,authController.userList);

// Individual details
router.get("/userData",authenticateToken,authController.userData);

// Extra APIs data will be taken from the "Data" model

router.post("/additionalData",authController.additionalData);
router.get("/individualDetails",authController.individualDetails);

// Todo list APIs

router.post("/todo/add",authenticateToken,authController.add);
router.get("/todo/showData",authController.showData);
router.put("/todo/update/:id",authController.todoUpdate);
router.delete("/todo/delete/:id",authController.todoDelete);


module.exports = router;
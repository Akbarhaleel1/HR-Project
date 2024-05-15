const express = require("express");
const app = express();
const userCollection = require("../model/user");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const Meeting = require("../model/Meeting");
const Employee = require("../model/EmployeeSchema");

// // Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "akbarhaleel508@gmail.com",
    pass: "gwvm bfrb rmou tcda",
  },
});

// Generate a new secret for TOTP
const secret = speakeasy.generateSecret({ length: 10, name: "MyApp" });

//   // Function to generate an OTP token
const generateOTPToken = () => {
  return speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
  });
};

//   // Function to send OTP via email
const sendOTPEmail = (email, otp) => {
  const mailOptions = {
    from: "akbarhaleel508@gmail.com",
    to: email,
    subject: "One-Time Password (OTP)",
    text: `Your OTP for MyApp: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// signup get

exports.getSignup = (req, res) => {
  try {
    res.render("signup");
  } catch (error) {
    console.log("error in signup get", error);
  }
};
exports.getLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.error("Error in getlogin route:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.postSignup = async (req, res) => {
  try {
    console.log("signup Post is working");
    console.log("value is :", req.body);
    const data = {
      username: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: "user",
    };
    req.session.userdetails = data;

    const userExist = await userCollection.findOne({ email: data.email });
    if (!userExist) {
      // Example usage
      const userEmailAddress = data.email;
      req.session.otpToken = generateOTPToken();
      console.log(req.session.otpToken);
      otpmail = userEmailAddress;
      // Send OTP via email
      sendOTPEmail(userEmailAddress, req.session.otpToken);
      console.log("success");
      res.redirect("/otp");
    } else {
      res.render("signup", { message: "User is already Exisis" });
    }
  } catch (error) {
    console.error("Error in getlogin route:", error);
    res.status(500).send("Internal Server Error");
  }
};

// otp get
exports.getOtp = (req, res) => {
  try {
    res.render("otp");
  } catch (error) {
    console.log("otp get error ", error);
  }
};

// OTP post Router
exports.postOtp = async (req, res) => {
  try {
    console.log(req.session.userdetails);

    const enteredotp = req.body.digits;
    console.log("User entered OTP:", enteredotp);

    if (enteredotp === req.session.otpToken) {
      // Hash and salt the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        req.session.userdetails.password,
        saltRounds
      );

      // Replace plain password with hashed password
      req.session.userdetails.password = hashedPassword;

      // Create a user in the database
      await userCollection.create(req.session.userdetails);

      // Redirect to login page upon successful registration
      res.redirect("/login");
      console.log("OTP verified successfully!");
    } else {
      // Render an error message if OTP is invalid
      res.render("otp", { message: "Invalid OTP. Please try again." });
      console.log("Invalid OTP. Please try again.");
    }
  } catch (error) {
    // Log and handle errors appropriately
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// post login

exports.postLogin = async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };

    if (!data.email || !data.password) {
      res.render("login", { message: "Username and password are required." });
      return;
    }

    const user = await userCollection.findOne({ email: data.email });

    if (!user) {
      console.log("Account doesn't exist");
      res.render("login", {
        message: "Account doesn't exist. Use different credentials.",
      });
      return;
    }

    // Use bcrypt.compare to check the password
    const passwordMatch = await bcrypt.compare(data.password, user.password);

    // Store essential information in session
    req.session.user = {
      userId: user._id,
      username: user.username,
      role: user.role,
    };

    // Redirect based on role
    if (user.role === "user") {
      res.redirect("/userhome");
    } else {
      res.redirect("/home");
    }
  } catch (error) {
    console.error("Error in postLogin route:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getHome = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.error("Error in getlogin route:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.HRMangement = async (req, res) => {
  try {
    // Fetch meetings from database. Assume we want all meetings for simplicity
    const sheduleMeetings = await Meeting.find({});
    console.log("sheduleMeetings", sheduleMeetings);
    // Render the HRMangement.ejs view and pass sheduleMeetings to it
    res.render("HrMangement", { sheduleMeetings });
  } catch (error) {
    console.error("Error in getlogin route:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.postMeetings = async (req, res) => {
  try {
    console.log("data is", req.body);
    const { title, startTime, endTime } = req.body;
    const newMeeting = new Meeting({
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    await newMeeting.save();
    res.redirect("/successPage");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error scheduling meeting");
  }
};

exports.CancelMeeting = async (req, res) => {
  try {
    const { meetingId } = req.body; // Extract meetingId from the body
    const result = await Meeting.updateOne(
      { _id: meetingId },
      { $set: { status: "cancelled" } }
    );
  } catch (error) {
    console.error("Error cancelling meeting:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error scheduling meeting",
        error: error.message,
      });
  }
};

exports.successPage = (req, res) => {
  res.render("successerPage");
};

exports.cancelMeeting = (req, res) => {
  res.render("cancelMeeting");
};

// User Home

exports.userhome = async (req, res) => {
  if (!req.session.user || !req.session.user.userId) {
    // Redirect to login if session is not set or invalid
    return res.redirect("/login");
  }

  try {
    const userId = req.session.user.userId;
    const user = await userCollection.findOne({ _id: userId });
    const userdetails = await Employee.findOne({ userId: userId });

    console.log(user, userdetails);
    res.render("userhome", { user, userdetails });
  } catch (error) {
    console.error("Error in userhome get", error);
    res.status(500).send("Error loading user home page");
  }
};

exports.PostaddDetails = async (req, res) => {
  const userId = req.session.user.userId;
  console.log("session in post add details", userId);
  try {
    const { firstName, lastName, email, age, department, position, salary } =
      req.body;

    // Create a new employee document
    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      age,
      department,
      position,
      salary,
      userId: userId,
    });

    // Save the employee document to MongoDB
    newEmployee.save();
    res.redirect("/userhome");
  } catch (error) {
    console.log("error in POST addDetails", error);
  }
};

exports.admin = (req, res) => {
  try {
    res.render("admin");
  } catch (error) {
    console.log("error in adminlogin", error);
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

exports.postAdmin = (req, res) => {
  try {
    const { adminName, adminEmail, adminPassword } = req.body;
    req.session.adminPassword = adminPassword;
    const newUser = new userCollection({
      username: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    // Saving the new document to the database
    newUser.save().then((savedUser) => {
      // Handle success
      console.log("New user created:", savedUser);
    });
    console.log("admin session is", req.session.adminPassword);
    res.redirect("/login");
  } catch (error) {
    console.log("error in adminlogin post", error);
  }
};

exports.addDetails = (req, res) => {
  try {
    res.render("EmployeeForm");
  } catch (error) {
    console.log("error in adddetails get", error);
  }
};

exports.usersDetails = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render("usersDetails", { employees });
  } catch (error) {
    console.log("error in adddetails get", error);
  }
};

exports.editUserDetails = async (req, res) => {
  const { email, department, salary, position } = req.body;
  try {
    await Employee.findOneAndUpdate(
      { email },
      { department, salary, position }
    );
    res.redirect("/userDetails"); // Redirect back to the employee list page
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).send("Failed to update employee");
  }
};

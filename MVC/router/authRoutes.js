const express = require("express");
const router = express.Router();
const session = require("express-session");
require("dotenv").config();

const {
  getHome,
  HRMangement,
  getLogin,
  getOtp,
  postOtp,
  successPage,
  cancelMeeting,
  userhome,
  PostaddDetails,
  usersDetails,
} = require("../controller/authController");
const {
  postSignup,
  postLogin,
  postMeetings,
  CancelMeeting,
  logout,
  admin,
  postAdmin,
  addDetails,
  editUserDetails,
} = require("../controller/authController");

router.get("/home", getHome);
router.get("/HrMangement", HRMangement);
router.get("/login", getLogin);
router.post("/login", postLogin);
router.post("/signup", postSignup);
//OTP get router
router.get("/otp", getOtp);
router.post("/otp", postOtp);
router.post("/sheduleMeeting", postMeetings);
router.post("/cancel-meeting", CancelMeeting);
router.get("/successPage", successPage);
router.get("/cancelMeeting", cancelMeeting);

// router.get("/meeting", getMeeting);

router.get("/logout", logout);
//role based authenctication
router.get("/admin", admin);
router.post("/admin", postAdmin);
// userhome
router.get("/userhome", userhome);
// employee form
router.get("/add-details", addDetails);
router.post("/add-details", PostaddDetails);

router.get("/userDetails", usersDetails);

router.post("/userDetails", editUserDetails);

module.exports = router;

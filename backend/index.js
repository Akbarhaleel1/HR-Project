const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { default: axios } = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();
let ChatMessage = require("../model/ChatMessage");
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", Credential: true }));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// database connection

mongoose
  .connect(process.env.MONGO_STR)
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch(() => {
    console.log("connection failed");
  });

const cookieParser = require("cookie-parser");
const authRoutes = require("../MVC/router/authRoutes");

app.post("/authenticate", async (req, res) => {
  const { username } = req.body;
  try {
    const r = await axios.put(
      "https://api.chatengine.io/users/",
      { username: username, secret: username, first_name: username },
      { headers: { "private-key": "be4cc75a-fd80-4232-a87e-e103105d972b" } }
    );

    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response.status).json(e.response.data);
  }
});

const fetchDataAndSaveOrUpdate = async () => {
  try {
    const response = await axios.get("https://api.chatengine.io/users/", {
      headers: {
        "Project-ID": "3c0cc79b-f720-4cc5-aaf5-c770582e6bc3",
        "Private-Key": "be4cc75a-fd80-4232-a87e-e103105d972b",
      },
    });

    for (const user of response.data) {
      const existingUser = await ChatMessage.findOne({
        chatEngineId: user.id,
      }).exec();

      if (existingUser) {
        // Check if there's a new last message to add to the allMessages array
        if (
          existingUser.lastMessage &&
          user.last_message &&
          existingUser.lastMessage.id !== user.last_message.id
        ) {
          existingUser.allMessages.push(user.last_message); // Add new message
        }

        // Update lastMessage with the latest one from the API
        existingUser.lastMessage = user.last_message;

        // You might want to update specific fields only if they need to be updated:
        // Example: Check for change before updating
        if (existingUser.isOnline !== user.is_online) {
          existingUser.isOnline = user.is_online;
        }

        await existingUser.save();
      } else {
        // If user does not exist, create a new record
        const newUser = new ChatMessage({
          chatEngineId: user.id,
          isAuthenticated: user.is_authenticated,
          lastMessage: user.last_message,
          allMessages: [user.last_message], // Initialize with the lastMessage
          username: user.username,
          secret: user.secret,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          avatar: user.avatar,
          customJson: JSON.parse(user.custom_json),
          isOnline: user.is_online,
          created: new Date(user.created),
        });
        await newUser.save();
      }
    }
  } catch (error) {
    // console.log(error);
  }
};

setInterval(() => {
  fetchDataAndSaveOrUpdate();
}, 5000);

app.use(express.static("public/uploads"));
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
// app.set("views", "./views/user");
app.set("views", "../MVC/views/user");

// Routes
app.use("/", authRoutes);
console.log(`http://localhost:3001/login`);
app.listen(3001);

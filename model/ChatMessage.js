const mongoose = require("../MVC/Database/db.connect")


const chatMessageSchema = new mongoose.Schema({
    chatEngineId: Number,
    isAuthenticated: Boolean,
    lastMessage: {
      id: Number,
      text: String,
      created: Date,
      attachments: Array
    },
    allMessages: [{
      id: Number,
      text: String,
      created: Date,
      attachments: Array
    }],
    username: String,
    secret: String,
    email: String,
    firstName: String,
    lastName: String,
    avatar: String,
    customJson: Object,
    isOnline: Boolean,
    created: Date
});


const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
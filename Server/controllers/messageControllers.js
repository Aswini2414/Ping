const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");

const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name image email").populate("chat");

        res.status(200).json(messages);
    } catch (error) {
        throw new Error (error.message);
    }
    
}

const sendMessage = async (req, res) => {
    const { chatId, content } = req.body;

    if (!content || !chatId) {
        res.status(400).json("Missing content or chatId");
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        let message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select:"name pic email",
        })
        
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage:message,
        })
        res.status(200).json(message);
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { allMessages, sendMessage };
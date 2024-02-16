const User = require('../Models/userModel');
const Chat = require('../Models/chatModel');
const asyncHandler = require("express-async-handler");

const accessChat = async (req, res) => {
    const { userId } = req.body;

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    }).populate("users", "-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    
    try {
      if (isChat.length > 0) {
        res.send(isChat[0]);
      } else {
        var chatData = {
          chatName: "sender",
          isGroupChat: "false",
          users: [req.user._id, userId],
        };
      }
      const createChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
    
};

const fetchChats = async (req, res) => {

    try {
        let isChat = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate("users", "-password").populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email",
        });

        res.status(200).json(isChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        res.status(400).send({message:"Please fill all the fields"})
    }

    let users = req.body.users;
    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        console.log("hi");

        const fullGroupChat = await Chat.findById({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat );
    } catch (error) {
            res.status(400);
            throw new Error(error.message);
    }
})

const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName: chatName }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.staus(404);
        throw new Error("Chat not found");
    } else {
        res.json(updatedChat);
    }
}

const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(chatId, {
        $pull: { users: userId }
    }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }
};

const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(chatId, {
        $push: { users: userId },
    }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.status(201).json(added);
    }
}

module.exports = { accessChat, fetchChats,createGroupChat,renameGroup,removeFromGroup,addToGroup};
const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/message");
const Chat = require("../models/chat");

const sendMessages = expressAsyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  const sender = req.user._id;

  if (!chatId || !content) {
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: sender,
    content: content,
    chat: chatId,
  };

  try {
    const message = await Message.create(newMessage);

    // Now fetch the message with the populated fields
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name")
      .populate({
        path: "chat",
        model: "Chat",
        populate: {
          path: "users",
          model: "User",
          select: "name email",
        },
      })
      .exec();

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: populatedMessage,
    });

    res.json(populatedMessage);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to send message" });
  }
});

const allMessages = expressAsyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  console.log(chatId);
  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

module.exports = { sendMessages, allMessages };

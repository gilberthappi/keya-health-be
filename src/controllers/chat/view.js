import { Chats, Messages } from "../../models";
import { errorHandler, respond } from "../../utils";
import DataHandler from "../../utils/dataHandler";
import status from "http-status";

export const view = async (req, res) => {
	try {
		let countQuery = { ...req.query };

		delete countQuery.sk;
		delete countQuery.page;
		delete countQuery.limit;
		delete countQuery.sort;
		delete countQuery.populate;

		const total = await Chats.find(countQuery).count();

		const features = new DataHandler(Chats.find(countQuery), req.query)
			.search()
			.filter()
			.paginate()
			.sort()
			.populate();

		const doc = await features.query;

		if (!doc) {
			let error = new Error("Failed to retrieve data!");
			error.status = status.BAD_REQUEST;
			throw error;
		}

		respond(
			res,
			status.OK,
			{
				data: doc,
				total,
				page: req.query.page * 1,
				limit: req.query.limit * 1,
			},
			"Retrieved successfully"
		);
	} catch (error) {
		errorHandler(res, error);
	}
};

// delete all chats
export const deleteAll = async (req, res) => {
	try {
		const data = await Chats.deleteMany();

		if (!data) {
			let error = new Error("Failed to delete. make sure item exist!");
			error.status = status.BAD_REQUEST;
			throw error;
		}

		respond(res, status.OK, data, "Deleted successfully");
	} catch (error) {
		errorHandler(res, error);
	}
};

export const checkIfChatExists = async (req, res) => {
	const { user1Id, user2Id } = req.params;

	try {
		const chat = await Chats.findOne({
			$or: [
				{ privateUser1: user1Id, privateUser2: user2Id },
				{ privateUser1: user2Id, privateUser2: user1Id },
			],
		});

		if (chat) {
			return res.status(200).json({ exists: true, chatId: chat._id });
		} else {
			return res.status(200).json({ exists: false });
		}
	} catch (error) {
		return res.status(500).json({ error: "Server error" });
	}
};

export const getUserChats = async (req, res) => {
	try {
	  const userId = req.userId;
  
	  // Find chats involving the user
	  const chats = await Chats.find({
		$or: [{ privateUser1: userId }, { privateUser2: userId }],
	  }).populate("privateUser1 privateUser2", "name photo");
  
	  if (!chats || chats.length === 0) {
		console.log("No chats found");
		return respond(res, status.OK, { data: [] }, "No chats found");
	  }
  
	  // Get the latest message for each chat and include message text, time, and read status
	  const modifiedChats = await Promise.all(
		chats.map(async (chat) => {
		  const latestMessage = await Messages.findOne({ chat: chat._id })
			.sort({ createdAt: -1 })
			.select("createdAt text sender read");
  
		  let unreadMessagesCount = 0;
		  let isOther = false;
  
		  // If the last message is not sent by the user, set isOther = true
		  if (latestMessage && !latestMessage.sender.equals(userId)) {
			isOther = true; // The last message is from the other user
  
			// Fetch all messages from this chat, newer ones first
			const messages = await Messages.find({ chat: chat._id })
			  .sort({ createdAt: -1 })
			  .select("sender read");
  
			// Count unread messages only if isOther is true
			if (isOther) {
			  for (const message of messages) {
				if (message.sender.equals(userId)) {
				  break; // Stop counting when a message from the user is found
				} else if (!message.read) {
				  unreadMessagesCount += 1;
				}
			  }
			}
		  }
  
		  // Determine the other user in the private chat
		  const otherUser =
			chat.privateUser1._id.equals(userId)
			  ? chat.privateUser2
			  : chat.privateUser1;
  
		  return {
			...chat._doc,
			title: otherUser.name,
			image: otherUser.photo,
			otherUser,
			lastMessage: latestMessage ? latestMessage.text : null,
			lastMessageTime: latestMessage ? latestMessage.createdAt : null,
			unreadMessagesCount, // Include the unread messages count
			isOther, // Include the isOther flag
			lastMessageRead: latestMessage ? latestMessage.read : false, // Include the read status of the last message
		  };
		})
	  );
  
	  // Sort chats by last message time (latest first)
	  modifiedChats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
  
	  // Respond with the sorted chats including last message, time, unread message count, isOther flag, and lastMessageRead status
	  respond(
		res,
		status.OK,
		{ data: modifiedChats },
		"Chats retrieved successfully"
	  );
	} catch (error) {
	  errorHandler(res, error);
	}
  };

  
  export const getUserChatById = async (req, res) => {
	try {
	  const userId = req.userId;
	  const chatId = req.params.id;
  
	  // Find the chat and messages for the given chatId
	  const chat = await Chats.findOne({
		_id: chatId,
		$or: [{ privateUser1: userId }, { privateUser2: userId }],
	  }).populate("privateUser1 privateUser2", "name photo");
  
	  if (!chat) {
		console.log("No chat found");
		return respond(res, status.NOT_FOUND, null, "Chat not found");
	  }
  
	  // Fetch the latest message in the chat
	  const latestMessage = await Messages.findOne({ chat: chatId })
		.sort({ createdAt: -1 })
		.select("sender");
  
	  if (latestMessage) {
  
		if (!latestMessage.sender.equals(userId)) {

		  // Perform the update
		  const result = await Messages.updateMany(
			{ chat: chatId, sender: { $ne: userId }},
			{ $set: { read: true, readAt: new Date() } }
		  );
  
		  
  
		  // Update unreadMessagesCount to 0
		  await Chats.updateOne(
			{ _id: chatId },
			{ $set: { unreadMessagesCount: 0 } }
		  );
		}
	  }
  
	  // Fetch all messages in the chat and populate the sender field
	  const messages = await Messages.find({ chat: chatId }).populate("sender");
  
	  // Determine the other user
	  const otherUser =
		chat.privateUser1._id.equals(userId) ? chat.privateUser2 : chat.privateUser1;
  
	  const modifiedChat = {
		...chat._doc,
		title: otherUser.name,
		image: otherUser.photo,
		otherUser,
		unreadMessagesCount: 0, 
	  };
  
	  respond(
		res,
		status.OK,
		{
		  data: modifiedChat,
		  messages: messages.map(message => ({
			...message._doc,
			readAt: message.readAt // Include readAt field
		  })),
		},
		"Chat retrieved successfully"
	  );
	} catch (error) {
	  errorHandler(res, error);
	}
  };
  
  
  
  
  
  
  
  
  
import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "text",
    },
    chat: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Chats",
    },
    sender: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "USER",
    },
    read: {
        type: Boolean,
        default: false,
    },
    readAt: {
        type: Date,  // Field to record when the message was read
    },
},
    {
        timestamps: true
    }
);

export const Messages = mongoose.model("Messages", messageSchema);

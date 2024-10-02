import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    title: {
        type: String,
    },
    type: {
        type: String,
        enum: ["group", "private"],
        required: true,
    },
    privateUser1: {
        type: mongoose.Types.ObjectId,
        ref: "USER",
    },
    privateUser2: {
        type: mongoose.Types.ObjectId,
        ref: "USER",
    },
    unreadMessagesCount: {
        type: Number,
        default: 0, 
      },
},
    {
        timestamps: true
    }
);

export const Chats = mongoose.model("Chats", chatSchema);

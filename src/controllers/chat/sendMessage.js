import { Messages } from "../../models";
import { errorHandler, respond } from "../../utils";
import status from "http-status";

export const sendMessage = async (req, res) => {
    try {

        const { id: chatId } = req.params;
        const sender = req.userId;
        console.log("sender:", sender);
        const data = await Messages.create({ ...req.body, chat: chatId, sender });
        console.log("data:", data);
        if (!data) {
            let error = new Error("Failed to create item, make sure data is valid!");
            error.status = status.BAD_REQUEST;
            throw error;
        }

        respond(res, status.CREATED, data, "Created successfully");

    } catch (error) {
        errorHandler(res, error);
    }
};

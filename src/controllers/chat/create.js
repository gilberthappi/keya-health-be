import { Chats } from "../../models";
import { errorHandler, respond } from "../../utils";
import status from "http-status";

export const create = async (req, res) => {
    try {
        const data = await Chats.create(req.body);

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

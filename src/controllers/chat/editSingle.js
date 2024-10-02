import { Chats } from "../../models";
import { errorHandler, respond } from "../../utils";
import status from "http-status";

export const editSingle = async (req, res) => {
    try {

        const { id } = req.params;
        const data = await Chats.findByIdAndUpdate(id, { $set: req.body }, {
            new: true,
        })

        if (!data) {
            let error = new Error("Failed to update. make sure data selected exist!");
            error.status = status.BAD_REQUEST;
            throw error;
        }

        respond(res, status.OK, data, "Updated successfully");

    } catch (error) {
        errorHandler(res, error);
    }
};

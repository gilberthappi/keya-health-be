import { Messages } from "../../models";
import { errorHandler, respond } from "../../utils";
import status from "http-status";

export const deleteSingle = async (req, res) => {
    try {

        const { id } = req.params;

        const data = await Messages.findByIdAndDelete(id)

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
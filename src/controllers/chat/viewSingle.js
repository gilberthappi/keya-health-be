import { Chats, Messages } from "../../models";
import { errorHandler, respond } from "../../utils";
import status from "http-status";

export const viewSingle = async (req, res) => {
    try {
		const { id } = req.params;
		let populateQuery = [];

		if (req.query.populate) {
			populateQuery = req.query.populate.split(",").join(" ");
		}

		const data = await Chats.findById(id).populate(
			"privateUser2 privateUser1"
		);
		const messages = await Messages.find({ chat: id }).populate("sender");

		if (!data) {
			console.log("No chats found");
		}

		respond(
			res,
			status.OK,
			{ chat: data, messages },
			"Retrieved successfully"
		);
	} catch (error) {
        errorHandler(res, error);
    }
};

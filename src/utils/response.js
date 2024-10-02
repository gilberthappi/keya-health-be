
// This function is used to send response to the client, it takes in the response object, status code, data and message as parameters
export const respond = (res, status, data, message) => {
    return res.status(status).json({
        status: "Success",
        message: message || "Request successful",
        data,
    });
}
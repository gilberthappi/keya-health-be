import status from "http-status";

export const errorHandler = (res, err) => {
    return res.status(err.status || status.INTERNAL_SERVER_ERROR).json({
        status: "Something went wrong",
        message: err.message,
    });
};

export const uniqueFieldErrorHandler = (error, next) => {
    let errMsg;
    if (error.code == 11000) {
        errMsg = Object.keys(error.keyValue)[0].toLocaleUpperCase() + " already taken, use another value.";
    } else {
        errMsg = error.message;
    }
    next(new Error(errMsg))
};
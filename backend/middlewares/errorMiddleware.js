//to catch errors, so that don't have to put try catch in every function
const catchAsyncErrors = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((error) => {
      next(error);
    });
  };
};

//to construct the custom error
class NewError extends Error {
  constructor(statusCode, errorMessage) {
    super(statusCode, errorMessage);
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
  }
}

//to handle the error
const ErrorMiddleware = (err, req, res, next) => {
  console.log(err)
  return res.status(err.statusCode || err.status || 500).json({
    error:
      err.message ||
      err.errorMessage ||
      "Something went wrong. Please try again.",
  });
};

module.exports = { catchAsyncErrors, ErrorMiddleware,NewError };

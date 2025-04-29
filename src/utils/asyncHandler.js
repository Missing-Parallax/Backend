const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      next(error);
    });
  };
};

// Using try catch

// const asyncHandler = (func) => async (req, res, next) => {
//   try {
//     func(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: true,
//       message: error.message,
//     });
//   }
// };

export { asyncHandler };

// Async function to avoid having to use async and await in teh controllers functions

const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn (req, res, next)).catch(next);

 module.exports = asyncHandler;  
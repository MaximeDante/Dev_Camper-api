const ErrorResponse = require('../utils/errorResponse')

// Cusotm error handling middleware based on different error name you get

const errorHandler = (err, req, res, next) => {

    let error = {...err};

    error.message = err.message
	// Log to console for dev
    console.log(err.stack.red);
    

    // Mongoose bad objectID
    if (err.name === 'CastError'){ 
        const message = `Resource not found`
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate Key
    if (err.name === 11000){ 
        const message = `Duplicate feild value entered  `
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError'){ 
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }


	res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler; 

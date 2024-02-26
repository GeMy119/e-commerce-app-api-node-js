// Define a middleware function for error handling
const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error(err.stack);

    // Check if the error is a known type
    if (err.name === 'ValidationError') {
        // Handle Mongoose validation errors
        return res.status(400).json({ error: err.message });
    } else if (err.name === 'UnauthorizedError') {
        // Handle unauthorized access errors
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // For other types of errors, return a generic server error response
    res.status(500).json({ error: 'Internal Server Error' });
};

// Register the error handler middleware

export default errorHandler
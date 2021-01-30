const path = require('path');
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const expressRateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db');

//load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();


// routes files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

const app = express();

// body parser
app.use(express.json());


// app.use(logger);

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}


// file uploading
app.use(fileupload());


// =====> Security middleware (packages)

// Sanitize data (prevent noSQL injection)
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

//  prevent XSS attacts
app.use(xss());

// Rate limiting
const limiter = expressRateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
}) 
app.use(limiter);


// prevent http params pollution
app.use(hpp());


// Enable CORS (PUBLIC API)
app.use(cors());

// =====> Security middleware (packages)


// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/auth/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);


// cookie parser
app.use(cookieParser); 



const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Globally handled unhandled promise rejections

process.on('unhandledRejection', (err, promise) =>{
    console.log(`Error: ${err.message}`.red);
    // close server and exit process
    server.close(() => process.exit(1));
})

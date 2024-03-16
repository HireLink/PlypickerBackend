const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const app = express();
const cors = require("cors")
const bodyparser = require("body-parser")
const connectDB = require("./Database/DB")
require('dotenv').config(); // Load environment variables


// Use CORS middleware based on the environment
if (process.env.NODE_ENV === 'production') {
  // Use Vercel CORS configuration for production
  app.use(cors({
    origin: 'https://plypicker-admin-one.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));
} else {
  // Use normal CORS for development
  app.use(cors());
}


app.use(bodyparser.json({ limit: '10mb' }));
app.use(bodyparser.urlencoded({ limit: '10mb', extended: true }));

connectDB()
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/assets', express.static(path.join(__dirname, 'views/assets')));



const authRoutes = require('./routes/users');

app.use(authRoutes);




// catch 404 and forward to error handler

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

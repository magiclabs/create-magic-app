require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const userRouter = require('./routes/user');
const cors = require('cors');
const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.TOKEN_SECRET,
    resave: false, // don't resave session variables if nothing has changed
    saveUninitialized: true, // save empty value in session if there is no value
  })
);

app.use('/api', userRouter);

const listener = app.listen(process.env.PORT || 8080, function () {
  console.log('Listening on port ' + listener.address().port);
});

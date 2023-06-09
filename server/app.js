const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const bookRouter = require('./routes/bookRoutes');
const errorController = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const path = require('path');

const cors = require('cors');

dotenv.config({ path: './config.env' });

const app = express();

// const corsOptions = {
//   origin: frontEndDomain,
//   credential: true
// }
// have to set samesite to none and secure to true on HTTPS for cookies
// csurf??????

app.use(cors());

// app.enable('trust proxy');

app.use(
  express.json({
    limit: '10kb',
  })
);

app.use(cookieParser());

app.use('/api/v1/books', bookRouter);
app.use('/api/v1/users', userRouter);

app.use(errorController);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('DB up');
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

app.listen(3002, () => console.log('server started'));

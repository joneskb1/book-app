const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const bookRouter = require('./routes/bookRoutes');
const errorController = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

const cors = require('cors');

dotenv.config({ path: './config.env' });

const app = express();

app.use(cors());

// app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'https://books.google.com/', 'data:'],
    },
  })
);
app.use(mongoSanitize());
app.use(xss());
app.use(compression());
app.use(hpp());

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
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'))
  );
}

app.listen(3002, () => console.log('server started'));

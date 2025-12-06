require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ ok: true, message: 'solar Mongo API running' }));

app.use("/user",authRoutes);


// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

const port = process.env.PORT || 8000;
connectDB().then(()=> {
  app.listen(port, ()=> console.log('Server running on http://localhost:'+port));
}).catch(err => { console.error('DB connect failed', err); process.exit(1); });

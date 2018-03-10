import express from 'express';
import mongoose from 'mongoose';
import apiRoute from './routes/api';

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost/image_search';
const app = express();

app.use(express.static('public'));
mongoose.connect(DB_URL);

// INDEX ROUTE
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './views' });
});

// API ROUTE
app.use('/api', apiRoute);

app.listen(PORT, () => console.log(`App is running on ${PORT}`));

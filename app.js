import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import { GOOGLE_API_KEY, SEARCH_ENGINE_KEY } from './secret';

const PORT = process.env.PORT || 3000;
const app = express();
const router = express.Router();

app.use('/api', router);

router.get('/', (req, res) => {
  res.json({ message: 'API Initialized' });
});

router.get('/imagesearch/:keyword', (req, res) => {
  const keyword = req.params.keyword;

  axios(`https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_KEY}&searchType=image&q=${keyword}`)
    .then((respond) => {
      const results = respond.data.items.map((item) => {
        const result = {
          link: item.link,
          snippet: item.snippet,
          thumbnail: item.image.thumbnailLink,
          contextLink: item.image.contextLink
        };

        return result;
      });


      res.send(results);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`App is running on ${PORT}`));

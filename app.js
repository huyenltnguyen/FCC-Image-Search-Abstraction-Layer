import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import { GOOGLE_API_KEY, SEARCH_ENGINE_KEY } from './secret';
import SearchQuery from './model/searchQuery';

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost/image_search';
const app = express();
const router = express.Router();

app.use(express.static('public'));
app.use('/api', router);
mongoose.connect(DB_URL);

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './views' });
});

// /api ROUTE
router.get('/', (req, res) => {
  res.json({ message: 'API Initialized' });
});

// SEARCH IMAGE
router.get('/imagesearch/:keyword', (req, res) => {
  const keyword = req.params.keyword;
  const offset = req.query.offset ? req.query.offset : 1;
  const date = new Date();

  axios(`https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_KEY}&searchType=image&q=${keyword}&start=${offset}`)
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

  SearchQuery.create({
    term: keyword,
    when: date.toUTCString()
  }, (err, query) => {
    if (err) { console.log(err); }
  })
});

// GET LATEST SEARCH TERMS
router.get('/latest/imagesearch', (req, res) => {
  SearchQuery.find({}).sort({when: -1}).limit(10).exec((err, foundQueries) => {
    if (err) {
      console.log(err);
    } else {
      const latestQueries = foundQueries.map((query) => {
        return {
          term: query.term,
          when: query.when
        };
      });

      res.send(latestQueries);
    }
  })
});

app.listen(PORT, () => console.log(`App is running on ${PORT}`));

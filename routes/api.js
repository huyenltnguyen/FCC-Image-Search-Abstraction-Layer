import express from 'express';
import axios from 'axios';
import SearchQuery from '../model/searchQuery';
import { GOOGLE_API_KEY, SEARCH_ENGINE_KEY } from '../secret';

const router = express.Router();

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

export default router;
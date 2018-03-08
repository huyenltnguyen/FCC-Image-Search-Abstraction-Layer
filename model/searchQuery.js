import mongoose from 'mongoose';

const searchQuerySchema = new mongoose.Schema({
  term: String,
  when: String
});

export default mongoose.model('Search_Query', searchQuerySchema);


import Genre from '../models/Genre.js';

export const createGenre = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Tên genre là bắt buộc' });

    const existing = await Genre.findOne({ name: String(name).trim() });
    if (existing) return res.status(400).json({ message: 'Genre đã tồn tại' });

    const genre = new Genre({ name: String(name).trim(), slug, description });
    await genre.save();
    return res.status(201).json({ genre });
  } catch (error) {
    console.error('Error in createGenre controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getGenres = async (req, res) => {
  try {
    const items = await Genre.find().sort({ name: 1 });
    return res.status(200).json({ items });
  } catch (error) {
    console.error('Error in getGenres controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getGenreById = async (req, res) => {
  try {
    const { id } = req.params;
    const genre = await Genre.findById(id);
    if (!genre) return res.status(404).json({ message: 'Genre not found' });
    return res.status(200).json({ genre });
  } catch (error) {
    console.error('Error in getGenreById controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    const fields = ['name', 'slug', 'description'];
    fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const updated = await Genre.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Genre not found' });
    return res.status(200).json({ genre: updated });
  } catch (error) {
    console.error('Error in updateGenre controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const genre = await Genre.findById(id);
    if (!genre) return res.status(404).json({ message: 'Genre not found' });
    await Genre.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Genre deleted' });
  } catch (error) {
    console.error('Error in deleteGenre controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

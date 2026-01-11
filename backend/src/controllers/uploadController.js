import path from 'path';

export const uploadFiles = (req, res) => {
  try {
    const files = req.files || {};
    const audio = files.audio?.[0];
    const cover = files.cover?.[0];

    const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;

    const audioFilename = audio?.filename ?? audio?.path ? path.basename(audio.path ?? "") : undefined;
    const coverFilename = cover?.filename ?? cover?.path ? path.basename(cover.path ?? "") : undefined;

    const audioUrl = audioFilename ? `${baseUrl}/uploads/${audioFilename}` : undefined;
    const coverUrl = coverFilename ? `${baseUrl}/uploads/${coverFilename}` : undefined;

    return res.status(200).json({ audioUrl, coverUrl });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ message: 'Upload error' });
  }
};
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3005;
const PUBLIC_DIR = path.join(__dirname, 'public');

// The APK lives outside this repo so a 74 MB binary never enters git
const APK_DOWNLOAD_URL = process.env.APK_DOWNLOAD_URL || 'https://note.brizaai.com/platonotes.apk';

app.disable('x-powered-by');

// platonotes.app is the origin registered with Razorpay - www must never serve content of its own
app.use((req, res, next) => {
  const host = req.headers.host || '';
  if (host.startsWith('www.')) {
    return res.redirect(301, `https://${host.slice(4)}${req.originalUrl}`);
  }
  next();
});

app.get('/download', (req, res) => {
  res.redirect(302, APK_DOWNLOAD_URL);
});

app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));

app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

app.listen(PORT, () => {
  console.log(`Plato Notes site listening on ${PORT}`);
});

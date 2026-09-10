const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3005;
const PUBLIC_DIR = path.join(__dirname, 'public');

// The APK lives outside this repo so a 74 MB binary never enters git
const APK_DOWNLOAD_URL = process.env.APK_DOWNLOAD_URL || 'https://note.brizaai.com/platonotes.apk';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.platonotes.app';

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

// Razorpay checks the origin of the page running checkout.js, so this proxies rather than
// redirects - a 3xx would move the browser to the API host and the registered origin is lost
app.get('/checkout', async (req, res) => {
  const target = `${API_BASE_URL}/api/subscriptions/checkout-session-page?t=${encodeURIComponent(req.query.t || '')}`;

  try {
    const upstream = await fetch(target, { redirect: 'manual' });
    const body = await upstream.text();

    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'text/html; charset=utf-8');
    // Per-user page - a cached copy served to another viewer would be a security incident
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.send(body);
  } catch (err) {
    res.status(502).type('html').send('<p>Could not load the payment page. Please try again.</p>');
  }
});

app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));

app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

app.listen(PORT, () => {
  console.log(`Plato Notes site listening on ${PORT}`);
});

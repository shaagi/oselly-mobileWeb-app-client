const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 4000;
const ENV = process.env.NODE_ENV || 'prod';

app.disable('x-powered-by');

let prerender = require('prerender-node');

if (ENV !== 'prod') {
  prerender = prerender.set('prerenderServiceUrl', 'http://localhost:3000');
} else {
  prerender = prerender.set('prerenderToken', 'h3lz6rDk3k7qX8dpZtdt');
}

app.use('*', (req, res, next) => {
  console.log('reqHeadersXForwardedProto: ', req.headers['x-forwarded-proto']);
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  return next();
});

app.use(prerender);

const distBasketball = path.join(__dirname, 'basketball');
const index = fs.readFileSync(path.join(distBasketball, 'index.html')).toString();

app.get('*.*', express.static(path.join(distBasketball), {
  maxAge: '1y'
}));

app.get('*', (req, res) => {
  res.send(index);
});

app.listen(PORT, () => {
  console.log(`App Listening on port ${PORT}.`);
});

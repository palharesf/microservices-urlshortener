require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const dns = require('dns'); // Adding DNS to ensure we can test if the requested URL is valid or not

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

// All of the code above is boilerplate; actual implementation starts below

const shortUrlIndex = 0;
function shortUrlInc(shortUrlIndex) {
  return ++shortUrlIndex;
};

// Add parsing functionalities to express in order to work with unencoded URLs (the default mode received by the POST request)
app.use(express.json()); // JSON parsing
app.use(express.urlencoded({ extended: true })); // URL parsing

const urlMap = new Map(); // Creating a map to store all originalurl-shorturl key-value pairs; created here to be accessible globally

// Creating route handler for the api/shorturl endpoint
app.post('/api/shorturl', (req, res) => {
  const longUrl = req.body.url; // Getting the url from the request

  try {
    const host = new URL(url).hostname; // This expression will send a TypeError if the 'url' passed is not in the proper url format, in which case the error will be 'caught' outside the 'try' block
    dns.lookup(host, { family: 6 }, (err, address) => {
      if (err) {
        // The domain does not exist or is not resolvable
        res.status(400).json({ error: 'Invalid URL' });
      } else {
        // The domain exists and is resolvable, proceed to URL shortening logic

        // These two function calls ensure that the short url is unique and the Index is always updated after creating a new short url
        const shortUrl = shortUrlInc(shortUrlIndex);
        shortUrlIndex = shortUrlInc(shortUrlIndex);
        urlMap.set(shortUrl, originalUrl);

        // Sending both the original and short url as a JSON response object
        res.json({
          original_url: longUrl,
          short_url: shortUrl });
      }
    })  
  } catch (error) {
    res.status(400).json({ error: 'Invalid URL' }); // In case there is a TypeError when trying to form a URL from a malformed string     
  }  
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;
  const longUrl = urlMap.get(shortUrl);
  if (longUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: 'Short URL not found' });
  }
});


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

let longUrl = "";
let shortUrl = 0;
let shortUrlIndex = 0;
function shortUrlInc(shortUrlIndex) {
  return ++shortUrlIndex;
};

// Add parsing functionalities to express in order to work with unencoded URLs (the default mode received by the POST request)
app.use(express.json()); // JSON parsing
app.use(express.urlencoded({ extended: true })); // URL parsing

const urlMap = new Map(); // Creating a map to store all originalurl-shorturl key-value pairs; created here to be accessible globally

// Creating route handler for the api/shorturl endpoint
app.post('/api/shorturl', (req, res) => {
  longUrl = req.body.url; // Getting the url from the request

  try {
    const host = new URL(longUrl).hostname; // This expression will send a TypeError if the 'url' passed is not in the proper url format, in which case the error will be 'caught' outside the 'try' block
    dns.lookup(host, { timeout: 500 }, (err, address) => {
      if (err) {
        // The domain does not exist or is not resolvable
        res.json({ error: 'Invalid URL' });
      } else {
        // The domain exists and is resolvable, proceed to URL shortening logic

        // Check if longUrl already exists in the map; if not, create a shortUrl and add both to the map
        if (!urlMap.has(longUrl)) {
          // These two function calls ensure that the short url is unique and the Index is always updated after creating a new short url
          shortUrl = shortUrlInc(shortUrlIndex);
          shortUrlIndex = shortUrlInc(shortUrlIndex);
          urlMap.set(shortUrl, longUrl);       
        }

        // Sending both the original and short url as a JSON response object
        return res.json({
          original_url: longUrl,
          short_url: shortUrl });
      }
    })  
  } catch (error) {
    return res.json({ error: 'Invalid URL' }); // In case there is a TypeError when trying to form a URL from a malformed string     
  }  
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrlParam = req.params.short_url;
  const longUrl = urlMap.get(parseInt(shortUrlParam));
  if (longUrl) {
    return res.redirect(longUrl);
  } else {
    return res.json({ error: 'Short URL not found' });
  }
});


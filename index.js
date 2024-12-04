require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

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

// Creating route handler for the api/shorturl endpoint
app.post('/api/shorturl', (req, res) => {
  // Getting the url from the request
  const url = req.body.url;

  // Creating the short url from the long url
  
  // Sending both the original and short url as a JSON response object
  res.json({
    original_url: 'test',
    short_url: 'short_test' });
});

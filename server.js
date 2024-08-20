require('dotenv').config();
const express = require('express');
const path = require('path');
const https = require('https');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/weather', (req, res) => {
  const apiKey = process.env.API_KEY;
  const lat = req.query.lat;
  const lon = req.query.lon;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  https.get(url ,(apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      res.json(JSON.parse(data));
    });
  }).on('error', (err) => {
    res.status(500).json({error: 'Failed to fetch data from API'});
  });
});

app.get('/api/airQuality', (req, res) => {
  const apiKey = process.env.API_KEY;
  const lat = req.query.lat;
  const lon = req.query.lon;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  const url = `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  https.get(url ,(apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      res.json(JSON.parse(data));
    });
  }).on('error', (err) => {
    res.status(500).json({error: 'Failed to fetch data from Air Pollution API'});
  });
});

app.get('/api/5day-forecast', (req, res) => {
  const apiKey = process.env.API_KEY;
  const lat = req.query.lat;
  const lon = req.query.lon;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  https.get(url, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      res.json(JSON.parse(data));
    });
  }).on('error', (err) => {
    res.status(500).json({error: 'Failed to fetch data from 5 Day / 3 Hour Forecast API'});
  });
});

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});


const express = require('express');
const app = express();
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/home/server/rail_data.db');

app.use(cors());

// Define routes for switch usage and track usage
app.get('/api/switch-usage', (req, res) => {
  console.log(`/api/switch-usage used`);
  db.all('SELECT switch_id, COUNT(*) as usage_count FROM rail_data GROUP BY switch_id', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/track-usage', (req, res) => {
  db.all('SELECT track_id, SUM(usage_count) as total_usage FROM track_usage_data GROUP BY track_id', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

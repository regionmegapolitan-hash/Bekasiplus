const fs = require('fs');
const path = require('path');

// Ensure directory exists
const dataDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Read raw data from save_chunk1 if exists or construct
console.log("Ready to write full student records");

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/favorites.json');

// Read favorites
function readFavourites() {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (err) {
    return {}; 
  }
}

// Write favorites
function writeFavourites(favorites) {
  fs.writeFileSync(filePath, JSON.stringify(favorites, null, 2));
}

module.exports = {readFavourites, writeFavourites };

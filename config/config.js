require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  ghostApiUrl: process.env.GHOST_API_URL,
  ghostContentApiKey: process.env.GHOST_CONTENT_API_KEY,
  algoliaAppId: process.env.ALGOLIA_APP_ID,
  algoliaApiKey: process.env.ALGOLIA_API_KEY,
  algoliaIndexName: process.env.ALGOLIA_INDEX_NAME
};
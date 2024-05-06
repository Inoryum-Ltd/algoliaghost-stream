const algoliasearch = require('algoliasearch');
const { algoliaAppId, algoliaApiKey, algoliaIndexName } = require('../config/config');

const client = algoliasearch(algoliaAppId, algoliaApiKey);
const index = client.initIndex(algoliaIndexName);

module.exports = { index };
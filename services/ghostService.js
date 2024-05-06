const GhostContentAPI = require('@tryghost/content-api');
const { ghostApiUrl, ghostContentApiKey } = require('../config/config');

const api = new GhostContentAPI({
  url: ghostApiUrl,
  key: ghostContentApiKey,
  version: "v5.0"
});

module.exports = { api };
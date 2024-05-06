const express = require('express');
const { handleWebhook } = require('./handleWebhook');

const router = express.Router();

router.post('/ghost-webhook', handleWebhook);

module.exports = router;
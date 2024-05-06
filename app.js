const app = require('./config/setup');
const webhookRouter = require('./webhooks/webhook');
const { indexPosts } = require('./indexer/indexPosts');
const logger = require('./config/logger'); // Import logger
const { port } = require('./config/config');

app.use(webhookRouter);

app.listen(port, async () => {
  logger.info(`Server is running on port ${port}`);
  try {
    await indexPosts(); // Index existing posts on server start
    logger.info("Existing posts have been indexed.");
  } catch (error) {
    logger.error("Error indexing existing posts:", error);
  }
});
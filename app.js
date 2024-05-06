const app = require('./config/setup');
const webhookRouter = require('./webhooks/webhook');
const { indexPosts } = require('./indexer/indexPosts');
const { port } = require('./config/config');

app.use(webhookRouter);

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    await indexPosts(); // Index existing posts on server start
    console.log("Existing posts have been indexed.");
  } catch (error) {
    console.error("Error indexing existing posts:", error);
  }
});
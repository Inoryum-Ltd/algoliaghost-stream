// webhooks/handleWebhook.js
const { api } = require('../services/ghostService');
const { index } = require('../services/algoliaService');
const logger = require('../config/logger'); // Import logger

async function handleWebhook(req, res) {
  try {
    logger.info('Received webhook:', req.body);
    
    const data = req.body;
    if (data.post) {
      if (data.post.current && data.post.current.published_at) {
        await handleNewOrUpdatePost(data);
      } else if (data.post.previous && data.post.previous.published_at) {
        await handleUnpublishedOrDeletedPost(data);
      }
    }
    res.sendStatus(200);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
}

async function handleNewOrUpdatePost(data) {
  try {
    const post = await api.posts.read({ id: data.post.current.id, include: 'tags' });
    logger.info('Retrieved post:', post);

    const record = {
      objectID: post.id,
      title: post.title,
      content: post.html,
      image: post.feature_image,
      url: post.url,
      excerpt: post.excerpt,
      tags: post.tags.map(tag => tag.name),
      date: post.published_at
    };
    const result = await index.saveObject(record);
    logger.info('Saved record:', result);

    logger.info(`Indexed post "${post.title}"`);
  } catch (error) {
    logger.error('Error handling new or updated post:', error);
  }
}

async function handleUnpublishedOrDeletedPost(data) {
  try {
    const result = await index.deleteObject(data.post.previous.id);
    logger.info('Deleted record:', result);

    logger.info(`Removed post "${data.post.previous.title}" from index`);
  } catch (error) {
    logger.error('Error handling unpublished or deleted post:', error);
  }
}

module.exports = { handleWebhook };
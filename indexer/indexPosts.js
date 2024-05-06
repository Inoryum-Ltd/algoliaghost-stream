// indexer/indexPosts.js
const { api } = require('../services/ghostService');
const { index } = require('../services/algoliaService');
const logger = require('../config/logger'); // Import logger

async function indexPosts() {
  try {
    const posts = await api.posts.browse({ limit: 'all', include: 'tags,authors' });
    posts.forEach(post => {
      const record = {
        objectID: post.id,
        title: post.title,
        content: post.html,
        image: post.feature_image,
        excerpt: post.excerpt,
        url: post.url,
        tags: post.tags.map(tag => tag.name),
        date: post.published_at
      };
      index.saveObject(record)
        .then(() => {
          logger.info(`Indexed post "${post.title}"`);
        })
        .catch(error => {
          logger.error('Error indexing post:', error);
        });
    });
  } catch (error) {
    logger.error('Error retrieving posts:', error);
  }
}

module.exports = { indexPosts };
const { api } = require('../services/ghostService');
const { index } = require('../services/algoliaService');

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
          console.log(`Indexed post "${post.title}"`);
        })
        .catch(error => {
          console.error('Error indexing post:', error);
        });
    });
  } catch (error) {
    console.error('Error retrieving posts:', error);
  }
}

module.exports = { indexPosts };
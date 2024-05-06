const { api } = require('../services/ghostService');
const { index } = require('../services/algoliaService');

async function handleWebhook(req, res) {
  try {
    console.log('Received webhook:', req.body);
    
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
    console.error(err);
    res.sendStatus(500);
  }
}

async function handleNewOrUpdatePost(data) {
  console.log('Retrieving post from Ghost...');
  const post = await api.posts.read({ id: data.post.current.id, include: 'tags' });
  console.log('Retrieved post:', post);

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
  console.log('Formatted record:', record);

  console.log('Saving record to Algolia index...');
  const result = await index.saveObject(record);
  console.log('Saved record:', result);

  console.log(`Indexed post "${post.title}"`);
}

async function handleUnpublishedOrDeletedPost(data) {
  console.log('Deleting record from Algolia index...');
  const result = await index.deleteObject(data.post.previous.id);
  console.log('Deleted record:', result);

  console.log(`Removed post "${data.post.previous.title}" from index`);
}

module.exports = { handleWebhook };
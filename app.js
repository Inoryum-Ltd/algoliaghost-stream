const algoliasearch = require('algoliasearch');
const fs = require('fs');
const path = require('path');
const GhostContentAPI = require('@tryghost/content-api');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Initialize the Ghost API with your credentials
const api = new GhostContentAPI({
  url: process.env.GHOST_API_URL,
  key: process.env.GHOST_CONTENT_API_KEY,
  version: 'v5'
});

// Initialize the Algolia client with your API key and index name
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);


// Listen for new posts on the Ghost site
api.posts.browse({limit: 'all', include: 'tags,authors'}).then(posts => {
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
  })
  .catch(error => {
    console.error('Error retrieving posts:', error);
  });


app.use(bodyParser.json());

// Listen for new, updated, or deleted posts on the Ghost site

app.post('/ghost-webhook', async (req, res) => {
  try {
    console.log('Received webhook:', req.body);
    
    const data = req.body;
    if (data.post) {
      if (data.post.current && data.post.current.published_at) {
        // Retrieve the newly published or updated post from Ghost
        console.log('Retrieving post from Ghost...');
        const post = await api.posts.read({
          id: data.post.current.id,
          include: 'tags'
        });
        console.log('Retrieved post:', post);

        // Format the data for Algolia
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

        // Add or update the record in the Algolia index
        console.log('Saving record to Algolia index...');
        const result = await index.saveObject(record);
        console.log('Saved record:', result);

        console.log(`Indexed post "${post.title}"`);
      } else if (data.post.previous && data.post.previous.published_at) {
        // Delete the post from the Algolia index if it was unpublished or deleted from Ghost
        console.log('Deleting record from Algolia index...');
        const result = await index.deleteObject(data.post.previous.id);
        console.log('Deleted record:', result);

        console.log(`Removed post "${data.post.previous.title}" from index`);
      }
    }
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

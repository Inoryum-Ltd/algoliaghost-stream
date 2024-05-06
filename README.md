# AlgoliaGhostStream

This Node.js application seamlessly synchronizes content from your Ghost CMS with an Algolia index, enabling enhanced search capabilities for your Ghost-powered website or blog.

## Key Features

* **Initial Synchronization:** Fetches all published Ghost posts and indexes them in Algolia.
* **Webhook-Based Updates:** Keeps the Algolia index in sync with Ghost content changes by responding to post publish, update, and deletion events.
* **Modular Design:** Well-structured code for improved readability and maintainability.

## Setup

### Prerequisites

* Node.js and npm (or yarn) installed
* A Ghost site with API keys generated
* An Algolia account with an application and index created

### Clone the Repository

```bash
git clone https://github.com/Inoryum-Ltd/algoliaghost-stream

# Navigate into the project directory:
cd algoliaghost-stream

```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project's root directory or rename the `sample.env` to `.env` and populate it with the following variables:

```bash
GHOST_API_URL=https://your-ghost-site.com 
GHOST_CONTENT_API_KEY=your-content-api-key
ALGOLIA_APP_ID=your-algolia-app-id
ALGOLIA_API_KEY=your-algolia-admin-api-key
ALGOLIA_INDEX_NAME=your-algolia-index-name
PORT=3000 # Or your preferred port
```


### Start the Application

```bash
npm start
```
This will start an Express server that listens for webhooks from your Ghost site and updates the Algolia index accordingly.

## Configure the Ghost Webhook

In your Ghost Admin panel:

* Go to "Integrations"
* Add a new custom integration.
* Set the "Target URL" to http://your-server-address:3000/ghost-webhook. Replace `your-server-address` with your actual server domain or IP address.

## Usage

Once set up, new or updated posts on your Ghost site will automatically be reflected in your Algolia search index.
Implement a search interface on your website using Algolia's frontend libraries to leverage the synchronized data.

## Professional Ghost CMS Services

If you're looking for expert assistance with Ghost setup, development, customization, or want to maximize the potential of your Ghost site, Inoryum offers a full range of Ghost CMS services. Visit to learn more: https://inoryum.com/ghost-cms-services/




## Contributing

We welcome contributions to improve this project! Please open issues for bug reports or feature suggestions, and feel free to submit pull requests.

## Dependencies

This integration tool relies on the following dependencies:

- `@tryghost/content-api`: A JavaScript library for interacting with the Ghost Content API.
- `algoliasearch`: The official Algolia API client for JavaScript.
- `body-parser`: Middleware for parsing incoming request bodies in Express.
- `dotenv`: A zero-dependency module for loading environment variables from a `.env` file into `process.env`.
- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `Winston`: For Logging.

## License

This integration tool is licensed under the [MIT License](LICENSE).
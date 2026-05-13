require('dotenv').config();

const { MongoClient } = require('mongodb');

let clientPromise = null;
let dbPromise = null;

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing env var MONGODB_URI');
  return uri;
}

function getMongoDbName() {
  return process.env.MONGODB_DB || 'fsd_grocery';
}

async function getMongoClient() {
  if (!clientPromise) {
    const uri = getMongoUri();
    clientPromise = MongoClient.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
  }
  return clientPromise;
}

async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const client = await getMongoClient();
      return client.db(getMongoDbName());
    })();
  }
  return dbPromise;
}

module.exports = {
  getMongoClient,
  getDb,
};


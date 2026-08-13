// Import the Pinecone library
const { Pinecone } = require("@pinecone-database/pinecone");

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Create a dense index with integrated embedding

const ChatappIndex = pc.Index("chat-app");

async function createMemory({ vectors, metadata, messageId }) {
  await ChatappIndex.upsert([
    {
      id: messageId,
      values: vectors,
      metadata,
    },
  ]);
}


async function queryMemory({ queryvector, queryVector, limit = 5, metadata }) {
  const vector = queryVector || queryvector;

  const data = await ChatappIndex.query({
    vector,
    topK: limit,
    filter: metadata || undefined,
    includeMetadata: true,
  });

  return data.matches;
} 


module.exports = {
    createMemory,queryMemory
}
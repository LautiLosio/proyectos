const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = "AIzaSyBKkT_7pLEw3kHrE4a5fAIg5lhCtvRlp54";

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const context = "You are a helpful assistant.";
const examples = [];
const messages = [
  {
    "content": "Hello"
  },
  {
    "content": "Hi there! How can I help you today?"
  }
];

messages.push({ "content": "NEXT REQUEST" });

client.generateMessage({
  // required, which model to use to generate the result
  model: MODEL_NAME,
  // optional, 0.0 always uses the highest-probability result
  temperature: 0.25,
  // optional, how many candidate results to generate
  candidateCount: 1,
  // optional, number of most probable tokens to consider for generation
  top_k: 40,
  // optional, for nucleus sampling decoding strategy
  top_p: 0.95,
  prompt: {
    // optional, sent on every request and prioritized over history
    context: context,
    // optional, examples to further finetune responses
    examples: examples,
    // required, alternating prompt/response messages
    messages: messages,
  },
}).then(result => {
  console.log(JSON.stringify(result, null, 2));
});
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
// const readlineSync = require('readline-sync');
app.use(cors());
require('dotenv').config();

const app = express();


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const history = [];

// Middleware to parse JSON body
app.use(express.json());

// Endpoint to handle user input and generate responses
app.post('/api/chat', async (req, res) => {
  const user_input = req.body.message;

  const messages = [];
  for (const [input_text, completion_text] of history) {
    messages.push({ role: 'user', content: input_text });
    messages.push({ role: 'assistant', content: completion_text });
  }

  messages.push({ role: 'user', content: user_input });

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    const completion_text = completion.data.choices[0].message.content;

    history.push([user_input, completion_text]);

    res.json({ message: completion_text });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});


app.listen(8080, () => {
  try{
    console.log(`Server running on port 8080`);
  }catch(err){
  console.log("something went wrong")
  }
});

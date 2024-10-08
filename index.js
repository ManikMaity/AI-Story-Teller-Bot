require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const fs = require('fs').promises; // Use fs.promises for async operations
const path = require('path');

const { GoogleGenerativeAI } = require("@google/generative-ai");
const getImage = require("./image");
const { textToSpeech } = require("./audio");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_TOKEN);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  try {
    const prompt = `Make a story in simple english language about "${msg.text}" within 1000 text using this JSON schema: {"imagePrompt" : "A short prompt to make an image for the story", "story" : "The story in text no line break", "filename" : "custom-filename(nospace)"}`;
    
    const result = await model.generateContent(prompt);
    const responseOBJ = JSON.parse(result.response.text());
    console.log(responseOBJ);

    // Fetch the image
    const storyImage = await getImage(responseOBJ.imagePrompt);
    if (storyImage === 'default-image-url') {
      await bot.sendMessage(chatId, "Could not fetch the image. Please try again.");
    } else {
      await bot.sendPhoto(chatId, storyImage);
    }

    // Convert text to speech
    const storyAudio = await textToSpeech(responseOBJ.story, responseOBJ.filename);
    await bot.sendDocument(chatId, storyAudio);

    // Send the story text
    bot.sendMessage(chatId, responseOBJ.story);
    bot.sendMessage(chatId, "Please enjoy the story!");

  } catch (err) {
    console.log(err);
    bot.sendMessage(chatId, "An error occurred: " + err.message);
  }
});

const gTTS = require("gtts");

async function textToSpeech(text, filename) {
  try {
    const gtts = new gTTS(text, "en");
    const audioFileName = `./audio/${filename}.mp3`;

    await new Promise((resolve, reject) => {
      gtts.save(audioFileName, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve("What is this"); // Resolve with the filename
        }
      });
    });

    return audioFileName;

  } catch (err) {
    console.error("Error in textToSpeech:", err);
  }
}

module.exports = {
  textToSpeech,
};

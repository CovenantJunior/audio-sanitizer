const express = require('express');
const multer  = require('multer');
const app = express();
const upload = multer({ dest: 'audios/' });
const path = require('path');
const port = 3000;
const fs = require('fs');
const speech = require('@google-cloud/speech');
const ffmpeg = require('fluent-ffmpeg');


app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.post('/censor', upload.single('audio'), (req, res) => {
    // req.file is the 'audio' file
    // req.body will hold the text fields, if there were any

    // Path to the audio file
    let filePath = file.path;

    // Convert audio file to mono channel and save as .flac
    ffmpeg(filePath)
        .audioChannels(1)
        .audioFrequency(16000)
        .format('flac')
        .save('output.flac')
        .on('end', async () => {
            // The audio file is now mono channel and in .flac format

            // Creates a client
            const client = new speech.SpeechClient();

            // Reads a local audio file and converts it to base64
            const file = fs.readFileSync('output.flac');
            const audioBytes = file.toString('base64');

            // The audio file's encoding, sample rate in hertz, and BCP-47 language code
            const audio = {
                content: audioBytes,
            };
            const config = {
                encoding: 'FLAC',
                sampleRateHertz: 16000,
                languageCode: 'en-US',
            };
            const request = {
                audio: audio,
                config: config,
            };

            // Detects speech in the audio file
            const [response] = await client.recognize(request);
            const transcription = response.results
                .map(result => result.alternatives[0].transcript)
                .join('\n');
            
            // Check for curse words in the transcription
            let curseWords = ["badword1", "badword2", "badword3"];
            let words = transcription.split(' ');
            
            for (let word of words) {
                if (curseWords.includes(word.toLowerCase())) {
                    console.log("Curse word detected: " + word);
                    return;
                }
            }

            console.log("No curse words detected.");
        });

});
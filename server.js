const express = require('express');
const multer  = require('multer');
const app = express();
const upload = multer({ dest: 'audios/' });
const path = require('path');
const app = express();
const port = 3000;
const censor = require('./censor');


app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/censor', (req, res) => {

})
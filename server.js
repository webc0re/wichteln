const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const matchesFile = 'matches.json';

// Load existing matches or initialize an empty object
let matches = {};
if (fs.existsSync(matchesFile)) {
    matches = JSON.parse(fs.readFileSync(matchesFile));
}

app.post('/match', (req, res) => {
    const { name } = req.body;

    if (Object.keys(matches).length >= 6) {
        return res.status(400).json({ error: 'All matches have been made.' });
    }

    if (!matches[name]) {
        const participants = Object.keys(matches);
        if (participants.includes(name)) {
            return res.status(400).json({ error: 'You have already been matched.' });
        }

        const availableMatches = ['Manuel H', 'Manuel E', 'Krista', 'Michael', 'Irina', 'Karsten'].filter(participant => participant !== name && !Object.values(matches).includes(participant));
        if (availableMatches.length === 0) {
            return res.status(400).json({ error: 'No available matches' });
        }
        const randomIndex = Math.floor(Math.random() * availableMatches.length);
        matches[name] = availableMatches[randomIndex];

        // Save matches to the JSON file
        fs.writeFileSync(matchesFile, JSON.stringify(matches, null, 2));
    }

    res.json({ match: matches[name] });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
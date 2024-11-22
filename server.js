const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors'); // Import the cors package
const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors({
    origin: 'https://webc0re.github.io' // Allow requests from your GitHub Pages site
}));

app.use(bodyParser.json());

const matchesFile = 'matches.json';

// Load existing matches or initialize an empty object
let matches = {};
if (fs.existsSync(matchesFile)) {
    matches = JSON.parse(fs.readFileSync(matchesFile));
}

app.post('/match', (req, res) => {
    const { name } = req.body;

    // Check if all matches have been made
    if (Object.keys(matches).length >= 6) {
        return res.status(400).json({ error: 'All matches have been made.' });
    }

    // Check if the user has already been matched
    if (!matches[name]) {
        const participants = Object.keys(matches);
        if (participants.includes(name)) {
            return res.status(400).json({ error: 'You have already been matched.' });
        }

        // Find available matches, excluding the same name
        const availableMatches = ['Manuel H', 'Manuel E', 'Krista', 'Michael', 'Irina', 'Karsten']
            .filter(participant => participant !== name && !Object.values(matches).includes(participant));
        
        if (availableMatches.length === 0) {
            return res.status(400).json({ error: 'No available matches' });
        }

        // Randomly select a match
        const randomIndex = Math.floor(Math.random() * availableMatches.length);
        matches[name] = availableMatches[randomIndex];

        // Save matches to the JSON file
        try {
            fs.writeFileSync(matchesFile, JSON.stringify(matches, null, 2));
        } catch (error) {
            console.error('Error writing to matches file:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    res.json({ match: matches[name] });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
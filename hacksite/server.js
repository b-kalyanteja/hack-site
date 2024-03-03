const http = require('http');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Create a single server to handle all requests
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    if (req.url === '/ip') {
      handleIpRequest(req, res);
    } else if (req.url === '/contacts') {
      handleContactsRequest(req, res);
    } else if (req.url === '/location') {
      handleLocationRequest(req, res);
    } else {
      sendResponse(res, 404, 'Not found');
    }
  } else {
    sendResponse(res, 405, 'Method Not Allowed');
  }
});

// Enable CORS for all routes
server.use(cors());

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

// Function to send response with status code and data
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Start the server listening only on port 3001
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

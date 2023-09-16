import React, { useState, useEffect } from 'react';
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from 'axios'; // Import axios for making HTTP requests

// const db = require('../views/alerts/alert/db'); // Import the database connection
const Alert = require('../views/alerts/alert/alertModel.js'); // Import the Alert model


const saveAlertToMongoDB = async (switchId, useCount) => {
    try {
      // Create a new alert document
      const alert = new Alert({
        switchid: switchId,
        usecount: useCount,
        message: 'Your alert message', // Replace with your actual alert message
      });
  
      // Save the alert to MongoDB
      const savedAlert = await alert.save();
  
      console.log('Alert saved to MongoDB:', savedAlert);
    } catch (error) {
      console.error('Error saving alert to MongoDB:', error);
    }
  };


const Notification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleClose = () => {
    setIsVisible(false);
  };

//   const saveAlertToMongoDB = async (switchId, useCount) => {
//     try {
//       const response = await axios.post('http://localhost:27020/alerts', {
//         switchid: switchId,
//         usecount: useCount,
//         message: 'Your alert message', // Replace with your actual alert message
//       });

//       console.log('Alert saved to MongoDB:', response.data);
//     } catch (error) {
//       console.error('Error saving alert to MongoDB:', error);
//     }
//   };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your API endpoint URL
        const response = await fetch('http://localhost:5500/api/switch-usage');
        const data = await response.json();
        console.log('API Response:', data);

        // Filter switches with usage count above 100
        const filteredSwitches = data.filter((item) => item.usage_count > 400);

        if (filteredSwitches.length > 0) {
          // Create a message listing switches with count above 100
          const switchList = filteredSwitches.map((switchData) => (
            `${switchData.switch_id}: ${switchData.usage_count}`
          )).join(', ');

          setNotificationMessage(`Switches with usage count above 400: \n${switchList}`);
          setIsVisible(true); // Show the notification when data is fetched

          // Save the alert to MongoDB for each switch
          filteredSwitches.forEach((switchData) => {
            saveAlertToMongoDB(switchData.switch_id, switchData.usage_count);
          });
        } else {
          setIsVisible(false); // Hide the notification if no switches match the criteria
        }
      } catch (error) {
        console.error('API Error:', error);
        setIsVisible(false); // Hide the notification on error
      }
    };

    const fetchIntervalId = setInterval(() => {
      fetchData();
    }, 10000); // Fetch data every 10 seconds

    // Initial fetch when the component mounts
    fetchData();

    return () => clearInterval(fetchIntervalId);
  }, []);

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={isVisible}
      autoHideDuration={120000}
      onClose={handleClose}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        severity="info"
        onClose={handleClose}
      >
        {notificationMessage || 'Fetching data...'}
      </MuiAlert>
    </Snackbar>
  );
};

export default Notification;

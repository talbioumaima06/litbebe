import {initializeApp, applicationDefault } from 'firebase-admin/app';
import { getMessaging } from "firebase-admin/messaging";
import { getDatabase } from "firebase-admin/database";
import { ref, onValue } from 'firebase/database';
import express, { json } from "express";
import cors from "cors";


process.env.GOOGLE_APPLICATION_CREDENTIALS;

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});


initializeApp({
  credential: applicationDefault(),
  projectId: 'litbebe-a66b1',
  databaseURL: 'https://litbebe-a66b1-default-rtdb.europe-west1.firebasedatabase.app'
});

// Access Firebase Realtime Database after initialization
const db = getDatabase();
const temperatureRef = ref(db, 'temperature');

// Add a listener for changes to the temperature
onValue(temperatureRef, (snapshot) => {
  const temperature = snapshot.val();
  if (temperature > 37) {
    // Temperature exceeds 37, send notification
    const message = {
      notification: {
        title: "Temperature Alert",
        body: `The temperature (${temperature}°C) has exceeded 37°C.`
      },
      // Add the FCM token here for the device you want to send notification to
      token: "cP7bqktsRouLIO2WAlKX8T:APA91bEyxEU3S05o-Jh0t8anmS6-wZHBDwh2S6jj-M0uS8_0dJY575Vb1cHAGeg-TLn8YnMuoq6HHu1H_hbnLjbGN_0jhrBvQIK05804SWiRzg9ZFEYsZTEhAzgFH8zIMGDnzFILzEd5",
    };

    getMessaging()
      .send(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  }
});

// Your existing code for sending notifications
app.post("/send", function (req, res) {
  const receivedToken = req.body.fcmToken;
  
  const message = {
    notification: {
      title: "Notif",
      body: 'This is a Test Notification'
    },
    token: "cP7bqktsRouLIO2WAlKX8T:APA91bEyxEU3S05o-Jh0t8anmS6-wZHBDwh2S6jj-M0uS8_0dJY575Vb1cHAGeg-TLn8YnMuoq6HHu1H_hbnLjbGN_0jhrBvQIK05804SWiRzg9ZFEYsZTEhAzgFH8zIMGDnzFILzEd5",
  };
  
  getMessaging()
    .send(message)
    .then((response) => {
      res.status(200).json({
        message: "Successfully sent message",
        token: receivedToken,
      });
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      res.status(400);
      res.send(error);
      console.log("Error sending message:", error);
    });
  
  
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
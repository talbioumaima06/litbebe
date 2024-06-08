import {initializeApp, applicationDefault } from 'firebase-admin/app';
import { getMessaging } from "firebase-admin/messaging";
import { getDatabase } from "firebase-admin/database";
import { ref, onValue } from 'firebase/database';
import express, { json } from "express";
import cors from "cors";
import admin from 'firebase-admin';
import fs from "fs";

process.env.GOOGLE_APPLICATION_CREDENTIALS;
import serviceAccount from './litbebe-a66b1-firebase-adminsdk-fjqwg-ee9fcda21f.json' assert { type: 'json' };

const app = express();
app.use(express.json());
const fcmToekn = "eZJwd8XHTbWqpl00bf7REG:APA91bGZ__TMA0FZrO7FOK72udEGOmlEjSudi21y0PFIVNtTgPHz6Lo-jQTU65je8gZLq-ptQqv-F7CU08DuAnMsU7kUAuxuV_U_xfEBCSn4P7BdWKjEh0BJLp6e53tg-c0fmgXjAOF-";

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
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://litbebe-a66b1-default-rtdb.europe-west1.firebasedatabase.app"
});

// Access Firebase Realtime Database after initialization
const db = getDatabase();
const temperatureRef = ref(db, '/Sensor/DHT_11/Temperature');

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
      token: fcmToekn,
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

const mouvementRef = ref(db, '/Sensor/Mvt_Status');
// Add a listener for changes to the mouvement sensor
onValue(mouvementRef, (snapshot) => {
  const mouvement = snapshot.val();
  if (mouvement != "Your baby is calm") {
    // Temperature exceeds 37, send notification
    const message = {
      notification: {
        title: "Votre bébé bouge !",
        body: ``
      },
      // Add the FCM token here for the device you want to send notification to
      token: fcmToekn,
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

const soundRed = ref(db, '/Sensor/sound_status');
// Add a listener for changes to the sound sensor
onValue(soundRed, (snapshot) => {
  const sounds = snapshot.val();
  if (sounds != "Your baby is sleeping.") {
    // Temperature exceeds 37, send notification
    const message = {
      notification: {
        title: "Vérifiez votre bébé, il fait des bruits !",
        body: ``
      },
      // Add the FCM token here for the device you want to send notification to
      token: fcmToekn,
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

const aiRef = ref(db, '/camera/ai_listener');
// Add a listener for changes to the ai istener
onValue(aiRef, (snapshot) => {
  const aiVal = snapshot.val();
  const message = {
    notification: {
      title: "Votre bébé est dans une position dangereuse, vérifiez-le s'il vous plaît!",
      body: ``
    },
    // Add the FCM token here for the device you want to send notification to
    token: fcmToekn,
  };

  getMessaging()
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
});

// Handle image upload
app.post("/upload", function (req, res) {
  const base64Data = req.body.image; // Assuming the base64 image data is sent in the 'image' field
  
  // Generate a unique filename for the image
  const fileName = `${Date.now()}.png`; // You can adjust the file extension as per your requirement
  
  // Path to save the uploaded image
  const filePath = `./uploads/${fileName}`;
  
  // Write the base64 data to a file
  fs.writeFile(filePath, base64Data, 'base64', function(err) {
    if (err) {
      console.error("Error saving image:", err);
      res.status(500).json({ error: "Error saving image" });
    } else {
      console.log("Image saved successfully");
      res.status(200).json({ message: "Image uploaded successfully", filePath });
    }
  });
});

// Your existing code for sending notifications
app.post("/send", function (req, res) {
  const receivedToken = req.body.fcmToken;
  
  const message = {
    notification: {
      title: "Notif",
      body: 'This is a Test Notification'
    },
    token: fcmToekn,
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

const port = 3000;
const hostname = '192.168.1.17'; // or '192.168.1.26'
app.listen(port, hostname, () => {
  console.log("Server started on port 3000");
});
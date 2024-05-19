
const admin = require('firebase-admin');

// Replace 'path/to/serviceAccountKey.json' with the path to your service account key JSON file
const serviceAccount = require('./litbebe-a66b1-firebase-adminsdk-fjqwg-ee9fcda21f.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://litbebe-a66b1-default-rtdb.europe-west1.firebasedatabase.app'
});

// Access Firebase Realtime Database
const db = admin.database();
const temperatureRef = db.ref('temperature');

// Listen for changes in temperature
temperatureRef.on('value', (snapshot) => {
    const temperature = snapshot.val();
    if (temperature > 37) {
        sendPushNotification();
    }
});

// Read data from the database
// temperatureRef.once('value', (snapshot) => {
//     console.log('Data from Firebase:', snapshot.val());
// });

// Function to send push notification
function sendPushNotification() {
    const registrationToken = 'cP7bqktsRouLIO2WAlKX8T:APA91bEyxEU3S05o-Jh0t8anmS6-wZHBDwh2S6jj-M0uS8_0dJY575Vb1cHAGeg-TLn8YnMuoq6HHu1H_hbnLjbGN_0jhrBvQIK05804SWiRzg9ZFEYsZTEhAzgFH8zIMGDnzFILzEd5';

    const message = {
        data: {
            temperatureAlert: 'Temperature exceeds 37°C!'
        },
        token: registrationToken
    };

    admin.messaging().send(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
}
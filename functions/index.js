const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./secrets.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://auth-bd8b7-default-rtdb.firebaseio.com"
});

const database = admin.database();


const { onCall, HttpsError} = require('firebase-functions/v2/https');

exports.addAdminRole = onCall(
    { cors: true },
    async (data) => {
        try {
            let isAdmin = false;
            const snapshot = await admin.database().ref('/users/' + data.data.uid).once('value');

            if (!snapshot.exists()) {
                return {
                    isAdmin: false,
                    message: `No user found with the provided UID.`,
                };
            }

            const userData = snapshot.val();

            if(userData && 'isAdmin' in userData && userData.isAdmin){
                isAdmin = true;
            }

            if(isAdmin){
                await admin.auth().setCustomUserClaims(data.data.uid, { admin: true });
                return {
                    isAdmin: true,
                    message: `Success! ${data.data.uid} has been made an admin.`,
                };
            } else {
                return {
                    isAdmin: false,
                    message: `User not an admin`,
                };
            }

        } catch (error) {
            throw new HttpsError('internal', 'An error occurred while processing the request.', error);
        }
    },
);


exports.checkAdminRole = onCall(
    { cors: true },
    async (data) => {
        try {
            if (!data.data.uid || typeof data.data.uid !== 'string' || data.data.uid.length > 128) {
                return {
                    isAdmin: false,
                    message: `Invalid UID provided.`,
                };
            }

            const userRecord = await admin.auth().getUser(data.data.uid);

            if (userRecord.customClaims && userRecord.customClaims.admin === true) {
                return {
                    isAdmin: true,
                    message: `Success! User is an admin.`,
                };
            } else {
                return {
                    isAdmin: false,
                    message: `User is not an admin.`,
                };
            }
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                return {
                    message: `User does not exist.`,
                    isAdmin: false,
                };
            } else {
                throw new HttpsError('internal', 'An error occurred while processing the request.', error);
            }
        }
    },
);


exports.createUser = onCall(
    { cors: true },
    async (data) => {
        try {

            if (!data.data.uid || typeof data.data.uid !== 'string' || data.data.uid.length > 128) {
                return {
                    isCreated: false,
                    message: `Invalid UID provided.`,
                };
            }

            const userRecord = await admin.auth().getUser(data.data.uid);

            if (!(userRecord.customClaims && userRecord.customClaims.admin)) {
                return {
                    isCreated: false,
                    message: 'User has not been Created',
                };
            }

            const savedUserRecord = await admin.auth().createUser({
                email: data.data.email,
                password: data.data.password,
            });

            const userData = {
                email: data.data.email,
                password: data.data.password,
                full_name: data.data.full_name,
                isAdmin: false
            }

            await admin.database().ref('/users/' + savedUserRecord.uid).set(userData);
            return {
                isCreated: true,
                message: 'User Created Successfully',
            };

        } catch (error) {
            if (error.code === 'auth/email-already-exists') {
                return {
                    isCreated: false,
                    message: `User with email ${data.data.email} already exists.`,
                };
            } else if (error.code === 'auth/user-not-found') {
                return {
                    message: 'User has not been Created',
                    isCreated: false,
                };
            }
            throw new HttpsError('internal', 'An error occurred while processing the request.', error);
        }
    }
);


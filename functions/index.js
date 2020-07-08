const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const express = require('express');
const app = express();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
app.get('/posts', (req, res) => {
  admin.firestore().collection('posts').get()
    .then(data => {
      let posts = [];
      data.forEach(doc => {
        posts.push(doc.data());
      })
      return res.json(posts);
    })
    .catch(err => console.error(err));
})

app.post('/posts', (req, res) => {
  const newPost = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };

  admin.firestore().collection('posts').add(newPost)
    .then((doc) => {
      return res.json({
        message: `document ${doc.id} created successfully`
      });
    })
    .catch(err => {
      res.status(500).json({
        error: "something went wrong"
      });
      console.error(err);
    });
})



exports.api = functions.https.onRequest(app);

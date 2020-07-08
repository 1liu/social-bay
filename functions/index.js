const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();
admin.initializeApp();

const db = admin.firestore();

const firebaseConfig = {
  apiKey: "AIzaSyCIoZiZ5X67WuC7hDkG519yUbIXa99WpHw",
  authDomain: "social-bay-5841e.firebaseapp.com",
  databaseURL: "https://social-bay-5841e.firebaseio.com",
  projectId: "social-bay-5841e",
  storageBucket: "social-bay-5841e.appspot.com",
  messagingSenderId: "26473207467",
  appId: "1:26473207467:web:e097b1eff7b112946249ee",
  measurementId: "G-XKZY3QYPKH"
};



const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
app.get('/posts', (req, res) => {
  db.collection('posts').orderBy('createdAt', 'desc').get()
    .then(data => {
      let posts = [];
      data.forEach(doc => {
        posts.push({
          postId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      })
      return res.json(posts);
    })
    .catch(err => console.error(err));
})

app.post('/posts', (req, res) => {
  const newPost = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  db.collection('posts').add(newPost)
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

/* signup route */
app.post('/signup', (req, res)=>{
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmedPassword: req.body.confirmedPassword,
    handle: req.body.handle,
  }
  // TODO validate signup data
  db.collection('users').doc(`${newUser.handle}`)
    .get()
    .then((doc) => {
      console.log(doc)
      if (doc.exists) {
        return res.status(400).json({ handle: "this handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
  .then(data => {
    return data.user.getIdToken();
  })
  .then(token => {
    return res.status(201).json({token})
  })
  .catch(err=>{
    console.error(err);
    res.status(500).json({error: err.code})
  })

})

exports.api = functions.https.onRequest(app);

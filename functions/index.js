const functions = require('firebase-functions');

const express = require('express');
const app = express();

const { getAllPosts, postOnePost} = require('./handlers/posts');
const {signup, login} = require('./handlers/users');
const {FBAuth} = require('./util/fbAuth')


//posts routes
app.get('/posts', getAllPosts);
app.post('/posts', FBAuth, postOnePost);

/*Users Routes */
app.post('/signup', signup)
app.post('/login', login)

exports.api = functions.https.onRequest(app);

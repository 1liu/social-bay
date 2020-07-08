const functions = require('firebase-functions');

const express = require('express');
const app = express();

const { getAllPosts, postOnePost, getPost, postComment} = require('./handlers/posts');
const { signup, login, uploadImage, addUserDetail, getAuthUser} = require('./handlers/users');
const {FBAuth} = require('./util/fbAuth')


//posts routes
app.get('/posts', getAllPosts);
app.post('/posts', FBAuth, postOnePost);
app.get('/posts/:postId', getPost);

//todo: delete post
//todo: like a post
//tode: unlike a post
//tode: comment a post
app.post('/posts/:postId/comment', FBAuth, postComment);

/*Users Routes */
app.post('/signup', signup)
app.post('/login', login)
app.post('/user/image', FBAuth, uploadImage)
app.post('/user', FBAuth, addUserDetail);
app.get('/user', FBAuth, getAuthUser);
exports.api = functions.https.onRequest(app);

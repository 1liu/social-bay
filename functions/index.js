const functions = require('firebase-functions');

const express = require('express');
const app = express();
const db = require('./util/admin');

const {
  getAllPosts,
  postOnePost,
  getPost,
  postComment,
  likePost,
  unlikePost,
  deletePost
} = require('./handlers/posts');

const {
  signup,
  login,
  uploadImage,
  addUserDetail,
  getAuthUser
} = require('./handlers/users');

const { FBAuth } = require('./util/fbAuth')


//posts routes
app.get('/posts', getAllPosts);
app.post('/posts', FBAuth, postOnePost);
app.get('/posts/:postId', getPost);

//todo: delete post
//todo: like a post
//tode: unlike a post
app.get('/posts/:postId/like', FBAuth, likePost);
app.get('/posts/:postId/unlike', FBAuth, unlikePost);
app.delete('/posts/:postId', FBAuth, deletePost);
//tode: comment a post
app.post('/posts/:postId/comment', FBAuth, postComment);

/*Users Routes */
app.post('/signup', signup)
app.post('/login', login)
app.post('/user/image', FBAuth, uploadImage)
app.post('/user', FBAuth, addUserDetail);
app.get('/user', FBAuth, getAuthUser);
exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
  .onCreate(snapshot => {
    db.document(`/posts/${snapshot.data().postId}`).get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
          createdAt: new Date().toIsoString(),
          recipient: doc.data().userHandle,
          sender: snapshot.data().userHandle,
          type: 'like',
          read: false,
          postId: doc.id
        });
      }
    })
    .then(()=>{
      return;
    })
    .catch(err=>{
      console.error(err);
      return;
    })
  })

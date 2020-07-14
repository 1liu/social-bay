/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const cors = require('cors')
const express = require('express');
const app = express();
app.use(cors());
const { db } = require('./util/admin');

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
  getAuthUser,
  getUserDetail,
  markNotificationRead
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
app.get('/user/:handle', getUserDetail);
app.post('/notifications', FBAuth, markNotificationRead);
exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions
  .firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            postId: doc.id
          });
        }
      })
      .catch((err) => console.error(err));
  });


exports.delteNotificationOnUnLike = functions.firestore.document('likes/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  })

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            postId: doc.id
          });
        }
      })
      .catch((err) => console.error(err));
  })

exports.onUserImageChange = functions.firestore.document('users/{userId}')
  .onUpdate(change => {
    console.log(change.before.data());
    console.log(change.after.data());

    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed')
      let batch = db.batch();
      return db.collection('posts').where('userHandle', '==', change.before.data().handle).get()
        .then(data => {
          data.forEach(doc => {
            const post = db.doc(`/posts/${doc.id}`);
            batch.update(post, { userImage: change.after.data().imageUrl });
          })
          return batch.commit();
        })
    } else return true;
  })

exports.onPostDelete = functions.firestore.document('posts/{postId}')
  .onDelete((snapshot, context) => {
    const postId = context.params.postId;
    const batch = db.batch();
    return db.collection('comments').where('postId', '==', postId).get()
    .then(data=>{
      data.forEach(doc=>{
        batch.delete(db.doc(`/comments/${doc.id}`));
      })
      return db.collection('likes').where('postId', '==', postId).get();
    })
    .then(data=>{
      data.forEach(doc => {
        batch.delete(db.doc(`/likes/${doc.id}`));
      })
      return db.collection('notifications').where('postId', '==', postId).get();
    })
    .then(data=>{
      data.forEach(doc => {
        batch.delete(db.doc(`/notifications/${doc.id}`));
      })
      return batch.commit();
    })
    .catch(err=>{
      console.error(err);
    })
  })

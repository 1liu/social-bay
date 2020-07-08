const { db } = require('../util/admin')
const config = require('../util/config')

const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData } = require('../util/validators');
exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmedPassword: req.body.confirmedPassword,
    handle: req.body.handle,
  }


  //validation
  const { valid, errors } = validateSignupData(newUser);
  if (!valid) return res.status(400).json({ errors });
  // TODO validate signup data
  let token, userId;
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
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(theToken => {
      token = theToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
      // return res.status(201).json({ token })
    })
    .then(() => {
      return res.status(201).json({ token })
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({
          email: 'email is already in use'
        })
      } else {
        return res.status(500).json({ error: err.code })
      }
    })

}


exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = {
    email,
    password
  };

  //validation
  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json({ errors });

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res.status(403).json({ general: 'Wrong password, try again' })
      } else {
        return res.status(500).json({ error: err.code });
      }
    })
}


const isEmail = (email) => {
  const regEx = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (email.match(regEx)) return true;
  else return false;
}
const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
}

exports.validateSignupData = newUser => {
  let errors = {}

  if (isEmpty(newUser.email)) {
    errors.email = 'Email is needed'
  } else if (!isEmail(newUser.email)) {
    errors.email = 'Not a valid email address'
  }

  if (isEmpty(newUser.password)) {
    errors.password = 'Must not be empty'
  }

  if (newUser.password !== newUser.confirmedPassword) {
    errors.confirmedPassword = 'Passwords must match'
  }

  if (isEmpty(newUser.handle)) {
    errors.handle = 'Must not be empty'
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

exports.validateLoginData = user =>{
  let errors = {};

  if (isEmpty(user.email)) errors.email = 'Must not be empty';
  if (isEmpty(user.password)) errors.password = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

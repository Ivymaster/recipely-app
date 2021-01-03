////////////////////////////////
// Alert/////////////////////////
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document
    .querySelector('#login-message')
    .insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

/////////////////////////////////////////
/// LOG IN - OUT //////////////////////
const forgotPass = async email => {
  try {
    axios.defaults.headers.post['Content-Type'] = 'text/plain';

    const res = await axios.post(
      'http://localhost:3000/api/v1/users/forgotPassword',
      {
        email
      }
    );

    if (res.data.status === 'success') {
      showAlert('success', 'Poslana poruka sa sifrom');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
const newPass = async (password, passwordConfirm, token) => {
  try {
    axios.defaults.headers.post['Content-Type'] = 'text/plain';

    const res = await axios.post(
      `http://localhost:3000/api/v1/users/resetPassword/${token}`,
      {
        password,
        passwordConfirm
      }
    );

    if (res.data.status === 'success') {
      showAlert('success', 'Sifra promijenjena');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
/////////////////////////////////////////////////
// DODAVANJE LISTENERA /////////////////////////
const forgotPassForm = document.querySelector('#forgotPass');
const newPassForm = document.querySelector('#newForgotPass');

if (forgotPassForm)
  forgotPassForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    console.log(email);
    forgotPass(email);
  });

if (newPassForm)
  newPassForm.addEventListener('submit', e => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const token = document.getElementById('newForgotBtn').value;
    console.log();
    newPass(password, passwordConfirm, token);
  });

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
/// SIGN UP //////////////////////
const signUp = async (
  username,
  firstname,
  lastname,
  email,
  password,
  passwordConfirm
) => {
  try {
    axios.defaults.headers.post['Content-Type'] = 'text/plain';

    const res = await axios.post('http://localhost:3000/api/v1/users/signup', {
      username,
      firstname,
      lastname,
      email,
      password,
      passwordConfirm
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `Dobrodosli, ${username}, hvala Vam na prijavljivanju!`
      );
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

//////////////////////////////
///LISTENERI/////////////////
const signUpForm = document.querySelector('#signUpForm');

if (signUpForm)
  signUpForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('signUp-username').value;
    const firstname = document.getElementById('signUp-firstname').value;
    const lastname = document.getElementById('signUp-lastname').value;
    const email = document.getElementById('signUp-email').value;
    const password = document.getElementById('signUp-password').value;
    const passwordConfirm = document.getElementById('signUp-passwordConfirm')
      .value;

    signUp(username, firstname, lastname, email, password, passwordConfirm);
  });

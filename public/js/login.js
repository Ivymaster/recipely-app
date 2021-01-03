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
const login = async (username, password) => {
  try {
    axios.defaults.headers.post['Content-Type'] = 'text/plain';

    const res = await axios.post('http://localhost:3000/api/v1/users/login', {
      username,
      password
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Uspjesna prijava!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const logout = async () => {
  try {
    axios.defaults.headers.post['Content-Type'] = 'text/plain';

    const res2 = await axios.get('http://localhost:3000/api/v1/users/logout');

    if ((res2.data.status = 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Pogreska prilikom prijave. Pokusajte ponovo!');
  }
};

/////////////////////////////////////////////////
// DODAVANJE LISTENERA /////////////////////////
const loginForm = document.querySelector('#loginForm');
const logOut = document.querySelector('#logOut');

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    login(username, password);
  });

if (logOut) logOut.addEventListener('click', logout);

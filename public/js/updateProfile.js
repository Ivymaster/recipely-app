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
/// update //////////////////////
const updateData = async data => {
  try {
    axios.defaults.headers.post['Content-Type'] = 'text/plain';

    const res = await axios.post(
      'http://localhost:3000/api/v1/users/updateMe',

      data
    );

    if (res.data.status === 'success') {
      document.getElementById('userImage').src =
        '/img/users/' + res.data.data.user.photo;
      showAlert('success', `Profil azuriran`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const updatePass = async (passwordCurrent, password, passwordConfirm) => {
  try {
    axios.defaults.headers.post['Content-Type'] = 'text/plain';

    const res = await axios.post(
      'http://localhost:3000/api/v1/users/updateMyPassword',

      { passwordCurrent, password, passwordConfirm }
    );

    if (res.data.status === 'success') {
      showAlert('success', `Profil azuriran`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
//////////////////////////////
///LISTENERI/////////////////
const updateDataForm = document.querySelector('#updateDataForm');
const updatePassword = document.querySelector('#updatePasswordForm');

if (updateDataForm)
  updateDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('username', document.getElementById('update-username').value);
    form.append('lastname', document.getElementById('update-lastname').value);
    form.append('firstname', document.getElementById('update-firstname').value);
    form.append('email', document.getElementById('update-email').value);
    form.append('photo', document.getElementById('update-photo').files[0]);
    updateData(form);
  });

if (updatePassword)
  updatePassword.addEventListener('submit', e => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('old-password').value;
    const password = document.getElementById('update-password').value;
    const passwordConfirm = document.getElementById('update-passwordConfirm')
      .value;

    updatePass(passwordCurrent, password, passwordConfirm);
  });

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
const saveRecept = async (id, comment) => {
  try {
    axios.defaults.headers.post['Content-Type'] = 'text/plain';
    let url = 'http://localhost:3000/recepts/' + id;
    const res = await axios.post(
      url,

      { id, comment }
    );

    if (res.data.status === 'success') {
      showAlert('success', `Recept i komentar spremljeni`);
      window.setTimeout(() => {
        location.assign('/recepts/mojiRecepti');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const update = async (id, comment) => {
  try {
    axios.defaults.headers.post['Content-Type'] = 'text/plain';
    let url = 'http://localhost:3000/recepts/savedRecept/' + id;

    const res = await axios.post(
      url,

      { id, comment }
    );

    if (res.data.status === 'success') {
      showAlert('success', `Recept i komentar spremljeni`);
      window.setTimeout(() => {
        location.assign('/recepts/mojiRecepti');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
//////////////////////////////
///LISTENERI/////////////////
const saveBtn = document.querySelector('#save-recept-button');

if (saveBtn)
  saveBtn.addEventListener('click', e => {
    e.preventDefault();
    const id = saveBtn.value;
    const comment = document.getElementById(id).value;
    console.log(id, comment);
    saveRecept(id, comment);
  });

const updateBtn = document.querySelector('#update-recept-button');

if (updateBtn)
  updateBtn.addEventListener('click', e => {
    e.preventDefault();
    const id = updateBtn.value;
    const comment = document.getElementById(id).value;
    console.log(id, comment);
    update(id, comment);
  });

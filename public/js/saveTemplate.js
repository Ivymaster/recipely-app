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
const saveTemplate = async id => {
  try {
    axios.defaults.headers.post['Content-Type'] = 'text/plain';
    let url = 'http://localhost:3000/meal/addTemplate/' + id;

    const res = await axios.post(url, {
      date: document.querySelector('#startDate').value
    });
    console.log(res);

    if (res.data.status === 'success') {
      showAlert('success', `Uspjesno dodan plan ishrane!`);
      window.setTimeout(() => {
        location.assign('/meal/myMeal');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

//////////////////////////////
///LISTENERI/////////////////
const saveBtn = document.querySelector('#save-template-button');

if (saveBtn)
  saveBtn.addEventListener('click', e => {
    e.preventDefault();
    const id = saveBtn.value;
    saveTemplate(id);
  });

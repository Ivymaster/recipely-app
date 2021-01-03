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
const saveRecept = async (name, email, mob, content) => {
  try {
    axios.defaults.headers.post['Content-Type'] = 'text/plain';
    let url = 'http://localhost:3000/contactMail';
    const res = await axios.post(
      url,

      { name, email, mob, content }
    );
    if (res.data.status === 'success') {
      showAlert('success', 'Email je poslan!');
      window.setTimeout(() => {
        //location.assign('/contact');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

//////////////////////////////
///LISTENERI/////////////////
const sendMailBtn = document.querySelector('#send-mail-button');

if (sendMailBtn)
  sendMailBtn.addEventListener('click', e => {
    e.preventDefault();
    const name = document.getElementById('name-send-mail').value;
    const email = document.getElementById('email-send-mail').value;
    const mob = document.getElementById('mob-send-mail').value;
    const content = document.getElementById('content-send-mail').value;

    saveRecept(name, email, mob, content);
  });

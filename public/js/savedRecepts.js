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
const brisanjeRecept = async id => {
  try {
    axios.defaults.headers.post['Content-Type'] = 'text/plain';
    let url = 'http://localhost:3000/recepts/' + id;
    console.log(url);
    const res = await axios.delete(url);
    console.log(res.data);

    if (res.data.status === 'success') {
      showAlert('success', `Recept obrisan`);
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
const brisanjeBtn = document.querySelectorAll('.brisanje-link');

if (brisanjeBtn)
  brisanjeBtn.forEach(function(btn) {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const id = btn.name;
      console.log(id);
      brisanjeRecept(id);
    });
  });

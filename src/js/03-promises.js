import Notiflix from 'notiflix';

const formEl = document.querySelector('.form');
formEl.addEventListener('submit', handlerSubmitForm);

function handlerSubmitForm(event) {
  event.preventDefault();

  const delay = Number(event.currentTarget.delay.value);
  const step = Number(event.currentTarget.step.value);
  const amount = Number(event.currentTarget.amount.value);

  creatMltplPromises(delay, step, amount);

  event.currentTarget.reset();
}

function creatMltplPromises(delay, step, amount) {
  let amountDelay = delay;

  for (let i = 1; i <= amount; i += 1) {
    createPromise(i, amountDelay).then(onResolve).catch(onReject);
    amountDelay += step;
  }
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

function onResolve({ position, delay }) {
  Notiflix.Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
}

function onReject({ position, delay }) {
  Notiflix.Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
}

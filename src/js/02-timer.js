import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const TIMER_STEP = 1000;
let timerId = null;
let date = null;
let timeDiff = 0;

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

refs.startBtn.disabled = true;
refs.startBtn.addEventListener('click', onStartBtnClick);

flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    date = selectedDates[0];
    startBtnActivation();
  },
});

function startBtnActivation() {
  const currentDate = Date.now();
  const selectedDate = new Date(date).getTime();

  if (selectedDate < currentDate) {
    Notiflix.Notify.failure('Please choose a date in the future');
    refs.startBtn.disabled = true;
    date = null;
    return;
  }

  timeDiff = selectedDate - currentDate;
  refs.startBtn.disabled = false;
}

function onStartBtnClick() {
  refs.input.disabled = true;
  refs.startBtn.disabled = true;

  timerId = setInterval(() => {
    timeDiff -= TIMER_STEP;
    const timeComp = convertMs(timeDiff);

    if (timeDiff < 0) {
      clearInterval(timerId);
      refs.input.disabled = false;
      return;
    }

    updateClockface(timeComp);
  }, TIMER_STEP);
}

function updateClockface(obj) {
  const { days, hours, minutes, seconds } = obj;
  refs.days.textContent = `${addLeadingZero(days)}`;
  refs.hours.textContent = `${addLeadingZero(hours)}`;
  refs.minutes.textContent = `${addLeadingZero(minutes)}`;
  refs.seconds.textContent = `${addLeadingZero(seconds)}`;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

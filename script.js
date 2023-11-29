'use strict';

////////////
//  Data  //
////////////

const account1 = {
  owner: 'Alexander Ivanov',
  movements: [500, -200, 125000, -300, -400, 49, 700, 300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-11-25T18:49:59.371Z',
    '2023-11-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: `it-IT`,
};

const account2 = {
  owner: 'Bryn Bowie',
  movements: [1500, -1000, 200, -400, -300, 700, 400, -600],
  interestRate: 0.7,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2023-11-25T18:49:59.371Z',
    '2023-11-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

////////////////////////
//  Global Variables  //
////////////////////////

let currentUser;
let isSorted = false;
let timer;

////////////////
//  Elements  //
////////////////

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////
//  Functions  //
/////////////////

// function to make timer work and logout user
const startTimer = function () {
  let timerTime = 300;
  // tick function for callback of setInterval()
  const tick = function () {
    // convert timerTIme in minutes and seconds
    const minutes = String(Math.trunc(timerTime / 60)).padStart(2, 0);
    const seconds = String(timerTime % 60).padStart(2, 0);

    // update timer in UI
    const remainingTimeStr = `${minutes}:${seconds}`;
    labelTimer.textContent = remainingTimeStr;

    // if timerTime is finished
    if (timerTime === 0) {
      // stop ticking
      clearInterval(timer);
      // logout user
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    // decrease timer time
    timerTime--;
  };

  // call tick() once first seconds then each seconds thanks to the setInterval
  tick();
  // call tick every 1000ms
  const timer = setInterval(tick, 1000);
  // returing "timer" variable to be able to clearInterval(timer) outside the function
  return timer;
};

// universal function to display currency
const formatCurrency = function (value, locale, currency) {
  const options = {
    style: `currency`,
    currency: currency,
  };
  return Intl.NumberFormat(locale, options).format(value);
};

// function to calculate and return date to be displayed
const calcDisplayDate = function (date) {
  // get "now" moment in timestamp in milliseconds
  const now = new Date().getTime();

  // function which returns difference of days
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  // calculate difference of days between given "date" and "now"
  const daysPassed = calcDaysPassed(date, now);

  // get number data type from given "date"
  // const movementYear = `${date.getFullYear()}`;
  // const movementMonth = `${date.getMonth() + 1}`.padStart(2, `0`);
  // const movementDay = `${date.getDate()}`.padStart(2, `0`);
  const options = {
    day: `numeric`,
    month: `numeric`,
    year: `numeric`,
    hour: `numeric`,
    minute: `numeric`,
    // weekday: `long`,
  };

  const dateIntl = Intl.DateTimeFormat(currentUser.locale, options).format(
    date
  );

  // decide what to return
  if (daysPassed === 0) {
    return `Today`;
  } else if (daysPassed === 1) {
    return `Yesterday`;
  } else if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  } else {
    return `${dateIntl}`;
  }
};

// function which creates usernames
const createUserames = function (accs) {
  accs.forEach(function (el) {
    el.username = el.owner
      .toLowerCase()
      .split(' ')
      .map(i => i[0])
      .join(``);
  });
};

// function to display all movements inside the "containerMovements"
const displayMovements = function (acc, sorted = false) {
  containerMovements.innerHTML = ``;

  // creating a copy of "movements" array sorting or not based on the argument
  const movementsCopy = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements.slice();

  movementsCopy.forEach(function (movement, index) {
    const movementType = movement < 0 ? `withdrawal` : `deposit`;

    const movementDate = new Date(acc.movementsDates[index]);
    const displayDate = calcDisplayDate(movementDate);

    // format currency (internationalizing)
    const formattedCurrency = formatCurrency(
      movement,
      acc.locale,
      acc.currency
    );

    const htmlPiece = `
    <div class="movements__row">
      <div class="movements__type movements__type--${movementType}">${
      index + 1
    } ${movementType}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedCurrency}</div>
    </div>`;
    containerMovements.insertAdjacentHTML(`afterbegin`, htmlPiece);
  });
};

// function to calculate and display current balance
const calcDisplayBalance = function (account) {
  // get the current date and time
  const currentDate = new Date();

  // transform "currentDate" in nicely formatted string
  const currentYear = `${currentDate.getFullYear()}`;
  const currentMonth = `${currentDate.getMonth() + 1}`.padStart(2, `0`);
  const currentDay = `${currentDate.getDate()}`.padStart(2, `0`);
  const currentHour = `${currentDate.getHours()}`.padStart(2, `0`);
  const currentMinute = `${currentDate.getMinutes()}`.padStart(2, `0`);

  account.currentBalance = account.movements.reduce(function (
    accumul,
    current
  ) {
    return accumul + current;
  },
  0);
  // change content on page
  // labelBalance.textContent = `${account.currentBalance.toFixed(2)}€`;
  labelBalance.textContent = formatCurrency(
    account.currentBalance,
    account.locale,
    account.currency
  );
  labelDate.textContent = `${currentDay}/${currentMonth}/${currentYear}, ${currentHour}:${currentMinute}`;
};

// function to calculate and display summury
const calcDisplaySummury = function (account) {
  // money in
  const totalIn = account.movements
    .filter(el => el > 0)
    .reduce((acc, el) => acc + el, 0);
  // labelSumIn.textContent = `${totalIn.toFixed(2)}€`;
  labelSumIn.textContent = formatCurrency(
    totalIn,
    account.locale,
    account.currency
  );

  // money out
  const totalOut = account.movements
    .filter(el => el < 0)
    .reduce((acc, el) => acc + el, 0);
  console.log(typeof totalOut);
  // labelSumOut.textContent = `${Math.abs(totalOut).toFixed(2)}€`;

  labelSumOut.textContent = formatCurrency(
    Math.abs(totalOut),
    account.locale,
    account.currency
  );

  // interest
  // bank pays interest each time that there is a deposit to the bank account
  // bank only pays an interest if that interest is at least one Euro
  const interest = account.movements
    .filter(el => el > 0)
    .map(el => (el * account.interestRate) / 100)
    .filter(el => el >= 1)
    .reduce((acc, el) => acc + el);
  // labelSumInterest.textContent = `${interest.toFixed(2)}€`;
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
};

const updateUI = function (account) {
  // calculate and display movements
  displayMovements(account);

  // calculate and display balance
  calcDisplayBalance(account);

  // calculate and display summury
  calcDisplaySummury(account);
};

/////////////////////
// Event Listeners //
/////////////////////

// creating "username" property for each account
createUserames(accounts);

// implementing login
btnLogin.addEventListener(`click`, function (event) {
  // prevent from reloading the page
  event.preventDefault();

  // removing the focus after submitting
  [inputLoginUsername, inputLoginPin].forEach(el => blur(el));

  // change the current user
  currentUser = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  // check if the "inputLoginPin" (pin) is correct (same as pin of currentUser)
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // change welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentUser.owner.split(` `)[0]
    }!`;

    // show the application
    containerApp.style.opacity = 100;

    // update User Interface
    updateUI(currentUser);

    // check if there is a timer, if yes clear it
    if (timer) clearInterval(timer);
    // start new timer
    timer = startTimer();
  }

  // clear the inputs fields
  [inputLoginUsername, inputLoginPin].forEach(el => (el.value = ``));
});

// implementing transfers
btnTransfer.addEventListener(`click`, function (e) {
  e.preventDefault();

  // get the current date in ISO
  const currentDateISO = new Date().toISOString();

  // get amount to transfer and receiver
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);

  // check if the data for transition is valid
  if (
    receiver &&
    amount <= currentUser.currentBalance &&
    receiver !== currentUser &&
    amount > 0
  ) {
    // if data is valid add movement for both users (transmitter and receiver)
    currentUser.movements.push(-amount);
    receiver.movements.push(amount);

    // if data is valid add movements dates for both users (transmitter and receiver)
    currentUser.movementsDates.push(currentDateISO);
    receiver.movementsDates.push(currentDateISO);

    // and updata UI
    updateUI(currentUser);
  }
  // clear the inputs fields
  inputTransferTo.value = inputTransferAmount.value = ``;
  // check if there is a timer, if yes clear it
  if (timer) clearInterval(timer);
  // start new timer
  timer = startTimer();
});

// implementing loan
btnLoan.addEventListener(`click`, function (e) {
  e.preventDefault();
  // test if data is correct
  // rule: to get the loan the user should have at least one deposit which is 10% of the loan
  const amountLoan = Math.floor(inputLoanAmount.value);
  const currentDateISO = new Date().toISOString();
  if (
    amountLoan > 0 &&
    currentUser.movements.some(el => el >= amountLoan * 0.1)
  ) {
    // if correct se setTimeout to 3 seconds to execute the transfer
    setTimeout(() => {
      // update array of movements and dates
      currentUser.movements.push(amountLoan);
      currentUser.movementsDates.push(currentDateISO);
      updateUI(currentUser);
    }, 3 * 1000);
  }
  inputLoanAmount.value = ``;
  // check if there is a timer, if yes clear it
  if (timer) clearInterval(timer);
  // start new timer
  timer = startTimer();
});

// implementing closing account
btnClose.addEventListener(`click`, function (e) {
  e.preventDefault();
  // check if the data is correct
  if (
    inputCloseUsername.value === currentUser.username &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    // calculate the index
    const index = accounts.findIndex(
      el => el.username === currentUser.username
    );

    // removing the account from "accounts" array
    accounts.splice(index, 1);

    // empty the form
    inputCloseUsername.value = inputClosePin.value = ``;
  }
  // hide the application
  containerApp.style.opacity = 0;
  labelWelcome.textContent = `Goodbye, ${currentUser.owner.split(` `)[0]}!`;
});

// implementing sorting
btnSort.addEventListener(`click`, function (e) {
  e.preventDefault();
  displayMovements(currentUser, !isSorted);
  isSorted = !isSorted;
});

/////////////////////////////////////////////////////////////////////////////////////////////

console.log(`---------------CONTINUE HERE---------------`);
// time in seconds

// create a global variable "timerTime" in seconds
// calculate and show "timerTime" in minutes and seconds
// decrease timer on each second
// reset timer if operation/change user
// logout if timer is o

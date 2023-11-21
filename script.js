'use strict';

////////////
//  Data  //
////////////

const account1 = {
  owner: 'Alexander Ivanov',
  movements: [
    500, -200, 1000, -300, -400, 49, 700, 300, -800, 1200, -500, -1000, 1500,
  ],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Shelley Coby',
  movements: [
    1200, -800, 300, -200, -500, 100, 600, -25, -400, 800, -300, -700, 900,
  ],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Bryn Bowie',
  movements: [
    1500, -1000, 200, -400, -300, 700, 400, -600, 900, -800, -1200, 1800,
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Parker Hunter',
  movements: [
    800, -600, 400, -300, -200, 500, 200, -700, 1000, -400, -800, 1200,
  ],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

////////////////////////
//  Global Variables  //
////////////////////////

let currentUser;
let isSorted = false;

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
const displayMovements = function (movements, sorted = false) {
  containerMovements.innerHTML = ``;

  // creating a copy of "movements" array sorting or not based on the argument
  const movementsCopy = sorted
    ? movements.slice().sort((a, b) => a - b)
    : movements.slice();

  movementsCopy.forEach(function (movement, index) {
    const movementType = movement < 0 ? `withdrawal` : `deposit`;

    const htmlPiece = `
    <div class="movements__row">
      <div class="movements__type movements__type--${movementType}">${
      index + 1
    } ${movementType}</div>
      <div class="movements__value">${movement}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML(`afterbegin`, htmlPiece);
  });
};

// function to calculate and display current balance
const calcDisplayBalance = function (account) {
  account.currentBalance = account.movements.reduce(function (
    accumul,
    current
  ) {
    return accumul + current;
  },
  0);
  labelBalance.textContent = `${account.currentBalance}€`;
};

// function to calculate and display summury
const calcDisplaySummury = function (account) {
  // money in
  const totalIn = account.movements
    .filter(el => el > 0)
    .reduce((acc, el) => acc + el, 0);
  labelSumIn.textContent = `${totalIn.toFixed(2)}€`;

  // money out
  const totalOut = account.movements
    .filter(el => el < 0)
    .reduce((acc, el) => acc + el, 0);
  labelSumOut.textContent = `${Math.abs(totalOut).toFixed(2)}€`;

  // interest
  // bank pays interest each time that there is a deposit to the bank account
  // bank only pays an interest if that interest is at least one Euro
  const interest = account.movements
    .filter(el => el > 0)
    .map(el => (el * account.interestRate) / 100)
    .filter(el => el >= 1)
    .reduce((acc, el) => acc + el);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const updateUI = function (account) {
  // calculate and display movements
  displayMovements(account.movements);

  // calculate and display balance
  calcDisplayBalance(account);

  // calculate and display summury
  calcDisplaySummury(account);
};

//////////////////
//  Main Logic  //
//////////////////

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
  }

  // clear the inputs fields
  [inputLoginUsername, inputLoginPin].forEach(el => (el.value = ``));
});

// implementing transfers
btnTransfer.addEventListener(`click`, function (e) {
  e.preventDefault();
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

    // and updata UI
    updateUI(currentUser);
  }
  // clear the inputs fields
  inputTransferTo.value = inputTransferAmount.value = ``;
});

// implementing loan
btnLoan.addEventListener(`click`, function (e) {
  e.preventDefault();
  // test if data is correct
  // rule: to get the loan the user should have at least one deposit which is 10% of the loan
  const amountLoan = Number(inputLoanAmount.value);
  if (
    amountLoan > 0 &&
    currentUser.movements.some(el => el >= amountLoan * 0.1)
  ) {
    currentUser.movements.push(amountLoan);
    updateUI(currentUser);
  }
  inputLoanAmount.value = ``;
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
  displayMovements(currentUser.movements, !isSorted);
  isSorted = !isSorted;
});

/////////////////////////////////////////////////////////////////////////////////////////////

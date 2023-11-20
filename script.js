'use strict';

////////////
//  Data  //
////////////

const account1 = {
  owner: 'Alexander Ivanov',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Shelley Coby',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Bryn Bowie',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Parker Hunter',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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
const displayMovements = function (movements) {
  containerMovements.innerHTML = ``;
  movements.forEach(function (movement, index) {
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
const calcDisplayBalance = function (movements) {
  const currentBalance = movements.reduce(function (accumul, current) {
    return accumul + current;
  }, 0);
  labelBalance.textContent = `${currentBalance}€`;
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
  calcDisplayBalance(account.movements);

  // calculate and display summury
  calcDisplaySummury(account);
};

//////////////////
//  Main Logic  //
//////////////////

let currentUser;

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
    containerApp.style.opacity = `100`;

    // update User Interface
    updateUI(currentUser);
  }

  // clear the inputs fields
  [inputLoginUsername, inputLoginPin].forEach(el => (el.value = ``));
});

btnTransfer.addEventListener(`click`);
/////////////////////////////////////////////////////////////////////////////////////////////

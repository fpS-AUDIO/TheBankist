'use strict';

////////////
//  Data  //
////////////

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
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
const calcShowBalance = function (movements) {
  const currentBalance = movements.reduce(function (accumul, current) {
    return accumul + current;
  }, 0);
  labelBalance.textContent = `${currentBalance}€`;
};

// function to calculate and display summury
const calcDisplaySummury = function (movements) {
  // money in
  const totalIn = movements
    .filter(el => el > 0)
    .reduce((acc, el) => acc + el, 0);
  labelSumIn.textContent = `${totalIn}€`;

  // money out
  const totalOut = movements
    .filter(el => el < 0)
    .reduce((acc, el) => acc + el, 0);
  labelSumOut.textContent = `${Math.abs(totalOut)}€`;

  // interest
  // bank pays interest each time that there is a deposit to the bank account
  // bank only pays an interest if that interest is at least one Euro
  const interest = movements
    .filter(el => el > 0)
    .map(el => (el * 1.2) / 100)
    .filter(el => el >= 1)
    .reduce((acc, el) => acc + el);
  labelSumInterest.textContent = `${interest}€`;
};

//////////////////
//  Main Logic  //
//////////////////

// REMEMBER: account1.movements = [200, 450, -400, 3000, -650, -130, 70, 1300]

createUserames(accounts);
displayMovements(account1.movements);
calcShowBalance(account1.movements);
calcDisplaySummury(account1.movements);
/////////////////////////////////////////////////////////////////////////////////////////////

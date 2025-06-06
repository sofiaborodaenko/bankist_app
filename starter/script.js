"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: "Jonas Schmedtmann",
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: "Jessica Davis",
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: "Steven Thomas Williams",
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Sarah Smith",
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2025-06-02T17:01:17.194Z",
    "2025-06-09T23:36:17.929Z",
    "2025-06-04T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// format the movement currency
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// displays the main data in the center
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  // make a combined object that holds the movments with the dates
  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? "deposit" : "withdrawal";

    // format the date of the movements
    const date = new Date(movementDate);
    const displayDate = formatMovementDate(date, acc.locale);

    // format the movement currency
    const formattedMov = formatCur(movement, acc.locale, acc.currency);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
        `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// calculates and displays the balance at the top right of the screen
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);

  // format the balance currency
  const formattedBalance = formatCur(acc.balance, acc.locale, acc.currency);

  labelBalance.textContent = `${formattedBalance}`;
};

// calculates and displays the summaries located at the bottom of the screen
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  // format the movement currency
  const formattedIncome = formatCur(incomes, acc.locale, acc.currency);

  labelSumIn.textContent = `${formattedIncome}`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  // format the out currency
  const formattedOut = formatCur(Math.abs(out), acc.locale, acc.currency);

  labelSumOut.textContent = `${formattedOut}`;

  // interest is 1.2% of each deposited amount for this bank
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((accum, int) => accum + int, 0);

  // format the interest currency
  const formattedInteres = formatCur(interest, acc.locale, acc.currency);

  labelSumInterest.textContent = `${formattedInteres}`;
};

// createts the username based on users name
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map(function (name) {
        return name[0];
      })
      .join("");
  });
};
createUsername(accounts);

function updateUI(acc) {
  // displays movement
  displayMovements(acc);

  // displays balance
  calcDisplayBalance(acc);

  // displays summary
  calcDisplaySummary(acc);
}

//--------------EVENT HANDLERS--------------
let currAccount;

// fake log in
currAccount = account1;
updateUI(currAccount);
containerApp.style.opacity = 1;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  // gets the user thats inputed
  currAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  // makes sure the pin is correct before logging
  if (currAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back ${
      currAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 1;

    // clears input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // update the UI
    updateUI(currAccount);

    // create the date
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      //weekday: "long",
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currAccount.locale,
      options
    ).format(now);
  }
});

// transferring between accounts
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault(); // prevents reload after submiting

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  // resets the values
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currAccount.balance &&
    receiverAcc.username !== currAccount.username
  ) {
    // doing the transfer
    currAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add transfer date
    currAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currAccount);
  }
});

// asks for a loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const ammount = Math.floor(inputLoanAmount.value);

  // checks if the user has ten person of the loan request
  if (
    ammount > 0 &&
    currAccount.movements.some((mov) => mov >= ammount * 0.1)
  ) {
    // adding movemenet
    currAccount.movements.push(ammount);

    // add loan date
    currAccount.movementsDates.push(new Date().toISOString());

    //update UI
    updateUI(currAccount);
  }
  inputLoanAmount.value = btnLoan.value = "";
});

// deletes the account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currAccount.username &&
    +inputClosePin.value === currAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currAccount.username
    );

    // delete account
    accounts.splice(index, 1);

    // hide UI
    containerApp.style.opacity = 0;

    // change the text at the top
    labelWelcome.textContent = "Log in to get started";
  }

  inputClosePin.value = inputCloseUsername.value = "";
});

// sort the movements
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault;
  displayMovements(currAccount, !sorted);
  sorted = !sorted;
});

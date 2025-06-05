"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

// displays the main data in the center
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
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

  labelBalance.textContent = `${acc.balance}€`;
};

// calculates and displays the summaries located at the bottom of the screen
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}€`;

  // interest is 1.2% of each deposited amount for this bank
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((accum, int) => accum + int, 0);

  labelSumInterest.textContent = `${interest}€`;
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
  displayMovements(acc.movements);

  // displays balance
  calcDisplayBalance(acc);

  // displays summary
  calcDisplaySummary(acc);
}

//--------------EVENT HANDLERS--------------
let currAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  // gets the user thats inputed
  currAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  // makes sure the pin is correct before logging
  if (currAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${
      currAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 1;

    // clears input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // update the UI
    updateUI(currAccount);
  }
});

// transferring between accounts
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault(); // prevents reload after submiting

  const amount = Number(inputTransferAmount.value);
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
    updateUI(currAccount);
  }
});

// asks for a loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const ammount = Number(inputLoanAmount.value);

  // checks if the user has ten person of the loan request
  if (
    ammount > 0 &&
    currAccount.movements.some((mov) => mov >= ammount * 0.1)
  ) {
    // adding movemenet
    currAccount.movements.push(ammount);

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
    Number(inputClosePin.value) === currAccount.pin
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
  displayMovements(currAccount.movements, !sorted);
  sorted = !sorted;
});

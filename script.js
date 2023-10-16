'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Faisal Shaikh',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-09-17T10:17:24.185Z',
    '2023-09-18T14:11:59.604Z',
    '2023-09-19T17:01:17.194Z',
    '2023-09-20T15:36:17.929Z',
    '2023-09-21T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const account2 = {
  owner: 'Abubaqar Shaikh',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-06-25T18:49:59.371Z',
    '2023-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
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

/////////////////////////////////////////////////
// Functions
//date function
const formatMovementsDate = function (date, locale) {
  const calcdaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcdaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} Days Ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//currency format function
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    let date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    // new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(mov);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const formattedBal = formatCur(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = formattedBal;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

//Logout Timer function***
const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //In each call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    //When 0 seconds, Stop the timer and logOut
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log In to get started';
      containerApp.style.opacity = 0;
    }
    //decrease one second
    time--;
  };
  //Set the time to five min
  let time = 120;

  //Call The Timer every Second
  const timer = setInterval(tick, 1000);

  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

//FAKE ALWAYS LOGIN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//experimenting with the API
// const now = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
//   weekday: 'short',
// };
// //to get locale from the users browser
// const locale = navigator.language;
// console.log(locale);
// //locale en - english, IN - india
// labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

//////////////////////////////////////////
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //create current Date and Time
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'short',
    };
    //to get locale from the users browser
    // const locale = navigator.language;
    // console.log(locale);
    //locale en - english, IN - india
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //logout timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    //reset the timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  //the floor method converts the string to number
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      //add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      //reset the logout timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
//Converting and Checking numbers
console.log('Converting and Checking numbers------------');
//All numbers in javascript internally are represented as floating point numbers i.e decimal numbers
console.log(23 === 23.0); //true
//numbers are represented internally in a 64 base 2 format
// that means numbers are always stored in binary format
//it only consists of 0 and 1

//Base 10 - 0 to 9
//Base 2 - 0 to 1
//do not use for JS scientific calculation

//convert to numbers
console.log(Number('24'));
console.log(+'23');

//Parsing
// Inorder for this to work the string should start with a number
console.log(Number.parseInt('30@x')); //30
//10 is base which is used to avoid bugs
console.log(Number.parseInt('30@x', 10)); //30
console.log(Number.parseInt('@x30', 10)); //NAN
console.log(Number.parseFloat('2.5rem')); //2.5
console.log(parseFloat('  2.5rem')); //2.5

//number namespace
//check if the value is NAN
console.log(Number.isNaN(20)); //false because it is a number
console.log(Number.isNaN(+'20')); //true
console.log(Number.isNaN(23 / 0)); //false //infinity

//best way of checking if a value is a number
console.log(Number.isFinite(20)); //true
console.log(Number.isFinite('20')); //false
*/
//////////////////////////////////////////////////////////////
/*
//MAth and Rounding
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2)); //square root
console.log(8 ** (1 / 3)); //cube root
console.log(Math.max(5, 6, 4, 7, 8)); //8
console.log(Math.max(5, 6, 4, 7, '8')); //8
console.log(Math.max(5, 6, 4, 7, 'px')); //NAN

console.log(Math.min(5, 6, 4, 7)); //4

//constants
console.log(Math.PI * Number.parseFloat('10px') ** 2);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
console.log(randomInt(10, 20));

//Rounding Integers
console.log(Math.trunc(23.45)); //23

console.log(Math.round(23.8)); //24
//round up
console.log(Math.ceil(23.3)); //24
//round down
console.log(Math.floor(23.9)); //23
console.log(Math.floor('23.3')); //23
console.log(Math.floor(-23.3)); //-24

//Rounding floats
console.log((2.4).toFixed(0)); // string 2
console.log((2.4).toFixed(3)); // string 2.400
console.log((2.435).toFixed(2)); // string 2.44
console.log(+(2.435).toFixed(2)); //  2.44
*/
//////////////////////////////////////////////////////////////
//Numeric seperator
// const distance = 2323.3200302021;
// const price = 345_99;
// console.log(price); //345.99

// const transferFee = 15_00; //15.00
// const transferFee1 = 1_5_00; //1,500
//////////////////////////////////////////////////////////////
/*
//BigInt
// there are 64 bits numbers used in JS
//And only 53 bits are used to store numbers
console.log(2 ** 53 - 1); //9007199254740991 biggest number Js can represent
console.log(Number.MAX_SAFE_INTEGER); ////9007199254740991
console.log(2 ** 53 + 1); //9007199254740991

//the bigInt is used to store numbers as lagre as we want
console.log(23434434555456465653546435546546); //2.3434434555456467e+31

console.log(23434434555456465653546435546546n); //23434434555456465653546435546546n
console.log(BigInt(234344345554)); //234344345554n

//operations
console.log(10000n + 10000n); //20000
console.log(243255344534523542245n * 10000000000n);

let huge = 56726523456423652623465842368n;
let num = 23;
// console.log(huge * num); //TypeError: Cannot mix BigInt and other types, use explicit conversions
//to avoid this first convert the number to bigInt
console.log(huge * BigInt(num));

console.log(20n > 15); //true
console.log(20n === 20); //false
console.log(20n == 20); //true
*/
//////////////////////////////////////////////////////////////
/*
// create a Date
const now1 = new Date();
console.log(now1); //Wed Sep 20 2023 16:41:59 GMT+0530 (India Standard Time)
console.log(new Date('December 24, 2023'));
console.log(new Date(account1.movementsDates[0]));
//we can also pass in day, month,year,min,sec
console.log(new Date(2037, 10, 19, 15, 23, 5));

//we can also pass miliseconds since the bigening of unix time
console.log(new Date(0)); //Thu Jan 01 1970 05:30:00 GMT+0530 (India Standard Time)
console.log(new Date(3 * 24 * 60 * 60 * 1000)); //Sun Jan 04 1970 05:30:00 GMT+0530 (India Standard Time)

//working with Dates
const future = new Date(2037, 10, 19, 15, 23, 5);
console.log(future);
console.log(future.getFullYear()); //2037
console.log(future.getMonth()); //10 i.e 11th month
console.log(future.getDate()); //19
console.log(future.getDay()); //4
console.log(future.toISOString()); //2037-11-19T09:53:05.000Z
console.log(future.getTime()); //2142237185000 time stamp

console.log(new Date(2142237185000)); //Thu Nov 19 2037 15:23:05 GMT+0530 (India Standard Time)
console.log(Date.now()); //1695213198304 time stamp

future.setFullYear(2040);
console.log(future); //Mon Nov 19 2040 15:23:05 GMT+0530 (India Standard Time)
*/
/////////////////////////////////////////////////////////////
/*
//Operation with Dates
//we can perform calculation with dates
// we can add one date from another date and many more
//when we convert a date into a numbe the result will be time stamp in miliseconds
// with this timestamp we can perform calculations
const future = new Date(2037, 10, 19, 15, 23);
console.log(+future); //2142237180000
console.log(Number(future)); //2142237180000
//we can also convert this timestamp into dates

//lets create a function that takes two dates and return the number of days that pass between them
const daysPassed = (date1, date2) =>
  (Math.abs(date2) - Math.abs(date1)) / (1000 * 60 * 60 * 24);
const days1 = daysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
console.log(days1); //864000000 i.e 10 days
//now converting the timestamp into date by dividing the timestamp with /1000 * 60 * 60 * 24;
//1000 will convert miliseconds to seconds
//60 will convert seconds to minutes
//60 will convert minutes to hours
//24 will convert hours to a day
// to do more complex date calculation we can use moment dot.js library
*/
//////////////////////////////////////////////////////////////
// Internationalizing Numbers (Intl)
// const num = 2342342.34;
// const options = {
//   style: 'currency',
//   unit: 'mile-per-hour',
//   currency: 'INR',
// };
// //the navigator.language will the number format form the your browser
// console.log(new Intl.NumberFormat(navigator.language).format(num));
// console.log(new Intl.NumberFormat('en-GB', options).format(num));
//////////////////////////////////////////////////////////////
//Timers: setTimeout and setInterval
//setTimeout Timer : this timer will run only once after a defined time
//setInterval Timer : this timer will run forever, until we stop it

// setTimeout(function () {
//   console.log('here is yor pizza');
// }, 3000);
// console.log('waiting........');
//if we want to pass in arguments into the callback function
// then we can mentions the arguments after the time and then pass it into the callback funtion
// setTimeout(
//   function (ing1, ing2) {
//     console.log(`'here is your pizza' with ${ing1} and ${ing2}`);
//   },
//   3000,
//   'olives',
//   'tomato'
// );

// if we want to cancel the timeout function before it appers
// const ing = ['olives', 'tomatos'];
// const cancleTimeout = setTimeout(
//   function (ing1, ing2) {
//     console.log(`'here is your pizza' with ${ing1} and ${ing2}`);
//   },
//   3000,
//   ...ing
// );
// if (ing.includes('tomatos')) clearTimeout(cancleTimeout);

//SetTimeInterval********
//this will help the function to run over and over again with whatever time in seconds we want
//like every 5 sec or 10 sec

//lets create a clock
// setInterval(function () {
//   const now = new Date();
//   const hours = now.getHours();
//   const min = now.getMinutes();
//   const sec = now.getSeconds();
//   console.log(`${hours}:${min}:${sec}`);
// }, 1000);
//so every second a new date is created in the console

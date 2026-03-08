const display = document.querySelector(".display");
const numBtn = document.querySelectorAll(".number");
const opBtn = document.querySelectorAll("#operation");
let currentOperand = "";
let result = "";

function updateDisplay() {
  display.value = currentOperand;
}

function displayValue(value) {
  currentOperand += value;
  updateDisplay();
}

function appendDecimal(decimal) {
  const lastNumber = currentOperand.split(/[+\−\×\÷\-\*\/]/).pop();
  if (!lastNumber.includes(decimal)) {
    if (lastNumber === "") {
      currentOperand += "0" + decimal;
    } else {
      currentOperand += decimal;
    }
    updateDisplay();
  }
}

numBtn.forEach((num) => {
  num.addEventListener("click", numBtnFunc);
});
function numBtnFunc(event) {
    const output = event?.target?.value || event;
    const hasOperator = /[+\−\×\÷\-\*\/]/.test(currentOperand);
    if (result !== "" && hasOperator) {
      displayValue(output);
    } else if (result !== "") {
      result = "";
      currentOperand = "";
      displayValue(output);
    } else {
      displayValue(output);
    }
}

opBtn.forEach((op) => {
  op.addEventListener("click", opBtnFunc);
});
function opBtnFunc(event) {
  const output = event?.target?.value || event;

  if (currentOperand === "") return;

  const lastChar = currentOperand.slice(-1);
  const isLastCharOperator = /[+\−\×\÷\-\*\/]/.test(lastChar);
  if (isLastCharOperator) {
    currentOperand = currentOperand.slice(0, -1) + output;
    updateDisplay();
    return;
  }

  const hasOperator = /[+\−\×\÷\-\*\/]/.test(currentOperand);
  if (hasOperator) {
    operate();
  }

  displayValue(output);
}

function clearEntry() {
  currentOperand = "";
  result = "";
  updateDisplay();
}

function deleteLast() {
  currentOperand = currentOperand.toString();
  if (currentOperand == "Error: Division by zero") {
    currentOperand = "";
    result = "";
  }
  currentOperand = currentOperand.slice(0, -1);
  if (currentOperand.endsWith("0.")) {
    currentOperand = currentOperand.slice(0, -2);
  } else if (currentOperand.endsWith(".0")) {
    currentOperand = currentOperand.slice(0, -3);
  } else if (currentOperand.endsWith(".")) {
    currentOperand = currentOperand.slice(0, -1);
  }
  updateDisplay();
}

function percent() {
  if (currentOperand !== "") {
    currentOperand = parseFloat(currentOperand) / 100;
  }

  updateDisplay();
}

function operate() {
  let numbers = currentOperand.split(/[+\−\×\÷\-\*\/]/);
  if (currentOperand.includes("+")) {
    currentOperand = parseFloat(numbers[0]) + parseFloat(numbers[1]);
    result = currentOperand;
  } else if (currentOperand.includes("−" || currentOperand.includes("-"))) {
    currentOperand = parseFloat(numbers[0]) - parseFloat(numbers[1]);
    result = currentOperand;
  } else if (
    currentOperand.includes("×") ||
    currentOperand.includes("x") ||
    currentOperand.includes("*")
  ) {
    currentOperand = parseFloat(numbers[0]) * parseFloat(numbers[1]);
    result = currentOperand;
  } else if (currentOperand.includes("÷") || currentOperand.includes("/")) {
    if (parseFloat(numbers[1]) === 0) {
      currentOperand = "Error: Division by zero";
      result = currentOperand;
    } else {
      currentOperand = parseFloat(numbers[0]) / parseFloat(numbers[1]);
      result = currentOperand;
    }
  }
  updateDisplay();
}

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (!isNaN(key)) {
    event.preventDefault();
    numBtnFunc(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    event.preventDefault();
    opBtnFunc(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    operate();
  } else if (key === "." || key === ",") {
    event.preventDefault();
    appendDecimal(".");
  } else if (key === "Backspace") {
    event.preventDefault();
    deleteLast();
  } else if (key === "Escape" || key === "Delete") {
    event.preventDefault();
    clearEntry();
  }

  const button = document.querySelector(`button[data-key="${key}"]`);
  if (button) {
    button.classList.add("key-active");
    setTimeout(() => {
      button.classList.remove("key-active");
    }, 150);
  }
});

const screen = document.getElementById('scr');
const buttons = document.querySelectorAll('.button');

let currentInput = '';
let operator = '';
let firstOperand = '';
let isResultDisplayed = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (value === 'CLR') {
            clearCalculator();
        } else if (value === 'DEL') {
            deleteLastDigit();
        } else if (value === '=') {
            calculateResult();
        } else if (['+', '-', '*', '/'].includes(value)) {
            handleOperator(value);
        } else {
            handleNumberInput(value);
        }
        updateScreen();
    });
});

function clearCalculator() {
    currentInput = '';
    operator = '';
    firstOperand = '';
    isResultDisplayed = false;
}

function deleteLastDigit() {
    if (isResultDisplayed) return;
    currentInput = currentInput.slice(0, -1);
}

function calculateResult() {
    if (!currentInput || !firstOperand || !operator) {
        showError('Invalid operation');
        return;
    }
    const result = calculate(firstOperand, operator, currentInput);
    if (result === '') return;

    screen.value = `${firstOperand} ${operator} ${currentInput} = ${result}`;
    currentInput = result;
    operator = '';
    firstOperand = '';
    isResultDisplayed = true;
}

function handleOperator(value) {
    if (!currentInput) {
        showError('Enter a number first');
        return;
    }
    if (isResultDisplayed) {
        firstOperand = currentInput;
        currentInput = '';
        isResultDisplayed = false;
    } else {
        firstOperand = currentInput;
        currentInput = '';
    }
    operator = value;
}

function handleNumberInput(value) {
    if (isResultDisplayed) {
        clearCalculator();
    }
    if (value === '.' && currentInput.includes('.')) {
        showError('Invalid decimal point');
        return;
    }
    if (value === '.' && currentInput === '') {
        currentInput = '0.';
    } else {
        currentInput += value;
    }
}

function calculate(num1, op, num2) {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);

    if (op === '+') return (num1 + num2).toString();
    if (op === '-') return (num1 - num2).toString();
    if (op === '*') return (num1 * num2).toString();
    if (op === '/') {
        if (num2 === 0) {
            showError('Division by zero');
            return '';
        }
        return (num1 /

 num2).toString();
    }
    return '';
}

function updateScreen() {
    if (!isResultDisplayed) {
        screen.value = `${firstOperand} ${operator} ${currentInput}`.trim();
    }
}

function showError(message) {
    screen.value = message;
    setTimeout(() => {
        updateScreen();
    }, 2000);
}



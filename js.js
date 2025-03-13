const screen = document.getElementById('scr');
const buttons = document.querySelectorAll('.button');

if (!screen || buttons.length === 0) {
    console.error('عناصر الواجهة غير موجودة!');
} else {
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

        // تحسين التوافق مع قارئات الشاشة
        button.setAttribute('aria-label', button.textContent);
    });

    function clearCalculator() {
        currentInput = '';
        operator = '';
        firstOperand = '';
        isResultDisplayed = false;
        updateScreen();
    }

    function deleteLastDigit() {
        if (isResultDisplayed || !currentInput) return;
        currentInput = currentInput.slice(0, -1);
        updateScreen();
    }

    function calculateResult() {
        if (!firstOperand || !operator || !currentInput) {
            showError('عملية غير صالحة');
            return;
        }

        const result = calculate(parseFloat(firstOperand), operator, parseFloat(currentInput));
        if (result === null) return;

        screen.value = result;
        currentInput = result.toString();
        operator = '';
        firstOperand = '';
        isResultDisplayed = true;

        // تحديث وصف الشاشة لقارئات الشاشة
        screen.setAttribute('aria-label', `النتيجة هي ${result}`);
        speakResult(result);
    }

    function handleOperator(value) {
        if (!currentInput && !firstOperand) {
            showError('أدخل رقمًا أولًا');
            return;
        }

        if (isResultDisplayed) {
            firstOperand = currentInput;
            currentInput = '';
            isResultDisplayed = false;
        } else {
            if (firstOperand && operator && currentInput) {
                calculateResult();
                firstOperand = currentInput;
                currentInput = '';
            } else if (!firstOperand) {
               

 firstOperand = currentInput;
                currentInput = '';
            }
        }
        operator = value;

        // تحديث وصف الشاشة لقارئات الشاشة
        screen.setAttribute('aria-label', `تم اختيار العملية ${operator}`);
    }

    function handleNumberInput(value) {
        if (isResultDisplayed) {
            clearCalculator();
        }

        if (value === '.' && currentInput.includes('.')) {
            showError('نقطة عشرية غير صالحة');
            return;
        }

        if (value === '.' && currentInput === '') {
            currentInput = '0.';
        } else {
            currentInput += value;
        }

        // تحديث وصف الشاشة لقارئات الشاشة
        screen.setAttribute('aria-label', `الإدخال الحالي هو ${currentInput}`);
        updateScreen();
    }

    function updateScreen() {
        screen.value = currentInput || '0';
    }

    function calculate(a, op, b) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b !== 0 ? a / b : (showError('لا يمكن القسمة على صفر'), null);
            default: return null;
        }
    }

    function showError(message) {
        alert(message);
    }

    function speakResult(result) {
        const utterance = new SpeechSynthesisUtterance(`النتيجة هي ${result}`);
        speechSynthesis.speak(utterance);
    }
}



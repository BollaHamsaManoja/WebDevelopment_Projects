
const screen = document.getElementById("screen");
const history = document.getElementById("history");
const keypad = document.querySelector(".keypad");

let expression = "";
let justCalculated = false;

function updateDisplay() {
    screen.value = expression || "0";
}

function clearCalculator() {
    expression = "";
    history.textContent = "";
    justCalculated = false;
    updateDisplay();
}

function appendValue(value) {
    if (justCalculated) {
        if ("0123456789.".includes(value)) {
            expression = "";
        }
        justCalculated = false;
    }

    if ("+-*/".includes(value)) {
        if (!expression) {
            if (value !== "-") return;
        } else if (/[+\-*/]$/.test(expression)) {
            expression = expression.slice(0, -1);
        }
    }

    if (value === ".") {
        const currentNumber = expression.split(/[+\-*/]/).pop();
        if (currentNumber.includes(".")) return;
        if (!currentNumber || currentNumber.endsWith("%")) {
            expression += "0";
        }
    }

    expression += value;
    updateDisplay();
}

function deleteLast() {
    if (justCalculated) {
        clearCalculator();
        return;
    }

    expression = expression.slice(0, -1);
    updateDisplay();
}

function addPercent() {
    if (justCalculated) justCalculated = false;

    if (/\d$/.test(expression)) {
        expression += "%";
        updateDisplay();
    }
}

// Safely evaluate arithmetic expressions without eval().
function calculate(input) {
    const tokens = input.match(
        /(?:\d+\.?\d*|\.\d+)|[+\-*/%]/g
    );

    if (!tokens || tokens.join("") !== input) {
        throw new Error("Invalid expression");
    }

    let position = 0;

    function parseExpression() {
        let value = parseTerm();

        while (tokens[position] === "+" || tokens[position] === "-") {
            const operator = tokens[position++];
            const right = parseTerm();

            value = operator === "+"
                ? value + right
                : value - right;
        }

        return value;
    }

    function parseTerm() {
        let value = parseUnary();

        while (tokens[position] === "*" || tokens[position] === "/") {
            const operator = tokens[position++];
            const right = parseUnary();

            if (operator === "/" && right === 0) {
                throw new Error("Cannot divide by zero");
            }

            value = operator === "*"
                ? value * right
                : value / right;
        }

        return value;
    }

    function parseUnary() {
        if (tokens[position] === "+") {
            position++;
            return parseUnary();
        }

        if (tokens[position] === "-") {
            position++;
            return -parseUnary();
        }

        let value = parseNumber();

        while (tokens[position] === "%") {
            position++;
            value /= 100;
        }

        return value;
    }

    function parseNumber() {
        const token = tokens[position];

        if (!token || !/^(?:\d+\.?\d*|\.\d+)$/.test(token)) {
            throw new Error("Invalid expression");
        }

        position++;
        return Number(token);
    }

    const result = parseExpression();

    if (position !== tokens.length || !Number.isFinite(result)) {
        throw new Error("Invalid calculation");
    }

    return Number(result.toPrecision(12));
}

function showResult() {
    if (!expression) return;

    try {
        const original = expression;
        const result = calculate(expression);

        history.textContent = original + " =";
        expression = String(result);
        justCalculated = true;
        updateDisplay();
    } catch (error) {
        history.textContent = error.message;
        expression = "";
        justCalculated = false;
        updateDisplay();
    }
}

function changeSign() {
    if (!expression) {
        expression = "-";
        updateDisplay();
        return;
    }

    const match = expression.match(/(\d+\.?\d*|\.\d+)%?$/);

    if (!match) return;

    const start = match.index;
    const number = match[0];
    const before = expression.slice(0, start);

    if (before.endsWith("-") &&
        (before.length === 1 || /[+\-*/]$/.test(before.slice(0, -1)))) {
        expression = before.slice(0, -1) + number;
    } else {
        expression = before + "-" + number;
    }

    justCalculated = false;
    updateDisplay();
}

keypad.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.value !== undefined) {
        appendValue(button.dataset.value);
        return;
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;
        case "delete":
            deleteLast();
            break;
        case "percent":
            addPercent();
            break;
        case "decimal":
            appendValue(".");
            break;
        case "sign":
            changeSign();
            break;
        case "equals":
            showResult();
            break;
    }
});

document.addEventListener("keydown", function (event) {
    if (/^[0-9]$/.test(event.key)) {
        appendValue(event.key);
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        appendValue(event.key);
    } else if (event.key === ".") {
        appendValue(".");
    } else if (event.key === "%") {
        addPercent();
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        showResult();
    } else if (event.key === "Backspace") {
        deleteLast();
    } else if (event.key === "Escape") {
        clearCalculator();
    }
});

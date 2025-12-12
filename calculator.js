const display = document.getElementById('display');

function appendValue(value) {
    if (display.value === 'Error') display.value = '';
    display.value += value;
}

function clearDisplay() {
    display.value = '';
}

function deleteChar() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        const raw = display.value;
        if (!raw) return;
        
        const processed = preprocessPercent(raw);

        if (/[^0-9+\-*/().\s]/.test(processed)) throw new Error('Invalid characters');

        const result = Function('"use strict"; return (' + processed + ')')();
        display.value = String(result);
    }
        catch (err) {
        display.value = 'Error';
        console.error(err);
    }
}

function preprocessPercent(expression) {
    if (!expression) return '';

    let expr = expression.replace(/\s+/g, ''); 

    const pattern = /(-?\d+(\.\d+)?)([+\-*/])(-?\d+(\.\d+)?)%/;

    while (pattern.test(expr)) {
        expr = expr.replace(pattern, function(match, a, _adec, op, b) {
            if (op === '+' || op === '-') {
                return `${a}${op}(${a}*${b}/100)`;
            } else if (op === '*') {
                return `${a}*(${b}/100)`;
            } else if (op === '/') {
                return `${a}/(${b}/100)`;
            }
            return match; 
        });
    }

    expr = expr.replace(/(-?\d+(\.\d+)?)%/g, '($1/100)');

    return expr;
}
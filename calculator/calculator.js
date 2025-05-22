const input = document.getElementById('inputboxs');
const buttons = document.querySelectorAll('button');

let justEvaluated = false;

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.innerText;
        let cursorPos = input.selectionStart || 0;
        let currentValue = input.value || "";

        // ✅ Evaluate expression
        // ✅ Evaluate expression
   if (value === '=') {
    try {
        if (currentValue.trim() === "") {
            input.value = "0"; // Show 0 if input is empty
        } else {
            // Convert percentages like 10% of 200 to (200 * 10 / 100)
            let expr = currentValue.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
            
            // Handle cases like "200 + 10%" to mean "200 + (200 * 10 / 100)"
            expr = expr.replace(/(\d+(?:\.\d+)?)([+\-*/])\((\d+(?:\.\d+)?)\/100\)/g, (match, num1, operator, percent) => {
                return `${num1}${operator}(${num1}*${percent}/100)`;
            });

            input.value = eval(expr);
        }
    } catch {
        input.value = "Error";
    }
    justEvaluated = true;
    input.focus();
    return;
}


        // ✅ Clear all
        if (value === 'AC') {
            input.value = "";
            justEvaluated = false;
            input.focus();
            return;
        }

        // ✅ Delete one character before cursor
        if (value === 'DEL') {
            if (justEvaluated || currentValue === "") {
                input.value = "";
                setCursorPos(0);
            } else if (cursorPos > 0) {
                const updatedValue = currentValue.slice(0, cursorPos - 1) + currentValue.slice(cursorPos);
                input.value = updatedValue;
                setCursorPos(cursorPos - 1);
            }
            justEvaluated = false;
            input.focus();
            return;
        }

        // ✅ If '=' was just pressed and a number is clicked, start fresh
        const isNumberOrDot = /^[0-9.]$/.test(value);
        if (justEvaluated && isNumberOrDot) {
            currentValue = "";
            cursorPos = 0;
            input.value = "";
        }
        justEvaluated = false;

        // ✅ Handle initial zero and append at cursor
        if (currentValue === "0" && isNumberOrDot && value !== ".") {
            input.value = value;
            setCursorPos(1);
        } else {
            input.value = currentValue.slice(0, cursorPos) + value + currentValue.slice(cursorPos);
            setCursorPos(cursorPos + value.length);
        }

        input.focus();
    });
});

// ✅ Helper to set cursor position safely
function setCursorPos(pos) {
    setTimeout(() => {
        input.setSelectionRange(pos, pos);
    }, 0);
}

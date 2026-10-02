/**
 * 简易计算器：只用原生 JS，全部逻辑写在本文件里。
 * 不引框架、不拆文件、不装依赖。
 */

// 页面骨架（种子已就绪，别改名）
const displayMain = document.getElementById('display-main');
const displaySub = document.getElementById('display-sub');
const keyboard = document.getElementById('keyboard');

// 新增：获取历史记录列表容器
const historyList = document.getElementById('history-list');

/**
 * 加法：把两个数相加。
 * @param {number} a 加数
 * @param {number} b 被加数
 * @returns {number} 两数之和
 */
function add(a, b) {
    return a + b;
}

// =========================================
// 计算器核心逻辑
// =========================================
let currentInput = '0';
let previousInput = null;
let currentOperator = null;
let shouldResetDisplay = false;

function updateDisplay() {
    displayMain.textContent = currentInput;
    if (currentOperator && previousInput !== null) {
        displaySub.textContent = `${previousInput} ${currentOperator}`;
    } else {
        displaySub.textContent = '';
    }
}

function calculate() {
    if (previousInput === null || currentOperator === null) return;

    const a = parseFloat(previousInput);
    const b = parseFloat(currentInput);
    let result = 0;

    switch (currentOperator) {
        case '+': result = add(a, b); break;
        case '-': result = a - b; break;
        case '×': result = a * b; break;
        case '÷': result = b === 0 ? 'Error' : a / b; break;
    }

    // 生成并记录历史
    const expression = `${previousInput} ${currentOperator} ${currentInput} = ${result}`;
    addHistoryRecord(expression);

    currentInput = String(result);
    previousInput = null;
    currentOperator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// 新增：添加历史记录到面板
function addHistoryRecord(text) {
    if (!historyList) return;

    const li = document.createElement('li');
    li.textContent = text;
    // 注意：这里删掉了 li.style 的代码，把样式写进 CSS 里了
    historyList.appendChild(li);

    // 自动滚动到底部
    historyList.scrollTop = historyList.scrollHeight;
}

// =========================================
// 键盘事件绑定
// =========================================
const buttons = ['7','8','9','÷','4','5','6','×','1','2','3','-','0','.','=','+'];

buttons.forEach(btnText => {
    const btn = document.createElement('button');
    btn.textContent = btnText;
    btn.className = 'key';
    if (btnText === '=') btn.classList.add('key--success');

    btn.addEventListener('click', () => {
        if (btnText >= '0' && btnText <= '9') {
            if (shouldResetDisplay || currentInput === '0') {
                currentInput = btnText;
                shouldResetDisplay = false;
            } else {
                currentInput += btnText;
            }
        } else if (btnText === '.') {
            if (!currentInput.includes('.')) currentInput += '.';
        } else if (['+', '-', '×', '÷'].includes(btnText)) {
            if (currentOperator !== null) calculate();
            previousInput = currentInput;
            currentOperator = btnText;
            shouldResetDisplay = true;
        } else if (btnText === '=') {
            calculate();
        }
        updateDisplay();
    });

    // 安全的 append 方式，防止页面没有 keyboard 节点时报错
    if (keyboard) {
        keyboard.appendChild(btn);
    }
});

// 初始化
updateDisplay();

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
 */
function add(a, b) {
    return a + b;
}

// =========================================
// 计算器核心逻辑（补全基础按键，方便测试）
// =========================================

let currentInput = '0';      // 当前显示的数字
let previousInput = null;    // 上一个数字
let currentOperator = null;  // 当前的运算符
let shouldResetDisplay = false; // 是否在下一次输入时清空显示

// 更新显示区
function updateDisplay() {
    displayMain.textContent = currentInput;
    if (currentOperator && previousInput !== null) {
        displaySub.textContent = `${previousInput} ${currentOperator}`;
    } else {
        displaySub.textContent = '';
    }
}

// 执行计算
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

    // 生成历史记录 (上一轮操作 + 结果)
    const expression = `${previousInput} ${currentOperator} ${currentInput} = ${result}`;
    addHistoryRecord(expression);

    // 更新当前状态
    currentInput = String(result);
    previousInput = null;
    currentOperator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// 新增：添加历史记录到面板
function addHistoryRecord(text) {
    if (!historyList) return; // 防止找不到元素报错

    const li = document.createElement('li');
    li.textContent = text;
    // 简单加点内联样式保证不挤在一起
    li.style.padding = '4px 0';
    li.style.borderBottom = '1px solid #333';

    historyList.appendChild(li);

    // 每次添加后自动滚动到底部，符合用户习惯
    historyList.scrollTop = historyList.scrollHeight;
}

// =========================================
// 键盘事件绑定 (为了让你能测试，我快速把键盘渲染出来)
// =========================================

const buttons = [
    '7', '8', '9', '÷',
    '4', '5', '6', '×',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
];

buttons.forEach(btnText => {
    const btn = document.createElement('button');
    btn.textContent = btnText;
    btn.className = 'key';
    // 给等号加个特殊颜色
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

    keyboard.appendChild(btn);
});

// 初始化
updateDisplay();

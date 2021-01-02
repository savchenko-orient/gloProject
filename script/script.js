'use strict';
const isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

let start = document.getElementById('start'),
 incomePlus = document.getElementsByTagName('button')[0],
 expensesPlus = document.getElementsByTagName('button')[1],
 depositCheck = document.querySelector('#deposit-check'),
 additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
 resultBudgetMonth = document.getElementsByClassName('budget_month-value')[0],
 resultBudgetDay = document.getElementsByClassName('budget_day-value')[0],
 resultExpensesMonth = document.getElementsByClassName('expenses_month-value')[0],
 resultAdditionalncome = document.getElementsByClassName('additional_income-value')[0],
 additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
 resultlncomePeriod = document.getElementsByClassName('income_period-value')[0],
 resultTargetMonth = document.getElementsByClassName('target_month-value')[0],
 salaryAmount = document.getElementsByClassName('salary-amount')[0],
 expensesItemTitle = document.getElementsByClassName('expenses-item-title')[0],
 expensesItems = document.querySelectorAll('.expenses-items'),
 additionalExpensesItem = document.getElementsByClassName('additional_expenses-item')[0],
 depositAmount = document.getElementsByClassName('deposit-amount')[0],
 depositPercent = document.getElementsByClassName('deposit-percent')[0],
 targetAmount = document.getElementsByClassName('target-amount')[0],
 periodSelect = document.getElementsByClassName('period-select')[0],
 incomeItems = document.querySelectorAll('.income-items'),
 periodAmount = document.querySelector('.period-amount');
 
 let cansel = start.cloneNode(true);
 cansel.innerText = 'Сбросить';

const AppData = function () {
    this.budget= 0;
    this.budgetDay= 0;
    this.budgetMonth= 0;
    this.income= {};
    this.incomeMonth= 0;
    this.addIncome= [];
    this.expenses= {};
    this.addExpenses= [];
    this.expensesMonth= 0;
    this.deposit= false;
    this.parcentDeposit= 0;
    this.moneyDeposit= 0;
    this.period= 0;
};

AppData.prototype.start = function () {
    this.budget = +salaryAmount.value;
    this.getExpenses();
    this.getIncome();
    this.getExpensesMonth();
    this.getAddExpenses();
    this.getAddIncome();
    this.getBudget();
    this.showResult();
    this.blocked();
};

AppData.prototype.showResult = function () {
    const _this = this;
    resultBudgetMonth.value = this.budgetMonth;
    resultBudgetDay.value = this.budgetDay;
    resultExpensesMonth.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    resultAdditionalncome.value = this.addIncome.join(', ');
    resultTargetMonth.value = Math.ceil(this.getTargetMonth());
    resultlncomePeriod.value = this.calcPeriod();
    periodSelect.addEventListener('input', function () {
        resultlncomePeriod.value = _this.budgetMonth * periodAmount.innerText;
    });
};
AppData.prototype.addIncomeBlock = function () {
    let cloneIncomeItems = incomeItems[0].cloneNode(true);
    incomeItems[0].parentNode.insertBefore(cloneIncomeItems, incomePlus);
    incomeItems = document.querySelectorAll('.income-items');
    if (incomeItems.length === 3) {
        incomePlus.style.display = 'none';
    }
};
AppData.prototype.addExpensesBlock = function () {
    let cloneExpensesItem = expensesItems[0].cloneNode(true);
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
    expensesItems = document.querySelectorAll('.expenses-items');
    if(expensesItems.length === 3) {
        expensesPlus.style.display = 'none';
    }
};
AppData.prototype.getExpenses = function () {
    const _this = this;
    expensesItems.forEach(function (item) {
        let itemExpenses = item.querySelector('.expenses-item-title').value,
            cashExpenses = item.querySelector('.expenses-amount').value;
        if (itemExpenses !== '' && cashExpenses !== '') {
            _this.expenses[itemExpenses] = +cashExpenses;
        }
    });
};
AppData.prototype.getIncome = function () {
    const _this = this;
    incomeItems.forEach(function (item) {
        let itemIncome = item.querySelector('.income-item-title').value,
            cashIncome = item.querySelector('.income-amount').value;
        if (itemIncome !== '' && cashIncome !== '') {
            _this.income[itemIncome] = +cashIncome;
        }
    });
    for (let key in this.income) {
        _this.incomeMonth += +_this.income[key];
    }
};
AppData.prototype.getAddExpenses = function () {
    const _this = this;
    let addExpenses = additionalExpensesItem.value.split(', ');
    addExpenses.forEach(function (item) {
        item = item.trim();
        if (item !== '') {
            _this.addExpenses.push(item);
        }
    });
};
AppData.prototype.getAddIncome = function () {
    const _this = this;
    additionalIncomeItem.forEach(function (item) {
        let itemValue = item.value.trim();
        if (itemValue !== '') {
    _this.addIncome.push(itemValue);
        }
    });
};
AppData.prototype.getExpensesMonth = function () {
    for (let key in this.expenses) {
        this.expensesMonth += this.expenses[key];
    }
};
AppData.prototype.getBudget = function () {
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
};
AppData.prototype.getTargetMonth = function () {
    return targetAmount.value / this.budgetMonth;
};
AppData.prototype.getStatusIncome= function () {
    if (this.budgetDay <= 300) {
        console.log('К сожалению у вас уровень дохода ниже среднего!');
    } else if (this.budgetDay <= 800) {
        console.log('У вас средний уровень дохода!');
    } else if(this.budgetDay >= 1200) {
        console.log('У вас высокий уровень дохода!');
    }
};
AppData.prototype.getInfoDeposit = function () {
    if (this.deposit) {
        this.parcentDeposit = +prompt('Какой годовой процент?', 10);
        while (!isNumber(this.parcentDeposit)) {
            this.parcentDeposit = +prompt('Какой годовой процент?', 10);
        }
        this.moneyDeposit = +prompt('Какая сумма заложена?', 10000);
        while (!isNumber(this.moneyDeposit)) {
            this.moneyDeposit = +prompt('Какая сумма заложена?', 10000);
        }
    }
};
AppData.prototype.calcPeriod = function () {
    return this.budgetMonth * periodSelect.value;
};
AppData.prototype.changePeriodValue = function () {
    periodAmount.innerText = periodSelect.value;
};
AppData.prototype.reset = function () {
    let dataInput = document.querySelectorAll('.data input'),
        resultInput = document.querySelectorAll('.result input');
        
    dataInput.forEach(function (item) {
        item.disabled = false;
        item.value = '';
        periodSelect.value = '0';
        periodAmount.innerHTML = periodSelect.value;
    });
    resultInput.forEach(function (item) {
        item.value = '';
    });
    for (let i = 1; i < incomeItems.length; i++) {
        incomeItems[i].parentNode.removeChild(incomeItems[i]);
        incomePlus.style.display = 'block';
    }
};

AppData.prototype.blocked = function () {
    const _this = this;
    document.querySelectorAll('.data input').forEach(function (item) {
            item.disabled = true;
     });
    start.style.display = 'none';
    start.parentNode.insertBefore(cansel, start);
    cansel.addEventListener('click', function () {
        document.querySelectorAll('.data input').forEach(function (item) {
            item.disabled = false;
            item.value = '';
            cansel.style.display = 'none';
            start.style.display = 'inline-block';
        });
        document.querySelectorAll('.result input').forEach(function (item) {
            item.value = '';
        });
        _this.reset();
    });
        
};

const appData = new AppData();

const EventListeners = function () {
    incomePlus.addEventListener('click', AppData.prototype.addIncomeBlock);
    expensesPlus.addEventListener('click', AppData.prototype.addExpensesBlock);
    periodSelect.addEventListener('input', AppData.prototype.changePeriodValue);
};

EventListeners.prototype.start = AppData.prototype.start.addEventListener('click', function () {
    if (salaryAmount.value.trim() !== '') {
        console.log(this);
        appData.start(); 
    } 
});

const eventListeners = new EventListeners();

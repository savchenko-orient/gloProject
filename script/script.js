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

const appData = {
    budget: 0,
    budgetDay: 0,
    budgetMonth: 0,
    income: {},
    incomeMonth: 0,
    addIncome: [],
    expenses: {},
    addExpenses: [],
    expensesMonth: 0,
    deposit: false,
    parcentDeposit: 0,
    moneyDeposit: 0,
    period: 3,
    start: function () {
        this.budget = +salaryAmount.value;
        
        this.getExpenses();
        this.getIncome();
        this.getExpensesMonth();
        this.getAddExpenses();
        this.getAddIncome();
        this.getBudget();
        this.showResult();

        this.blocked();
        
    },
    blocked: function () {
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
        });
        
    },

    showResult: function () {
        resultBudgetMonth.value = this.budgetMonth;
        resultBudgetDay.value = this.budgetDay;
        resultExpensesMonth.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        resultAdditionalncome.value = this.addIncome.join(', ');
        resultTargetMonth.value = Math.ceil(this.getTargetMonth());
        resultlncomePeriod.value = this.calcPeriod();
        periodSelect.addEventListener('input', function () {
            resultlncomePeriod.value = appData.budgetMonth * periodAmount.innerText;
        });
        
        
    },
    addIncomeBlock: function () {
        let cloneIncomeItems = incomeItems[0].cloneNode(true);
        incomeItems[0].parentNode.insertBefore(cloneIncomeItems, incomePlus);
        incomeItems = document.querySelectorAll('.income-items');
        if (incomeItems.length === 3) {
            incomePlus.style.display = 'none';
        }
    },
    addExpensesBlock: function () {
        let cloneExpensesItem = expensesItems[0].cloneNode(true);
        expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
        expensesItems = document.querySelectorAll('.expenses-items');
        if(expensesItems.length === 3) {
            expensesPlus.style.display = 'none';
        }
    },
    getExpenses: function () {
        expensesItems.forEach(function (item) {
            let itemExpenses = item.querySelector('.expenses-item-title').value,
                cashExpenses = item.querySelector('.expenses-amount').value;
            if (itemExpenses !== '' && cashExpenses !== '') {
                appData.expenses[itemExpenses] = +cashExpenses;
            }
        });
    },
    getIncome: function () {
        incomeItems.forEach(function (item) {
            let itemIncome = item.querySelector('.income-item-title').value,
                cashIncome = item.querySelector('.income-amount').value;
            if (itemIncome !== '' && cashIncome !== '') {
                appData.income[itemIncome] = +cashIncome;
            }
        });
        
        for (let key in appData.income) {
            appData.incomeMonth += +appData.income[key];
        }
    },
    getAddExpenses: function () {
        let addExpenses = additionalExpensesItem.value.split(', ');
        addExpenses.forEach(function (item) {
            item = item.trim();
            if (item !== '') {
                appData.addExpenses.push(item);
            }
        });
    },
    getAddIncome: function () {
        additionalIncomeItem.forEach(function (item) {
            let itemValue = item.value.trim();
            if (itemValue !== '') {
                appData.addIncome.push(itemValue);
            }
        });
    },
    
    getExpensesMonth: function () {
        for (let key in appData.expenses) {
            appData.expensesMonth += appData.expenses[key];
        }
    },
    getBudget: function () {
        appData.budgetMonth = appData.budget +appData.incomeMonth - appData.expensesMonth;
        appData.budgetDay = Math.floor(appData.budgetMonth / 30);
    },
    
    getTargetMonth: function () {
        return  targetAmount.value / appData.budgetMonth; 
    },

    getStatusIncome: function () {
    if (appData.budgetDay <= 300) {
        console.log('К сожалению у вас уровень дохода ниже среднего!');
    } else if (appData.budgetDay <= 800) {
        console.log('У вас средний уровень дохода!');
    } else if(appData.budgetDay >= 1200) {
        console.log('У вас высокий уровень дохода!');
        }
    },
    getInfoDeposit: function () {
        if (appData.deposit) {
            appData.parcentDeposit = +prompt('Какой годовой процент?', 10);
            while (!isNumber(appData.parcentDeposit)) {
                appData.parcentDeposit = +prompt('Какой годовой процент?', 10);  
            }
            appData.moneyDeposit = +prompt('Какая сумма заложена?', 10000);
            while (!isNumber(appData.moneyDeposit)) {
                appData.moneyDeposit = +prompt('Какая сумма заложена?', 10000);
            }
        }
    },
    calcPeriod: function () {
        return appData.budgetMonth * periodSelect.value;
    },

    changePeriodValue: function () {
       periodAmount.innerText = periodSelect.value; 
    }
}; 

start.addEventListener('click', function () {
    if (salaryAmount.value.trim() !== '') {
        appData.start(); 
    } 
});
incomePlus.addEventListener('click', appData.addIncomeBlock);
expensesPlus.addEventListener('click', appData.addExpensesBlock);
periodSelect.addEventListener('input', appData.changePeriodValue);

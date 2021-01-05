'use strict';
const isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

const start = document.getElementById('start'),
    cansel = document.getElementById('cancel'),
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
 additionalExpensesItem = document.getElementsByClassName('additional_expenses-item')[0],
 depositAmount = document.getElementsByClassName('deposit-amount')[0],
 depositPercent = document.getElementsByClassName('deposit-percent')[0],
 targetAmount = document.getElementsByClassName('target-amount')[0],
 periodSelect = document.getElementsByClassName('period-select')[0],
 periodAmount = document.querySelector('.period-amount');
 
let incomeItems = document.querySelectorAll('.income-items'),
    expensesItems = document.querySelectorAll('.expenses-items');

class AppData {
    constructor() {
        this.budget = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.income = {};
        this.incomeMonth = 0;
        this.addIncome = [];
        this.expenses = {};
        this.addExpenses = [];
        this.expensesMonth = 0;
        this.deposit = false;
        this.parcentDeposit = 0;
        this.moneyDeposit = 0;
        this.period = 0;
    }

    start() {
        salaryAmount.value = salaryAmount.value.trim();
        if (!isNumber(salaryAmount.value)) {
            alert('Введите месячный доход');
            return;
        }
        expensesPlus.setAttribute('disabled', 'true');
        incomePlus.setAttribute('disabled', 'true');

        this.budget = +salaryAmount.value;
        this.getExpenses();
        this.getIncome();
        this.getExpensesMonth();
        this.getAddExpenses();
        this.getAddIncome();
        this.getBudget();
        this.showResult();
        this.blocked();
    
    }

    showResult() {
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
    }

    addIncomeBlock() {
        const cloneIncomeItems = incomeItems[0].cloneNode(true);
        incomeItems[0].parentNode.insertBefore(cloneIncomeItems, incomePlus);
        incomeItems = document.querySelectorAll('.income-items');
        if (incomeItems.length === 3) {
            incomePlus.style.display = 'none';
        }
    }

    addExpensesBlock() {
        const cloneExpensesItem = expensesItems[0].cloneNode(true);
        expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
        expensesItems = document.querySelectorAll('.expenses-items');
        if(expensesItems.length === 3) {
            expensesPlus.style.display = 'none';
        }   
    }

    getExpenses() {
        const _this = this;
        expensesItems.forEach( item => {
            const itemExpenses = item.querySelector('.expenses-item-title').value,
                cashExpenses = item.querySelector('.expenses-amount').value;
            if (itemExpenses !== '' && cashExpenses !== '') {
                _this.expenses[itemExpenses] = +cashExpenses;
            }
        });
    }

    getIncome() {
        const _this = this;
        incomeItems.forEach( item => {
            const itemIncome = item.querySelector('.income-item-title').value,
                cashIncome = item.querySelector('.income-amount').value;
            if (itemIncome !== '' && cashIncome !== '') {
                _this.income[itemIncome] = +cashIncome;
            }
        });
        for (let key in this.income) {
            _this.incomeMonth += +_this.income[key];
        }
    }

    getAddExpenses() {
        const _this = this;
        const addExpenses = additionalExpensesItem.value.split(',');
        addExpenses.forEach( item => {
            item = item.trim();
            if (item !== '') {
                _this.addExpenses.push(item);
            }
        });
    }

    getAddIncome() {
        const _this = this;
        additionalIncomeItem.forEach( item => {
            let itemValue = item.value.trim();
            if (itemValue !== '') {
                _this.addIncome.push(itemValue);
            }
        }); 
    }

    getExpensesMonth() {
        for (let key in this.expenses) {
            this.expensesMonth += this.expenses[key];
        } 
    }

    getBudget() {
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
        this.budgetDay = Math.floor(this.budgetMonth / 30);
    }

    getTargetMonth() {
        return targetAmount.value / this.budgetMonth;
    }

    getStatusIncome() {
        if (this.budgetDay <= 300) {
            console.log('К сожалению у вас уровень дохода ниже среднего!');
        } else if (this.budgetDay <= 800) {
            console.log('У вас средний уровень дохода!');
        } else if(this.budgetDay >= 1200) {
            console.log('У вас высокий уровень дохода!');
        }
    }

    getInfoDeposit() {
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
    }

    calcPeriod() {
        return this.budgetMonth * periodSelect.value;
    }

    changePeriodValue() {
        periodAmount.innerText = periodSelect.value;
    }

    reset() {
        const dataInput = document.querySelectorAll('.data input'),
            resultInput = document.querySelectorAll('.result input');
        dataInput.forEach( item =>{
            item.disabled = false;
            item.value = '';
            periodSelect.value = '0';
            periodAmount.innerHTML = periodSelect.value;
        });
        resultInput.forEach( item => {
            item.value = '';
        });
        for (let i = 1; i < incomeItems.length; i++){
            incomeItems[i].parentNode.removeChild(incomeItems[i]);
            incomePlus.style.display = 'block';
        }
        for (let i = 1; i < expensesItems.length; i++){
            expensesItems[i].parentNode.removeChild(expensesItems[i]);
            expensesPlus.style.display = 'block';
        }
        this.budget= 0;
        this.budgetDay= 0;
        this.budgetMonth= 0;
        this.income={};
        this.incomeMonth= 0;
        this.addIncome=[];
        this.expenses={};
        this.addExpenses=[];
        this.expensesMonth= 0;
        this.deposit= false;
        this.parcentDeposit= 0;
        this.moneyDeposit= 0;
        this.period = 0;
    }

    blocked() {
        const _this = this;
        document.querySelectorAll('.data input[type=text]').forEach( item => {
            item.disabled = true;
        });
        start.style.display = 'none';
        cansel.style.display = 'block';

        cansel.addEventListener('click', function () {
            document.querySelectorAll('.data input[type=text]').forEach( item => {
                item.disabled = false;
                item.value = '';
                cansel.style.display = 'none';
                start.style.display = 'inline-block';
                _this.reset();
            });
            document.querySelectorAll('.result input').forEach( item => {
                item.value = ''; 
            });
        });

        
    }

    eventListeners() {
        start.addEventListener('click', this.start.bind(this));
        incomePlus.addEventListener('click', this.addIncomeBlock);
        expensesPlus.addEventListener('click', this.addExpensesBlock);
        periodSelect.addEventListener('input', this.changePeriodValue);
        cansel.addEventListener('click', this.reset);
    }
}


const appData = new AppData();
appData.eventListeners();
console.log(document.querySelectorAll('.data input[type=text]'));





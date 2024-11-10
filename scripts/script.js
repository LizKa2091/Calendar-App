const table = document.querySelector('tbody');
const nextMonthButton = document.querySelector('.next-month');
const previousMonthButton = document.querySelector('.prev-month');
const monthDisplayer = document.querySelector('.month-heading');
const mainContent = document.querySelector('main-content');
const body = document.querySelector('body');
const returnMonthButton = document.querySelector('.return-to-today-month');

const listOfMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const countRows = (month) => {
    let lastDayOfMonth = getDaysOfMonth(month);
    let newLastDayDate = new Date(`2024-${month}-${lastDayOfMonth}`);
    let newFirstDayDate = new Date(`2024-${month}-01`);
    let firstDayName = newFirstDayDate.getDay() === 0 ? 7 : newFirstDayDate.getDay();
    let lastDayName = newLastDayDate.getDay() === 0 ? 7 : newLastDayDate.getDay();
    let firstWeekDays = 7-firstDayName+1;
    let lastWeekDays = 7-lastDayName;

    totalRows = (lastDayOfMonth-(7-firstDayName+1)-(7-lastDayName+1)) / 7;
    if (totalRows % 7 !== 0) {
        totalRows = (lastDayOfMonth-(7-firstDayName+1)-(lastDayName)) / 7;
        lastWeekDays = lastDayName;
    }

    return [firstWeekDays, lastWeekDays, lastDayOfMonth];
};

const getDaysOfMonth = (month) => {
    //month передаётся в виде обычного числа без 0 в начале
    let days = 31;

    if (month < 10) month = `0${month}`;
    while (true) {
        let newDate = new Date(`2024-${month}-${days}`);
        let calcMonth = newDate.getMonth()+1<10 ? `0${newDate.getMonth()+1}` : newDate.getMonth()+1;
        if (calcMonth == month) return days;
        else if (days < 28) throw new Error('something went wrong with months');
        else days--;
    }
};

const buildTable = (month) => {
    let [firstWeekDays, lastWeekDays, lastDayOfMonth] = countRows(month);
    let emptyFirstDays = 7 - firstWeekDays;
    let emptyLastDays = 7 - lastWeekDays;
    let allCalendarDays = [];
    
    if (month == monthSafe && year == yearSafe) returnMonthButton.style.display = 'none';
    else returnMonthButton.style.display = 'block';

    monthDisplayer.textContent = `${year}, ${listOfMonths[month-1]}`;

    for (let i = 0; i < emptyFirstDays; i++) {
        allCalendarDays.push(null);
    }
    
    for (let j = 1; j <= lastDayOfMonth; j++) {
        allCalendarDays.push(j);
    }
    
    for (let i = 0; i < emptyLastDays; i++) {
        allCalendarDays.push(null);
    }

    let currentRow = 0;
    let todayDay;
    table.innerHTML += `<tr class='table-row'></tr>`;

    for (let i=0; i<allCalendarDays.length; i++) {
        let allTableRows = document.querySelectorAll('.table-row');

        if (i === todaySafe && month == monthSafe && year == yearSafe) todayDay = i;

        if (allCalendarDays[i] === null) {
            allTableRows[currentRow].innerHTML += `<td class='empty-table-cell'>X</td>`; 
        }
        else {
            allTableRows[currentRow].innerHTML += `<td><a href="">${allCalendarDays[i]}</a></td>`;
        }
        
        if ((i + 1) % 7 === 0 && i !== allCalendarDays.length - 1) {
            currentRow++;
            table.innerHTML += "<tr class='table-row'></tr>";
        }
    }
    document.querySelectorAll('td')[todayDay+emptyFirstDays-1]?.classList.add('today-day');

    return allCalendarDays;
};

const prevMonth = () => {
    resetTable();
    month = +month-1;
    if (month === 0) {
        year= (+year-1).toString();
        month = 12;
    }
    buildTable(month);
    monthDisplayer.textContent = `${year}, ${listOfMonths[month-1]}`;
};

const nextMonth = () => {
    resetTable();
    month = +month+1;
    if (month === 13) {
        year = (+year+1).toString();
        month = 1;
    }
    buildTable(month);
    monthDisplayer.textContent = `${year}, ${listOfMonths[month-1]}`;
};

const resetTable = () => {
    table.innerHTML = `
        <tr>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday😱</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
            <th>Sunday</th>
        </tr>
    `;
};

const dateNow = new Date();
const monthSafe = (dateNow.getMonth()+1).toString();
const yearSafe = (dateNow.getFullYear()).toString();
const todaySafe = dateNow.getDate();
let month = monthSafe;
let year = yearSafe;

document.addEventListener('DOMContentLoaded', ()=>buildTable(month));
previousMonthButton.addEventListener('click', ()=>prevMonth());
nextMonthButton.addEventListener('click', ()=>nextMonth());
returnMonthButton.addEventListener('click', ()=>{
    month = monthSafe;
    year = yearSafe;
    resetTable();
    buildTable(month);
});
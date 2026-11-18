// ==========================================
// LOGIN PROTECTION
// ==========================================

const loggedInUser =
    JSON.parse(
        localStorage.getItem("loggedInUser")
    );

if (!loggedInUser) {

    window.location.href =
        "login.html";
}


// ==========================================
// DOM ELEMENTS
// ==========================================

const form =
    document.getElementById("expenseForm");

const description =
    document.getElementById("description");

const amount =
    document.getElementById("amount");

const type =
    document.getElementById("type");

const category =
    document.getElementById("category");

const date =
    document.getElementById("date");

const transactionList =
    document.getElementById("transactionList");

const balance =
    document.getElementById("balance");

const income =
    document.getElementById("income");

const expense =
    document.getElementById("expense");

const search =
    document.getElementById("search");

const filterType =
    document.getElementById("filterType");

const monthFilter =
    document.getElementById("monthFilter");

const themeBtn =
    document.getElementById("themeBtn");

const exportBtn =
    document.getElementById("exportBtn");

const clearAllBtn =
    document.getElementById("clearAllBtn");

const welcomeMessage =
    document.getElementById("welcomeMessage");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// USER
// ==========================================

if (
    loggedInUser &&
    welcomeMessage
) {

    welcomeMessage.textContent =
        `Welcome back, ${loggedInUser.name} 👋`;

}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "loggedInUser"
            );

            window.location.href =
                "login.html";

        }
    );

}


// ==========================================
// TRANSACTIONS
// ==========================================

const transactionStorageKey =
    "transactions_" + loggedInUser.email;

let transactions =
    JSON.parse(
        localStorage.getItem(transactionStorageKey)
    ) || [];

// ==========================================
// EDITING
// ==========================================

let editingId = null;


// ==========================================
// CHARTS
// ==========================================

let incomeExpenseChart = null;

let categoryChart = null;


// ==========================================
// TODAY
// ==========================================

function getToday() {

    const today =
        new Date();

    return today
        .toISOString()
        .split("T")[0];
}

date.value = getToday();


// ==========================================
// FORMAT MONEY
// ==========================================

function formatMoney(value) {

    return Number(value).toLocaleString(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ==========================================
// SAVE
// ==========================================

function saveTransactions() {

    localStorage.setItem(
        transactionStorageKey,
        JSON.stringify(transactions)
    );

}


// ==========================================
// MONTH OPTIONS
// ==========================================

function updateMonthOptions() {

    const currentValue =
        monthFilter.value;

    const months = [
        ...new Set(
            transactions
                .map(transaction =>
                    transaction.date.substring(0, 7)
                )
        )
    ].sort().reverse();


    monthFilter.innerHTML =
        `<option value="all">
            All Months
        </option>`;


    months.forEach(month => {

        const option =
            document.createElement("option");

        option.value = month;

        const [year, monthNumber] =
            month.split("-");

        const monthName =
            new Date(
                year,
                monthNumber - 1
            ).toLocaleString(
                "en-IN",
                {
                    month: "long"
                }
            );

        option.textContent =
            `${monthName} ${year}`;

        monthFilter.appendChild(
            option
        );

    });


    if (
        months.includes(currentValue)
    ) {

        monthFilter.value =
            currentValue;

    } else {

        monthFilter.value =
            "all";

    }

}


// ==========================================
// MONTH TRANSACTIONS
// ==========================================

function getMonthTransactions() {

    const selectedMonth =
        monthFilter.value;


    if (
        selectedMonth === "all"
    ) {

        return transactions;

    }


    return transactions.filter(
        transaction =>
            transaction.date.startsWith(
                selectedMonth
            )
    );

}


// ==========================================
// VISIBLE TRANSACTIONS
// ==========================================

function getVisibleTransactions() {

    let result =
        getMonthTransactions();


    const searchText =
        search.value
            .toLowerCase()
            .trim();


    const selectedType =
        filterType.value;


    if (searchText) {

        result =
            result.filter(
                transaction =>
                    transaction.description
                        .toLowerCase()
                        .includes(searchText) ||

                    transaction.category
                        .toLowerCase()
                        .includes(searchText)
            );

    }


    if (
        selectedType !== "all"
    ) {

        result =
            result.filter(
                transaction =>
                    transaction.type ===
                    selectedType
            );

    }


    return result;

}


// ==========================================
// ADD / UPDATE
// ==========================================

form.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const transactionData = {

            description:
                description.value.trim(),

            amount:
                Number(amount.value),

            type:
                type.value,

            category:
                category.value,

            date:
                date.value

        };


        if (
            !transactionData.description ||
            !transactionData.amount ||
            !transactionData.date
        ) {

            return;

        }


        // UPDATE

        if (editingId !== null) {

            const index =
                transactions.findIndex(
                    transaction =>
                        transaction.id ===
                        editingId
                );


            if (index !== -1) {

                transactions[index] = {

                    ...transactions[index],

                    ...transactionData

                };

            }


            editingId = null;

        }

        // ADD

        else {

            transactions.push({

                id:
                    Date.now(),

                ...transactionData

            });

        }


        saveTransactions();


        form.reset();

        date.value =
            getToday();


        form.querySelector(
            "button[type='submit']"
        ).textContent =
            "Add Transaction";


        updateEverything();

    }
);


// ==========================================
// DISPLAY
// ==========================================

function displayTransactions() {

    const visibleTransactions =
        getVisibleTransactions();


    transactionList.innerHTML = "";


    if (
        visibleTransactions.length === 0
    ) {

        transactionList.innerHTML = `
            <div class="empty">
                No transactions found.
            </div>
        `;

        return;

    }


    visibleTransactions
        .slice()
        .sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        )
        .forEach(transaction => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "transaction-item";


            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            item.innerHTML = `

                <div class="transaction-info">

                    <h3>
                        ${escapeHTML(
                            transaction.description
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            transaction.category
                        )}
                        •
                        ${escapeHTML(
                            transaction.date
                        )}
                    </p>

                </div>


                <div class="transaction-right">

                    <strong
                        class="${transaction.type}"
                    >
                        ${sign}
                        ${formatMoney(
                            transaction.amount
                        )}
                    </strong>


                    <div class="actions">

                        <button
                            data-action="edit"
                            data-id="${transaction.id}"
                            title="Edit"
                        >
                            ✏️
                        </button>

                        <button
                            data-action="delete"
                            data-id="${transaction.id}"
                            title="Delete"
                        >
                            🗑️
                        </button>

                    </div>

                </div>

            `;


            transactionList.appendChild(
                item
            );

        });

}


// ==========================================
// EDIT / DELETE
// ==========================================

transactionList.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (!button) {

            return;

        }


        const id =
            Number(
                button.dataset.id
            );


        const action =
            button.dataset.action;


        if (
            action === "edit"
        ) {

            editTransaction(id);

        }


        if (
            action === "delete"
        ) {

            deleteTransaction(id);

        }

    }
);


// ==========================================
// EDIT
// ==========================================

function editTransaction(id) {

    const transaction =
        transactions.find(
            item =>
                item.id === id
        );


    if (!transaction) {

        return;

    }


    description.value =
        transaction.description;

    amount.value =
        transaction.amount;

    type.value =
        transaction.type;

    category.value =
        transaction.category;

    date.value =
        transaction.date;


    editingId =
        id;


    form.querySelector(
        "button[type='submit']"
    ).textContent =
        "Update Transaction";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ==========================================
// DELETE
// ==========================================

function deleteTransaction(id) {

    const transaction =
        transactions.find(
            item =>
                item.id === id
        );


    if (!transaction) {

        return;

    }


    const confirmed =
        confirm(
            `Delete "${transaction.description}"?`
        );


    if (!confirmed) {

        return;

    }


    transactions =
        transactions.filter(
            item =>
                item.id !== id
        );


    saveTransactions();

    updateEverything();

}


// ==========================================
// SUMMARY
// ==========================================

function updateSummary() {

    const monthTransactions =
        getMonthTransactions();


    let totalIncome = 0;

    let totalExpense = 0;


    monthTransactions.forEach(
        transaction => {

            if (
                transaction.type ===
                "income"
            ) {

                totalIncome +=
                    Number(
                        transaction.amount
                    );

            } else {

                totalExpense +=
                    Number(
                        transaction.amount
                    );

            }

        }
    );


    const totalBalance =
        totalIncome -
        totalExpense;


    income.textContent =
        formatMoney(
            totalIncome
        );


    expense.textContent =
        formatMoney(
            totalExpense
        );


    balance.textContent =
        formatMoney(
            totalBalance
        );

}


// ==========================================
// CHARTS
// ==========================================

function updateCharts() {

    const monthTransactions =
        getMonthTransactions();


    let totalIncome = 0;

    let totalExpense = 0;


    const categoryTotals = {};


    monthTransactions.forEach(
        transaction => {

            const transactionAmount =
                Number(
                    transaction.amount
                );


            if (
                transaction.type ===
                "income"
            ) {

                totalIncome +=
                    transactionAmount;

            } else {

                totalExpense +=
                    transactionAmount;


                if (
                    !categoryTotals[
                        transaction.category
                    ]
                ) {

                    categoryTotals[
                        transaction.category
                    ] = 0;

                }


                categoryTotals[
                    transaction.category
                ] +=
                    transactionAmount;

            }

        }
    );


    // ======================================
    // INCOME / EXPENSE CHART
    // ======================================

    const incomeExpenseCanvas =
        document.getElementById(
            "incomeExpenseChart"
        );


    if (
        incomeExpenseChart
    ) {

        incomeExpenseChart.destroy();

    }


    incomeExpenseChart =
        new Chart(
            incomeExpenseCanvas,
            {

                type: "bar",

                data: {

                    labels: [
                        "Income",
                        "Expense"
                    ],

                    datasets: [

                        {

                            label:
                                "Amount",

                            data: [
                                totalIncome,
                                totalExpense
                            ],

                            borderWidth: 1

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: false
                        }

                    }

                }

            }
        );


    // ======================================
    // CATEGORY CHART
    // ======================================

    const categoryCanvas =
        document.getElementById(
            "categoryChart"
        );


    if (
        categoryChart
    ) {

        categoryChart.destroy();

    }


    const categoryLabels =
        Object.keys(
            categoryTotals
        );


    const categoryData =
        Object.values(
            categoryTotals
        );


    categoryChart =
        new Chart(
            categoryCanvas,
            {

                type: "doughnut",

                data: {

                    labels:
                        categoryLabels,

                    datasets: [

                        {

                            data:
                                categoryData,

                            borderWidth: 1

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        }

                    }

                }

            }
        );

}


// ==========================================
// SEARCH
// ==========================================

search.addEventListener(
    "input",
    displayTransactions
);


// ==========================================
// TYPE FILTER
// ==========================================

filterType.addEventListener(
    "change",
    displayTransactions
);


// ==========================================
// MONTH FILTER
// ==========================================

monthFilter.addEventListener(
    "change",
    () => {

        displayTransactions();

        updateSummary();

        updateCharts();

    }
);


// ==========================================
// EXPORT CSV
// ==========================================

exportBtn.addEventListener(
    "click",
    () => {

        const data =
            getVisibleTransactions();


        if (
            data.length === 0
        ) {

            alert(
                "No transactions to export."
            );

            return;

        }


        const headers = [
            "Description",
            "Amount",
            "Type",
            "Category",
            "Date"
        ];


        const rows =
            data.map(
                transaction => [

                    transaction.description,

                    transaction.amount,

                    transaction.type,

                    transaction.category,

                    transaction.date

                ]
            );


        const csv = [
            headers,
            ...rows
        ]
        .map(
            row =>
                row.map(
                    value => {

                        let text =
                            String(value);


                        // Prevent CSV formula injection

                        if (
                            /^[=+\-@]/.test(
                                text
                            )
                        ) {

                            text =
                                "'" + text;

                        }


                        return `"${text.replaceAll(
                            '"',
                            '""'
                        )}"`;

                    }
                ).join(",")
        )
        .join("\n");


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href = url;

        link.download =
            "expense-transactions.csv";


        link.click();


        URL.revokeObjectURL(
            url
        );

    }
);


// ==========================================
// CLEAR ALL
// ==========================================

clearAllBtn.addEventListener(
    "click",
    () => {

        if (
            transactions.length === 0
        ) {

            alert(
                "There are no transactions."
            );

            return;

        }


        const confirmed =
            confirm(
                "Are you sure you want to delete all transactions?"
            );


        if (!confirmed) {

            return;

        }


        transactions = [];


        saveTransactions();


        updateEverything();

    }
);


// ==========================================
// DARK MODE
// ==========================================

const savedTheme =
    localStorage.getItem(
        "theme"
    );


if (
    savedTheme === "dark"
) {

    document.body.classList.add(
        "dark"
    );

    themeBtn.textContent =
        "☀️";

}


themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "theme",
            isDark
                ? "dark"
                : "light"
        );


        themeBtn.textContent =
            isDark
                ? "☀️"
                : "🌙";

    }
);


// ==========================================
// UPDATE EVERYTHING
// ==========================================

function updateEverything() {

    updateMonthOptions();

    displayTransactions();

    updateSummary();

    updateCharts();

}


// ==========================================
// INITIAL LOAD
// ==========================================

updateEverything();
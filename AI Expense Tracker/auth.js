
// ==========================================
// EXPENSEAI AUTHENTICATION
// ==========================================

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        const users = JSON.parse(
            localStorage.getItem("expenseUsers")
        ) || [];

        const user = users.find(function (item) {
            return item.email === email &&
                   item.password === password;
        });

        if (!user) {
            message.textContent = "Invalid email or password!";
            return;
        }

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify({
                name: user.name,
                email: user.email
            })
        );

        window.location.href = "Index.html";

    });

}


// ==========================================
// REGISTER
// ==========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;
        const message = document.getElementById("registerMessage");

        const users = JSON.parse(
            localStorage.getItem("expenseUsers")
        ) || [];

        const existingUser = users.find(function (item) {
            return item.email === email;
        });

        if (existingUser) {
            message.textContent = "Email already registered!";
            return;
        }

        users.push({
            name: name,
            email: email,
            password: password
        });

        localStorage.setItem(
            "expenseUsers",
            JSON.stringify(users)
        );

        alert("Registration successful! Please login.");

        window.location.href = "login.html";

    });

}

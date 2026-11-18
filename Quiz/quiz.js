
// ===============================
// QUIZ DATA
// ===============================

const quizData = {

    // ===============================
    // HTML QUESTIONS
    // ===============================

    html: [
        {
            question: "What does HTML stand for?",
            options: [
                "Hyper Text Markup Language",
                "High Text Machine Language",
                "Hyper Tool Multi Language",
                "Home Text Markup Language"
            ],
            answer: 0
        },

        {
            question: "Which tag is used to create a paragraph?",
            options: [
                "<p>",
                "<h1>",
                "<div>",
                "<para>"
            ],
            answer: 0
        },

        {
            question: "Which tag is used to create a hyperlink?",
            options: [
                "<link>",
                "<a>",
                "<href>",
                "<url>"
            ],
            answer: 1
        },

        {
            question: "Which tag is used to display an image?",
            options: [
                "<image>",
                "<picture>",
                "<img>",
                "<src>"
            ],
            answer: 2
        },

        {
            question: "Which tag creates the largest heading?",
            options: [
                "<h6>",
                "<heading>",
                "<h1>",
                "<head>"
            ],
            answer: 2
        }
    ],


    // ===============================
    // CSS QUESTIONS
    // ===============================

    css: [
        {
            question: "What does CSS stand for?",
            options: [
                "Computer Style Sheets",
                "Cascading Style Sheets",
                "Creative Style System",
                "Colorful Style Sheets"
            ],
            answer: 1
        },

        {
            question: "Which property is used to change text color?",
            options: [
                "font-color",
                "text-color",
                "color",
                "foreground"
            ],
            answer: 2
        },

        {
            question: "Which property changes the background color?",
            options: [
                "background-color",
                "bg-color",
                "color-background",
                "background"
            ],
            answer: 0
        },

        {
            question: "Which property is used to make text bold?",
            options: [
                "font-style",
                "font-weight",
                "text-bold",
                "bold"
            ],
            answer: 1
        },

        {
            question: "Which symbol is used for an ID selector in CSS?",
            options: [
                ".",
                "#",
                "*",
                "@"
            ],
            answer: 1
        }
    ],


    // ===============================
    // JAVASCRIPT QUESTIONS
    // ===============================

    javascript: [
        {
            question: "Which keyword declares a variable that can be reassigned?",
            options: [
                "const",
                "let",
                "static",
                "define"
            ],
            answer: 1
        },

        {
            question: "Which method prints a message in the console?",
            options: [
                "console.log()",
                "print()",
                "console.print()",
                "log.console()"
            ],
            answer: 0
        },

        {
            question: "Which symbol is used for a single-line comment?",
            options: [
                "<!--",
                "#",
                "//",
                "/*"
            ],
            answer: 2
        },

        {
            question: "Which method adds an item to the end of an array?",
            options: [
                "push()",
                "add()",
                "append()",
                "insert()"
            ],
            answer: 0
        },

        {
            question: "Which value represents a boolean?",
            options: [
                "true",
                "yes",
                "1",
                "on"
            ],
            answer: 0
        }
    ]
};


// ===============================
// HTML ELEMENTS
// ===============================

const themeBtn =
    document.getElementById("themeBtn");

const startScreen =
    document.getElementById("startScreen");

const quizScreen =
    document.getElementById("quizScreen");

const resultScreen =
    document.getElementById("resultScreen");

const startBtn =
    document.getElementById("startBtn");

const nextBtn =
    document.getElementById("nextBtn");

const restartBtn =
    document.getElementById("restartBtn");

const questionNumber =
    document.getElementById("questionNumber");

const questionText =
    document.getElementById("question");

const optionsContainer =
    document.getElementById("options");

const scoreElement =
    document.getElementById("score");

const finalScore =
    document.getElementById("finalScore");

const correctAnswers =
    document.getElementById("correctAnswers");

const wrongAnswers =
    document.getElementById("wrongAnswers");

const percentageElement =
    document.getElementById("percentage");

const bestScoreElement =
    document.getElementById("bestScore");   

const resultMessage =
    document.getElementById("resultMessage");

const timerElement =
    document.getElementById("timer");

const progressBar =
    document.getElementById("progressBar");

const categoryButtons =
    document.querySelectorAll(".category-btn");

const leaderboardBtn =
    document.getElementById("leaderboardBtn"); 

const leaderboardScreen =
    document.getElementById("leaderboardScreen");

const backBtn =
    document.getElementById("backBtn");  

// ===============================
// QUIZ VARIABLES
// ===============================

let selectedCategory = "";

let questions = [];

let currentQuestion = 0;

let score = 0;

let timeLeft = 15;

let timer;


// ===============================
// CATEGORY SELECTION
// ===============================

categoryButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        selectedCategory =
            button.dataset.category;

        categoryButtons.forEach(function (btn) {

            btn.classList.remove("selected");

        });

        button.classList.add("selected");

    });

});


// ===============================
// START QUIZ
// ===============================

startBtn.addEventListener("click", function () {

    if (selectedCategory === "") {

        alert("Please select a category first!");

        return;
    }

    // IMPORTANT:
    // Only selected category questions
    questions = quizData[selectedCategory];

    questions.sort(() => Math.random() - 0.5);

    currentQuestion = 0;

    score = 0;

    scoreElement.textContent = score;

    startScreen.classList.add("hidden");

    resultScreen.classList.add("hidden");

    quizScreen.classList.remove("hidden");

    showQuestion();

});


// ===============================
// SHOW QUESTION
// ===============================

function showQuestion() {

    clearInterval(timer);

    timeLeft = 15;

    timerElement.textContent = timeLeft;

    timerElement.style.transform = "scale(1)";

    startTimer();

    const current =
        questions[currentQuestion];

    questionNumber.textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

    const progress =
        ((currentQuestion + 1) /
            questions.length) * 100;

    progressBar.style.width =
        `${progress}%`;

    questionText.textContent =
        current.question;

    optionsContainer.innerHTML = "";

    current.options.forEach(function (option, index) {

        const button =
            document.createElement("button");

        button.classList.add("option");

        button.textContent = option;

        button.addEventListener("click", function () {

            checkAnswer(index);

        });

        optionsContainer.appendChild(button);

    });

    nextBtn.style.display = "none";

};


// ===============================
// TIMER
// ===============================

function startTimer() {

    timer = setInterval(function () {

        timeLeft--;

        timerElement.textContent = timeLeft;

        if (timeLeft <= 5) {

            timerElement.style.transform =
                "scale(1.1)";

        } else {

            timerElement.style.transform =
                "scale(1)";

        }

        if (timeLeft === 0) {

            clearInterval(timer);

            timeUp();

        }

    }, 1000);

}


// ===============================
// CHECK ANSWER
// ===============================

function checkAnswer(selectedIndex) {

    clearInterval(timer);

    const current =
        questions[currentQuestion];

    const optionButtons =
        document.querySelectorAll(".option");

    optionButtons.forEach(function (button) {

        button.disabled = true;

    });

    if (selectedIndex === current.answer) {

        optionButtons[selectedIndex]
            .classList.add("correct");

        score++;

        playSound("correct");

        scoreElement.textContent = score;

    } else {

        optionButtons[selectedIndex]
            .classList.add("wrong");

        optionButtons[current.answer]
            .classList.add("correct");

        playSound("wrong");

    }

    nextBtn.style.display = "block";

}


// ===============================
// TIME UP
// ===============================

function timeUp() {

    const current =
        questions[currentQuestion];

    const optionButtons =
        document.querySelectorAll(".option");

    optionButtons.forEach(function (button) {

        button.disabled = true;

    });

    optionButtons[current.answer]
        .classList.add("correct");

    nextBtn.style.display = "block";

}


// ===============================
// NEXT QUESTION
// ===============================

nextBtn.addEventListener("click", function () {

    currentQuestion++;

    if (currentQuestion < questions.length) {

        showQuestion();

    } else {

        showResult();

    }

});


// ===============================
// SHOW RESULT
// ===============================

function showResult() {

    clearInterval(timer);

    quizScreen.classList.add("hidden");

    resultScreen.classList.remove("hidden");

    finalScore.textContent =
        `${score} / ${questions.length}`;

      const wrong =
    questions.length - score;

const percentage =
    Math.round((score / questions.length) * 100);

correctAnswers.textContent =
    score;

wrongAnswers.textContent =
    wrong;

percentageElement.textContent =
    `${percentage}%`;

// Get old best score
let bestScore =
    localStorage.getItem(`bestScore_${selectedCategory}`) || 0;


// Check if current score is better
if (score > Number(bestScore)) {

    bestScore = score;

    localStorage.setItem(
    `bestScore_${selectedCategory}`,
    bestScore
);
}

// Show best score
bestScoreElement.textContent =
    `${bestScore} / ${questions.length}`;    

    const percentageValue =
        (score / questions.length) * 100;

    if (percentage === 100) {

        resultMessage.textContent =
            "🏆 Excellent! Perfect Score!";

    } else if (percentage >= 60) {

        resultMessage.textContent =
            "👏 Great Job! Keep practicing.";

    } else {

        resultMessage.textContent =
            "💪 Keep Learning! You can do better.";

    }

}


// ===============================
// RESTART QUIZ
// ===============================

restartBtn.addEventListener("click", function () {

    clearInterval(timer);

    currentQuestion = 0;

    score = 0;

    timeLeft = 15;

    scoreElement.textContent = score;

    timerElement.textContent = timeLeft;

    timerElement.style.transform = "scale(1)";

    progressBar.style.width = "0%";

    resultScreen.classList.add("hidden");

    quizScreen.classList.add("hidden");

    startScreen.classList.remove("hidden");

    categoryButtons.forEach(function (button) {

        button.classList.remove("selected");

    });

    selectedCategory = "";

    questions = [];

});
// ===============================
// SOUND EFFECTS
// ===============================

function playSound(type) {

    const audioContext =
        new (window.AudioContext || window.webkitAudioContext)();

    const oscillator =
        audioContext.createOscillator();

    const gainNode =
        audioContext.createGain();

    oscillator.connect(gainNode);

    gainNode.connect(audioContext.destination);


    if (type === "correct") {

        oscillator.frequency.value = 700;

    } else if (type === "wrong") {

        oscillator.frequency.value = 250;

    } else if (type === "complete") {

        oscillator.frequency.value = 900;

    }


    oscillator.start();

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.3
    );

    oscillator.stop(
        audioContext.currentTime + 0.3
    );
}
// ===============================
// DARK / LIGHT MODE
// ===============================

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        themeBtn.textContent = "☀️ Light Mode";

    } else {

        themeBtn.textContent = "🌙 Dark Mode";

    }

});
leaderboardBtn.addEventListener("click", function () {

    resultScreen.classList.add("hidden");
    leaderboardScreen.classList.remove("hidden");

});
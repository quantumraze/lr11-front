const words = [
    { english: "Apple", ukrainian: ["яблуко"] },
    { english: "Book", ukrainian: ["книга", "книжка"] },
    { english: "House", ukrainian: ["будинок", "дім"] },
    { english: "Water", ukrainian: ["вода"] },
    { english: "School", ukrainian: ["школа"] },
    { english: "Friend", ukrainian: ["друг", "подруга"] },
    { english: "Sun", ukrainian: ["сонце"] },
    { english: "Computer", ukrainian: ["комп'ютер", "комп’ютер"] },
    { english: "Family", ukrainian: ["сім'я", "сім’я", "родина"] },
    { english: "City", ukrainian: ["місто"] }
];
let shuffledWords = [];
let currentStep = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let answered = false;

$(function () {
    startGame();
    $("#wordCard").on("click", function () {
        checkAnswer();
    });
    $("#wordCard").on("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            checkAnswer();
        }
    });
    $("#checkButton").on("click", function () {
        checkAnswer();
    });
    $("#translation").on("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();

            if (answered) {
                nextWord();
            } else {
                checkAnswer();
            }
        }
    });
    $("#nextButton").on("click", function () {
        nextWord();
    });
    $("#restartButton").on("click", function () {
        startGame();
    });
    $("#playAgain").on("click", function () {
        startGame();
    });
});

function shuffleWords(array) {
    let result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function startGame() {
    shuffledWords = shuffleWords(words);
    currentStep = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    answered = false;
    $("#resultModal").hide();
    showWord();
    updateStatistics();
}

function showWord() {
    answered = false;
    let currentWord = shuffledWords[currentStep];
    $("#englishWord").text(currentWord.english);
    $("#translation")
        .val("")
        .prop("disabled", false)
        .focus();
    $("#wordCard")
        .removeClass("success error");
    $("#message")
        .text("")
        .removeClass("success error");
    $("#checkButton").prop("disabled", false);
    $("#nextButton").prop("disabled", true);
    $("#step").text(
        (currentStep + 1) + " / " + shuffledWords.length
    );
}

function normalizeText(text) {
    return text
        .trim()
        .toLowerCase()
        .replace(/[’ʼ`]/g, "'")
        .replace(/\s+/g, " ");
}
function checkAnswer() {
    if (answered) {
        return;
    }

    let userAnswer = normalizeText(
        $("#translation").val()
    );
    if (userAnswer === "") {
        $("#message")
            .text("⚠️ Введіть переклад слова!")
            .removeClass("success")
            .addClass("error");

        $("#translation").focus();
        return;
    }

    let currentWord = shuffledWords[currentStep];

    let isCorrect = currentWord.ukrainian.some(
        translation => normalizeText(translation) === userAnswer
    );
    answered = true;

    if (isCorrect) {
        correctAnswers++;
        $("#wordCard")
            .removeClass("error")
            .addClass("success");

        $("#message")
            .text("✅ Правильно! Чудова робота!")
            .removeClass("error")
            .addClass("success");

    } else {
        incorrectAnswers++;
        $("#wordCard")
            .removeClass("success")
            .addClass("error");

        $("#message")
            .text(
                "❌ Неправильно! Правильний переклад: " +
                currentWord.ukrainian[0]
            )
            .removeClass("success")
            .addClass("error");
    }

    $("#translation").prop("disabled", true);
    $("#checkButton").prop("disabled", true);
    $("#nextButton").prop("disabled", false);
    if (currentStep === shuffledWords.length - 1) {
        $("#nextButton").text("Завершити тест");
    } else {
        $("#nextButton").text("Наступне слово →");
    }
    updateStatistics();
}

function nextWord() {
    if (!answered) {
        return;
    }
    currentStep++;
    if (currentStep >= shuffledWords.length) {

        finishGame();
        return;
    }
    showWord();
}

function updateStatistics() {
    $("#correct").text(correctAnswers);
    $("#incorrect").text(incorrectAnswers);
    let completed = correctAnswers + incorrectAnswers;
    let progress = completed / shuffledWords.length * 100;
    $("#progressBar").css("width", progress + "%");
}

function getKnowledgeLevel(percent) {
    if (percent >= 90) {
        return {
            level: "Відмінний рівень", description: "Ти чудово знаєш ці англійські слова!"
        };
    }
    if (percent >= 70) {
        return {
            level: "Добрий рівень", description: "Гарний результат! Продовжуй практикуватися."
        };
    }
    if (percent >= 50) {
        return {
            level: "Середній рівень", description: "Основи засвоєно, але деякі слова варто повторити."
        };
    }
    return {
        level: "Початковий рівень", description: "Рекомендується повторити слова та пройти тест ще раз."
    };
}

function finishGame() {
    let total = shuffledWords.length;
    let percent = Math.round(
        correctAnswers / total * 100
    );
    let knowledge = getKnowledgeLevel(percent);
    $("#resultScore").text(
        "Правильних відповідей: " +
        correctAnswers + " із " + total +
        " (" + percent + "%)"
    );
    $("#knowledgeLevel").text(knowledge.level);
    $("#resultDescription").text(knowledge.description);
    $("#resultModal")
        .css("display", "flex")
        .hide()
        .fadeIn(300);
}

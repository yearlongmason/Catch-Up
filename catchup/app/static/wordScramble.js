function checkAnswer() {
    const userGuess = document.getElementById('userGuess').value.trim();
    const result = document.getElementById('result');

    if (userGuess.toLowerCase() === original.toLowerCase()) {
        result.textContent = "Correct! Well done!";
        result.className = "text-green-500";
    } else {
        result.textContent = "Oops! Try again.";
        result.className = "text-red-500";
    }
}

function getNewQuote() {
    window.location.reload();
}


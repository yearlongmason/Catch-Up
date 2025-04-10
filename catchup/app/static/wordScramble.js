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

// Adds keypress listener
document.addEventListener("keypress", function(event) {
    // If the user presses the enter key click the update roster button
    if (event.key === "Enter") {
        // Prevent the defualt action
        // Not sure if there actually is one right now, but better safe than sorry
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("nextSentence").click();
    }
});
var correctAuthor = "";
var rand_index;


function checkAnswer() {
	const userGuess = document.getElementById("guess").value.trim();

	const result = document.getElementById("result");
	if (userGuess.toLowerCase() === author.toLowerCase()) {
		result.textContent = "Correct! 🎉";
		result.className = "mt-4 text-lg font-semibold text-green-500";
	} else {
		result.textContent = "Oops! The correct answer is " + author + ".";
		result.className = "mt-4 text-lg font-semibold text-red-500";
	}
}

function togleButtonVisibility(shouldEnable) {
	var guessButton = document.getElementById('guessButton');
	var refreshButton = document.getElementById('refreshButton');

	if (shouldEnable) {
		guessButton.disabled = false;
		guessButton.style.visibility = 'visible';
		refreshButton.disabled = false;
		refreshButton.style.visibility = 'visible';
	}
	else {
		guessButton.disabled = true;
		guessButton.style.visibility = 'hidden';
		refreshButton.disabled = true;
		refreshButton.style.visibility = 'hidden';
	}
}


window.onload = (event) => {
	var guessButton = document.getElementById('guessButton');
	guessButton.onclick = checkAnswer;

	var refreshButton = document.getElementById('refreshButton');
	refreshButton.onclick = refreshQuote;

};

// Adds keypress listener
document.addEventListener("keypress", function(event) {
    // If the user presses the enter key click the update roster button
    if (event.key === "Enter") {
        // Prevent the defualt action
        // Not sure if there actually is one right now, but better safe than sorry
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("guessButton").click();
    }
});
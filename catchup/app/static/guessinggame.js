const correctAuthor = "Franklin D. Roosevelt";

    function checkAnswer() {
      const userGuess = document.getElementById("guess").value.trim();
      const result = document.getElementById("result");
      if (userGuess.toLowerCase() === correctAuthor.toLowerCase()) {
        result.textContent = "Correct! 🎉";
        result.className = "mt-4 text-lg font-semibold text-green-500";
      } else {
        result.textContent = "Oops! The correct answer is " + correctAuthor + ".";
        result.className = "mt-4 text-lg font-semibold text-red-500";
      }
    }

    window.onload = (event) => {
        var guessButton = document.getElementById('guessButton');
        guessButton.onclick = checkAnswer;
    };
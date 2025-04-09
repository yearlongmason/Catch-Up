var currentQuote = ""

function scrambleSentence(sentence) {
    return sentence.split(' ').sort(() => 0.5 - Math.random()).join(' ');
}

function togleButtonVisibility(shouldEnable) {
	var guessButton = document.getElementById('submitbutton');
	var refreshButton = document.getElementById('nextSentence');

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

function getQuote()
{
    document.getElementById('scrambledSentence').textContent = "Loading Quote...";
    togleButtonVisibility(false);

    const other_params = {
        method: 'GET', 
        headers: {
          'Authorization': `Api-Key ${api_key}`,
          'Content-Type': 'application/json'
        }
      };
      var URL = api_url + `${server_id}/`;
      
      fetch(URL, other_params)
        .then(response => {
          if (response.ok) {
            return response.json(); 
          } else {
            throw new Error('API request failed');
          }
        })
        .then(data => {
          rand_index = Math.floor(Math.random() * data.length);
          var quote = data[rand_index];
          displaySentence(quote['quote'], quote['author']);
        })
        .catch(error => {
          console.error(error);
        });
}

function displaySentence(quote, author) {
    currentQuote = quote;
    let scrambledSentence = scrambleSentence(quote);
    document.getElementById('scrambledSentence').textContent = scrambledSentence;
    document.getElementById('userGuess').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('author').textContent = "Said by: " + author;
    togleButtonVisibility(true);
}

function checkAnswer() {
    const userGuess = document.getElementById('userGuess').value.trim();
    const result = document.getElementById('result');

    if (userGuess.toLowerCase() === currentQuote.toLowerCase()) {
        result.textContent = "Correct! Well done!";
        result.className = "text-green-500";
    } else {
        result.textContent = "Oops! Try again.";
        result.className = "text-red-500";
    }
}

function nextScrambledSentence() {
    getQuote()
}

window.onload = (event) => {
    getQuote()
};


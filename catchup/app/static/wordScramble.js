var currentQuote = ""

function scrambleSentence(sentence) {
    return sentence.split(' ').sort(() => 0.5 - Math.random()).join(' ');
}

function getQuote()
{
    document.getElementById('scrambledSentence').textContent = "Loading Quote...";
    const other_params = {
        method: 'GET', 
        headers: {
          'Authorization': `Api-Key ${api_key}`,
          'Content-Type': 'application/json'
        }
      };
      const URL = api_url + `${server_id}/`;
      
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
          console.log(quote['quote'])
          displaySentence(quote['quote']);
        })
        .catch(error => {
          console.error(error);
        });
}

function displaySentence(quote) {
    currentQuote = quote;
    let scrambledSentence = scrambleSentence(quote);
    document.getElementById('scrambledSentence').textContent = scrambledSentence;
    document.getElementById('userGuess').value = '';
    document.getElementById('result').textContent = '';
}

function checkAnswer() {
    const userGuess = document.getElementById('userGuess').value.trim();
    const result = document.getElementById('result');

    if (userGuess.toLowerCase() === currentQuote.toLowerCase()) {
        result.textContent = "Correct! Well done!";
        result.className = "text-green-500";
        document.getElementById('nextSentence').classList.remove('hidden');
    } else {
        result.textContent = "Oops! Try again.";
        result.className = "text-red-500";
    }
}

function nextScrambledSentence() {
    getQuote()
    document.getElementById('nextSentence').classList.add('hidden');
}

window.onload = (event) => {
    getQuote()
};


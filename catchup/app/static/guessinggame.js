var correctAuthor = "";
var rand_index;

function randomQuoteRequest() {
      var quote_element = document.getElementById("quote");
      togleButtonVisibility(false)

      quote_element.textContent = "Loading Quote..."
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
          var quote = data[rand_index]
          populateQuoteHtml(quote);
        })
        .catch(error => {
          console.error(error);
        });
    }

    function populateQuoteHtml(quote) {
      var quote_element = document.getElementById("quote");
      quote_element.textContent = quote["quote"];
      correctAuthor = quote["author"];

      togleButtonVisibility(true)
    }

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

    function togleButtonVisibility(shouldEnable)
    {
      var guessButton = document.getElementById('guessButton');
      var refreshButton = document.getElementById('refreshButton');

      if (shouldEnable)
      {
        guessButton.disabled = false;
        guessButton.style.visibility = 'visible';
        refreshButton.disabled = false;
        refreshButton.style.visibility = 'visible';
      }
      else
      {
        guessButton.disabled = true;
        guessButton.style.visibility = 'hidden';
        refreshButton.disabled = true;
        refreshButton.style.visibility = 'hidden';
      }

    }

    function refreshQuote() {
      randomQuoteRequest();
    }

    window.onload = (event) => {
        var guessButton = document.getElementById('guessButton');
        guessButton.onclick = checkAnswer;
        
        var refreshButton = document.getElementById('refreshButton');
        refreshButton.onclick = refreshQuote;

        randomQuoteRequest();
    };

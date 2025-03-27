const correctAuthor = "Franklin D. Roosevelt";
var quote;
var rand_index;

    function randomQuoteRequest() {   
      var quote_element = document.getElementById("quote");
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
          quote = data[rand_index]
          //console.log(data[rand_index])
          //console.log(quote)
        })
        .catch(error => {
          console.error(error);
        });
    }

    function populateQuoteHtml() {
      var quote_element = document.getElementById("quote");
      quote_element.textContent = quote["quote"];
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

    window.onload = (event) => {
        var guessButton = document.getElementById('guessButton');
        guessButton.onclick = checkAnswer;

        randomQuoteRequest();
        
        // gotta be a better way to do this
        console.log("Waiting for api call to finish")
        setTimeout(function(){
          populateQuoteHtml();
        }, 2000);
    };
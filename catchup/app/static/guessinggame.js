const correctAuthor = "Franklin D. Roosevelt";


    function randomQuoteRequest() {     
      const other_params = {
        method: 'GET', 
        headers: {
          'Authorization': `Api-Key ${api_key}`,
          'Content-Type': 'application/json'
        },
        data : {
          'server_id' : server_id
        },
      };
      
      fetch(api_url, other_params)
        .then(response => {
          if (response.ok) {
            return response.json(); 
          } else {
            throw new Error('API request failed');
          }
        })
        .catch(error => {
          console.error(error);
        });
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

        console.log(randomQuoteRequest());
    };
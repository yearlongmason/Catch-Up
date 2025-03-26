// ALL_DATA is not technically a constant, but should not be changed
let ALL_DATA
let MIN_NUM_QUOTES = 3

window.onload = (event) => {
    ALL_DATA = getData() // Set allData constant

    // Check for minimum quote requirement
    if (ALL_DATA.length < MIN_NUM_QUOTES) {
        document.getElementById("dataViz").innerHTML = `<h1 class="text-3xl text-white mb-8">Sorry, a server must have at least ${MIN_NUM_QUOTES} quotes to see the stats page!</h1>`
    }

    updateMostQuoted()
};

// beep boop beep boop
// This function should essentially scrape all the data from the current roster.html
// This is a workaround to having to pass a json object through contexts
// Returns a list of objects describing each quote
function getData() {
    let allQuoteTags = document.getElementsByClassName("catchUpQuote")
    let allQuotes = []

    // Loop through each quote div it found
    for(let i = 0; i < allQuoteTags.length; i++){
        // Individually get the quote (text), author, and date
        // Put all values into an object
        // Append new object to allQuotes array
        currID = allQuoteTags[i].getElementsByClassName("catchUpQuoteID")[0].innerHTML
        currText = allQuoteTags[i].getElementsByClassName("catchUpQuoteText")[0].innerHTML.slice(0, -2)
        currAuthor = allQuoteTags[i].getElementsByClassName("catchUpQuoteAuthor")[0].innerHTML
        currDate = allQuoteTags[i].getElementsByClassName("catchUpQuoteDate")[0].innerHTML.slice(1, -1)
        allQuotes.push({"quote_id":currID, "quote":currText, "author":currAuthor, "date":currDate, "timestamp":Date.parse(currDate)})
    }

    return allQuotes
}

// Returns an array of unique names in the quote list
function getUniqueAuthors() {
    return Array.from(new Set(ALL_DATA.map((quote) => quote.author)));
}

// Get the number of times an element occurs in an array
function getNumOccurrences(array, element) {
    let numOccurrences = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] == element){
            numOccurrences += 1
        }
    }

    return numOccurrences
}

// Gets the most quoted author and display them on the banner at the top
function updateMostQuoted() {
    mostQuotedAuthor = ""
    uniqueAuthors = getUniqueAuthors()
    mostQuotes = 0
    allQuoteAuthors = ALL_DATA.map((quote) => quote.author)

    // Loop through all unique authors
    for (let i = 0; i < uniqueAuthors.length; i++) {
        if (getNumOccurrences(allQuoteAuthors, uniqueAuthors[i]) > mostQuotes){
            mostQuotes = getNumOccurrences(allQuoteAuthors, uniqueAuthors[i])
            mostQuotedAuthor = uniqueAuthors[i]
        }
    }

    let mostQuotedUserTag = document.getElementById("mostQuotedUser")
    let numberOfQuotesTag = document.getElementById("numberOfQuotes")
    mostQuotedUserTag.innerText = mostQuotedAuthor;
    numberOfQuotesTag.innerText = `${mostQuotes} Quotes`;
    mostQuotedUserTag.classList.remove('hidden')
    numberOfQuotesTag.classList.remove('hidden')
}
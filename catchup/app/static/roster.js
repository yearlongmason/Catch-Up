// If Django is caching this file, clear your browser cache!
// In Chrome press ctrl + shift + del and delete cached images and files!

// Define all global variables
// ALL_DATA is not technically a constant, but should not be changed
let ALL_DATA
let currentData
let dateNewestFirst

window.onload = (event) => {
    ALL_DATA = getData()
    dateNewestFirst = true
};

function testJSFunc() {
    alert("The JS file is connected and working!")
}

// This swaps the dateNewestFirst boolean and updates the button text accordingly
function swapDateOrder() {
    // If the date is ascending, then swap it to descending
    if (dateNewestFirst) {
        document.getElementById("sortDateButton").innerText = "Sort date: Oldest First"
        dateNewestFirst = false
    }
    else {
        document.getElementById("sortDateButton").innerText = "Sort date: Newest First"
        dateNewestFirst = true
    }
}

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
        currText = allQuoteTags[i].getElementsByClassName("catchUpQuoteText")[0].innerHTML.slice(0, -2)
        currAuthor = allQuoteTags[i].getElementsByClassName("catchUpQuoteAuthor")[0].innerHTML
        currDate = allQuoteTags[i].getElementsByClassName("catchUpQuoteDate")[0].innerHTML.slice(1, -1)
        allQuotes.push({"quote":currText, "author":currAuthor, "date":currDate, "timestamp":Date.parse(currDate)})
    }

    return allQuotes
}
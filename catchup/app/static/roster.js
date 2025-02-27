// If Django is caching this file, clear your browser cache!
// In Chrome press ctrl + shift + del and delete cached images and files!

// Define all global variables
// ALL_DATA is not technically a constant, but should not be changed
let ALL_DATA
let dateNewestFirst

window.onload = (event) => {
    ALL_DATA = getData().reverse() // Set allData constant
    dateNewestFirst = true
    updateRoster() // Call update roster to make sure it's sorted correctly
};

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

// Takes in list of JSON object same as ALL_DATA
// Returns data formatted as HTML to replace in roster.html's allQuotes div
function formatAsHTML(modifiedData){
    let formattedhtml = ""

    // Loop through each quote and add that roster element to the new html
    for (let i = 0; i < modifiedData.length; i++) {
        formattedhtml += '<div class="container mx-auto mt-6 w-4/5">'
        formattedhtml += '<div class="bg-white p-6 rounded shadow-md mb-4 h-16 catchUpQuote">'
        formattedhtml += `<p class="text-gray-800 float-left catchUpQuoteText">${modifiedData[i].quote} -</p>`
        formattedhtml += `<p class="text-gray-800 float-left pl-1 catchUpQuoteAuthor">${modifiedData[i].author}</p>`
        formattedhtml += `<p class="text-gray-800 float-right catchUpQuoteDate">(${modifiedData[i].date})</p>`
        formattedhtml += "</div></div>"
    }

    // Return the data formatted as HTML
    return formattedhtml
}

// Takes in list of JSON object same as ALL_DATA
// Returns currentData sorted depending on the dateNewestFirst variable
function sortByDate(currentData) {
    // Comparison function for sort
    function compareFn(a, b) { return a - b; }

    // If the date is newest first, just return the sorted list
    // Otherwise return the reversed sorted list
    if (dateNewestFirst){
        return currentData.sort(compareFn)
    }
    return currentData.sort(compareFn).reverse()
}

// When the user has set their preferences they can apply their changes by pressing the update roster button
// which calls this function to apply all changes
function updateRoster(){
    // Make a deepcopy of ALL_DATA
    currentData = structuredClone(ALL_DATA)
    currentData = sortByDate(currentData) // Sort by date
    document.getElementById("allQuotes").innerHTML = formatAsHTML(currentData) // Set inner HTML as new formatted HTML
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
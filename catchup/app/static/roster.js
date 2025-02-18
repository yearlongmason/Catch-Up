// If Django is caching this file, clear your browser cache!
// In Chrome press ctrl + shift + del and delete cached images and files!

dateAscending = true

function testJSFunc() {
    alert("The JS file is connected and working!")
    dateAscending = false
}

// This function should essentially scrape all the data from the current roster.html
// This is a workaround to having to pass a json object through contexts
function getData() {
    let quotesList = document.getElementById("allQuotes")
    let allQuotes = document.getElementsByClassName("quote")
    console.log(quotesList)
    console.log(allQuotes)
}
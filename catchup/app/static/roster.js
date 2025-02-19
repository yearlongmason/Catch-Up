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
    let allQuoteTags = document.getElementsByClassName("catchUpQuote")

    // Loop through each quote div it found
    for(let i = 0; i < allQuoteTags.length; i++){
        console.log(i, allQuoteTags[i])
        console.log(allQuoteTags[i].getElementsByClassName("catchUpQuoteText")[0].innerHTML.slice(0, -2))
        console.log(allQuoteTags[i].getElementsByClassName("catchUpQuoteAuthor")[0].innerHTML)
        console.log(allQuoteTags[i].getElementsByClassName("catchUpQuoteDate")[0].innerHTML)
    }
}
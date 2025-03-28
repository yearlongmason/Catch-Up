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
    renderNumQuotesByAuthorChart()
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

function getQuoteCountsPerAuthor() {
    let uniqueAuthors = getUniqueAuthors();
    let allQuoteAuthors = ALL_DATA.map((quote) => quote.author)
    let authorCounts = [];

    // Set all authors to 0 initially
    for (let i = 0; i < uniqueAuthors.length; i++) {
        currentAuthor = uniqueAuthors[i]
        authorCounts.push(getNumOccurrences(allQuoteAuthors, currentAuthor))
    }
    return uniqueAuthors.map((author, i) => ({
        author: author,
        numQuotes: authorCounts[i]})).sort((a, b) => a.numQuotes - b.numQuotes)
}

// Creates a chart that displays the number of quotes
function renderNumQuotesByAuthorChart() {
    let quoteCountsPerAuthor = getQuoteCountsPerAuthor()

    const chartCanvas = document.getElementById('numQuotesByAuthor').getContext('2d');
    const chart = new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: quoteCountsPerAuthor.map((author) => author.author), // x axis labels
            datasets: [{
                label: 'Number of Quotes',
                data: quoteCountsPerAuthor.map((author) => author.numQuotes), // Y-axis data
                backgroundColor: '#fb923c', // Bar color
                borderColor: '#fb923c', // Border color
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
}
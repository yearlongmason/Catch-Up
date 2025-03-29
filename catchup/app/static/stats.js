// ALL_DATA is not technically a constant, but should not be changed
let ALL_DATA
let MIN_NUM_QUOTES = 3

window.onload = (event) => {
    ALL_DATA = getData() // Set ALL_DATA constant

    // Check for minimum quote requirement
    if (ALL_DATA.length < MIN_NUM_QUOTES) {
        document.getElementById("dataViz").innerHTML = `<h1 class="text-3xl text-white mb-8">Sorry, a server must have at least ${MIN_NUM_QUOTES} quotes to see the stats page!</h1>`
    }

    // Render visualizations
    renderMostQuotedUser()
    renderNumQuotesByAuthorChart()
    renderWordCountsChart()
    renderQuotesOverTime()
};

// beep boop beep boop
// This function should essentially scrape all the data from the current roster.html
// This is a workaround to having to pass a json object through contexts
// Returns a list of objects describing each quote
function getData() {
    let allQuoteTags = document.getElementsByClassName("catchUpQuote")
    let allQuotes = []

    // Loop through each quote div
    for (let i = 0; i < allQuoteTags.length; i++) {
        // Individually get the quote (text), author, and date
        // Put all values into an object
        // Append new object to allQuotes array
        currID = allQuoteTags[i].getElementsByClassName("catchUpQuoteID")[0].innerHTML
        currText = allQuoteTags[i].getElementsByClassName("catchUpQuoteText")[0].innerHTML
        currAuthor = allQuoteTags[i].getElementsByClassName("catchUpQuoteAuthor")[0].innerHTML
        currDate = allQuoteTags[i].getElementsByClassName("catchUpQuoteDate")[0].innerHTML
        allQuotes.push({ "quote_id": currID, "quote": currText, "author": currAuthor, "date": currDate, "timestamp": Date.parse(currDate) })
    }

    return allQuotes
}

// Returns an array of unique names in the quote list
function getUniqueAuthors() {
    return Array.from(new Set(ALL_DATA.map((quote) => quote.author)));
}

// Get the number of times an element occurs in an array
function getNumOccurrences(array, element) {
    return array.filter(x => x === element).length;
}

// Returns array of all element frequencies from an array
// e.g. [{element: "Mason", frequency: 117}, {element: "John", frequency: 343}]
function getFrequencies(array) {
    let uniqueElements = Array.from(new Set(array));
    let frequencies = [];

    // Get the count of each element in the array
    uniqueElements.forEach(element => { frequencies.push(getNumOccurrences(array, element)) });

    // Return sorted array
    return uniqueElements.map((element, i) => ({
        element: element,
        frequency: frequencies[i]
    })
    ).sort((a, b) => a.frequency - b.frequency)
}

// Gets the most quoted author and display them on the banner at the top
function renderMostQuotedUser() {
    // Get the most quoted author
    let quoteCounts = getFrequencies(ALL_DATA.map((quote) => quote.author))
    let mostQuotedAuthor = quoteCounts[quoteCounts.length - 1];

    // Update most quoted user banner
    let mostQuotedUserTag = document.getElementById("mostQuotedUser")
    let numberOfQuotesTag = document.getElementById("numberOfQuotes")
    mostQuotedUserTag.innerText = mostQuotedAuthor.element;
    numberOfQuotesTag.innerText = `${mostQuotedAuthor.frequency} Quotes`;

    // Make banner text visible
    mostQuotedUserTag.classList.remove('hidden')
    numberOfQuotesTag.classList.remove('hidden')
}

// Creates a chart that displays the number of quotes by author
function renderNumQuotesByAuthorChart() {
    let quoteCountsPerAuthor = getFrequencies(ALL_DATA.map((quote) => quote.author))

    const chartCanvas = document.getElementById('numQuotesByAuthor').getContext('2d');
    const chart = new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: quoteCountsPerAuthor.map((author) => author.element), // x axis labels
            datasets: [{
                label: 'Number of Quotes',
                data: quoteCountsPerAuthor.map((author) => author.frequency), // Y-axis data
                backgroundColor: '#fb923c', // Bar color
                borderColor: '#fb923c', // Border color
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
}

// Set string to title case
// "mason and john are cool" -> "Mason And John Are Cool"
function titleCase(s) {
    return s.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Gets word counts of all quotes combined
function getWordCounts() {
    // Get all quotes as a single string with no punctuation and all lowercase
    let formattedQuotesString = ALL_DATA.map((currentQuote) => currentQuote.quote).join(" ")
    formattedQuotesString = formattedQuotesString.replace(/[^a-zA-Z ]/g, "").toLowerCase()
    return getFrequencies(formattedQuotesString.split(" "))
}

// Creates a chart that displays the number of quotes
function renderWordCountsChart() {
    let quoteCountsPerAuthor = getWordCounts()

    // If more than 10 words, only take the top 10 most frequent words
    if (quoteCountsPerAuthor.length > 10) {
        quoteCountsPerAuthor = quoteCountsPerAuthor.slice(Math.max(quoteCountsPerAuthor.length - 10))
    }

    const chartCanvas = document.getElementById('wordFrequencyChart').getContext('2d');
    const chart = new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: quoteCountsPerAuthor.map((word) => titleCase(word.element)), // x axis labels
            datasets: [{
                label: 'Word Frequency',
                data: quoteCountsPerAuthor.map((word) => word.frequency), // Y-axis data
                backgroundColor: '#fb923c', // Bar color
                borderColor: '#fb923c', // Border color
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
}

function renderQuotesOverTime() {
    // Get previous 12 months as an array
    let last12Months = getLast12Months();
    let monthQuotes = ALL_DATA.map(quote => getMonthYear(quote.timestamp));
    let monthFrequencies = last12Months.map(month => { return {element: month, frequency: getNumOccurrences(monthQuotes, month)} })

    const chartCanvas = document.getElementById('quotesOverTime').getContext('2d');

    const chart = new Chart(chartCanvas, {
        type: "line",
        data: {
            labels: last12Months, // x axis labels
            datasets: [{
                label: 'Quote Frequency',
                data: monthFrequencies.map(month => month.frequency), // Y-axis data
                backgroundColor: '#fb923c', // Bar color
                borderColor: '#fb923c', // Border color
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
}

// Returns an array containing the last 12 months formatted as "Full Month Full Year"
// Sorted by oldest month first
function getLast12Months() {
    let last12Months = [];
    let monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date = new Date();
    date.setDate(1);
    for (i = 0; i <= 11; i++) {
        last12Months.push(monthName[date.getMonth()] + ' ' + date.getFullYear());
        date.setMonth(date.getMonth() - 1);
    }
    
    last12Months = last12Months.reverse();
    
    return last12Months;
}

// Returns the month and year given a timestamp
function getMonthYear(timestamp){
    let monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const timestampDate = new Date(timestamp)
    return `${monthName[timestampDate.getMonth()]} ${timestampDate.getFullYear()}`
}
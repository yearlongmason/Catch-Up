// If your browser is caching this file, clear your browser cache!
// In Chrome press ctrl + shift + del and delete cached images and files!

// Define all global variables
// ALL_DATA is not technically a constant, but should not be changed
let ALL_DATA
let dateNewestFirst

window.onload = (event) => {
    dateNewestFirst = true
    ALL_DATA = getData().reverse() // Set allData constant
    // Format all authors as titled
    populateDropdown()
    updateRoster() // Call update roster to make sure it's sorted correctly
};

// Returns an array of unique names in the quote list
function getUniqueNames() {
    return Array.from(new Set(ALL_DATA.map((quote) => quote.author)));
}

// Populates the dropdown menu with names of people being quoted
function populateDropdown() {
    // Add the check all button
    dropdownHTML = `<button id="checkAllButton" onclick="checkAllDropdown()" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer font-bold">Check/Uncheck All</button>`
    // Add a new checkbox for each unique name in the quote list
    getUniqueNames().forEach(name => {
        dropdownHTML += `<label class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer authorCheckbox"><input type="checkbox" class="mr-2 option-checkbox" checked>${name}</label>`
    });
    document.getElementById("dropdownMenu").innerHTML = dropdownHTML;
}

// Make the dropdown menu visible when clicked
function makeDropdownVisible(){
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdownMenu');

    const isHidden = dropdownMenu.classList.contains('invisible');
    dropdownMenu.classList.toggle('opacity-0', !isHidden);
    dropdownMenu.classList.toggle('invisible', !isHidden);
    
    // Place dropdown results right below the button
    const rect = dropdownButton.getBoundingClientRect();
    dropdownMenu.style.top = `${rect.bottom + window.scrollY}px`;
    dropdownMenu.style.left = `${rect.left + window.scrollX}px`;
}

// This is the functionality for checking all boxes in people dropdown
function checkAllDropdown() {
    const checkboxes = document.querySelectorAll('.option-checkbox');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    checkboxes.forEach(checkbox => checkbox.checked = !allChecked);
}

// This swaps the dateNewestFirst boolean and updates the button text accordingly
function swapDateOrder() {
    // If the date is ascending, then swap it to descending
    if (dateNewestFirst) {
        document.getElementById("sortDateButton").innerText = "Sort date: Ascending"
        dateNewestFirst = false
    }
    else {
        document.getElementById("sortDateButton").innerText = "Sort date: Descending"
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

// Takes in list of JSON object same as ALL_DATA
// Returns currentData filtered by the string in the search bar
// (Only returns quotes that have search string as a substring)
// Searching is not case sensitive
function filterBySearchBar(currentData) {
    // Get the contents of the search bar
    wordToSearch = document.getElementById("searchQuotes").value.toLowerCase()

    // If the user doesn't have anything in the search bar, just skip it
    if (wordToSearch == "") {
        return currentData
    }

    // Return all quotes that have the search string present in it
    return currentData.filter((item) => item.quote.toLowerCase().includes(wordToSearch))
}

// Return all authors who are checked in the dropdown menu
function getCheckedAuthors(){
    // Get all author checkboxes
    let authors = Array.prototype.slice.call( document.getElementsByClassName("authorCheckbox") )
    // Filter by authors who are checked
    authors = authors.filter((author) => author.children[0].checked)

    // Return the author names
    return authors.map((author) => author.innerHTML.split(">")[author.innerHTML.split(">").length - 1])
}

// Filter by authors
function filterByAuthors(currentData) {
    // Get all checked authors and return quotes by those authors
    let checkedAuthors = getCheckedAuthors()
    return currentData.filter((quote) => checkedAuthors.includes(quote.author))
}

// When the user has set their preferences they can apply their changes by pressing the update roster button
// which calls this function to apply all changes
function updateRoster(){
    // Make a deepcopy of ALL_DATA
    currentData = structuredClone(ALL_DATA)
    currentData = sortByDate(currentData) // Sort by date
    currentData = filterBySearchBar(currentData) // Filter by search word
    currentData = filterByAuthors(currentData) // Filter by authors
    document.getElementById("allQuotes").innerHTML = formatAsHTML(currentData) // Set inner HTML as new formatted HTML
}

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
        currText = allQuoteTags[i].getElementsByClassName("catchUpQuoteText")[0].innerHTML.slice(0, -2)
        currAuthor = allQuoteTags[i].getElementsByClassName("catchUpQuoteAuthor")[0].innerHTML
        currDate = allQuoteTags[i].getElementsByClassName("catchUpQuoteDate")[0].innerHTML.slice(1, -1)
        allQuotes.push({"quote":currText, "author":currAuthor, "date":currDate, "timestamp":Date.parse(currDate)})
    }

    return allQuotes
}

// Adds keypress listener
document.addEventListener("keypress", function(event) {
    // If the user presses the enter key click the update roster button
    if (event.key === "Enter") {
        // Prevent the defualt action
        // Not sure if there actually is one right now, but better safe than sorry
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("updateRosterButton").click();
    }
});

// If dropdown is open and user clicks off screen, make dropdown invisible again
document.addEventListener('click', (event) => {
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.add('opacity-0', 'invisible');
    }
});
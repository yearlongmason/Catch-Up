// If your browser is caching this file, clear your browser cache!
// In Chrome press ctrl + shift + del and delete cached images and files!
//require('dotenv').config();


// Define all global variables
// ALL_DATA is not technically a constant, but should not be changed except for quote deletion
let ALL_DATA
let dateNewestFirst
let currentSearchPhrase = "";
let quoteToDeleteID = -1

window.onload = (event) => {
    dateNewestFirst = false
    ALL_DATA = getData() // Set allData constant
    populateAuthorsDropdown()
    updateRoster() // Call update roster to make sure it's sorted correctly
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
        currText = allQuoteTags[i].getElementsByClassName("catchUpQuoteText")[0].innerHTML
        currAuthor = allQuoteTags[i].getElementsByClassName("catchUpQuoteAuthor")[0].innerHTML
        currDate = allQuoteTags[i].getElementsByClassName("catchUpQuoteDate")[0].innerHTML
        allQuotes.push({"quote_id":currID, "quote":currText, "author":currAuthor, "date":currDate, "timestamp":Date.parse(currDate)})
    }

    return allQuotes
}

// Populates the dropdown menu with names of people being quoted
function populateAuthorsDropdown() {
    // Add the check all button
    dropdownHTML = `<button id="checkAllButton" onclick="checkAllDropdown()" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer font-bold">Check/Uncheck All</button>`
    // Add a new checkbox for each unique name in the quote list
    getUniqueNames().sort().forEach(name => {
        dropdownHTML += `<label class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer authorCheckbox"><input type="checkbox" onclick="updateRoster()" class="mr-2 option-checkbox" checked>${name}</label>`
    });
    document.getElementById("dropdownMenu").innerHTML = dropdownHTML;
}

// Updates the authors that are shown and ensures they are sorted correctly
function updateAuthors() {
    let currentData = ALL_DATA // Get all the data that's currently there
    currentData = filterByAuthors(currentData) // Filter by authors
    currentData = sortByDate(currentData)
    document.getElementById("allQuotes").innerHTML = formatAsHTML(currentData) // Set inner HTML as new formatted HTML
}

// Returns an array of unique names in the quote list
function getUniqueNames() {
    return Array.from(new Set(ALL_DATA.map((quote) => quote.author)));
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
    updateRoster()
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

// Takes in list of JSON object same as ALL_DATA
// Returns currentData sorted depending on the dateNewestFirst variable
function sortByDate(currentData) {
    // Comparison function for sort
    function compareFn(a, b) { return a.timestamp - b.timestamp; }

    // If the date is newest first, just return the sorted list
    // Otherwise return the reversed sorted list
    if (dateNewestFirst){
        return currentData.sort(compareFn)
    }
    return currentData.sort(compareFn).reverse()
}

// This swaps the dateNewestFirst boolean and updates the button text accordingly
function swapDateOrder() {
    // If the date is ascending, then swap it to descending
    if (dateNewestFirst) {
        document.getElementById("sortDateButton").innerHTML = 'Sort date <i class="fa-solid fa-arrow-down"></i>'
        dateNewestFirst = false
    }
    else {
        document.getElementById("sortDateButton").innerHTML = 'Sort date <i class="fa-solid fa-arrow-up"></i>'
        dateNewestFirst = true
    }
    updateRoster();
}

// Takes in list of JSON object same as ALL_DATA
// Returns currentData filtered by the string in the search bar
// (Only returns quotes that have search string as a substring)
// Searching is not case sensitive
function filterBySearchBar(currentData) {
    // If the user doesn't have anything in the search bar, just skip it
    if (currentSearchPhrase == "") {
        return currentData
    }

    // Return all quotes that have the search string present in it
    return currentData.filter((item) => item.quote.toLowerCase().includes(currentSearchPhrase))
}

// Grabs whatever text is in the search bar and sets the global currentSearchPhrase variable
// Then calls update roster to update the changes
function searchForQuote() {
    currentSearchPhrase = document.getElementById("quoteSearchBar").value.toLowerCase()
    updateRoster();
}

// Takes in list of JSON object same as ALL_DATA
// Returns data formatted as HTML to replace in roster.html's allQuotes div
function formatAsHTML(modifiedData){
    let formattedhtml = ""

    // Loop through each quote and add that roster element to the new html
    for (let i = 0; i < modifiedData.length; i++) {
        formattedhtml += `<div class="container mx-auto mt-6 w-4/5 items-center h-auto">`
        formattedhtml += `<div class="flex flex-row items-center justify-between bg-white p-5 rounded shadow-md mb-4 h-auto min-h-16">`
        formattedhtml += `<div class="flex flex-row w-4/5">`
        formattedhtml += `<p class="text-gray-800 float-left">${modifiedData[i].quote} - ${modifiedData[i].author}</p>`
        formattedhtml += `<p class="text-gray-800 float-left pl-1"></p>`
        formattedhtml += `</div>`
        formattedhtml += `<div class="flex flex-row">`
        formattedhtml += `<p class="text-gray-800">(${modifiedData[i].date})</p>`
        formattedhtml += `<button onclick="deleteButton(${modifiedData[i].quote_id})" style="margin-top:-.5%" class="ml-4 bg-white hover:bg-red-500 p-2 max-h-8 rounded flex items-center justify-center border border-gray-300 transition duration-200"><i class="fas fa-trash-alt text-gray-600"></i></button>`
        formattedhtml += `</div></div></div>`
    }

    // Return the data formatted as HTML
    return formattedhtml
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

// Delete conformation code
// Show the confirmation modal when the delete button is clicked
function deleteButton(quote_id) {
    // Make sure quote actually exists
    if (!quoteExists(quote_id)){
        return
    }

    quoteToDeleteID = quote_id // Change global quote to delete
    quoteToDelete = ALL_DATA.filter((quote) => quote.quote_id == quoteToDeleteID)[0]

    // Update and change modal
    document.getElementById("areYouSure?").innerText = `Are you sure you want to delete this quote?\n\n"${quoteToDelete.quote}" - ${quoteToDelete.author}`
    document.getElementById("confirmationModal").classList.remove('hidden');
}

// Close the modal when the cancel button is clicked
function hideModal() {
    document.getElementById("confirmationModal").classList.add('hidden');
};

// Check to make sure a quote actually exists
function quoteExists(quote_id){
    let allQuoteIDs = ALL_DATA.map((quote) => String(quote.quote_id)) // Get all quote ids
    console.log(allQuoteIDs)
    if (!allQuoteIDs.includes(String(quote_id))) {
        console.log("ERROR: Could not find quote")
        return false
    }

    return true
}

// Go through the steps of deleting a quote
// Check to make sure the quote exists
// Make a request to delete the quote
// Update roster
function deleteQuote(){
    // Ensure quote ID exists in data
    if (!quoteExists(quoteToDeleteID)){
        document.getElementById("confirmDelete").value = -1;
        return;
    }

    // Setting value delete  button to quote id or -1 to cancel
    document.getElementById("confirmDelete").value = quoteToDeleteID;

    // Remove quote from ALL_DATA and update roster
    ALL_DATA = ALL_DATA.filter((quote) => quote.quote_id != quoteToDeleteID);
    updateRoster();

    // Hide modal and reset quoteToDeleteID to invalid id
    hideModal();
    quoteToDeleteID = -1;
}

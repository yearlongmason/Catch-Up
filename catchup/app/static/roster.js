dateAscending = true
const data = JSON.parse(
    document.currentScript.nextElementSibling.textContent
);

function testJSFunc() {
    alert("The JS file is connected and working!")
    dateAscending = false
}
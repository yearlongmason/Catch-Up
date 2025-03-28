const sentences = [
    "The quick brown fox jumps over the lazy dog",
    "A journey of a thousand miles begins with a single step",
    "To be or not to be that is the question",
    "All that glitters is not gold",
    "Practice makes perfect"
];
let currentIndex = 0;

function scrambleSentence(sentence) {
    return sentence.split(' ').sort(() => 0.5 - Math.random()).join(' ');
}

function displaySentence() {
    let scrambledSentence = scrambleSentence(sentences[currentIndex]);
    document.getElementById('scrambledSentence').textContent = scrambledSentence;
    document.getElementById('userGuess').value = '';
    document.getElementById('result').textContent = '';
}

function checkAnswer() {
    const userGuess = document.getElementById('userGuess').value.trim();
    const result = document.getElementById('result');

    if (userGuess.toLowerCase() === sentences[currentIndex].toLowerCase()) {
        result.textContent = "Correct! Well done!";
        result.className = "text-green-500";
        document.getElementById('nextSentence').classList.remove('hidden');
    } else {
        result.textContent = "Oops! Try again.";
        result.className = "text-red-500";
    }
}

function nextScrambledSentence() {
    currentIndex++;
    if (currentIndex < sentences.length) {
        displaySentence();
        document.getElementById('nextSentence').classList.add('hidden');
    } else {
        document.getElementById('scrambledSentence').textContent = "Game Over!";
        document.getElementById('result').textContent = "You completed all the sentences!";
        document.getElementById('result').className = "text-blue-500";
        document.getElementById('nextSentence').classList.add('hidden');
    }
}

window.onload = (event) => {
    displaySentence();
};


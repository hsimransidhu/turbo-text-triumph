 'use strict';
import { onEvent, getElement, create } from './utils.js';
import Score from './class.js';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const words = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
    'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
    'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
    'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
    'philosophy', 'database', 'periodic', 'capitalism', 'abominable',
    'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
    'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology', 'promise',
    'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
    'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
    'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess',
    'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library',
    'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy',
    'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous',
    'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
    'keyboard', 'window', 'beans', 'truck', 'sheep', 'band', 'level', 'hope',
    'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 'mask',
    'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
    'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort', 'escape'
];
let shuffledWords;
let wordIndex;
let score = 0;
let time = 20;
let isPlaying = false;
let speechPlayed = false;

const wordDisplay = getElement('word-display');
const clearScore = getElement('clearScores');
const wordInput = getElement('word-input');
const timeDisplay = getElement('time');
const hitsDisplay = getElement('hits');
const scoreHitsDisplay = getElement('scoreHits');
const scoreTimeDisplay = getElement('scoreTime');
const startBtn = getElement('start-btn');
const restartBtn2 = getElement('restart-btn2');
const endBtn = getElement('end-btn');
const restartBtn = getElement('restart-btn');
const scoreContainer = getElement('score-container');
const gameContainer = getElement('game-container');
const res = getElement('dis');
const correctSound = document.getElementById('correctSound');
const winSound = document.getElementById('winSound');
const audio = new Audio('./assets/audio/bg.mp3');

onEvent('click', startBtn, init);
onEvent('click', restartBtn2, init);
onEvent('click', endBtn, endGame);
onEvent('click', restartBtn, restartGame);
clearScore.addEventListener('click', clearRecords);
let intervalId;

function init() {
    if (!isPlaying) {
        isPlaying = true;
        score = 0;
        wordInput.value = '';
        startBtn.innerHTML = 'Restart Game';
        endBtn.style.display = 'block';
        gameContainer.style.display = 'block';
        scoreContainer.style.display = 'none';
        shuffledWords = shuffleArray(words);
        startGame();
        clearInterval(intervalId);
        intervalId = setInterval(countdown, 1000); // Changed from 999 to 1000
        time = 21;
        playAudio();
    } else if (startBtn.innerHTML === 'Restart Game') {
        score = 0;
        time = 20;
        isPlaying = true;
        restartGame();
        clearInterval(intervalId);
        intervalId = setInterval(countdown, 1000);
        playAudio();
    }
}

function playAudio() {
    audio.play();
}

function stopAudio() {
    audio.pause();
    audio.currentTime = 0;
}

function playCorrectSound() {
    correctSound.currentTime = 0;
    correctSound.play();
}

function playwinSound() {
    winSound.currentTime = 4;
    winSound.play();
}

function shuffleArray(array) {
    return array.slice().sort(() => Math.random() - 0.5);
}

function startGame() {
    wordInput.focus();
    speechPlayed = false;
    wordIndex = 0;
    showWord(shuffledWords[wordIndex]);
    onEvent('input', wordInput, matchWords);

}

function restartGame() {
    wordIndex = 0;
    score = 0;
    hitsDisplay.textContent = 0;
    speechPlayed = false;
    shuffledWords = shuffleArray(words);
    showWord(shuffledWords[wordIndex]);
    onEvent('input', wordInput, matchWords);
    time = 20;
}

function showWord(word) {
    wordDisplay.textContent = word;
    playCorrectSound();
}

function matchWords() {
    if (wordInput.value === shuffledWords[wordIndex]) {
        score++;
        wordIndex++;
        if (wordIndex === shuffledWords.length) {
            endGame();
        } else {
            showWord(shuffledWords[wordIndex]);
            wordInput.value = '';
        }
    }
    hitsDisplay.textContent = score;
}

function countdown() {
    if (time > 0 && isPlaying) {
        time--;
        timeDisplay.textContent = time;
    } else {
        endGame();
    }
}
function addScores(){
    const currentDate = new Date();
    const scoreObject = {
        date: currentDate,
        hits: score,
        percentage: (score / words.length) * 100,
    };
    let scoresHistory = JSON.parse(localStorage.getItem('scoresHistory')) || [];
    scoresHistory.push(scoreObject);
    localStorage.setItem('scoresHistory', JSON.stringify(scoresHistory));

}

function endGame() {
    isPlaying = false;
    if (score > 10) {
        confetti();
        playwinSound();
    }
    startBtn.innerHTML = 'Start Game';
    endBtn.style.display = 'none';
    gameContainer.style.display = 'none';
    onEvent('input', wordInput, matchWords);
    stopAudio();
    scoreContainer.style.display = 'block';
    scoreHitsDisplay.textContent = score;
    if (!speechPlayed) {
        let comment = '';

        switch (true) {
            case score >= 7:
                comment = 'Dynamic Typing Keep it Up!..';
                playwinSound();
                addScores();
                break;
            case score >= 5:
                comment = 'You have good typing speed...';
                playwinSound();
                addScores();
                break;
            case score >= 3:
                comment = 'Great, You are Doing Awesome...';
                playwinSound();
                addScores();
                break;
            case score >= 2:
                comment = 'Nice One...';
                addScores();
                break;
            case score >= 1:
                comment = 'Good Try...';
                addScores();
                break;
            default:
                comment = 'Better Luck Next time...';
                addScores();
                break;
        }

        res.innerHTML = comment;
        speak(comment);
        speechPlayed = true;

        const currentDate = new Date();
        const scoreObject = new Score(currentDate, score, (score / words.length) * 100);

        document.getElementById('Date').textContent = scoreObject.date.toLocaleDateString();
        document.getElementById('percentage').textContent = `${scoreObject.percentage.toFixed(2)}%`;
         
    }
}

function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
}

document.addEventListener('DOMContentLoaded', function () {
    const game = new Game();
    const scoreboardModal = document.getElementById('scoreboard-modal');
    const closeBtn = document.getElementById('closeBtn');
    const scoreboardBtn = document.getElementById('scoreboard-btn');

    function openScoreboardModal() {
        scoreboardModal.style.display = 'block';
        game.updateScoreboard();
    }
   

    function closeScoreboardModal() {
        scoreboardModal.style.display = 'none';
    }

    scoreboardBtn.addEventListener('click', openScoreboardModal);
    closeBtn.addEventListener('click', closeScoreboardModal);

    const recentScore = game.scores[0];
    if (recentScore) {
        document.getElementById('recent-hits').textContent = recentScore.hits;
        document.getElementById('recent-percentage').textContent = `${recentScore.percentage.toFixed(2)}%`;
    }
});

function showScoreBoards() {
    const modal = document.getElementById('scoreboard-modal');
    modal.style.display = 'block';
    const show = document.getElementById('scoreBoardResult');
    const scoresHistory = JSON.parse(localStorage.getItem('scoresHistory')) || [];
    show.innerHTML = '';

    // Display scores in the scoreBoardResult div
    if (scoresHistory.length > 0) {
        const ulElement = document.createElement('ul');
        ulElement.style.listStyle = 'none'; // Set list style to none

        scoresHistory.forEach(function (score, index) {
             // Convert the date string to a Date object
             const dateObject = new Date(score.date);
            const dateWithoutTime = dateObject.toLocaleDateString(); 
            const listItem = document.createElement('li');
            listItem.innerHTML = `${index + 1}. Date: ${dateWithoutTime}&nbsp; Hits: ${score.hits}&nbsp; Percentage: ${score.percentage.toFixed(2)}%`;
            ulElement.appendChild(listItem);
        });

        show.appendChild(ulElement);
    } else {
        show.textContent = 'No scores available.';
    }
}

// Bind the showScoreBoards function to the button click event
const showScoresBtn = document.getElementById('showScoresBtn');
showScoresBtn.addEventListener('click', showScoreBoards);

// Close the modal when the close button is clicked
const closeBtn = document.getElementById('closeBtn');
closeBtn.addEventListener('click', function () {
    const modal = document.getElementById('scoreboard-modal');
    modal.style.display = 'none';
});

function clearRecords()
{
    localStorage.removeItem('scoresHistory');
    showScoreBoards();
}
 

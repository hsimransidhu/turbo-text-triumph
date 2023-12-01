'use strict';

class Score {
    #date;
    #hits;
    #percentage;

    constructor(date, hits, percentage) {
        this.#date = date;
        this.#hits = hits;
        this.#percentage = percentage;
    }

    get date() {
        return this.#date;
    }

    get hits() {
        return this.#hits;
    }

    get percentage() {
        return this.#percentage;
    }
}

import { onEvent, getElement } from './utils.js';
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
let time = 99;
let isPlaying = false;
let speechPlayed = false;

const wordDisplay = getElement('word-display');
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

function init() {
    if (!isPlaying) {
        isPlaying = true;
        score = 0;
        time = 99;
        wordInput.value = "";
        startBtn.innerHTML = 'Restart Game';
        endBtn.style.display = 'block';
        gameContainer.style.display = "block";
        scoreContainer.style.display = 'none';
        shuffledWords = shuffleArray(words);
        startGame();
        setInterval(countdown, 1000);
        playAudio();
    }
    if (startBtn.innerHTML == 'Restart Game') {
        score = 0;
        time = 99;
        isPlaying = true;
        restartGame();
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
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame() {
    wordIndex = 0;
    showWord(shuffledWords[wordIndex]);
    onEvent('input', wordInput, matchWords);
}

function restartGame() {
    wordIndex = 0;
    speechPlayed = false;
    shuffledWords = shuffleArray(words);
    showWord(shuffledWords[wordIndex]);
    onEvent('input', wordInput, matchWords);
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

function endGame() {
    isPlaying = false;
    if (score > 10) confetti(), playwinSound();

    startBtn.innerHTML = 'Start Game';
    endBtn.style.display = 'none';
    gameContainer.style.display = 'none';
    onEvent('input', wordInput, matchWords);
    stopAudio();
    scoreContainer.style.display = 'block';
    scoreHitsDisplay.textContent = score;
    scoreTimeDisplay.textContent = 99 - time;
    if (!speechPlayed) {
        let comment = '';
        if (score >= 30) {
            comment = "Dynamic Typing Keep it Up!..";
            playwinSound();
        } else if (score >= 20) {
            comment = "You have good typing speed...";
            playwinSound();
        } else if (score >= 15) {
            comment = "Great, You are Doing Awesome...";
            playwinSound();
        } else if (score >= 10) {
            comment = "Nice One...";
        } else if (score >= 5) {
            comment = "Good Try...";
        } else {
            comment = "Better Luck Next time...";
        }
        res.innerHTML = comment;
        speak(comment);
        speechPlayed = true;

        const currentDate = new Date();
        const scoreObject = new Score(currentDate, score, (score / words.length) * 100);

        // Displaying the Score object properties in HTML
        document.getElementById('Date').textContent = scoreObject.date.toLocaleDateString();
        document.getElementById('percentage').textContent = `${scoreObject.percentage}%`;
    }
}

function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
}

 

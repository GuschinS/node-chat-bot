'use strict';

const socket = io();

const conversationContainer = document.querySelector('.chat-bot-container');
const yourTemplate = '<div class="message-wrapper">\n' +
    '                <div class="message message-person">\n' +
    '                    <p class="message-text output-you">{{text}}</p>\n' +
    '                </div>\n' +
    '                <div class="avatar avatar-person">\n' +
    '                    <span>you</span>\n' +
    '                </div>\n' +
    '            </div>';

const botTemplate = '<div class="message-wrapper">\n' +
    '                <div class="avatar avatar-bot">\n' +
    '                    <span>bot</span>\n' +
    '                </div>\n' +
    '                <div class="message message-bot">\n' +
    '                    <p class="message-text output-bot">{{text}}</p>\n' +
    '                </div>\n' +
    '            </div>';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'ru-RU';//'en-US';
recognition.interimResults = false;

recognition.addEventListener('result', (e) => {
    console.log('Result has been detected.');

    let text = e.results[e.results.length - 1][0].transcript;

    addMessage(yourTemplate, text);
    console.log('Confidence: ' + e.results[0][0].confidence);

    socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
    recognition.stop();
});

recognition.addEventListener('error', (e) => {
    addMessage(botTemplate, 'Error: ' + e.error);
});

function addMessage(template, text) {
    let wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper';
    wrapper.innerHTML = template.replace('{{text}}', text);
    conversationContainer.appendChild(wrapper);
};

socket.on('bot reply', function(replyText) {
    synthVoice(replyText);
    if(replyText == '') replyText = '(No answer...)';
    addMessage(botTemplate, replyText);
});

function synthVoice(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
}


document.querySelector('.image-container').addEventListener('click', () => {
    recognition.start();
});

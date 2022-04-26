//"use strict";

const urlParams = new URLSearchParams(window.location.search);

var token = urlParams.get('deeplkey');
var spokenlanguage = urlParams.get('spokenlanguage');
var translanguage = urlParams.get('translanguage');
var transSelected = urlParams.get('transSelected');
alert(`${token}, ${translanguage}, ${transSelected}, ${spokenlanguage}`);

let useTranslate = (transSelected === "on") ? true : false;

//alert(`${token}, ${translanguage}, ${transSelected}, ${spokenlanguage}`);

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
let speechResult = "init";

var areaSubtitle = document.querySelector('.subtitle');
//var areaTranslation = document.querySelector('.translation');

// var btnTest = document.querySelector('button');
//var txtDebug = document.querySelector('.debug');

testSpeech(spokenlanguage,useTranslate,translanguage);

function testSpeech(spokenlanguage, useTranslate = false, translanguage="EN",token) {
  areaSubtitle.textContent = " ";

  var recognition = new SpeechRecognition();

  recognition.lang = spokenlanguage;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = true;

  recognition.start();

  recognition.onresult = function (event) {
    speechResult = event.results[0][0].transcript;
    if (useTranslate) {
      translateText(speechResult, translanguage,token);
    }
    else
      areaSubtitle.textContent = speechResult;

    recognition.stop();
  }

  recognition.onerror = function (event) {
    btnTest.disabled = false;
    btnTest.textContent = 'Start new test';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

  recognition.onend = function (event) {
    //Fired when the speech recognition service has disconnected.
    recognition.start();
    console.log('SpeechRecognition.onend');
  }

}

async function translateText(text2translate, translanguage, token) {

  const url = "https://api-free.deepl.com/v2/translate";
  //const token = "54cfddd9-5296-3646-2c47-6c4cfb56af89:fx";
  alert(token);
  let body = `auth_key=${token}&text=${text2translate}&target_lang=${translanguage}`;

  let param = {
    method: 'POST',
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: body
  }

  fetch(url, param)
    .then(response => response.json())
    .then(json => {
      areaSubtitle.textContent = json.translations[0].text;
    })
    .catch((error) => {
      // handle error
      alert(error);
      log(`error ${error}`);
    });
}


//btnTest.addEventListener('click', testSpeech);
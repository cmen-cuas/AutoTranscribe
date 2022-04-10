//"use strict";

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
let speechResult = "init";

var areaSubtitle = document.querySelector('.subtitle');
var areaTranslation = document.querySelector('.translation');
var btnTest = document.querySelector('button');
var txtDebug = document.querySelector('.debug');
var translanguage = document.getElementById('translanguage');
var spokenlanguage = document.getElementById('spokenlanguage');

async function translateText(text2translate,lang) {

  const url = "https://api-free.deepl.com/v2/translate";
  const token = "54cfddd9-5296-3646-2c47-6c4cfb56af89:fx";

  //alert(`in fun translateText: ${lang}`);
  let body = `auth_key=${token}&text=${text2translate}&target_lang=${lang}`;

  let param = {
    method: 'POST',
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: body
  }

  fetch(url, param)
    .then(response => response.json())
    .then(json => {
      // handle success
      //alert(json.areaTranslations[0].text);
      areaTranslation.textContent = json.translations[0].text;
    })
    .catch((error) => {
      // handle error
      alert(error);
      log(`error ${error}`);
    });
}

function testSpeech() {
  btnTest.disabled = true;
  txtDebug.textContent = "listening ....";
  btnTest.textContent = 'Test in progress';
  areaSubtitle.textContent = ' ';
  areaTranslation.textContent = " ";

  var e = document.getElementById('MyLang');

  // alert(`Spoken Language: ${spokenlanguage.value}`);
  // alert(`Translate Language: ${translanguage.value}`);
  var recognition = new SpeechRecognition();

  recognition.lang = spokenlanguage.value;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = true;

  recognition.start();

  recognition.onresult = function (event) {
    speechResult = event.results[0][0].transcript;
    areaSubtitle.textContent = speechResult;
    translateText(speechResult,translanguage.value)
    recognition.stop();
  }

  // recognition.onspeechend = function (event) {
  //   txtDebug.textContent = 'in onspeechend';
  // }

  recognition.onerror = function (event) {
    btnTest.disabled = false;
    btnTest.textContent = 'Start new test';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

  recognition.onaudiostart = function (event) {
    txtDebug.textContent = 'SpeechRecognition.onaudiostart';
    //Fired when the user agent has started to capture audio.
    console.log('SpeechRecognition.onaudiostart');
  }

  recognition.onaudioend = function (event) {
    //Fired when the user agent has finished capturing audio.
    txtDebug.textContent = 'SpeechRecognition.onaudioend';
    console.log('SpeechRecognition.onaudioend');
  }

  recognition.onend = function (event) {
    //Fired when the speech recognition service has disconnected.
    recognition.start();
    txtDebug.textContent = "listening ....";
    btnTest.textContent = 'Test in progress';
    console.log('SpeechRecognition.onend');
  }

  // recognition.onnomatch = function (event) {
  //   //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
  //   console.log('SpeechRecognition.onnomatch');
  // }

  // recognition.onsoundstart = function (event) {
  //   //Fired when any sound — recognisable speech or not — has been detected.
  //   console.log('SpeechRecognition.onsoundstart');
  // }

  // recognition.onsoundend = function (event) {
  //   //Fired when any sound — recognisable speech or not — has stopped being detected.
  //   console.log('SpeechRecognition.onsoundend');
  // }

  // recognition.onspeechstart = function (event) {
  //   //Fired when sound that is recognised by the speech recognition service as speech has been detected.
  //   console.log('SpeechRecognition.onspeechstart');
  // }
  // recognition.onstart = function (event) {
  //   //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
  //   txtDebug.textContent = 'SpeechRecognition.onstart'
  //   console.log('SpeechRecognition.onstart');
  // }
}

btnTest.addEventListener('click', testSpeech);
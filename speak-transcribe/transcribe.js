//"use strict";

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('deeplkey');
var translanguage = urlParams.get('translanguage');
var spokenlanguage = urlParams.get('spokenlanguage');
var chkTranslate = urlParams.get('chkTranslate');

//alert(`${deeplkey}, ${translanguage}, ${chkTranslate}, ${spokenlanguage}`);
let useTranslate = (chkTranslate === null) ? false : true;

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
let speechResult = "init";

var areaSubtitle = document.querySelector('.subtitle');
var areaTranslation = document.querySelector('.translation');

// var btnTest = document.querySelector('button');
//var txtDebug = document.querySelector('.debug');

async function translateText(text2translate, lang) {

  const url = "https://api-free.deepl.com/v2/translate";
  const token = token; //"54cfddd9-5296-3646-2c47-6c4cfb56af89:fx";

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
      areaSubtitle.textContent = json.translations[0].text;
    })
    .catch((error) => {
      // handle error
      alert(error);
      log(`error ${error}`);
    });
}

function testSpeech(useTranslate) {
  areaSubtitle.textContent = " ";
  areaTranslation.textContent = " ";

  var recognition = new SpeechRecognition();

  recognition.lang = spokenlanguage.value;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = true;

  recognition.start();

  recognition.onresult = function (event) {
    speechResult = event.results[0][0].transcript;

    if (useTranslate)
      var rest = translateText(speechResult, translanguage.value);
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
    // txtDebug.textContent = "listening ....";
    // btnTest.textContent = 'Test in progress';
    console.log('SpeechRecognition.onend');
  }

}

testSpeech(useTranslate);
//btnTest.addEventListener('click', testSpeech);
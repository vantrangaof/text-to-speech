// Init SpeechSynth API. Read more here: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
const synth = window.speechSynthesis;

// DOM Elements 
const textForm = document.querySelector("form")
const textInput = document.querySelector("#text-input")
const rate = document.querySelector("#rate")
const rateValue = document.querySelector("#rate-value")
const pitch = document.querySelector("#pitch")
const pitchValue = document.querySelector("#pitch-value")
const voiceSelect = document.querySelector("#voice-select")
const optGroup = document.querySelector("optgroup")
const body = document.querySelector("body")

//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Fetch Voices Using API
// Init Voice Array
let voices = []

const getVoices = () => {
    voices = synth.getVoices()
   // console.log(voices)

   // Loop through voices
   voices.forEach(voice => {
       const option = document.createElement("option")
       option.textContent =`${voice.name} (${voice.lang})`;
       // console.log(`${voice.name} (${voice.lang})`)
       option.style.fontSize="15px"
       option.setAttribute("data-name", voice.name)
       option.setAttribute("data-lang", voice.lang)
       optGroup.appendChild(option)

   })
}
getVoices()
// getVoices is an async function, hence we need to use onvoiceschanged event first, so the getVoices() won't return an empty array
if (isFirefox) {
    getVoices();
} else {
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}
}

window.addEventListener('DOMContentLoaded', () => {
    const welcomeSpeech = new SpeechSynthesisUtterance("Hi, I am AI Talk, your assistant! Hope you will have a nice day")
     // Loop through voices 
     voices.forEach(voice => {
        if (voice.name === "Victoria") {
            welcomeSpeech.voice = voice
        }
    })
    welcomeSpeech.rate = 1
    synth.speak(welcomeSpeech)
});

// Function Speak
const speak = () => {
    // Check if the browser is speaking
    if (synth.speaking) {
        console.error("Speaking now...")
        return;
    }
    // Make sure the text area is not an empty
    if (textInput.value !== '') {
        // Add background animation
        body.style.background = '#141414 url(img/wave.gif)';
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = 'cover';

        const speakText = new SpeechSynthesisUtterance(textInput.value)
        // When speech ends
        speakText.onend = e => {
            console.log("Done speaking...")
            body.style.background = "#141414 url('img/video_speech.gif')"
            body.style.backgroundSize = 'cover';
        }
        // Speech error
        speakText.onerror = e => {
            console.error("Err")
        }
        // Selected voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute("data-name")
        console.log(voiceSelect)

        // Loop through voices 
        voices.forEach(voice => {
            if (voice.name === selectedVoice) {
                speakText.voice = voice
            }
        })
        
        // Set pitch & rate
        speakText.rate = rate.value
        speakText.pitch = pitch.value

        //Speaking
        synth.speak(speakText)
    }
    else {
        const reminderSpeech = new SpeechSynthesisUtterance("Type your content first")
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute("data-name")
        voices.forEach(voice => {
            if (voice.name === selectedVoice) {
                reminderSpeech.voice = voice
            }
        })
        synth.speak(reminderSpeech)
    }
}

// Event Listeners

// Text form submit
textForm.addEventListener("submit", e => {
    e.preventDefault()
    speak()
    textInput.blur()
})

// Rate & Pitch value change
rate.addEventListener('change', e => rateValue.textContent = rate.value)
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value)

// Selected voice change
voiceSelect.addEventListener('change', e => speak())

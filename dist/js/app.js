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
       option.setAttribute("data-name", voice.name)
       option.setAttribute("data-lang", voice.lang)
       voiceSelect.appendChild(option)

   })
}
getVoices()
// getVoices is an async function, hence we need to use onvoiceschanged event first, so the getVoices() won't return an empty array
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices
}


// Function Speak
const speak = () => {
    // Check if the browser is speaking
    if (synth.speaking) {
        console.error("Speaking now...")
        return;
    }
    // Make sure the text area is not an empty
    if (textInput.value !== '') {
        const speakText = new SpeechSynthesisUtterance(textInput.value)
        // When speak ends
        speakText.onend = e => {
            console.log("Done speaking...")
        }
        // Speak error
        speakText.onerror = e => {
            console.error("Err")
        }
        // Selected voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute("data-name")
        console.log(selectedVoice)
        // Loop through voices 
        voices.forEach(voice => {
            if (voice.name = selectedVoice) {
                speakText.voice = voice
            }
        })
        
        // Set pitch & rate
        speakText.rate = rate.value
        speakText.pitch = pitch.value

        //Speaking
        synth.speak(speakText)
    }
}
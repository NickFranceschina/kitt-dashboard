// Pre-define toggle function for ElevenLabs config panel
function toggleConfig() {
    const configBody = document.getElementById('config-body');
    const configToggle = document.getElementById('config-toggle');
    if (configBody && configToggle) {
        configBody.classList.toggle('expanded');
        configToggle.textContent = configBody.classList.contains('expanded') ? '-' : '+';
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Generate LED columns for voice modulator
    const voiceModulator = document.getElementById('voice-modulator');
    const numColumns = 3; // Only 3 columns like the original
    const ledsPerColumn = 16;
    let ledElements = [];
    
    for (let col = 0; col < numColumns; col++) {
        const ledColumn = document.createElement('div');
        ledColumn.className = 'led-column';
        const colLeds = [];
        
        for (let row = 0; row < ledsPerColumn; row++) {
            const led = document.createElement('div');
            led.className = 'led';
            ledColumn.appendChild(led);
            colLeds.push(led);
        }
        
        voiceModulator.appendChild(ledColumn);
        ledElements.push(colLeds);
    }
    
    // Variables for voice animation
    let voiceAnimationId = null;
    
    // Function to animate voice modulator with provided values - diamond pattern
    function animateVoice(value) {
        // If an array was passed, use the first value
        if (Array.isArray(value)) {
            value = value[0];
        }
        
        // Reset all LEDs
        for (let col = 0; col < ledElements.length; col++) {
            for (let row = 0; row < ledElements[col].length; row++) {
                ledElements[col][row].classList.remove('active');
            }
        }
        
        // Calculate how many LEDs to light in center column (full value)
        const centerColumn = 1; // Middle column index
        const numCenterLeds = Math.floor((value / 100) * ledsPerColumn);
        
        // Side columns get fewer LEDs (70% of center height) to create diamond shape
        const sideColumns = [0, 2]; // Left and right column indices
        const numSideLeds = Math.floor(numCenterLeds * 0.7);
        
        // Light center column
        const middleIndex = Math.floor(ledsPerColumn / 2);
        for (let i = 0; i < numCenterLeds; i++) {
            // Light LEDs symmetrically from middle
            if (i % 2 === 0) {
                // Even numbers go up from middle
                const ledIndex = middleIndex - Math.floor(i/2);
                if (ledIndex >= 0) {
                    ledElements[centerColumn][ledIndex].classList.add('active');
                }
            } else {
                // Odd numbers go down from middle
                const ledIndex = middleIndex + Math.ceil(i/2);
                if (ledIndex < ledsPerColumn) {
                    ledElements[centerColumn][ledIndex].classList.add('active');
                }
            }
        }
        
        // Light side columns (shorter)
        for (const colIndex of sideColumns) {
            for (let i = 0; i < numSideLeds; i++) {
                // Light LEDs symmetrically from middle
                if (i % 2 === 0) {
                    // Even numbers go up from middle
                    const ledIndex = middleIndex - Math.floor(i/2);
                    if (ledIndex >= 0) {
                        ledElements[colIndex][ledIndex].classList.add('active');
                    }
                } else {
                    // Odd numbers go down from middle
                    const ledIndex = middleIndex + Math.ceil(i/2);
                    if (ledIndex < ledsPerColumn) {
                        ledElements[colIndex][ledIndex].classList.add('active');
                    }
                }
            }
        }
    }
    
    // Function to generate random voice modulator values
    function randomVoiceAnimation() {
        // Cancel any existing animation
        if (voiceAnimationId) {
            clearInterval(voiceAnimationId);
        }
        
        voiceAnimationId = setInterval(() => {
            // Create multiple wave patterns for more dynamic movement
            const time = Date.now() / 50; // Doubled speed
            const baseValue1 = Math.sin(time) * 0.5 + 0.5; // Primary wave
            const baseValue2 = Math.sin(time * 2.5) * 0.4 + 0.5; // Faster secondary wave
            const baseValue3 = Math.sin(time * 1.2) * 0.3 + 0.5; // Tertiary wave
            
            // Combine waves with different phases and amplitudes
            const combinedValue = (baseValue1 * 0.4 + baseValue2 * 0.4 + baseValue3 * 0.2);
            
            // Add more dynamic randomness
            const randomFactor = 0.4; // Increased randomness
            const randomness = (Math.random() * 2 - 1) * randomFactor;
            
            // Add more frequent spikes for more dramatic effect
            const spikeChance = 0.1; // 10% chance of a spike
            const spikeValue = Math.random() < spikeChance ? 2.0 : 1;
            
            // Scale to 0-100 range with spikes and more sensitivity
            const value = Math.max(0, Math.min(100, (combinedValue + randomness) * 120 * spikeValue));
            
            // Animate with a single value (the function will create diamond pattern)
            animateVoice(value);
        }, 20); // Reduced interval for even smoother animation
    }
    
    // Function to stop voice animation
    function stopVoiceAnimation() {
        if (voiceAnimationId) {
            clearInterval(voiceAnimationId);
            voiceAnimationId = null;
        }
        
        // Turn off all LEDs
        for (let col = 0; col < ledElements.length; col++) {
            for (let row = 0; row < ledElements[col].length; row++) {
                ledElements[col][row].classList.remove('active');
            }
        }
    }
    
    // Function to set the display mode
    function activateMode(mode) {
        document.getElementById('auto-cruise').classList.remove('active');
        document.getElementById('normal-cruise').classList.remove('active');
        document.getElementById('pursuit').classList.remove('active');
        
        document.getElementById(mode).classList.add('active');
    }
    
    // Function to toggle a button on/off
    function toggleButton(id) {
        const button = document.getElementById(id);
        button.classList.toggle('active');
        return button.classList.contains('active');
    }
    
    // Event listeners for mode buttons
    document.getElementById('auto-cruise').addEventListener('click', () => activateMode('auto-cruise'));
    document.getElementById('normal-cruise').addEventListener('click', () => activateMode('normal-cruise'));
    document.getElementById('pursuit').addEventListener('click', () => activateMode('pursuit'));
    
    // Event listeners for voice modulator buttons
    document.getElementById('btn-voice-random').addEventListener('click', randomVoiceAnimation);
    document.getElementById('btn-voice-off').addEventListener('click', stopVoiceAnimation);
    
    // Event listeners for all buttons
    document.getElementById('air').addEventListener('click', () => toggleButton('air'));
    document.getElementById('oil').addEventListener('click', () => toggleButton('oil'));
    document.getElementById('p1').addEventListener('click', () => toggleButton('p1'));
    document.getElementById('p2').addEventListener('click', () => toggleButton('p2'));
    document.getElementById('s1').addEventListener('click', () => toggleButton('s1'));
    document.getElementById('s2').addEventListener('click', () => toggleButton('s2'));
    document.getElementById('p3').addEventListener('click', () => toggleButton('p3'));
    document.getElementById('p4').addEventListener('click', () => toggleButton('p4'));
    
    // Initialize with auto-cruise mode and start random voice animation
    activateMode('auto-cruise');
    
    // API functions that can be called from outside this script
    
    // Function to set voice modulator values programmatically
    window.setVoiceValues = function(value) {
        // Stop any automatic animation
        stopVoiceAnimation();
        // Set the values directly
        animateVoice(value);
    };
    
    // Function to set a button state programmatically
    window.setButtonState = function(id, state) {
        const button = document.getElementById(id);
        if (state) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    };
    
    // Function to set the mode programmatically
    window.setMode = function(mode) {
        if (['auto-cruise', 'normal-cruise', 'pursuit'].includes(mode)) {
            activateMode(mode);
        }
    };
    
    // Function to connect to audio
    window.connectToAudio = function(audioElement) {
        if (!(audioElement instanceof HTMLAudioElement)) {
            console.error('Not a valid audio element');
            return;
        }
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audioElement);
        
        analyser.fftSize = 64; // Increased for more frequency bands
        analyser.smoothingTimeConstant = 0.3; // Reduced for faster response
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        // Stop any current animation
        stopVoiceAnimation();
        
        // Create new animation based on audio
        voiceAnimationId = setInterval(() => {
            analyser.getByteFrequencyData(dataArray);
            
            // Get weighted average intensity across frequency spectrum
            let sum = 0;
            let weightSum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                // Weight higher frequencies more heavily for more dynamic response
                const weight = 1 + (i / dataArray.length);
                sum += dataArray[i] * weight;
                weightSum += weight;
            }
            const average = (sum / weightSum) * 120 / 255; // Increased sensitivity
            
            // Add some randomness for more organic movement
            const randomFactor = 0.2;
            const randomness = (Math.random() * 2 - 1) * randomFactor;
            
            // Add occasional spikes for dramatic effect
            const spikeChance = 0.05;
            const spikeValue = Math.random() < spikeChance ? 1.5 : 1;
            
            // Scale to 0-100 range with spikes
            const value = Math.max(0, Math.min(100, average * spikeValue));
            
            // Animate with a single value (our function creates the diamond pattern)
            animateVoice(value);
        }, 20); // Reduced interval for smoother animation
        
        console.log('Audio connected successfully');
        return true;
    };
    
    // Speech Recognition Implementation
    let recognition = null;
    let isListening = false;
    const micButton = document.getElementById('mic-button');
    const statusText = document.getElementById('status-text');
    
    // Check if browser supports Speech Recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        // Configure speech recognition
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        // Event handlers for speech recognition
        recognition.onstart = function() {
            isListening = true;
            micButton.classList.add('listening');
            statusText.textContent = "Listening...";
            
            // Activate the voice modulator animation
            randomVoiceAnimation();
            
            // Switch to PURSUIT mode to indicate KITT is listening
            activateMode('pursuit');
        };
        
        recognition.onresult = function(event) {
            const speechResult = event.results[0][0].transcript;
            statusText.textContent = `You said: "${speechResult}"`;
            
            // Process the speech result
            processSpeechInput(speechResult);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            statusText.textContent = `Error: ${event.error}`;
            stopListening();
        };
        
        recognition.onend = function() {
            stopListening();
        };
    } else {
        statusText.textContent = "Sorry, your browser doesn't support speech recognition";
        micButton.disabled = true;
    }
    
    // Start/stop listening on mic button click
    micButton.addEventListener('click', function() {
        if (!isListening) {
            startListening();
        } else {
            stopListening();
        }
    });
    
    function startListening() {
        if (recognition) {
            recognition.start();
        }
    }
    
    function stopListening() {
        if (recognition) {
            recognition.stop();
        }
        isListening = false;
        micButton.classList.remove('listening');
        statusText.textContent = "Click the microphone to speak to KITT";
        
        // Return to normal state
        activateMode('auto-cruise');
        randomVoiceAnimation();
    }
    
    // ElevenLabs API configuration
    const ELEVENLABS_API_BASE = 'https://api.elevenlabs.io/v1';
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second

    // Audio context for voice playback
    let audioContext = null;
    let audioSource = null;

    // Function to initialize audio context
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Function to stop current audio playback
    function stopAudioPlayback() {
        if (audioSource) {
            audioSource.stop();
            audioSource = null;
        }
    }

    // Function to play audio from array buffer
    async function playAudio(audioBuffer) {
        stopAudioPlayback();
        initAudioContext();
        
        try {
            const audioData = await audioContext.decodeAudioData(audioBuffer);
            audioSource = audioContext.createBufferSource();
            audioSource.buffer = audioData;
            audioSource.connect(audioContext.destination);
            audioSource.start(0);
            
            // Animate voice modulator during playback
            const duration = audioData.duration * 1000; // Convert to milliseconds
            const startTime = Date.now();
            
            const animatePlayback = () => {
                const elapsed = Date.now() - startTime;
                if (elapsed < duration) {
                    // Create a wave pattern based on elapsed time
                    const progress = elapsed / duration;
                    const value = Math.sin(progress * Math.PI * 8) * 50 + 50;
                    animateVoice(value);
                    requestAnimationFrame(animatePlayback);
                } else {
                    stopVoiceAnimation();
                }
            };
            
            animatePlayback();
            
            return new Promise((resolve, reject) => {
                audioSource.onended = resolve;
                audioSource.onerror = reject;
            });
        } catch (error) {
            console.error('Error playing audio:', error);
            throw error;
        }
    }

    // Function to call ElevenLabs API with retries
    async function callElevenLabsAPI(endpoint, options = {}, retryCount = 0) {
        try {
            const config = await getElevenLabsConfig();
            const response = await fetch(`${ELEVENLABS_API_BASE}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': config.apiKey,
                    ...options.headers
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'API request failed');
            }

            return response;
        } catch (error) {
            if (retryCount < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return callElevenLabsAPI(endpoint, options, retryCount + 1);
            }
            throw error;
        }
    }

    // Function to get text-to-speech from ElevenLabs
    async function textToSpeech(text) {
        try {
            const config = await getElevenLabsConfig();
            if (!config.apiKey || !config.voiceId) {
                throw new Error('Missing API key or voice ID in configuration');
            }

            const response = await callElevenLabsAPI(`/text-to-speech/${config.voiceId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg'
                },
                body: JSON.stringify({
                    text,
                    model_id: config.modelId || 'eleven_monolingual_v1',
                    voice_settings: config.additionalParams
                })
            });

            const audioBuffer = await response.arrayBuffer();
            await playAudio(audioBuffer);
        } catch (error) {
            console.error('Error in text-to-speech:', error);
            log('Error generating speech: ' + error.message, 'error');
            throw error;
        }
    }

    // Function to get AI response from ElevenLabs
    async function getAIResponse(text) {
        try {
            const config = await getElevenLabsConfig();
            if (!config.apiKey || !config.voiceId) {
                throw new Error('Missing API key or Voice ID in configuration');
            }

            // Generate a contextual response based on the input
            const response = generateKittResponse(text);
            
            // Convert the response to speech
            await textToSpeech(response);
            
            return response;
        } catch (error) {
            console.error('Error in AI response:', error);
            log('Error getting AI response: ' + error.message, 'error');
            throw error;
        }
    }

    // Add mode state
    let currentMode = 'tts'; // 'tts' or 'ai'

    // Function to switch between modes
    function switchMode(mode) {
        currentMode = mode;
        const ttsButton = document.getElementById('btn-tts-mode');
        const aiButton = document.getElementById('btn-ai-mode');
        
        if (mode === 'tts') {
            ttsButton.classList.add('active');
            aiButton.classList.remove('active');
            log('Switched to Text-to-Speech mode', 'system');
        } else {
            aiButton.classList.add('active');
            ttsButton.classList.remove('active');
            log('Switched to AI Conversation mode', 'system');
        }
    }

    // Update the processSpeechInput function to handle both modes
    async function processSpeechInput(text) {
        try {
            log('Processing speech input: ' + text, 'info');
            addToConversationHistory(text, 'user');
            
            let response;
            if (currentMode === 'tts') {
                // In TTS mode, just echo back what was said without prefix
                response = text;
                await textToSpeech(response);
            } else {
                // In AI mode, generate a contextual response
                response = await getAIResponse(text);
            }
            
            // Add response to the conversation history
            addToConversationHistory(response, 'kitt');
            log('KITT: ' + response, 'kitt');
        } catch (error) {
            log('Error processing speech: ' + error.message, 'error');
            addToConversationHistory('Error: ' + error.message, 'system');
        }
    }

    // Function to add a message to the conversation history
    function addToConversationHistory(message, type = 'user') {
        const history = document.getElementById('conversation-history');
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        history.appendChild(messageDiv);
        history.scrollTop = history.scrollHeight;
    }

    // Function to clear the conversation history
    function clearConversationHistory() {
        const history = document.getElementById('conversation-history');
        history.innerHTML = '';
        window.currentConversationId = null;
        log('Conversation history cleared', 'system');
    }

    // Function to copy the conversation history
    function copyConversationHistory() {
        const history = document.getElementById('conversation-history');
        const text = Array.from(history.children)
            .map(div => div.textContent)
            .join('\n');
        
        navigator.clipboard.writeText(text)
            .then(() => log('Conversation history copied to clipboard', 'system'))
            .catch(err => log('Error copying conversation history: ' + err.message, 'error'));
    }

    // Function to generate KITT's response based on user input
    function generateKittResponse(input) {
        // Convert input to lowercase for easier matching
        input = input.toLowerCase();
        
        // Define some basic response patterns
        const responses = {
            greeting: [
                "Hello, Michael. How can I assist you today?",
                "Greetings, Michael. What can I do for you?",
                "Hello, Michael. I'm here to help."
            ],
            status: [
                "All systems are functioning normally.",
                "My diagnostic systems indicate everything is operating within normal parameters.",
                "I'm running at optimal efficiency."
            ],
            mode: [
                "I am currently in auto-cruise mode.",
                "We are in normal-cruise mode.",
                "Pursuit mode is active."
            ],
            default: [
                "I'm processing your request, Michael.",
                "I understand. Let me help you with that.",
                "I'll take care of that right away."
            ]
        };
        
        // Check for keywords and return appropriate response
        if (input.match(/hello|hi|hey|greetings/)) {
            return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
        }
        else if (input.match(/status|how are you|diagnostic/)) {
            return responses.status[Math.floor(Math.random() * responses.status.length)];
        }
        else if (input.match(/mode|what mode|current mode/)) {
            return responses.mode[Math.floor(Math.random() * responses.mode.length)];
        }
        else {
            return responses.default[Math.floor(Math.random() * responses.default.length)];
        }
    }

    // ElevenLabs Configuration UI
    const configHeader = document.getElementById('config-header');
    const configBody = document.getElementById('config-body');
    const configToggle = document.getElementById('config-toggle');
    const saveConfigButton = document.getElementById('save-config');
    
    // Add click event listener to the config header
    if (configHeader) {
        configHeader.addEventListener('click', toggleConfig);
    }
    
    // Add configuration storage
    let elevenLabsConfig = null;

    // Function to get ElevenLabs configuration
    async function getElevenLabsConfig() {
        // Return cached config if available
        if (elevenLabsConfig) {
            return elevenLabsConfig;
        }

        try {
            const response = await fetch('/config.json');
            if (!response.ok) {
                throw new Error('Configuration file not found');
            }
            const config = await response.json();
            elevenLabsConfig = config.elevenlabs;
            return elevenLabsConfig;
        } catch (error) {
            console.error('Error loading configuration:', error);
            // Fall back to form values if config file is not available
            elevenLabsConfig = {
                apiKey: document.getElementById('api-key').value,
                voiceId: document.getElementById('voice-id').value,
                modelId: document.getElementById('model-id').value,
                agentId: document.getElementById('agent-id').value,
                additionalParams: document.getElementById('additional-params').value
            };
            return elevenLabsConfig;
        }
    }

    // Function to save configuration
    async function saveConfig() {
        const config = {
            elevenlabs: {
                apiKey: document.getElementById('api-key').value,
                voiceId: document.getElementById('voice-id').value,
                modelId: document.getElementById('model-id').value,
                agentId: document.getElementById('agent-id').value,
                additionalParams: document.getElementById('additional-params').value
            },
            speech: {
                language: 'en-US',
                continuous: false,
                interimResults: false
            }
        };
        
        // Update the cached configuration
        elevenLabsConfig = config.elevenlabs;
        
        // In a production environment, you would typically send this to a server
        // For local development, you can show the configuration to copy manually
        console.log('Configuration to save to config.json:', JSON.stringify(config, null, 2));
        alert('Please copy the configuration from the console and save it to config.json');
    }

    // Update the save button click handler
    saveConfigButton.addEventListener('click', saveConfig);

    // Load configuration on page load
    window.addEventListener('load', async function() {
        try {
            const config = await getElevenLabsConfig();
            document.getElementById('api-key').value = config.apiKey || '';
            document.getElementById('voice-id').value = config.voiceId || '';
            document.getElementById('model-id').value = config.modelId || 'eleven_monolingual_v1';
            document.getElementById('agent-id').value = config.agentId || '';
            document.getElementById('additional-params').value = 
                typeof config.additionalParams === 'object' 
                    ? JSON.stringify(config.additionalParams, null, 2)
                    : config.additionalParams || '';
        } catch (error) {
            console.error('Error loading configuration:', error);
        }
    });

    // Add logging functionality
    function log(message, type = 'info') {
        const logArea = document.getElementById('system-log');
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}\n`;
        logArea.value += logEntry;
        logArea.scrollTop = logArea.scrollHeight;
    }

    // Add event listeners for log controls
    document.getElementById('clear-log').addEventListener('click', () => {
        document.getElementById('system-log').value = '';
        log('Log cleared', 'system');
    });

    document.getElementById('copy-log').addEventListener('click', () => {
        const logArea = document.getElementById('system-log');
        logArea.select();
        document.execCommand('copy');
        log('Log copied to clipboard', 'system');
    });

    // Update speech recognition event handlers
    recognition.onstart = () => {
        log('Speech recognition started', 'system');
        micButton.classList.add('listening');
        statusText.textContent = 'Listening...';
    };

    recognition.onend = () => {
        log('Speech recognition ended', 'system');
        micButton.classList.remove('listening');
        statusText.textContent = 'Click the microphone to speak to KITT';
    };

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        log(`Speech recognized: "${text}"`, 'speech');
        processSpeechInput(text);
    };

    recognition.onerror = (event) => {
        log(`Speech recognition error: ${event.error}`, 'error');
        micButton.classList.remove('listening');
        statusText.textContent = 'Error occurred. Click to try again.';
    };

    // Add conversation control event listeners
    document.getElementById('clear-conversation').addEventListener('click', clearConversationHistory);
    document.getElementById('copy-conversation').addEventListener('click', copyConversationHistory);

    // Add mode switch event listeners
    document.getElementById('btn-tts-mode').addEventListener('click', () => switchMode('tts'));
    document.getElementById('btn-ai-mode').addEventListener('click', () => switchMode('ai'));
});
// Function to handle clicks outside the panel
function handleOutsideClick(event) {
    const apiConfig = document.getElementById('api-config');
    const configToggleButton = document.getElementById('config-toggle-button');
    
    // Check if click is outside the panel and toggle button
    if (!apiConfig.contains(event.target) && !configToggleButton.contains(event.target)) {
        // Only close if not pinned
        if (!apiConfig.classList.contains('pinned')) {
            apiConfig.classList.remove('visible');
            configToggleButton.classList.remove('active');
        }
    }
}

// Function to toggle pin state
function togglePin() {
    const apiConfig = document.getElementById('api-config');
    const pinIcon = document.getElementById('pin-icon');
    
    apiConfig.classList.toggle('pinned');
    pinIcon.classList.toggle('pinned');
    
    // Save pinned state to localStorage
    localStorage.setItem('kittConfigPinned', apiConfig.classList.contains('pinned'));
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize panel state
    const apiConfig = document.getElementById('api-config');
    const pinIcon = document.getElementById('pin-icon');
    
    // Restore pinned state from localStorage
    const isPinned = localStorage.getItem('kittConfigPinned') === 'true';
    if (isPinned) {
        apiConfig.classList.add('pinned');
        pinIcon.classList.add('pinned');
    }
    
    // Ensure panel starts hidden
    apiConfig.classList.remove('visible');
    
    // Add click event listener for clicks outside the panel
    document.addEventListener('click', handleOutsideClick);
    
    // Add pin click handler
    if (pinIcon) {
        pinIcon.addEventListener('click', togglePin);
    }
    
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

            // Get conversation history
            const history = document.getElementById('conversation-history');
            const messages = Array.from(history.children).map(div => ({
                role: div.classList.contains('user-message') ? 'user' : 'assistant',
                content: div.textContent
            }));

            // First, get the AI response
            const response = await callElevenLabsAPI('/text-to-speech/' + config.voiceId, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg'
                },
                body: JSON.stringify({
                    text: text,
                    model_id: config.modelId || 'eleven_monolingual_v1',
                    voice_settings: config.additionalParams
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate speech');
            }

            const audioBuffer = await response.arrayBuffer();
            await playAudio(audioBuffer);
            
            return text; // For now, just echo back the text
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
        const micButton = document.getElementById('mic-button');
        const startButton = document.getElementById('start-conversation');
        const endButton = document.getElementById('end-conversation');
        const statusText = document.getElementById('status-text');
        
        if (mode === 'tts') {
            ttsButton.classList.add('active');
            aiButton.classList.remove('active');
            // Show mic button, hide conversation buttons
            micButton.style.display = 'block';
            startButton.style.display = 'none';
            endButton.style.display = 'none';
            // Set TTS mode status text
            statusText.textContent = "Click the microphone to speak to KITT";
            log('Switched to Text-to-Speech mode', 'system');
        } else {
            aiButton.classList.add('active');
            ttsButton.classList.remove('active');
            // Hide mic button, show conversation buttons
            micButton.style.display = 'none';
            startButton.style.display = 'block';
            endButton.style.display = 'block';
            // Set AI mode status text
            statusText.textContent = "Click 'Start Conversation' to begin";
            log('Switched to AI Conversation mode', 'system');
        }
    }

    // Conversation state
    let conversation = null;
    let isStreaming = false;

    // Function to request microphone permission
    async function requestMicrophonePermission() {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            return true;
        } catch (error) {
            console.error('Microphone permission denied:', error);
            return false;
        }
    }

    // Function to get signed URL for streaming
    async function getSignedUrl() {
        try {
            const config = await getElevenLabsConfig();
            if (!config.apiKey || !config.voiceId) {
                throw new Error('Missing API key or Voice ID in configuration');
            }

            // Get the audio stream directly
            const response = await callElevenLabsAPI('/text-to-speech/' + config.voiceId + '/stream', {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg'
                },
                body: JSON.stringify({
                    text: "Hello, I am KITT. How can I help you?",
                    model_id: config.modelId || 'eleven_monolingual_v1',
                    voice_settings: config.additionalParams
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get audio stream');
            }

            // Create a blob from the response
            const blob = await response.blob();
            // Create an object URL from the blob
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Error getting audio stream:', error);
            throw error;
        }
    }

    // Function to update connection status
    function updateStatus(isConnected) {
        const statusText = document.getElementById('status-text');
        statusText.textContent = isConnected ? 'Connected to KITT' : 'Disconnected from KITT';
        statusText.classList.toggle('connected', isConnected);
    }

    // Function to update speaking status
    function updateSpeakingStatus(mode) {
        const statusText = document.getElementById('status-text');
        const isSpeaking = mode.mode === 'speaking';
        statusText.textContent = isSpeaking ? 'KITT is speaking...' : 'Listening...';
        statusText.classList.toggle('speaking', isSpeaking);
        
        // Update voice modulator animation
        if (isSpeaking) {
            randomVoiceAnimation();
        } else {
            stopVoiceAnimation();
        }
    }

    // Function to start streaming conversation
    async function startConversation() {
        const micButton = document.getElementById('mic-button');
        const endButton = document.getElementById('end-conversation');
        
        try {
            const hasPermission = await requestMicrophonePermission();
            if (!hasPermission) {
                alert('Microphone permission is required for the conversation.');
                return;
            }

            const audioUrl = await getSignedUrl();
            
            // Create and configure the audio element
            const audioElement = new Audio();
            audioElement.src = audioUrl;
            audioElement.crossOrigin = 'anonymous';
            
            // Connect the audio element to our audio processing
            await connectToAudio(audioElement);
            
            // Start playing the audio
            await audioElement.play();
            
            // Update UI state
            updateStatus(true);
            micButton.disabled = true;
            endButton.disabled = false;
            isStreaming = true;

            // Switch to AI mode and pursuit display
            switchMode('ai');
            activateMode('pursuit');
            
        } catch (error) {
            console.error('Error starting conversation:', error);
            alert('Failed to start conversation. Please try again.');
        }
    }

    // Function to end streaming conversation
    async function endConversation() {
        if (isStreaming) {
            stopAudioPlayback();
            isStreaming = false;
            
            // Reset UI state
            updateStatus(false);
            document.getElementById('mic-button').disabled = false;
            document.getElementById('end-conversation').disabled = true;
            activateMode('auto-cruise');
            stopVoiceAnimation();
        }
    }

    // Update the processSpeechInput function to handle streaming
    async function processSpeechInput(text) {
        try {
            log('Processing speech input: ' + text, 'info');
            addToConversationHistory(text, 'user');
            
            if (isStreaming && conversation) {
                // In streaming mode, send text directly to conversation
                await conversation.sendMessage(text);
            } else {
                // Fall back to non-streaming mode
                let response;
                if (currentMode === 'tts') {
                    response = text;
                    await textToSpeech(response);
                } else {
                    response = await getAIResponse(text);
                }
                addToConversationHistory(response, 'kitt');
                log('KITT: ' + response, 'kitt');
            }
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

    // ElevenLabs Configuration UI
    const configHeader = document.getElementById('config-header');
    
    // Function to get ElevenLabs configuration
    async function getElevenLabsConfig() {
        try {
            const configText = document.getElementById('config-json').value;
            const config = JSON.parse(configText);
            
            // Validate the configuration structure
            if (!config.elevenlabs || !config.elevenlabs.apiKey || !config.elevenlabs.voiceId) {
                throw new Error('Invalid configuration: Missing required fields (apiKey, voiceId)');
            }
            
            return config.elevenlabs;
        } catch (error) {
            console.error('Error parsing configuration:', error);
            return null;
        }
    }
    
    // Load configuration on page load
    window.addEventListener('load', async function() {
        try {
            // Initialize button visibility based on current mode
            const micButton = document.getElementById('mic-button');
            const startButton = document.getElementById('start-conversation');
            const endButton = document.getElementById('end-conversation');
            
            if (currentMode === 'tts') {
                micButton.style.display = 'block';
                startButton.style.display = 'none';
                endButton.style.display = 'none';
            } else {
                micButton.style.display = 'none';
                startButton.style.display = 'block';
                endButton.style.display = 'block';
            }
        } catch (error) {
            console.error('Error initializing:', error);
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

    // Add event listeners for conversation controls
    document.getElementById('start-conversation').addEventListener('click', startConversation);
    document.getElementById('end-conversation').addEventListener('click', endConversation);

    // Add config toggle button handler
    const configToggleButton = document.getElementById('config-toggle-button');
    if (configToggleButton) {
        configToggleButton.addEventListener('click', toggleConfig);
    }
});

// Pre-define toggle function for ElevenLabs config panel
function toggleConfig() {
    const apiConfig = document.getElementById('api-config');
    const toggleButton = document.getElementById('config-toggle-button');
    
    if (apiConfig && toggleButton) {
        // Show/hide the panel
        apiConfig.classList.toggle('visible');
        toggleButton.classList.toggle('active');
    }
}
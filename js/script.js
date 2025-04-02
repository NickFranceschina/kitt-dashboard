import { Conversation } from 'https://cdn.jsdelivr.net/npm/@11labs/client@latest/+esm';

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
    // Voice Modulator Class
    class VoiceModulator {
        constructor() {
            this.ledElements = [];
            this.animationId = null;
            this.isPlaying = false;
            // Don't initialize LEDs here, we'll do it explicitly
        }

        initializeLEDs() {
            const voiceModulator = document.getElementById('voice-modulator');
            const numColumns = 3;
            const ledsPerColumn = 16;
            
            // Clear existing content
            voiceModulator.innerHTML = '';
            
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
                this.ledElements.push(colLeds);
            }
        }

        animateVoice(value) {
            // If an array was passed, use the first value
            if (Array.isArray(value)) {
                value = value[0];
            }
            
            // Reset all LEDs
            for (let col = 0; col < this.ledElements.length; col++) {
                for (let row = 0; row < this.ledElements[col].length; row++) {
                    this.ledElements[col][row].classList.remove('active');
                }
            }
            
            // Calculate how many LEDs to light in center column (full value)
            const centerColumn = 1; // Middle column index
            const numCenterLeds = Math.floor((value / 100) * this.ledElements[0].length);
            
            // Side columns get fewer LEDs (70% of center height) to create diamond shape
            const sideColumns = [0, 2]; // Left and right column indices
            const numSideLeds = Math.floor(numCenterLeds * 0.7);
            
            // Light center column
            const middleIndex = Math.floor(this.ledElements[0].length / 2);
            for (let i = 0; i < numCenterLeds; i++) {
                // Light LEDs symmetrically from middle
                if (i % 2 === 0) {
                    // Even numbers go up from middle
                    const ledIndex = middleIndex - Math.floor(i/2);
                    if (ledIndex >= 0) {
                        this.ledElements[centerColumn][ledIndex].classList.add('active');
                    }
                } else {
                    // Odd numbers go down from middle
                    const ledIndex = middleIndex + Math.ceil(i/2);
                    if (ledIndex < this.ledElements[0].length) {
                        this.ledElements[centerColumn][ledIndex].classList.add('active');
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
                            this.ledElements[colIndex][ledIndex].classList.add('active');
                        }
                    } else {
                        // Odd numbers go down from middle
                        const ledIndex = middleIndex + Math.ceil(i/2);
                        if (ledIndex < this.ledElements[0].length) {
                            this.ledElements[colIndex][ledIndex].classList.add('active');
                        }
                    }
                }
            }
        }

        startRandomAnimation() {
            // Cancel any existing animation
            this.stopAnimation();
            
            this.animationId = setInterval(() => {
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
                
                this.animateVoice(value);
            }, 20); // Reduced interval for even smoother animation
        }

        startPlaybackAnimation(duration) {
            this.stopAnimation();
            this.isPlaying = true;
            const startTime = Date.now();
            
            const animatePlayback = () => {
                if (!this.isPlaying) return;
                
                const elapsed = Date.now() - startTime;
                if (elapsed < duration) {
                    // Create a wave pattern based on elapsed time
                    const progress = elapsed / duration;
                    const value = Math.sin(progress * Math.PI * 8) * 50 + 50;
                    this.animateVoice(value);
                    requestAnimationFrame(animatePlayback);
                } else {
                    this.stopAnimation();
                }
            };
            
            animatePlayback();
        }

        stopAnimation() {
            if (this.animationId) {
                clearInterval(this.animationId);
                this.animationId = null;
            }
            this.isPlaying = false;
            
            // Turn off all LEDs
            for (let col = 0; col < this.ledElements.length; col++) {
                for (let row = 0; row < this.ledElements[col].length; row++) {
                    this.ledElements[col][row].classList.remove('active');
                }
            }
        }
    }

    // Create voice modulator instance and make it globally available
    window.voiceModulator = new VoiceModulator();

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
    
    // Initialize voice modulator
    window.voiceModulator.initializeLEDs();
    
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
    document.getElementById('btn-voice-random').addEventListener('click', () => window.voiceModulator.startRandomAnimation());
    document.getElementById('btn-voice-off').addEventListener('click', () => window.voiceModulator.stopAnimation());
    
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
        window.voiceModulator.stopAnimation();
        // Set the values directly
        window.voiceModulator.animateVoice(value);
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
        window.voiceModulator.stopAnimation();
        
        // Create new animation based on audio
        window.voiceModulator.animationId = setInterval(() => {
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
            window.voiceModulator.animateVoice(value);
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
        recognition.lang = 'en-US'; // Default language
        
        // Function to update speech recognition language
        async function updateSpeechRecognitionLanguage() {
            try {
                const config = await getElevenLabsConfig();
                if (config && config.language) {
                    recognition.lang = config.language;
                    log(`Speech recognition language set to: ${config.language}`, 'system');
                }
            } catch (error) {
                console.error('Error updating speech recognition language:', error);
            }
        }
        
        // Update language when configuration changes
        const configTextarea = document.getElementById('config-json');
        if (configTextarea) {
            configTextarea.addEventListener('input', updateSpeechRecognitionLanguage);
        }
        
        // Initial language update
        updateSpeechRecognitionLanguage();
        
        // Event handlers for speech recognition
        recognition.onstart = function() {
            isListening = true;
            micButton.classList.add('listening');
            statusText.textContent = "Listening...";
            
            // Activate the voice modulator animation
            window.voiceModulator.startRandomAnimation();
            
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
        window.voiceModulator.stopAnimation();
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
            window.voiceModulator.startPlaybackAnimation(duration);
            
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
    let currentMode = 'ai'; // Changed from 'tts' to 'ai'

    // Function to switch between modes
    async function switchMode(mode) {
        currentMode = mode;
        const ttsButton = document.getElementById('btn-tts-mode');
        const aiButton = document.getElementById('btn-ai-mode');
        const micButton = document.getElementById('mic-button');
        const startButton = document.getElementById('start-conversation');
        const endButton = document.getElementById('end-conversation');
        const statusText = document.getElementById('status-text');
        
        // Check for valid configuration
        const config = await getElevenLabsConfig();
        const hasValidConfig = config && config.apiKey && config.voiceId;
        
        if (!hasValidConfig) {
            // Disable all buttons and show configuration message
            micButton.disabled = true;
            startButton.disabled = true;
            endButton.disabled = true;
            statusText.textContent = "Please configure ElevenLabs API settings in the configuration panel";
            statusText.classList.add('error');
            log('Missing ElevenLabs configuration', 'error');
        } else {
            // Enable buttons and remove error state
            statusText.classList.remove('error');
        }
        
        if (mode === 'tts') {
            ttsButton.classList.add('active');
            aiButton.classList.remove('active');
            // Show mic button, hide conversation buttons
            micButton.style.display = hasValidConfig ? 'block' : 'none';
            startButton.style.display = 'none';
            endButton.style.display = 'none';
            // Set TTS mode status text
            statusText.textContent = hasValidConfig ? "Click the microphone to speak to KITT" : "Please configure ElevenLabs API settings in the configuration panel";
            log('Switched to Text-to-Speech mode', 'system');
        } else {
            aiButton.classList.add('active');
            ttsButton.classList.remove('active');
            // Hide mic button, show conversation buttons
            micButton.style.display = 'none';
            startButton.style.display = hasValidConfig ? 'block' : 'none';
            endButton.style.display = hasValidConfig ? 'block' : 'none';
            // Set AI mode status text
            statusText.textContent = hasValidConfig ? "Click 'Start Conversation' to begin" : "Please configure ElevenLabs API settings in the configuration panel";
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
            if (!config.apiKey || !config.agentId) {
                throw new Error('Missing API key or Agent ID in configuration');
            }

            const response = await fetch(
                `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${config.agentId}`,
                {
                    method: "GET",
                    headers: {
                        "xi-api-key": config.apiKey,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to get signed URL');
            }

            const data = await response.json();
            return data.signed_url;
        } catch (error) {
            console.error('Error getting signed URL:', error);
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
            window.voiceModulator.startRandomAnimation();
        } else {
            window.voiceModulator.stopAnimation();
        }
    }

    // Function to start streaming conversation
    async function startConversation() {
        const micButton = document.getElementById('mic-button');
        const endButton = document.getElementById('end-conversation');
        
        try {
            // First, ensure any existing conversation is properly ended
            if (conversation) {
                await endConversation();
            }

            const hasPermission = await requestMicrophonePermission();
            if (!hasPermission) {
                alert('Microphone permission is required for the conversation.');
                return;
            }

            const config = await getElevenLabsConfig();
            if (!config.apiKey || !config.agentId) {
                throw new Error('Missing API key or Agent ID in configuration');
            }

            const signedUrl = await getSignedUrl();
            
            // Create a new Conversation instance with language configuration
            conversation = await Conversation.startSession({
                signedUrl: signedUrl,
                overrides: {
                    agent: {
                        language: (config.language || 'en-US').split('-')[0]
                    }
                },
                onConnect: () => {
                    console.log('Connected to KITT');
                    updateStatus(true);
                    micButton.disabled = true;
                    endButton.disabled = false;
                    isStreaming = true;
                    activateMode('pursuit');
                    log(`Conversation started with language: ${config.language || 'en-US'}`, 'system');
                },
                onDisconnect: () => {
                    console.log('Disconnected from KITT');
                    updateStatus(false);
                    micButton.disabled = false;
                    endButton.disabled = true;
                    isStreaming = false;
                    activateMode('auto-cruise');
                    window.voiceModulator.stopAnimation();
                    // Clear the conversation reference
                    conversation = null;
                },
                onError: (error) => {
                    console.error('Conversation error:', error);
                    log(`Conversation error: ${error.message}`, 'error');
                    // Don't show alert for WebSocket state errors
                    if (!error.message.includes('WebSocket is already in CLOSING or CLOSED state')) {
                        alert('An error occurred during the conversation.');
                    }
                },
                onModeChange: (mode) => {
                    console.log('Mode changed:', mode);
                    updateSpeakingStatus(mode);
                }
            });
            
        } catch (error) {
            console.error('Error starting conversation:', error);
            log(`Error starting conversation: ${error.message}`, 'error');
            alert('Failed to start conversation. Please try again.');
            // Reset state on error
            conversation = null;
            isStreaming = false;
            updateStatus(false);
            micButton.disabled = false;
            endButton.disabled = true;
        }
    }

    // Helper function to get language name from code
    function getLanguageName(code) {
        const languageMap = {
            'en-US': 'English (US)',
            'es-ES': 'Spanish',
            'it-IT': 'Italian',
            'vi-VN': 'Vietnamese',
            'hi-IN': 'Hindi'
        };
        return languageMap[code] || 'English (US)';
    }

    // Function to end streaming conversation
    async function endConversation() {
        if (conversation) {
            try {
                await conversation.endSession();
                log('Conversation ended successfully', 'system');
            } catch (error) {
                console.error('Error ending conversation:', error);
                log(`Error ending conversation: ${error.message}`, 'error');
            } finally {
                // Always reset state
                conversation = null;
                isStreaming = false;
                updateStatus(false);
                document.getElementById('mic-button').disabled = false;
                document.getElementById('end-conversation').disabled = true;
                activateMode('auto-cruise');
                window.voiceModulator.stopAnimation();
            }
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
            const configText = document.getElementById('config-json').value.trim();
            
            // If config is empty, return null
            if (!configText) {
                return null;
            }
            
            const config = JSON.parse(configText);
            
            // Validate the configuration structure
            if (!config.elevenlabs || !config.elevenlabs.apiKey || !config.elevenlabs.voiceId) {
                throw new Error('Invalid configuration: Missing required fields (apiKey, voiceId)');
            }
            
            // Ensure language is properly set in the config
            if (!config.elevenlabs.language) {
                config.elevenlabs.language = 'en-US'; // Default to English if not set
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
            const statusText = document.getElementById('status-text');
            const ttsButton = document.getElementById('btn-tts-mode');
            const aiButton = document.getElementById('btn-ai-mode');
            
            // Check for valid configuration
            const config = await getElevenLabsConfig();
            const hasValidConfig = config && config.apiKey && config.voiceId;
            
            if (!hasValidConfig) {
                // Disable buttons and show configuration message
                micButton.disabled = true;
                startButton.disabled = true;
                endButton.disabled = true;
                statusText.textContent = "Please configure ElevenLabs API settings in the configuration panel";
                statusText.classList.add('error');
                log('Missing ElevenLabs configuration', 'error');
            } else {
                // Enable buttons and remove error state
                statusText.classList.remove('error');
            }
            
            // Set initial UI state for AI mode
            ttsButton.classList.remove('active');
            aiButton.classList.add('active');
            micButton.style.display = 'none';
            startButton.style.display = hasValidConfig ? 'block' : 'none';
            endButton.style.display = hasValidConfig ? 'block' : 'none';
            statusText.textContent = hasValidConfig ? "Click 'Start Conversation' to begin" : "Please configure ElevenLabs API settings in the configuration panel";
            
            log('Initialized in AI Conversation mode', 'system');
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

    // Add configuration textarea change handler
    const configTextarea = document.getElementById('config-json');
    if (configTextarea) {
        configTextarea.addEventListener('input', async function() {
            const config = await getElevenLabsConfig();
            const hasValidConfig = config && config.apiKey && config.voiceId;
            const micButton = document.getElementById('mic-button');
            const startButton = document.getElementById('start-conversation');
            const endButton = document.getElementById('end-conversation');
            const statusText = document.getElementById('status-text');
            const languageSelect = document.getElementById('language-select');
            
            // Update language dropdown if config has a language
            if (config && config.language && languageSelect) {
                languageSelect.value = config.language;
                log(`Language updated from config: ${config.language}`, 'system');
            }
            
            if (hasValidConfig) {
                // Enable buttons and remove error state
                micButton.disabled = false;
                startButton.disabled = false;
                endButton.disabled = false;
                statusText.classList.remove('error');
                
                // Update button visibility based on current mode
                if (currentMode === 'tts') {
                    micButton.style.display = 'block';
                    startButton.style.display = 'none';
                    endButton.style.display = 'none';
                    statusText.textContent = "Click the microphone to speak to KITT";
                } else {
                    micButton.style.display = 'none';
                    startButton.style.display = 'block';
                    endButton.style.display = 'block';
                    statusText.textContent = "Click 'Start Conversation' to begin";
                }
                
                log('Valid configuration detected', 'system');
            } else {
                // Disable buttons and show error state
                micButton.disabled = true;
                startButton.disabled = true;
                endButton.disabled = true;
                statusText.textContent = "Please configure ElevenLabs API settings in the configuration panel";
                statusText.classList.add('error');
                log('Invalid or incomplete configuration', 'error');
            }
        });
    }

    // Add language selector handler
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', async function() {
            try {
                const selectedLanguage = this.value;
                const configText = document.getElementById('config-json').value.trim();
                
                if (configText) {
                    // Parse the existing configuration
                    const config = JSON.parse(configText);
                    
                    // Ensure elevenlabs section exists
                    if (!config.elevenlabs) {
                        config.elevenlabs = {};
                    }
                    
                    // Update the language in both elevenlabs and speech sections
                    config.elevenlabs.language = selectedLanguage;
                    
                    if (config.speech) {
                        config.speech.language = selectedLanguage;
                    } else {
                        config.speech = {
                            language: selectedLanguage,
                            continuous: false,
                            interimResults: false
                        };
                    }
                    
                    // Update the config textarea with the modified configuration
                    document.getElementById('config-json').value = JSON.stringify(config, null, 4);
                    
                    // Update speech recognition language
                    if (recognition) {
                        recognition.lang = selectedLanguage;
                        log(`Language changed to: ${selectedLanguage}`, 'system');
                    }
                    
                    // If conversation is active, restart it with new language
                    if (isStreaming && conversation) {
                        log('Restarting conversation with new language...', 'system');
                        await endConversation();
                        await startConversation();
                    }
                }
            } catch (error) {
                console.error('Error updating language:', error);
                log('Error updating language: ' + error.message, 'error');
            }
        });

        // Set initial language from config
        async function setInitialLanguage() {
            try {
                const config = await getElevenLabsConfig();
                if (config && config.language) {
                    languageSelect.value = config.language;
                    log(`Initial language set to: ${config.language}`, 'system');
                }
            } catch (error) {
                console.error('Error setting initial language:', error);
            }
        }
        setInitialLanguage();
    }
});

// Pre-define toggle function for ElevenLabs config panel
function toggleConfig() {
    const apiConfig = document.getElementById('api-config');
    const toggleButton = document.getElementById('config-toggle-button');
    
    if (apiConfig && toggleButton) {
        // Only toggle if not pinned
        if (!apiConfig.classList.contains('pinned')) {
            apiConfig.classList.toggle('visible');
            toggleButton.classList.toggle('active');
        }
    }
}
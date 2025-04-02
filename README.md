# KITT Dashboard

A Knight Rider-inspired dashboard interface with ElevenLabs AI integration for natural language interaction.

## Features

- 🎙️ Real-time voice interaction with KITT using ElevenLabs AI
- 🎯 Multiple display modes (Auto Cruise, Normal Cruise, Pursuit)
- 🎨 Dynamic voice modulator visualization
- 🔧 Configurable ElevenLabs API settings
- 🌐 Multi-language support (English, Spanish, Italian, Vietnamese, Hindi)
- 📝 Conversation history with copy/clear functionality
- 📊 System logging for debugging
- 🎮 Interactive dashboard controls

## Configuration

### ElevenLabs API Setup

1. Get your API key from [ElevenLabs](https://elevenlabs.io)
2. Create a voice in your ElevenLabs account
3. Create an AI agent in your ElevenLabs account
4. Open the configuration panel (gear icon)
5. Paste your configuration in this format:

```json
{
    "elevenlabs": {
        "apiKey": "your-api-key-here",
        "voiceId": "your-voice-id-here",
        "modelId": "eleven_monolingual_v1",
        "agentId": "your-agent-id-here",
        "language": "en-US",
        "additionalParams": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.0,
            "use_speaker_boost": true
        }
    },
    "speech": {
        "language": "en-US",
        "continuous": false,
        "interimResults": false
    }
}
```

### Language Support

The dashboard supports multiple languages. You can change the language in two ways:

1. Using the language dropdown in the configuration panel
2. Manually editing the `language` field in the configuration JSON

Supported language codes:
- English (US): `en-US`
- Spanish: `es-ES`
- Italian: `it-IT`
- Vietnamese: `vi-VN`
- Hindi: `hi-IN`

The language setting affects both the AI agent's responses and speech recognition input.

## Usage

1. Configure your ElevenLabs API settings
2. Choose your preferred language
3. Click "Start Conversation" to begin interacting with KITT
4. Use the microphone button to speak
5. KITT will respond in your selected language
6. Use the dashboard controls to interact with different modes

## Development

### Prerequisites

- Modern web browser with WebSocket support
- ElevenLabs API key and configured agent
- Microphone access for voice interaction

### Local Development

1. Clone the repository
2. Open `index.html` in your browser
3. Configure your ElevenLabs API settings
4. Start developing!

## License

MIT License - feel free to use this project as you wish!
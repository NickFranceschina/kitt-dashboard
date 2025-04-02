# KITT Dashboard

Interactive KITT dashboard inspired by the TV show Knight Rider, complete with voice recognition and ElevenLabs integration.

![KITT Dashboard Screenshot](https://placeholder-for-your-screenshot.jpg)

## Features

- Authentic KITT dashboard with 3-column voice modulator display
- Interactive buttons and mode indicators
- Voice recognition to speak commands to KITT
- ElevenLabs integration for voice responses with customizable parameters
- Complete API for programmatic control
- Slide-out configuration panel for easy settings management
- Real-time voice modulator visualization
- Multiple conversation modes (TTS and AI Agent)
- System logging and debugging tools
- HTTPS local hosting support with SSL certificates
- Improved voice light control and effects
- Cross-browser compatibility

## Prerequisites

- Node.js (v14 or higher)
- ElevenLabs API key
- Modern web browser with JavaScript enabled

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/kitt-dashboard.git
cd kitt-dashboard
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

4. Set up your configuration:
   - Copy `config.template.json` to `config.json`
   - Update the configuration with your ElevenLabs API key and settings
   - Create a `.env` file in the backend directory with required environment variables

5. Start the development server:
```bash
# For HTTP (development)
npm run dev

# For HTTPS (recommended for voice recognition)
npm run https
```

## Configuration

The dashboard includes a slide-out configuration panel that allows you to:
- Configure ElevenLabs API settings and voice parameters
- Test and adjust voice modulator settings
- View system logs and debugging information
- Manage conversation modes and settings
- Customize lighting effects and visual feedback

### ElevenLabs Configuration
- API Key: Your ElevenLabs API key
- Voice ID: The ID of your chosen voice
- Model ID: Currently supports "eleven_monolingual_v1"
- Agent ID: Optional for AI conversation mode
- Additional Parameters:
  - Stability: Voice stability (0.0-1.0)
  - Similarity Boost: Voice similarity (0.0-1.0)
  - Style: Voice style (0.0-1.0)
  - Speaker Boost: Enhanced voice clarity

### Speech Recognition Settings
- Language: Speech recognition language (default: en-US)
- Continuous: Enable/disable continuous listening
- Interim Results: Show/hide interim recognition results

## Usage

1. **Voice Recognition**:
   - Click the microphone button to start speaking
   - The voice modulator will light up to indicate active listening
   - Speak your command clearly and wait for KITT's response
   - The system supports both TTS and AI conversation modes

2. **Mode Selection**:
   - Choose between Auto Cruise, Normal Cruise, and Pursuit modes
   - Each mode has unique visual indicators and response patterns
   - Mode changes are reflected in both visual and audio feedback

3. **Configuration Panel**:
   - Access settings by clicking the gear icon on the left side
   - Pin the panel open for easy access during use
   - View real-time system logs and debug information
   - Test voice modulator settings in real-time

## Development

Recent improvements include:
- Refactored voice modulator component for better maintainability
- Enhanced configuration panel with improved error handling
- Better voice light control and visual feedback
- Improved conversation mode switching and controls
- Added HTTPS support for local development with SSL certificates
- Enhanced system logging and debugging capabilities
- Improved cross-browser compatibility
- Better error handling for API calls

## Troubleshooting

1. **Voice Recognition Issues**:
   - Ensure you're using HTTPS (required for microphone access)
   - Check browser permissions for microphone access
   - Verify ElevenLabs API key is valid and has sufficient credits

2. **Configuration Problems**:
   - Verify config.json is properly formatted
   - Check backend .env file for required variables
   - Ensure all API keys are valid and properly set

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. When contributing:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

This project is licensed under the MIT License - see the LICENSE file for details.
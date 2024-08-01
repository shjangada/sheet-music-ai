# Sheet Music AI

# AI Sheet Music Processor

This application allows users to upload sheet music images, process them using Optical Music Recognition (OMR), and play back the resulting MIDI file. Future updates will include AI-generated fingering suggestions.

## Current Features

- Upload sheet music images
- Automatic sheet music detection
- Optical Music Recognition (OMR) to convert images to MusicXML and MIDI
- MIDI playback of the processed sheet music

## Planned Features

- AI-powered fingering suggestions
- Annotated sheet music output (image and PDF) with finger numbers

## Technology Stack

- Frontend: React Native
- Backend: Node.js with Express
- Image Processing: Python (PIL, NumPy)
- Music Processing: music21 library
- OMR: Oemer (Optical Music Easy Recognition)

## Prerequisites

- Node.js and npm
- Python 3.x
- Expo CLI (for React Native development)
- Oemer installed and configured

## Installation

1. Clone the repository:
git clone https://github.com/yourusername/ai-sheet-music-processor.git
cd ai-sheet-music-processor
Copy
2. Install backend dependencies:
npm install
Copy
3. Install frontend dependencies:
cd frontend
npm install
Copy
4. Install Python dependencies:
pip install -r requirements.txt
Copy
## Usage

1. Start the backend server:
node app.js
Copy
2. Start the React Native app:
cd frontend
expo start
Copy
3. Use the app to upload a sheet music image.

4. The app will process the image and allow you to play back the resulting MIDI file.

## Project Structure

- `app.js`: Main server file
- `check_sheet_music.py`: Script to detect if an image is sheet music
- `frontend/App.js`: Main React Native application file

## Future Development

We are currently working on implementing AI-powered fingering suggestions. This feature will:

- Generate optimal finger placements for the sheet music
- Annotate the original sheet music with finger numbers
- Provide both image and PDF outputs of the annotated sheet music

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

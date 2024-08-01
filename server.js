const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle file uploads and processing
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, req.file.path); // Path to the uploaded file
  const outputDir = path.join(__dirname, 'processed'); // Path to the output directory

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  console.log('Uploading file...');
  console.log('File uploaded');

  // Check if the file is sheet music
  const checkCommand = `/Library/Frameworks/Python.framework/Versions/3.11/bin/python3 ${path.join(__dirname, 'check_sheet_music.py')} ${filePath}`;

  exec(checkCommand, (checkError, checkStdout, checkStderr) => {
    if (checkError) {
      console.error(`Error checking file: ${checkError.message}`);
      return res.status(500).json({ error: 'Error checking file' });
    }

    console.log('File checked');
    console.log('Check stdout:', checkStdout);
    console.log('Check stderr:', checkStderr);

    if (checkStdout.trim() === 'not_sheet_music') {
      console.log('Not recognized as sheet music');
      return res.status(400).json({ error: 'The uploaded image is not recognized as sheet music.' });
    }

    console.log('File recognized as sheet music');

    // Construct the command for Oemer
    const command = `/Library/Frameworks/Python.framework/Versions/3.11/bin/oemer ${filePath} --output ${outputDir}`;

    // Execute the command
    exec(command, (error, stdout, stderr) => {
      console.log('Processing started...');
      
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ error: 'Error processing file' });
      }

      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }

      console.log('Processing output:', stdout);

      // Read the output directory and list the processed files
      const outputFiles = fs.readdirSync(outputDir);
      res.json({ files: outputFiles.map(file => `/processed/${file}`) });
    });
  });
});

// Serve static files from the 'processed' directory
app.use('/processed', express.static(path.join(__dirname, 'processed')));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

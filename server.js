const express = require('express');
const path = require('path');
const app = express();

// Render defines port dynamically in process.env.PORT, default to 10000
const PORT = process.env.PORT || 10000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '.')));

// Fallback to index.html for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running and listening on port ${PORT}`);
});

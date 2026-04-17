import app from './app.js';
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`=========================================`);
});

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Welcome to the API!");
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; 

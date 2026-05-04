const express = require('express');
const app = express();

app.get('/users', (req, res) => {
  res.json({ message: "User service response" });
});

app.listen(8081, () => console.log("User Service running on port 8081"));

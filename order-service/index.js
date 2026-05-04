const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: "order service response" });
});

app.listen(8082, () => console.log("Order Service running on port 8082"));

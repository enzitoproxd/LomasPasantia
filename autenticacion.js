const express = require("express");
const app = express();
const port = 3002;
const fs = require("fs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const privateKey = fs.readFileSync("private.key");
const publicKey = fs.readFileSync("public.key");

app.use(express.json());

app.post("/token", (req, res) => {
  const token = jwt.sign({ email: req.body.email }, privateKey, {
    algorithm: "RS256",
  });

  console.log("token generado:", token);
  
  res.json({ token });
});

app.get("/publickey", (req, res) => {
  setTimeout(()=>{
    res.send(publicKey);
  }, 1000)
});
//const decoded = jwt.verify(token,publicKey,{ algorithms: ["RS256"] });

//console.log(decoded);

// Start the server
app.listen(port, () => {
  console.log(`Server de auth corriendo en la url http://localhost:${port}`);
});

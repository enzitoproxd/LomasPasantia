const express = require("express");
const app = express();
app.use(express.json());
const port = 3001;
const fs = require("fs");
const axios = require("axios");
var jwt = require("jsonwebtoken");

let publicKey;

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.headers.authorization.split(" ")[1];
    if(!publicKey){
      console.log("Pido la info de la public key que no la tengo")
      const res = await axios.get('http://localhost:3002/publickey');
      publicKey = res.data;
    }
    const payload = jwt.verify(token, publicKey);
    req.user = payload;
    next();
  } catch (err) {
    
    return res.status(401).json({
      error: "Token inválido",
    });
  }
};
//--------------------------------------------------------------------------

function getResponse() {
  return {
    status: 200,
    data: {},
    err: {},
  };
}

app.post("/login", async (req, res) => {
  console.log("Body:", req.body);

  const { email, password } = req.body;
  const response = getResponse();

  try {
    if (email != "enzo@gmail.com") {
      throw "Email no existe";
    }

    if (password != "123456") {
      throw "Email o contraseña incorrecta";
    }

    // TODO: signToken no lo debe ser esta api, lo hace el de autenticacion

    const res = await axios.post("http://localhost:3002/token", {
      email: req.body.email,
    }); 

    response.data = { token: res.data.token };

  } catch (error) {
    response.status = 500;
    response.err = error.message;
  }
  // console.log(res);

  return res.send(response);
});

app.get("/juegos", authMiddleware, (req, res) => {

  const response = getResponse();

  response.data = 
    [
      { id: 1, nombre: "gta v" },
      {
        id: 2,
        nombre: "ciberpunk 2077",
      },
      {
        id: 3,
        nombre: "read dead redemption",
      },
    ]

  res.json(response);
});

// app.get /public-token

// Start the server
app.listen(port, () => {
  console.log(`Server de la aplicacion corriendo en la url http://localhost:${port}`);
});
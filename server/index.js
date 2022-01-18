require("./helpers/prototype");

const express = require("express");
const https = require("https");
const cors = require("cors");

const config = require("./config");
const router = require("./router");

const port = config.port || 80;

const app = express();

const server =
  parseInt(port) === 443
    ? https.createServer(
        {
          key: fs.readFileSync("./certs/key.pem", "utf-8"),
          cert: fs.readFileSync("./certs/cert.pem", "utf-8"),
          ca: fs.readFileSync("./certs/certificate.der", "utf-8"),
          requestCert: true,
          rejectUnauthorized: false
        },
        app
      )
    : app;

app.use(cors());
app.use(express.json());

app.use("/", router);

server.listen(port, () => {
  console.log(`Listen on ${port}`);
});

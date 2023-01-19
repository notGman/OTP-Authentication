const express = require("express");
require("dotenv").config();
require("./db/connection").connect();
const cookie = require("cookie-parser");
const cors = require('cors')
const router = require("./routes/router");

const app = express();
app.use(express.json());
app.use(cookie());
app.use(cors())
app.use("/api/v1", router);

const port = process.env.PORT ||8000;
app.listen(port, () => console.log(`Listening to port ${port}`));

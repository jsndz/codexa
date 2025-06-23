import express from "express";
import bodyParser from "body-parser";
import { PORT } from "./config/config";

const app = express();

app.use(bodyParser.json());

app.post("/", (req, res) => {
  console.log(req.body);
  res.send("WELCOME");
});

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));

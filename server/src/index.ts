import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PORT } from "./config/config";

const app = express();

app.use(bodyParser.json());
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedMethods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));

app.post("/", (req, res) => {
  console.log(req.body);
  res.send("WELCOME");
});

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));

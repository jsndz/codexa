import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

import { PORT, APP_ID, PRIVATE_KEY } from "./config/config.js";

const app = express();
const auth = createAppAuth({
  appId: APP_ID!,
  privateKey: PRIVATE_KEY,
});

app.use(bodyParser.json());
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedMethods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));

app.post("/", async (req, res) => {
  try {
    const { iid } = req.body;
    if (!iid) {
      res.status(400).json({ message: "Installation ID is required" });
    }

    const installationAuth = await auth({
      type: "installation",
      installationId: iid,
    });

    const octokit = new Octokit({
      auth: installationAuth.token,
    });

    const { data } = await octokit.repos.get({
      owner: "jsndz",
      repo: "test",
    });

    res.json({ message: "Success", repo: data.full_name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));

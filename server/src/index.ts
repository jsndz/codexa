import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

import { PORT, APP_ID, PRIVATE_KEY } from "./config/config.js";
import { extractFunctionsFromCommit } from "./utils/extract.js";
import { ExtractedFunction } from "./utils/types.js";
import { llmAnalysis } from "./utils/llm.js";

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
    const { iid, sha, repo, owner } = req.body;
    if (!iid) {
      res.status(400).json({ message: "Installation ID is required" });
    }
    console.log(sha, repo, iid, owner);

    const installationAuth = await auth({
      type: "installation",
      installationId: iid,
    });

    const octokit = new Octokit({
      auth: installationAuth.token,
    });

    const functions: ExtractedFunction[] = await extractFunctionsFromCommit(
      octokit,
      owner,
      repo,
      sha
    );
    const llmResults = await llmAnalysis(functions);

    const enrichedResults = llmResults.map((result: any) => {
      const original = functions.find(
        (f) => f.functionName === result.functionName
      );
      return {
        ...result,
        filePath: original?.filePath || "",
        startLine: original?.startLine || 0,
        endLine: original?.endLine || 0,
      };
    });
    console.log("data", enrichedResults);
    res.json({ message: "Success", data: enrichedResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));

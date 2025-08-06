# Codexa – AI-Driven Code Review & Static Analysis GitHub App

Codexa is an intelligent GitHub App that automatically reviews your code on every push.  
It combines static analysis and LLM-powered insights to catch issues, suggest improvements, and help prevent secrets leakage — all within your GitHub workflow.

---

![](/public/video.mp4)

---

## What Codexa Does

On every push to a repository where Codexa is installed:

1.  **Receives Code via GitHub Webhook**

- Listens to `push` events
- Automatically pulls the latest commits and file diffs

2.  **Performs Static Code Analysis**

- Evaluates code complexity
- Highlights bad patterns, anti-patterns, or structural issues

3.  **Detects API Keys / Secrets**

- Scans for common patterns of hardcoded secrets
- Warns about leaked tokens, credentials, and misconfigurations

4.  **Uses LLMs for Higher-Order Insights**

- Leverages an LLM to provide contextual feedback, code smells, and refactor suggestions
- Offers human-like explanations and improvement tips

5. **Reports Results via GitHub Checks**

   - Posts inline annotations on commits/files
   - Summarizes issues as Check Run results directly on GitHub UI

---

## Features

- Works **out-of-the-box** after GitHub App installation
- **Fully automated** — no CLI tools or integrations required
- **Modular analyzer pipeline** (can use regex, ASTs, LLMs)
- Displays all feedback as part of GitHub Checks on commits
- Give a full on **llm analysis** as a PR.

---

## 📦 Tech Stack

- **Language:** TypeScript (Node.js)
- **GitHub API:** [Octokit](https://github.com/octokit/octokit.js)
- **Webhooks Proxy (local):** [Smee.io](https://smee.io/)
- **Static Analysis:** AST parsing with tree-sitter
- **LLM Integration:** CodeLlama via [Ollama](https://ollama.com/)
- **Server Framework:** Express.js

---

## Code Layout

.
├── client # Frontend app
├── github_app # Static code analysis + generates LLM link
├── server # Runs the LLM analysis
└── README.md

---

## 🔍 Future Ideas

- PR summary comments with natural language reviews
- Security-focused mode (e.g., OWASP patterns)
- Dashboard to view metrics across repos
- CLI to run Codexa locally (Codexa CLI)

---

## 📚 References

- [Building GitHub Apps](https://docs.github.com/en/apps)
- [Octokit.js Docs](https://octokit.github.io/rest.js/)
- [Smee – Webhook Proxy](https://smee.io/)
- [JWT for GitHub Apps](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app)

---

## Setup Guide

### 1. Create a GitHub App

Follow the [GitHub Apps documentation](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps) to create a GitHub App with the following permissions:

| Permission          | Access Level |
| ------------------- | ------------ |
| Repository contents | Read-only    |
| Webhooks            | Read & write |
| Checks              | Read & write |
| Metadata            | Read-only    |

- **Important:** When configuring the Webhook, use a webhook proxy from [Smee.io](https://smee.io/) for local development.
  → Copy your Smee URL and paste it into the **Webhook URL** field of your GitHub App settings.

- Download your **Private Key** from the GitHub App page.

- Note down the **App ID** and **Client ID/Secret**.

---

### 2. Install the LLM model

You’ll need to install **codellama:7b-instruct** (or any other supported model) locally using [Ollama](https://ollama.com/).

```bash
ollama pull codellama:7b-instruct
```

---

### 3. Start the Project

Open **3 different terminals** and run the following in each:

---

#### Terminal 1: Server

```bash
cd server
# Copy .env.example to .env and replace values (especially GitHub App credentials, Ollama endpoint, etc.)
cp .env.example .env
# Fill in your App ID, Private Key Path, Webhook Secret, and Smee URL in the .env file
npm install
npm start
```

---

#### Terminal 2: Client (Frontend)

```bash
cd client
npm install
npm run dev
```

---

#### Terminal 3: GitHub App Handler

```bash
cd github_app
# Copy .env.example to .env and replace values (App ID, Private Key, etc.)
cp .env.example .env
npm install
npm run build
npm start
```

---

## Contributing

If you have suggestions for how codexa could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2025 jsndz

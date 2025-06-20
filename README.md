# 🚀 Codexa – AI-Driven Code Review & Static Analysis GitHub App

Codexa is an intelligent GitHub App written in **Typescript** that integrates directly into your repository. Once installed, it listens to `push` events and performs **automated static code analysis** enhanced with **LLMs (Large Language Models)** to detect issues, improve code quality, and prevent secrets leakage — all without leaving GitHub.

---

## ✨ What Codexa Does

On every push to a repository where Codexa is installed:

1. 📩 **Receives Code via GitHub Webhook**

   - Listens to `push` events
   - Automatically pulls the latest commits and file diffs

2. 🧠 **Performs Static Code Analysis**

   - Evaluates code complexity
   - Highlights bad patterns, anti-patterns, or structural issues

3. 🔐 **Detects API Keys / Secrets**

   - Scans for common patterns of hardcoded secrets
   - Warns about leaked tokens, credentials, and misconfigurations

4. 🤖 **Uses LLMs for Higher-Order Insights**

   - Leverages an LLM to provide contextual feedback, code smells, and refactor suggestions
   - Offers human-like explanations and improvement tips

5. ✅ **Reports Results via GitHub Checks**

   - Posts inline annotations on commits/files
   - Summarizes issues as Check Run results directly on GitHub UI

---

## 📦 Features

- Works **out-of-the-box** after GitHub App installation
- **Fully automated** — no CLI tools or integrations required
- **Modular analyzer pipeline** (can use regex, ASTs, LLMs)
- Displays all feedback as part of GitHub Checks on commits
- Can be extended to include **pull request summaries**, Slack alerts, etc.

---

## 🔐 Permissions Required

When creating your GitHub App, request these permissions:

| Permission          | Access Level |
| ------------------- | ------------ |
| Repository contents | Read-only    |
| Webhooks            | Push         |
| Checks              | Read & write |
| Metadata            | Read-only    |

---

## 📦 Tech Stack

- **Language**: JavaScript (Node.js)
- **GitHub API**: [Octokit](https://github.com/octokit/octokit.js)
- **Webhooks Proxy** (local): [Smee.io](https://smee.io/)
- **Static Analysis**: AST with tree-sitter
- **LLM Integration**: OpenAI / Local LLMs via API
- **Server**: Express

---

## 🧪 Example Output on GitHub

- ✅ Codexa appears as a GitHub Check on each commit
- 🧵 Click into the check to see:

  - 🧠 LLM-generated advice
  - ⚠️ Secrets or API key warnings
  - ⚙️ Code complexity reports

- 🖊️ Inline annotations show exactly which lines have issues

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

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t codexa .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> codexa
```

## Contributing

If you have suggestions for how codexa could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2025 jsndz

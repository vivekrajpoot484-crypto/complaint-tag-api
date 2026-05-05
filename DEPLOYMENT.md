# Deployment Guide

Follow these instructions to deploy the Complaint Classifier API and Frontend to Render.

## 1. Push to GitHub
- Create a new repository on GitHub.
- Initialize git in your local project:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  ```
- Push to your GitHub repository.

## 2. Deploy on Render
- Log in to [Render](https://render.com).
- Click **New +** and select **Web Service**.
- Connect your GitHub repository.

### Render Settings:
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Required Commands:
- `npm install` (Install dependencies)
- `npm run build` (Compile TypeScript to JavaScript)
- `npm start` (Run the production server)

## 3. Environment Variables
Add the following in the **Environment** tab on Render:
- `PORT`: `10000` (or leave blank, Render sets this automatically)

## 4. Final Validation
- Once deployed, your API will be available at `https://your-app.onrender.com`.
- Open `index.html` in your browser to use the frontend.

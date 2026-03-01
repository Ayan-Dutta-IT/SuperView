# SuperView AI

SuperView AI is an intelligent interview companion designed to help candidates practice and prepare for job interviews. By leveraging the power of Ollama Cloud and the `gpt-oss:120b` open-source model, SuperView dynamically generates role-specific interview questions and provides a structured evaluation of your answers.

## Features

- **Dynamic Question Generation**: Enter any job role (e.g., "Senior Frontend Developer", "Data Scientist", "Product Manager") to receive 5 tailored interview questions.
- **Interactive Interview Experience**: Answer questions one by one natively in the app with an elegant, modern, and engaging user interface.
- **Premium Glassmorphism UI**: Built with React and Tailwind CSS v4, featuring a beautiful dark theme with sleek gradients, smooth micro-animations, and a highly responsive layout.
- **AI Evaluation**: After submitting all answers, receive a structured evaluation including a communication score, a technical score, identified strengths, weaknesses, and a simulated hire/no-hire recommendation.
- **Powered by Ollama**: Fully integrated with the Ollama Cloud API.

## Project Structure

The project is split into two main components:

- **Frontend**: A React application built with Vite and Tailwind CSS.
- **Backend**: A Node.js/Express server that interfaces with the Ollama API to generate questions and evaluate responses.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- An Ollama API Key

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add your Ollama API key:
   ```env
   OLLAMA_API_KEY=your_api_key_here
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173/` (or the URL provided by Vite) to start practicing!

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4
- **Backend**: Node.js, Express, Ollama SDK (`ollama`)
- **AI Model**: `gpt-oss:120b` (via Ollama Cloud)

## License

MIT

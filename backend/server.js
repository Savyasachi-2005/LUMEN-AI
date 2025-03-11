import cors from "cors";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = "AIzaSyD6edoMMEWXjDPlxVMdhY4JB37MaGwaxKc"; // Replace with your actual Gemini API key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get("/", (req, res) => {
  res.json({ result: "Hi there" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const prompt = req.body.message;
    const result = await model.generateContent(prompt);
    const reply = await result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Error connecting to Gemini API:", error);
    res.status(500).json({ error: "Failed to fetch response from AI." });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

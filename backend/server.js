import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import Tesseract from "tesseract.js";
import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "./models/user.model.js";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();
const PORT = 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",  (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/landing-page.html"));
  });

app.use(express.static(path.join(__dirname, "../frontend")));

// File Upload
const upload = multer({ dest: "uploads/" });

// Hugging Face API
const HF_API_TOKEN = process.env.HF_API_TOKEN; 
const HF_API_URL = process.env.HF_API_URL;

async function queryHuggingFace(prompt) {
  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: prompt }),
  });
  const data = await response.json();
  return data[0]?.generated_text || "Could not generate response.";
}

// 🔹 API Routes

  
// Serve the login page when visiting /login
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
  });
  
  // Serve the register page when visiting /register
  app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/register.html"));
  });
  
  app.get("/logout", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/logout.html"));
  });

  // POST Register
  app.post("/register", async (req, res) => {
    try {
      const { firstName, lastName, email, phoneNumber, birthDate, gender, username, password } = req.body;
  
      // Check if user exists
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
        birthDate,
        gender,
        username,
        password: hashedPassword,
      });
  
      await user.save();
      res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // POST Login
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); 
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful" });
  });
  
  app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
  });

// 1. Symptom to Disease
// Add this route to your existing Express server
app.post('/analyze-symptoms', async (req, res) => {
  const { symptoms, age, gender } = req.body;
  
  console.log("Received request with:", { symptoms, age, gender }); // Debug log

  const prompt = `Act as a senior doctor. For a patient with these symptoms: "${symptoms}" (${age} years old, ${gender}), provide:

1. Top 3 possible conditions (format as "1. [Condition] - [1-sentence explanation]")
2. Urgency level (choose one: Mild/Moderate/Severe)
3. Recommended actions (3 bullet points)
4. Red flags (2 warning signs)

Example response:
1. Migraine - Throbbing headache often with light sensitivity
2. Tension headache - Band-like pressure around head
3. Sinusitis - Facial pain with nasal congestion

Urgency: Moderate

Actions:
- Rest in dark room
- Take pain relievers
- Stay hydrated

Red flags:
- Sudden worst headache of life
- Fever with neck stiffness`;

// Add this to ensure better responses
const options = {
  temperature: 0.7,  // Controls randomness (0-1)
  max_length: 500,   // Maximum response length
  do_sample: true    // Enables better response generation
};

  try {
    const result = await queryHuggingFace(prompt);
    console.log("AI Response:", result); // Debug log
    
    // Handle different HuggingFace response formats
    const diagnosis = result.generated_text || result[0]?.generated_text || result;
    
    res.json({ 
      success: true,
      diagnosis: diagnosis 
    });
  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).json({ 
      success: false,
      error: "Analysis failed. Please try again." 
    });
  }
});

app.post('/generate-health-plan', async (req, res) => {
  const { age, activity, diet, sleep, stress } = req.body;
  const prompt = `Create a personalized health plan for:
  - Age: ${age}
  - Activity: ${activity}
  - Diet: ${diet}
  - Sleep: ${sleep}
  - Stress: ${stress}
  
  Provide: 
  1. 3 dietary recommendations
  2. 2 exercise suggestions
  3. 1 sleep improvement tip
  4. 1 stress reduction technique`;
  
  try {
    const result = await queryHuggingFace(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: "Plan generation failed" });
  }
});

// 3. Report OCR & Summary
app.post("/analyze-report", upload.single("report"), async (req, res) => {
  const imagePath = req.file.path;
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, "eng");
    const prompt = `Explain the following medical report in simple language:\n${text}`;
    const result = await queryHuggingFace(prompt);

    fs.unlinkSync(imagePath); // cleanup
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: "Error processing report" });
  }
});

app.post('/logout', (req, res) => {
  try {
    res.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  connectDB();
});

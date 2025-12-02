import express from "express";
import multer from "multer";
import genAI from "../utils/gemini.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/generate-caption",  upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Convert Buffer → Base64
    const base64Image = req.file.buffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = "Generate a short, aesthetic Instagram caption for this image. No lists, no options, no bold text. Only output one single caption. you can use emojis and quote or phrases";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: req.file.mimetype,
        },
      }
    ]);

    const caption = result.response.text();

    res.json({ caption });
  } catch (err) {
    console.error("Gemini error:", err);
    return res.status(500).json({ error: "Failed to generate caption" });
  }
});

export default router;

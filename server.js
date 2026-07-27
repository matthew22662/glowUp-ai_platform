import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "100kb" }));
app.use(express.static("public"));

const voices = {
  alex: process.env.ELEVENLABS_VOICE_ALEX,
  mira: process.env.ELEVENLABS_VOICE_MIRA,
  lumi: process.env.ELEVENLABS_VOICE_LUMI,
  leo: process.env.ELEVENLABS_VOICE_LEO,
  nova: process.env.ELEVENLABS_VOICE_NOVA
};

app.post("/api/voice", async (req, res) => {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const { text, helper = "alex" } = req.body || {};

    if (!apiKey) {
      return res.status(503).send("ELEVENLABS_API_KEY is not configured");
    }
    if (typeof text !== "string" || !text.trim() || text.length > 500) {
      return res.status(400).send("Invalid text");
    }

    const voiceId =
      voices[helper] ||
      process.env.ELEVENLABS_VOICE_ID ||
      "Xb7hH8MSUJpSbSDYk0k2";

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg"
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: process.env.ELEVENLABS_MODEL_ID || "eleven_flash_v2_5",
          voice_settings: {
            stability: 0.48,
            similarity_boost: 0.76,
            style: 0.22,
            use_speaker_boost: true,
            speed: 0.96
          }
        })
      }
    );

    if (!response.ok) {
      const details = await response.text();
      console.error("ElevenLabs error:", response.status, details);
      return res.status(502).send("Voice generation failed");
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal voice error");
  }
});

app.get("*", (_req, res) => {
  res.sendFile(new URL("./public/index.html", import.meta.url).pathname);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`GlowUp AI is running on port ${port}`);
});

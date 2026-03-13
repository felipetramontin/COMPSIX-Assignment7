const express = require("express");
const { sequelize, Track } = require("./database/setup");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/api/tracks", async (req, res) => {

  try {

    const tracks = await Track.findAll();
    res.json(tracks);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });
    
  }

});

app.get("/api/tracks/:id", async (req, res) => {

  try {

    const track = await Track.findByPk(req.params.id);

    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }

    res.json(track);

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

});

app.post("/api/tracks", async (req, res) => {

  try {

    const { songTitle, artistName, albumName, genre } = req.body;

    if (!songTitle || !artistName || !albumName || !genre) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTrack = await Track.create(req.body);

    res.status(201).json(newTrack);

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

});

app.put("/api/tracks/:id", async (req, res) => {

  try {

    const track = await Track.findByPk(req.params.id);

    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }

    await track.update(req.body);

    res.json(track);

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

});

app.delete("/api/tracks/:id", async (req, res) => {

  try {

    const deleted = await Track.destroy({
      where: { trackId: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ error: "Track not found" });
    }

    res.json({ message: "Track deleted" });

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

});

app.listen(PORT, async () => {

  await sequelize.authenticate();
  console.log(`Server running on port ${PORT}`);

});
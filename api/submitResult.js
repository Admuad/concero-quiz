// api/submitResult.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { username, IQ, correct, totalQuestions } = req.body;
    if (!username || !IQ) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await client.connect();
    const db = client.db("concero_quiz");
    const leaderboard = db.collection("leaderboard");

    await leaderboard.insertOne({
      username,
      IQ,
      correct,
      totalQuestions,
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Result saved successfully" });
  } catch (error) {
    console.error("Error saving result:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
}

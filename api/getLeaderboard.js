import { MongoClient } from "mongodb";

const uri =
  (typeof process !== "undefined" && process.env.MONGODB_URI) ||
  import.meta.env.VITE_MONGODB_URI;

const client = new MongoClient(uri);

// Secret key — store this in your Vercel environment variables for safety
const ADMIN_KEY =
  (typeof process !== "undefined" && process.env.ADMIN_KEY) ||
  import.meta.env.VITE_ADMIN_KEY;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // 🔒 Require admin key for access
  const key = req.query.key;
  if (!key || key !== ADMIN_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await client.connect();
    const db = client.db("concero_quiz");
    const leaderboard = db.collection("leaderboard");

    // 🔹 Keep only each player's highest IQ
    const results = await leaderboard
      .aggregate([
        { $sort: { IQ: -1, createdAt: -1 } },
        {
          $group: {
            _id: "$username",
            IQ: { $first: "$IQ" },
            correct: { $first: "$correct" },
            totalQuestions: { $first: "$totalQuestions" },
            createdAt: { $first: "$createdAt" }
          }
        },
        { $sort: { IQ: -1 } }
      ])
      .toArray();

    res.status(200).json({ leaderboard: results });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
}

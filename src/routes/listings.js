import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

router.get("/all", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200); 
  try {
    const db   = await getDb();
    const coll = db.collection("listingsAndReviews");

    const listings = await coll.aggregate([
      { $sample: { size: limit } },
      { $project: {
          _id: 0,
          id: { $ifNull: ["$listing_id", { $toString: "$_id" }] },
          name: 1,
          summary: 1,
          price: { $toString: "$price" },
          rating: "$review_scores.review_scores_rating",
          picture: "$images.picture_url"
        }}
    ]).toArray();

    res.json(listings);
  } catch (err) {
    console.error("LISTINGS-API /all error ", err);
    res.status(500).json({ error: "server" });
  }
});

router.get("/", async (req, res) => {
  const { market, type, bedrooms } = req.query;
  if (!market) return res.status(400).json({ error: "market is mandatory" });

  const matchStage = {
    "address.market": { $regex: `^${market}$`, $options: "i" },
    ...(type && { property_type: type }),
    ...(bedrooms && { bedrooms: Number(bedrooms) })
  };

  try {
    const db   = await getDb();
    const coll = db.collection("listingsAndReviews");

    const listings = await coll.aggregate([
      { $match: matchStage },
      { $project: {
          _id: 0,
          id: { $ifNull: ["$listing_id", { $toString: "$_id" }] },
          name: 1,
          summary: 1,
          price: { $toString: "$price" },
          rating: "$review_scores.review_scores_rating",
          picture: "$images.picture_url"
        }}
    ]).toArray();

    res.json(listings);
  } catch (err) {
    console.error("LISTINGS-API error ", err);
    res.status(500).json({ error: "server" });
  }
});

export default router;

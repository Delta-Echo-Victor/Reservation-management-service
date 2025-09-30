import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  const required = ["listing_id", "start", "end", "name", "email", "mobile"];
  const missing  = required.filter(k => !req.body[k]);
  if (missing.length) {
    return res.status(400).json({ error: `missing: ${missing.join()}` });
  }

  const start = new Date(req.body.start);
  const end   = new Date(req.body.end);
  const today = new Date();
  today.setHours(0, 0, 0, 0);           

  if (start < today) {
    return res.status(400).json({ error: "Start date cannot be in the past." });
  }
  if (end < start) {
    return res.status(400).json({ error: "End date cannot be before start date." });
  }

  try {
    const db = await getDb();
    const bookingDoc = {
      listing_id: String(req.body.listing_id),  
      start,
      end,
      guest: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        mobile: req.body.mobile,
        address: {
          postal: req.body.postal,
          home:   req.body.home
        }
      },
      created_at: new Date()
    };

    const { insertedId } = await db.collection("bookings").insertOne(bookingDoc);
    res.json({ ok: true, id: insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db" });
  }
});

export default router;

import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { PORT } from "./config.js";
import listingsRouter from "./src/routes/listings.js";
import bookingsRouter from "./src/routes/bookings.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/listings", listingsRouter);
app.use("/api/bookings", bookingsRouter);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () =>
  console.log(`Airbnb app ready on http://localhost:${PORT}`));

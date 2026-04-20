import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is missing");
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);
  const isProduction = process.env.NODE_ENV === "production";

  app.use(express.json());

  // Health check
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Stripe API
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { roomId, roomTitle, amount, type } = req.body;

      if (!roomId || !roomTitle || !amount || !type) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const stripe = getStripe();
      const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `${type}: ${roomTitle}`,
                description: `Room ID: ${roomId}`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${appUrl}/?payment=success&roomId=${roomId}`,
        cancel_url: `${appUrl}/?payment=cancel&roomId=${roomId}`,
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  if (isProduction) {
    // ✅ SERVE FRONTEND (IMPORTANT FIX)
    const distPath = path.join(__dirname, "dist");

    app.use(express.static(distPath));

    // SPA fallback (VERY IMPORTANT)
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });

  } else {
    // Dev mode with Vite
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `🚀 Server running in ${isProduction ? "production" : "development"} mode on port ${PORT}`
    );
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

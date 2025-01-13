import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import { OAuthClient } from "./auth/oauth-client.js";
import crypto from "crypto";

dotenv.config({ path: "../.env" });

const frontEndUrl = "https://oauth2-client-library.vercel.app";

const app = express();
const port = 3001;

app.use(
  cors({
    origin: "https://oauth2-client-library.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

let oauthClient;
try {
  oauthClient = new OAuthClient({
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    redirectUri: "https://oauth2-client-library.vercel.app/callback",
    authorizationEndpoint: `https://${process.env.AUTH0_DOMAIN}/authorize`,
    tokenEndpoint: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    scope: "openid profile email offline_access",
  });
  console.log("OAuthClient initialized successfully");
} catch (error) {
  console.error("Error initializing OAuthClient:", error);
}

app.get("/api/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  req.session.oauthState = state;

  const { authUrl } = oauthClient.startAuthFlow();
  res.json({ authUrl: `${authUrl}&state=${state}` });
});

app.post("/api/callback", async (req, res) => {
  try {
    const { code, state } = req.body;

    if (state !== req.session.oauthState) {
      return res.status(400).json({ error: "Invalid state parameter" });
    }

    const tokenResponse = await oauthClient.handleCallback({ code });

    if (!tokenResponse || !tokenResponse.access_token) {
      return res
        .status(500)
        .json({ error: "Authentication failed, no token received" });
    }

    req.session.accessToken = tokenResponse.access_token;
    req.session.refreshToken = tokenResponse.refresh_token || "";

    delete req.session.oauthState;

    res.json({ success: true });
  } catch (error) {
    console.error("Callback error:", error);

    if (error.message && error.message.includes("403")) {
      return res.status(403).json({
        error: "Forbidden: Invalid token or insufficient permissions",
      });
    }

    res.status(500).json({ error: "Authentication failed" });
  }
});

app.get("/api/user", async (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const response = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${req.session.accessToken}`,
        },
      }
    );
    if (!response.ok) {
      if (response.status === 401 && req.session.refreshToken) {
        const newTokens = await oauthClient.refreshToken(
          req.session.refreshToken
        );

        req.session.accessToken = newTokens.access_token;
        req.session.refreshToken = newTokens.refresh_token;

        return res
          .status(307)
          .json({ message: "Token refreshed, please retry" });
      }
      throw new Error("Failed to fetch user data");
    }
    const userData = await response.json();
    res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

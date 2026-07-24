import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import session from 'express-session';
import 'dotenv/config';

declare module 'express-session' {
  interface SessionData {
    user?: {
      provider: 'roblox' | 'discord';
      id: string;
      username: string;
      displayName: string;
      avatar?: string | null;
    };
  }
}

const app = express();

const PORT = process.env.PORT || 3001;

const FRONTEND_URL = 'https://www.veyra.one';

// ─────────────────────────────────────────────
// Environment Variables
// ─────────────────────────────────────────────

const ROBLOX_CLIENT_ID = process.env.ROBLOX_CLIENT_ID;
const ROBLOX_CLIENT_SECRET = process.env.ROBLOX_CLIENT_SECRET;
const ROBLOX_REDIRECT_URI = process.env.ROBLOX_REDIRECT_URI;

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

const SESSION_SECRET =
  process.env.SESSION_SECRET || 'development-secret-change-this';

// ─────────────────────────────────────────────
// Environment Check
// ─────────────────────────────────────────────

console.log('Checking OAuth configuration...');

if (
  !ROBLOX_CLIENT_ID ||
  !ROBLOX_CLIENT_SECRET ||
  !ROBLOX_REDIRECT_URI
) {
  console.error(
    '❌ Missing Roblox OAuth environment variables.'
  );
}

if (
  !DISCORD_CLIENT_ID ||
  !DISCORD_CLIENT_SECRET ||
  !DISCORD_REDIRECT_URI
) {
  console.error(
    '❌ Missing Discord OAuth environment variables.'
  );
}

if (!process.env.SESSION_SECRET) {
  console.warn(
    '⚠️ SESSION_SECRET is not configured. Using development fallback.'
  );
}

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.set('trust proxy', 1);

app.use(
  session({
    secret: SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// ─────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Veyra API is running.',
    version: '1.0.0',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Veyra backend is online.',
  });
});

// ═════════════════════════════════════════════
// SESSION
// ═════════════════════════════════════════════

// ─────────────────────────────────────────────
// Get Current Logged-In User
// ─────────────────────────────────────────────

app.get('/api/auth/me', (req, res) => {
  if (!req.session.user) {
    return res.json({
      authenticated: false,
      user: null,
    });
  }

  return res.json({
    authenticated: true,
    user: req.session.user,
  });
});

// ─────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error(
        'Logout error:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Failed to log out.',
      });
    }

    res.clearCookie('connect.sid');

    return res.json({
      success: true,
      message: 'Logged out successfully.',
    });
  });
});

// ═════════════════════════════════════════════
// ROBLOX OAUTH
// ═════════════════════════════════════════════

// ─────────────────────────────────────────────
// Start Roblox Login
// ─────────────────────────────────────────────

app.get('/auth/roblox', (_req, res) => {
  if (
    !ROBLOX_CLIENT_ID ||
    !ROBLOX_REDIRECT_URI
  ) {
    return res.status(500).send(
      'Roblox OAuth is not configured correctly.'
    );
  }

  const state = crypto
    .randomBytes(32)
    .toString('hex');

  const params = new URLSearchParams({
    client_id: ROBLOX_CLIENT_ID,
    redirect_uri: ROBLOX_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile',
    state,
  });

  const authorizationUrl =
    `https://apis.roblox.com/oauth/v1/authorize?${params.toString()}`;

  console.log(
    'Redirecting to Roblox OAuth...'
  );

  res.redirect(authorizationUrl);
});

// ─────────────────────────────────────────────
// Roblox OAuth Callback
// ─────────────────────────────────────────────

app.get(
  '/auth/roblox/callback',
  async (req, res) => {
    try {
      const { code } = req.query;

      if (
        !code ||
        typeof code !== 'string'
      ) {
        return res.status(400).send(
          'Missing Roblox authorization code.'
        );
      }

      if (
        !ROBLOX_CLIENT_ID ||
        !ROBLOX_CLIENT_SECRET ||
        !ROBLOX_REDIRECT_URI
      ) {
        return res.status(500).send(
          'Roblox OAuth is not configured correctly.'
        );
      }

      console.log(
        'Received Roblox OAuth callback.'
      );

      // Exchange code for access token
      const tokenResponse = await fetch(
        'https://apis.roblox.com/oauth/v1/token',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/x-www-form-urlencoded',
          },

          body: new URLSearchParams({
            client_id:
              ROBLOX_CLIENT_ID,

            client_secret:
              ROBLOX_CLIENT_SECRET,

            grant_type:
              'authorization_code',

            code,

            redirect_uri:
              ROBLOX_REDIRECT_URI,
          }),
        }
      );

      if (!tokenResponse.ok) {
        const errorText =
          await tokenResponse.text();

        console.error(
          'Roblox token error:',
          errorText
        );

        return res.status(500).send(
          'Failed to authenticate with Roblox.'
        );
      }

      const tokenData =
        await tokenResponse.json();

      // Get Roblox user
      const userResponse =
        await fetch(
          'https://apis.roblox.com/oauth/v1/userinfo',
          {
            headers: {
              Authorization:
                `Bearer ${tokenData.access_token}`,
            },
          }
        );

      if (!userResponse.ok) {
        return res.status(500).send(
          'Failed to retrieve Roblox account information.'
        );
      }

      const userData =
        await userResponse.json();

      console.log(
        'Roblox user authenticated:',
        userData
      );

      // Create Veyra session
      req.session.user = {
        provider: 'roblox',

        id:
          userData.sub ||
          userData.id,

        username:
          userData.preferred_username ||
          userData.name ||
          'Roblox User',

        displayName:
          userData.name ||
          userData.preferred_username ||
          'Roblox User',
      };

      console.log(
        'Veyra Roblox session created.'
      );

      // Redirect back to Veyra
      return res.redirect(
        `${FRONTEND_URL}/?login=success`
      );

    } catch (error) {
      console.error(
        'Roblox authentication error:',
        error
      );

      return res.status(500).send(
        'Roblox authentication failed.'
      );
    }
  }
);

// ═════════════════════════════════════════════
// DISCORD OAUTH
// ═════════════════════════════════════════════

// ─────────────────────────────────────────────
// Start Discord Login
// ─────────────────────────────────────────────

app.get('/auth/discord', (_req, res) => {
  if (
    !DISCORD_CLIENT_ID ||
    !DISCORD_REDIRECT_URI
  ) {
    return res.status(500).send(
      'Discord OAuth is not configured correctly.'
    );
  }

  const state = crypto
    .randomBytes(32)
    .toString('hex');

  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,

    redirect_uri:
      DISCORD_REDIRECT_URI,

    response_type: 'code',

    scope: 'identify',

    state,
  });

  const authorizationUrl =
    `https://discord.com/oauth2/authorize?${params.toString()}`;

  console.log(
    'Redirecting to Discord OAuth...'
  );

  res.redirect(authorizationUrl);
});

// ─────────────────────────────────────────────
// Discord OAuth Callback
// ─────────────────────────────────────────────

app.get(
  '/auth/discord/callback',
  async (req, res) => {
    try {
      const { code } = req.query;

      if (
        !code ||
        typeof code !== 'string'
      ) {
        return res.status(400).send(
          'Missing Discord authorization code.'
        );
      }

      if (
        !DISCORD_CLIENT_ID ||
        !DISCORD_CLIENT_SECRET ||
        !DISCORD_REDIRECT_URI
      ) {
        return res.status(500).send(
          'Discord OAuth is not configured correctly.'
        );
      }

      console.log(
        'Received Discord OAuth callback.'
      );

      // Exchange authorization code
      // for access token
      const tokenResponse =
        await fetch(
          'https://discord.com/api/oauth2/token',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded',
            },

            body: new URLSearchParams({
              client_id:
                DISCORD_CLIENT_ID,

              client_secret:
                DISCORD_CLIENT_SECRET,

              grant_type:
                'authorization_code',

              code,

              redirect_uri:
                DISCORD_REDIRECT_URI,
            }),
          }
        );

      if (!tokenResponse.ok) {
        const errorText =
          await tokenResponse.text();

        console.error(
          'Discord token error:',
          errorText
        );

        return res.status(500).send(
          'Failed to authenticate with Discord.'
        );
      }

      const tokenData =
        await tokenResponse.json();

      console.log(
        'Discord access token received.'
      );

      // Get Discord user
      const userResponse =
        await fetch(
          'https://discord.com/api/users/@me',
          {
            headers: {
              Authorization:
                `Bearer ${tokenData.access_token}`,
            },
          }
        );

      if (!userResponse.ok) {
        return res.status(500).send(
          'Failed to retrieve Discord account information.'
        );
      }

      const userData =
        await userResponse.json();

      console.log(
        'Discord user authenticated:',
        userData
      );

      // Create Veyra session
      req.session.user = {
        provider: 'discord',

        id: userData.id,

        username:
          userData.username,

        displayName:
          userData.global_name ||
          userData.username,

        avatar:
          userData.avatar ||
          null,
      };

      console.log(
        'Veyra Discord session created.'
      );

      // Redirect back to Veyra
      return res.redirect(
        `${FRONTEND_URL}/?login=success`
      );

    } catch (error) {
      console.error(
        'Discord authentication error:',
        error
      );

      return res.status(500).send(
        'Discord authentication failed.'
      );
    }
  }
);

// ═════════════════════════════════════════════
// START SERVER
// ═════════════════════════════════════════════

app.listen(PORT, () => {
  console.log('');
  console.log(
    '================================'
  );
  console.log(
    '        VEYRA API SERVER'
  );
  console.log(
    '================================'
  );
  console.log('');

  console.log(
    `✓ Server running on port ${PORT}`
  );

  console.log(
    '✓ Frontend: https://www.veyra.one'
  );

  console.log(
    '✓ Roblox OAuth: /auth/roblox'
  );

  console.log(
    '✓ Discord OAuth: /auth/discord'
  );

  console.log(
    '✓ Session system: Enabled'
  );

  console.log('');
});
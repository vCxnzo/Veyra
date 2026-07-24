import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import 'dotenv/config';

const app = express();

// Render provides PORT automatically.
// Locally, it will use 3001.
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

// ─────────────────────────────────────────────
// Environment Check
// ─────────────────────────────────────────────

console.log('Checking OAuth configuration...');

console.log('Roblox Client ID:', ROBLOX_CLIENT_ID ? 'Loaded' : 'Missing');
console.log('Roblox Client Secret:', ROBLOX_CLIENT_SECRET ? 'Loaded' : 'Missing');
console.log('Roblox Redirect URI:', ROBLOX_REDIRECT_URI || 'Missing');

console.log('Discord Client ID:', DISCORD_CLIENT_ID ? 'Loaded' : 'Missing');
console.log('Discord Client Secret:', DISCORD_CLIENT_SECRET ? 'Loaded' : 'Missing');
console.log('Discord Redirect URI:', DISCORD_REDIRECT_URI || 'Missing');

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
// ROBLOX OAUTH
// ═════════════════════════════════════════════

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

  console.log('Redirecting to Roblox OAuth...');
  console.log('Roblox Redirect URI:', ROBLOX_REDIRECT_URI);

  res.redirect(authorizationUrl);
});

// ─────────────────────────────────────────────
// Roblox OAuth Callback
// ─────────────────────────────────────────────

app.get('/auth/roblox/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
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

    console.log('Received Roblox OAuth callback.');

    const tokenResponse = await fetch(
      'https://apis.roblox.com/oauth/v1/token',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: ROBLOX_CLIENT_ID,
          client_secret: ROBLOX_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code,
          redirect_uri: ROBLOX_REDIRECT_URI,
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

    console.log(
      'Roblox access token received.'
    );

    const userResponse = await fetch(
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

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Veyra - Roblox Connected</title>
        </head>

        <body>
          <h1>Roblox Connected!</h1>

          <p>
            Welcome to ${
              userData.preferred_username ||
              userData.name ||
              'Roblox User'
            }.
          </p>

          <p>
            Your Roblox account was authenticated successfully.
          </p>

          <p>
            You can close this window.
          </p>
        </body>
      </html>
    `);

  } catch (error) {
    console.error(
      'Roblox OAuth error:',
      error
    );

    res.status(500).send(
      'Roblox authentication failed.'
    );
  }
});

// ═════════════════════════════════════════════
// DISCORD OAUTH
// ═════════════════════════════════════════════

app.get('/auth/discord', (_req, res) => {

  if (
    !DISCORD_CLIENT_ID ||
    !DISCORD_REDIRECT_URI
  ) {
    console.error(
      '❌ Discord OAuth configuration missing.'
    );

    return res.status(500).send(
      'Discord OAuth is not configured correctly.'
    );
  }

  const state = crypto
    .randomBytes(32)
    .toString('hex');

  const params = new URLSearchParams();

  params.set(
    'client_id',
    DISCORD_CLIENT_ID
  );

  params.set(
    'redirect_uri',
    DISCORD_REDIRECT_URI
  );

  params.set(
    'response_type',
    'code'
  );

  params.set(
    'scope',
    'identify'
  );

  params.set(
    'state',
    state
  );

  const authorizationUrl =
    `https://discord.com/oauth2/authorize?${params.toString()}`;

  console.log('');
  console.log('================================');
  console.log('     DISCORD OAUTH REQUEST');
  console.log('================================');
  console.log(
    'Client ID:',
    DISCORD_CLIENT_ID
  );
  console.log(
    'Redirect URI:',
    DISCORD_REDIRECT_URI
  );
  console.log(
    'Authorization URL:',
    authorizationUrl
  );
  console.log('================================');
  console.log('');

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

        const errorText =
          await userResponse.text();

        console.error(
          'Discord user info error:',
          errorText
        );

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

      res.send(`
        <!DOCTYPE html>
        <html>

          <head>
            <title>
              Veyra - Discord Connected
            </title>
          </head>

          <body>

            <h1>
              Discord Connected!
            </h1>

            <p>
              Welcome to ${
                userData.global_name ||
                userData.username ||
                'Discord User'
              }.
            </p>

            <p>
              Your Discord account was authenticated successfully.
            </p>

            <p>
              You can close this window.
            </p>

          </body>

        </html>
      `);

    } catch (error) {

      console.error(
        'Discord OAuth error:',
        error
      );

      res.status(500).send(
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
  console.log('================================');
  console.log('        VEYRA API SERVER');
  console.log('================================');
  console.log('');

  console.log(
    `✓ Server running on port ${PORT}`
  );

  console.log(
    `✓ Frontend: ${FRONTEND_URL}`
  );

  console.log(
    `✓ Roblox OAuth: /auth/roblox`
  );

  console.log(
    `✓ Discord OAuth: /auth/discord`
  );

  console.log('');

});
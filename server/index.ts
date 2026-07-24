import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import 'dotenv/config';

const app = express();

const PORT = 3001;
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

if (
  !ROBLOX_CLIENT_ID ||
  !ROBLOX_CLIENT_SECRET ||
  !ROBLOX_REDIRECT_URI
) {
  console.error('❌ Missing Roblox OAuth environment variables.');
  console.error(
    'Required: ROBLOX_CLIENT_ID, ROBLOX_CLIENT_SECRET, ROBLOX_REDIRECT_URI'
  );
}

if (
  !DISCORD_CLIENT_ID ||
  !DISCORD_CLIENT_SECRET ||
  !DISCORD_REDIRECT_URI
) {
  console.error('❌ Missing Discord OAuth environment variables.');
  console.error(
    'Required: DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI'
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

  console.log('Redirecting to Roblox OAuth...');

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

    // Exchange authorization code for access token
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

    // Get Roblox user information
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
      const errorText =
        await userResponse.text();

      console.error(
        'Roblox user info error:',
        errorText
      );

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

    // Temporary success page
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Veyra - Roblox Connected</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #020617;
              color: white;
              font-family: Arial, sans-serif;
            }

            .card {
              width: 90%;
              max-width: 420px;
              padding: 40px;
              text-align: center;
              background: #0f172a;
              border: 1px solid #1e293b;
              border-radius: 20px;
              box-shadow:
                0 20px 60px
                rgba(0, 0, 0, 0.4);
            }

            .icon {
              width: 64px;
              height: 64px;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #ef4444;
              border-radius: 16px;
              font-size: 28px;
              font-weight: bold;
            }

            h1 {
              margin: 0 0 10px;
              font-size: 24px;
            }

            p {
              color: #94a3b8;
              line-height: 1.6;
            }

            .username {
              color: white;
              font-weight: bold;
            }

            .success {
              display: inline-block;
              margin-top: 15px;
              padding: 10px 16px;
              background:
                rgba(239, 68, 68, 0.15);
              color: #f87171;
              border-radius: 8px;
              font-size: 14px;
            }
          </style>
        </head>

        <body>
          <div class="card">

            <div class="icon">
              R
            </div>

            <h1>
              Roblox Connected!
            </h1>

            <p>
              Welcome to Veyra,
              <span class="username">
                ${
                  userData.preferred_username ||
                  userData.name ||
                  'Roblox User'
                }
              </span>.
            </p>

            <div class="success">
              ✓ Your Roblox account was authenticated
            </div>

            <p>
              You can close this window.
            </p>

          </div>
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
    redirect_uri: DISCORD_REDIRECT_URI,
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

      // Exchange code for access token
      const tokenResponse = await fetch(
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

      // Temporary success page
      res.send(`
        <!DOCTYPE html>
        <html>

          <head>
            <title>
              Veyra - Discord Connected
            </title>

            <style>
              * {
                box-sizing: border-box;
              }

              body {
                margin: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #020617;
                color: white;
                font-family: Arial, sans-serif;
              }

              .card {
                width: 90%;
                max-width: 420px;
                padding: 40px;
                text-align: center;
                background: #0f172a;
                border: 1px solid #1e293b;
                border-radius: 20px;
                box-shadow:
                  0 20px 60px
                  rgba(0, 0, 0, 0.4);
              }

              .icon {
                width: 64px;
                height: 64px;
                margin:
                  0 auto 20px;

                display: flex;
                align-items: center;
                justify-content: center;

                background: #5865f2;
                border-radius: 16px;

                font-size: 28px;
                font-weight: bold;
              }

              h1 {
                margin:
                  0 0 10px;

                font-size: 24px;
              }

              p {
                color: #94a3b8;
                line-height: 1.6;
              }

              .username {
                color: white;
                font-weight: bold;
              }

              .success {
                display: inline-block;
                margin-top: 15px;
                padding: 10px 16px;
                background:
                  rgba(
                    88,
                    101,
                    242,
                    0.15
                  );

                color: #818cf8;

                border-radius: 8px;

                font-size: 14px;
              }
            </style>
          </head>

          <body>

            <div class="card">

              <div class="icon">
                D
              </div>

              <h1>
                Discord Connected!
              </h1>

              <p>
                Welcome to Veyra,
                <span class="username">
                  ${
                    userData.global_name ||
                    userData.username ||
                    'Discord User'
                  }
                </span>.
              </p>

              <div class="success">
                ✓ Your Discord account
                was authenticated
              </div>

              <p>
                You can close this window.
              </p>

            </div>

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
    `✓ API: http://localhost:${PORT}`
  );
  console.log(
    `✓ Roblox OAuth: http://localhost:${PORT}/auth/roblox`
  );
  console.log(
    `✓ Discord OAuth: http://localhost:${PORT}/auth/discord`
  );
  console.log('');
});
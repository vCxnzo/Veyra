import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import session from 'express-session';
import 'dotenv/config';
import "./db";

const app = express();

// ============================================================
// CONFIGURATION
// ============================================================

const PORT = Number(process.env.PORT) || 3001;

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  'https://www.veyra.one';

// ============================================================
// ENVIRONMENT VARIABLES
// ============================================================

const ROBLOX_CLIENT_ID =
  process.env.ROBLOX_CLIENT_ID;

const ROBLOX_CLIENT_SECRET =
  process.env.ROBLOX_CLIENT_SECRET;

const ROBLOX_REDIRECT_URI =
  process.env.ROBLOX_REDIRECT_URI;

const DISCORD_CLIENT_ID =
  process.env.DISCORD_CLIENT_ID;

const DISCORD_CLIENT_SECRET =
  process.env.DISCORD_CLIENT_SECRET;

const DISCORD_REDIRECT_URI =
  process.env.DISCORD_REDIRECT_URI;

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  'veyra-development-secret-change-this';

// ============================================================
// TYPES
// ============================================================

interface Community {
  id: string;
  groupId: string;
  groupName: string;
  groupDescription: string;
  memberCount: number;
  ownerName: string | null;
  ownerId: string | null;
  iconUrl: string | null;

  connectedBy: {
    provider: 'roblox' | 'discord';
    userId: string;
  };

  createdAt: string;
}

interface RobloxGroupResponse {
  id: number;
  name: string;
  description: string;
  owner: {
    hasVerifiedBadge?: boolean;
    userId: number;
    username: string;
    displayName: string;
  } | null;
  memberCount: number;
  hasVerifiedBadge?: boolean;
}

interface RobloxThumbnailResponse {
  data?: Array<{
    targetId: number;
    state: string;
    imageUrl: string | null;
  }>;
}

// ============================================================
// TEMPORARY COMMUNITY STORAGE
// ============================================================

// This is temporary storage for testing.
//
// Important:
// Communities saved here will disappear whenever Render restarts.
//
// Later, replace this with MongoDB, PostgreSQL, Supabase, or another database.

const communities: Community[] = [];

// ============================================================
// TYPESCRIPT SESSION TYPE
// ============================================================

declare module 'express-session' {
  interface SessionData {
    user?: {
      provider: 'roblox' | 'discord';
      id: string;
      username: string;
      displayName: string;
      avatar?: string | null;
    };

    robloxOAuthState?: string;
    discordOAuthState?: string;
  }
}

// ============================================================
// ENVIRONMENT CHECK
// ============================================================

console.log('');
console.log('================================');
console.log('     CHECKING ENVIRONMENT');
console.log('================================');
console.log('');

console.log('FRONTEND_URL:', FRONTEND_URL);

console.log(
  'ROBLOX_REDIRECT_URI:',
  ROBLOX_REDIRECT_URI || 'NOT SET'
);

console.log(
  'DISCORD_REDIRECT_URI:',
  DISCORD_REDIRECT_URI || 'NOT SET'
);

console.log(
  'Roblox Client ID:',
  ROBLOX_CLIENT_ID
    ? '✓ Loaded'
    : '❌ Missing'
);

console.log(
  'Roblox Client Secret:',
  ROBLOX_CLIENT_SECRET
    ? '✓ Loaded'
    : '❌ Missing'
);

console.log(
  'Discord Client ID:',
  DISCORD_CLIENT_ID
    ? '✓ Loaded'
    : '❌ Missing'
);

console.log(
  'Discord Client Secret:',
  DISCORD_CLIENT_SECRET
    ? '✓ Loaded'
    : '❌ Missing'
);

console.log(
  'Session Secret:',
  SESSION_SECRET
    ? '✓ Loaded'
    : '❌ Missing'
);

console.log('');

// ============================================================
// TRUST RENDER PROXY
// ============================================================

app.set('trust proxy', 1);

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

// ============================================================
// SESSION
// ============================================================

app.use(
  session({
    name: 'veyra.sid',

    secret: SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
      domain: '.veyra.one',

      secure: true,

      httpOnly: true,

      sameSite: 'lax',

      maxAge:
        1000 *
        60 *
        60 *
        24 *
        7,
    },
  })
);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function requireAuthentication(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      message: 'You must be logged in.',
    });
  }

  next();
}

async function getRobloxGroup(
  groupId: string
): Promise<RobloxGroupResponse> {
  const response = await fetch(
    `https://groups.roblox.com/v1/groups/${groupId}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('GROUP_NOT_FOUND');
    }

    const errorText = await response.text();

    console.error(
      'Roblox group request failed:',
      response.status,
      errorText
    );

    throw new Error('ROBLOX_GROUP_REQUEST_FAILED');
  }

  return response.json() as Promise<RobloxGroupResponse>;
}

async function getRobloxGroupIcon(
  groupId: string
): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      groupIds: groupId,
      size: '150x150',
      format: 'Png',
      isCircular: 'false',
    });

    const response = await fetch(
      `https://thumbnails.roblox.com/v1/groups/icons?${params.toString()}`
    );

    if (!response.ok) {
      return null;
    }

    const data =
      (await response.json()) as RobloxThumbnailResponse;

    return data.data?.[0]?.imageUrl || null;
  } catch (error) {
    console.error(
      'Failed to retrieve Roblox group icon:',
      error
    );

    return null;
  }
}

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/', (_req, res) => {
  return res.json({
    success: true,
    message: 'Veyra API is running.',
    version: '1.1.0',
  });
});

app.get('/api/health', (_req, res) => {
  return res.json({
    success: true,
    message: 'Veyra backend is online.',
  });
});

// ============================================================
// AUTHENTICATION
// GET CURRENT SESSION
// ============================================================

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

// ============================================================
// LOGOUT
// ============================================================

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

    res.clearCookie('veyra.sid', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.json({
      success: true,
    });
  });
});

// ============================================================
// COMMUNITY ROUTES
// ============================================================

// ------------------------------------------------------------
// GET ALL COMMUNITIES FOR LOGGED-IN USER
// ------------------------------------------------------------

app.get(
  '/api/communities',
  requireAuthentication,
  (req, res) => {
    const user = req.session.user!;

    const userCommunities =
      communities.filter(
        (community) =>
          community.connectedBy.provider ===
            user.provider &&
          community.connectedBy.userId ===
            user.id
      );

    return res.json({
      success: true,
      hasCommunity:
        userCommunities.length > 0,
      communities: userCommunities,
    });
  }
);

// ------------------------------------------------------------
// GET ONE COMMUNITY
// ------------------------------------------------------------

app.get(
  '/api/communities/:communityId',
  requireAuthentication,
  (req, res) => {
    const user = req.session.user!;

    const community =
      communities.find(
        (savedCommunity) =>
          savedCommunity.id ===
            req.params.communityId &&
          savedCommunity.connectedBy
            .provider === user.provider &&
          savedCommunity.connectedBy
            .userId === user.id
      );

    if (!community) {
      return res.status(404).json({
        success: false,
        message:
          'Community could not be found.',
      });
    }

    return res.json({
      success: true,
      community,
    });
  }
);

// ------------------------------------------------------------
// ADD AND SAVE A ROBLOX GROUP
// ------------------------------------------------------------

app.post(
  '/api/communities',
  requireAuthentication,
  async (req, res) => {
    try {
      const user = req.session.user!;

      const rawGroupId =
        req.body?.groupId;

      const groupId =
        String(rawGroupId || '').trim();

      if (!groupId) {
        return res.status(400).json({
          success: false,
          message:
            'Enter a Roblox Group ID.',
        });
      }

      if (!/^\d+$/.test(groupId)) {
        return res.status(400).json({
          success: false,
          message:
            'The Roblox Group ID must only contain numbers.',
        });
      }

      const existingCommunity =
        communities.find(
          (community) =>
            community.groupId === groupId &&
            community.connectedBy
              .provider === user.provider &&
            community.connectedBy
              .userId === user.id
        );

      if (existingCommunity) {
        return res.status(409).json({
          success: false,
          message:
            'You have already connected this Roblox group.',
          community:
            existingCommunity,
        });
      }

      const group =
        await getRobloxGroup(groupId);

      const iconUrl =
        await getRobloxGroupIcon(
          groupId
        );

      const community: Community = {
        id:
          crypto.randomUUID(),

        groupId:
          String(group.id),

        groupName:
          group.name,

        groupDescription:
          group.description || '',

        memberCount:
          group.memberCount || 0,

        ownerName:
          group.owner?.username ||
          group.owner?.displayName ||
          null,

        ownerId:
          group.owner?.userId
            ? String(
                group.owner.userId
              )
            : null,

        iconUrl,

        connectedBy: {
          provider:
            user.provider,

          userId:
            user.id,
        },

        createdAt:
          new Date().toISOString(),
      };

      communities.push(community);

      console.log(
        `Community connected: ${community.groupName} (${community.groupId}) by ${user.username}`
      );

      return res.status(201).json({
        success: true,
        message:
          'Roblox group connected successfully.',
        community,
      });
    } catch (error) {
      console.error(
        'Add community error:',
        error
      );

      if (
        error instanceof Error &&
        error.message ===
          'GROUP_NOT_FOUND'
      ) {
        return res.status(404).json({
          success: false,
          message:
            'That Roblox group does not exist.',
        });
      }

      return res.status(500).json({
        success: false,
        message:
          'Veyra could not connect that Roblox group.',
      });
    }
  }
);

// ------------------------------------------------------------
// REMOVE A COMMUNITY
// ------------------------------------------------------------

app.delete(
  '/api/communities/:communityId',
  requireAuthentication,
  (req, res) => {
    const user = req.session.user!;

    const communityIndex =
      communities.findIndex(
        (community) =>
          community.id ===
            req.params.communityId &&
          community.connectedBy
            .provider === user.provider &&
          community.connectedBy
            .userId === user.id
      );

    if (communityIndex === -1) {
      return res.status(404).json({
        success: false,
        message:
          'Community could not be found.',
      });
    }

    communities.splice(
      communityIndex,
      1
    );

    return res.json({
      success: true,
      message:
        'Community removed successfully.',
    });
  }
);

// ============================================================
// ROBLOX OAUTH
// ============================================================

// ------------------------------------------------------------
// START ROBLOX LOGIN
// ------------------------------------------------------------

app.get(
  '/auth/roblox',
  (req, res) => {
    if (
      !ROBLOX_CLIENT_ID ||
      !ROBLOX_REDIRECT_URI
    ) {
      return res
        .status(500)
        .send(
          'Roblox OAuth is not configured correctly.'
        );
    }

    const state =
      crypto
        .randomBytes(32)
        .toString('hex');

    req.session.robloxOAuthState =
      state;

    const params =
      new URLSearchParams({
        client_id:
          ROBLOX_CLIENT_ID,

        redirect_uri:
          ROBLOX_REDIRECT_URI,

        response_type:
          'code',

        scope:
          'openid profile',

        state,
      });

    const authorizationUrl =
      `https://apis.roblox.com/oauth/v1/authorize?${params.toString()}`;

    req.session.save(
      (error) => {
        if (error) {
          console.error(
            'Failed to save Roblox OAuth state:',
            error
          );

          return res.status(500).send(
            'Failed to start Roblox login.'
          );
        }

        console.log(
          'Redirecting to Roblox OAuth...'
        );

        return res.redirect(
          authorizationUrl
        );
      }
    );
  }
);

// ------------------------------------------------------------
// ROBLOX CALLBACK
// ------------------------------------------------------------

app.get(
  '/auth/roblox/callback',
  async (req, res) => {
    try {
      const {
        code,
        state,
      } = req.query;

      if (
        !code ||
        typeof code !== 'string'
      ) {
        return res
          .status(400)
          .send(
            'Missing Roblox authorization code.'
          );
      }

      if (
        !state ||
        typeof state !== 'string' ||
        state !==
          req.session.robloxOAuthState
      ) {
        return res
          .status(400)
          .send(
            'Invalid Roblox authentication state.'
          );
      }

      delete req.session
        .robloxOAuthState;

      if (
        !ROBLOX_CLIENT_ID ||
        !ROBLOX_CLIENT_SECRET ||
        !ROBLOX_REDIRECT_URI
      ) {
        return res
          .status(500)
          .send(
            'Roblox OAuth is not configured correctly.'
          );
      }

      console.log(
        'Received Roblox OAuth callback.'
      );

      const tokenResponse =
        await fetch(
          'https://apis.roblox.com/oauth/v1/token',
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded',
            },

            body:
              new URLSearchParams({
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

        return res
          .status(500)
          .send(
            'Failed to authenticate with Roblox.'
          );
      }

      const tokenData:
        any =
        await tokenResponse.json();

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
        const errorText =
          await userResponse.text();

        console.error(
          'Roblox user info error:',
          errorText
        );

        return res
          .status(500)
          .send(
            'Failed to retrieve Roblox account information.'
          );
      }

      const userData:
        any =
        await userResponse.json();

      console.log(
        'Roblox user authenticated:',
        userData
      );

      req.session.user = {
        provider:
          'roblox',

        id:
          String(
            userData.sub ||
              userData.id ||
              ''
          ),

        username:
          userData.preferred_username ||
          userData.name ||
          'Roblox User',

        displayName:
          userData.name ||
          userData.preferred_username ||
          'Roblox User',

        avatar:
          userData.picture ||
          null,
      };

      req.session.save(
        (error) => {
          if (error) {
            console.error(
              'Roblox session save error:',
              error
            );

            return res
              .status(500)
              .send(
                'Failed to create login session.'
              );
          }

          console.log(
            'Roblox session created successfully.'
          );

          return res.redirect(
            `${FRONTEND_URL}?login=success`
          );
        }
      );
    } catch (error) {
      console.error(
        'Roblox authentication error:',
        error
      );

      return res
        .status(500)
        .send(
          'Roblox authentication failed.'
        );
    }
  }
);

// ============================================================
// DISCORD OAUTH
// ============================================================

// ------------------------------------------------------------
// START DISCORD LOGIN
// ------------------------------------------------------------

app.get(
  '/auth/discord',
  (req, res) => {
    if (
      !DISCORD_CLIENT_ID ||
      !DISCORD_REDIRECT_URI
    ) {
      return res
        .status(500)
        .send(
          'Discord OAuth is not configured correctly.'
        );
    }

    const state =
      crypto
        .randomBytes(32)
        .toString('hex');

    req.session.discordOAuthState =
      state;

    const params =
      new URLSearchParams({
        client_id:
          DISCORD_CLIENT_ID,

        redirect_uri:
          DISCORD_REDIRECT_URI,

        response_type:
          'code',

        scope:
          'identify',

        state,
      });

    const authorizationUrl =
      `https://discord.com/oauth2/authorize?${params.toString()}`;

    req.session.save(
      (error) => {
        if (error) {
          console.error(
            'Failed to save Discord OAuth state:',
            error
          );

          return res.status(500).send(
            'Failed to start Discord login.'
          );
        }

        console.log(
          'Redirecting to Discord OAuth...'
        );

        return res.redirect(
          authorizationUrl
        );
      }
    );
  }
);

// ------------------------------------------------------------
// DISCORD CALLBACK
// ------------------------------------------------------------

app.get(
  '/auth/discord/callback',
  async (req, res) => {
    try {
      const {
        code,
        state,
      } = req.query;

      if (
        !code ||
        typeof code !== 'string'
      ) {
        return res
          .status(400)
          .send(
            'Missing Discord authorization code.'
          );
      }

      if (
        !state ||
        typeof state !== 'string' ||
        state !==
          req.session.discordOAuthState
      ) {
        return res
          .status(400)
          .send(
            'Invalid Discord authentication state.'
          );
      }

      delete req.session
        .discordOAuthState;

      if (
        !DISCORD_CLIENT_ID ||
        !DISCORD_CLIENT_SECRET ||
        !DISCORD_REDIRECT_URI
      ) {
        return res
          .status(500)
          .send(
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
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded',
            },

            body:
              new URLSearchParams({
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

        return res
          .status(500)
          .send(
            'Failed to authenticate with Discord.'
          );
      }

      const tokenData:
        any =
        await tokenResponse.json();

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

        return res
          .status(500)
          .send(
            'Failed to retrieve Discord account information.'
          );
      }

      const userData:
        any =
        await userResponse.json();

      console.log(
        'Discord user authenticated:',
        userData
      );

      req.session.user = {
        provider:
          'discord',

        id:
          String(userData.id),

        username:
          userData.username ||
          'Discord User',

        displayName:
          userData.global_name ||
          userData.username ||
          'Discord User',

        avatar:
          userData.avatar
            ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
            : null,
      };

      req.session.save(
        (error) => {
          if (error) {
            console.error(
              'Discord session save error:',
              error
            );

            return res
              .status(500)
              .send(
                'Failed to create login session.'
              );
          }

          console.log(
            'Discord session created successfully.'
          );

          return res.redirect(
            `${FRONTEND_URL}?login=success`
          );
        }
      );
    } catch (error) {
      console.error(
        'Discord authentication error:',
        error
      );

      return res
        .status(500)
        .send(
          'Discord authentication failed.'
        );
    }
  }
);

// ============================================================
// START SERVER
// ============================================================

app.listen(
  PORT,
  () => {
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
      `✓ Frontend: ${FRONTEND_URL}`
    );

    console.log(
      '✓ Roblox OAuth: /auth/roblox'
    );

    console.log(
      '✓ Discord OAuth: /auth/discord'
    );

    console.log(
      '✓ Auth Check: /api/auth/me'
    );

    console.log(
      '✓ Get Communities: GET /api/communities'
    );

    console.log(
      '✓ Add Community: POST /api/communities'
    );

    console.log(
      '✓ Remove Community: DELETE /api/communities/:communityId'
    );

    console.log(
      '✓ Logout: /api/auth/logout'
    );

    console.log('');
  }
);
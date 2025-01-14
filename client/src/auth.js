import { OAuthClient } from "./auth/oauth-client";

const oauthClient = new OAuthClient({
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  clientSecret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
  redirectUri: `${window.location.origin}/callback`,
  authorizationEndpoint: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/authorize`,
  tokenEndpoint: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`,
  scope: "openid profile email offline_access",
});

export default oauthClient;

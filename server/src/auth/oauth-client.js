import "isomorphic-fetch";

class OAuthClient {
  /**
   * @param {import('./types').OAuthClientConfig} config
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Starts the OAuth authorization flow
   * @returns {Object} The authorization URL
   */
  startAuthFlow() {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope,
      response_type: "code",
    });

    const authUrl = `${this.config.authorizationEndpoint}?${params.toString()}`;

    return { authUrl };
  }

  /**
   * Handles the OAuth callback
   * @param {Object} callbackParams - The callback parameters
   * @returns {Promise<import('./types').TokenResponse>}
   */
  async handleCallback(callbackParams) {
    if (!callbackParams.code) {
      throw new Error("No authorization code found in the callback parameters");
    }

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: this.config.redirectUri,
      code: callbackParams.code,
    });

    const response = await fetch(this.config.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tokenResponse = await response.json();
    this.storeTokens(tokenResponse);
    return tokenResponse;
  }

  /**
   * Refreshes the access token
   * @param (string) refreshToken - The refresh token
   * @returns {Promise<import('./types').TokenResponse>}
   */
  async refreshToken(refreshToken) {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      refresh_token: refreshToken,
    });

    const response = await fetch(this.config.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tokenResponse = await response.json();
    this.storeTokens(tokenResponse);
    return tokenResponse;
  }

  // client-side support to manage tokens, by checking user's environment
  /**
   * stores the tokens (client-side usage)
   * @param (import("./types").TokenResponse) tokens
   */
  storeTokens(tokens) {
    if (typeof window !== "undefined") {
      localStorage.setItem("oauth_tokens", JSON.stringify(tokens));
    }
  }

  /**
   * Retrieves the stored tokens (client-side usage)
   * @returns {import("./types").TokenResponse|null}
   */
  getStoredTokens() {
    if (typeof window !== "undefined") {
      const tokens = localStorage.getItem("oauth_tokens");
      return tokens ? JSON.parse(tokens) : null;
    }
  }

  /**
   * Clears the stored tokens (client-side usage)
   */
  clearTokens() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("oauth_tokens");
    }
  }
}

export { OAuthClient };

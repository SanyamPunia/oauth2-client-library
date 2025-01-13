/**
 * @typedef {Object} OAuthClientConfig
 * @property {string} clientId - The OAuth client ID
 * @property {string} clientSecret - The OAuth client secret
 * @property {string} redirectUri - The redirect URI for the OAuth flow
 * @property {string} authorizationEndpoint - The authorization endpoint URL
 * @property {string} tokenEndpoint - The token endpoint URL
 * @property {string} scope - The requested scope for the OAuth flow
 */

/**
 * @typedef {Object} TokenResponse
 * @property {string} access_token - The access token
 * @property {string} token_type - The token type (e.g., "Bearer")
 * @property {number} expires_in - The expiration time in seconds
 * @property {string} refresh_token - The refresh token
 */

export {};

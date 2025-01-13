### OAuth 2.0 React Implementation Guide

Hey there! 👋 This guide will help you implement OAuth authentication in your React app using our custom OAuth client library. For this instance, we'll be using [Auth0](https://auth0.com/) as a provider.

### My understanding of the auth flow

- The user clicks on the login/sign-up CTA and gets redirected to a third-party authentication provider (like **Auth0**).
- The user fills in their credentials, grants necessary permissions, and completes the authentication process.
- The user is then redirected back to our site, either authenticated or with an error.
- During the redirect, the user returns with an **authorization code**, which is used by your auth client to exchange for an **access token** and potentially a **refresh token**.
- Finally, the user is either signed in with a valid session stored in **`localStorage`** or **`sessionStorage`**, or an error is thrown.

### Structure

We have divided our application into two parts: `client` and `server`.

- **Client**: Contains the demo application, which is utilizing our server to make necessary requests.
- **Server**: Contains two core files:
  - `server.js`: This file is responsible for creating and instantiating the entire authentication flow.
  - `oauth-client.js`: This file defines and creates a standard OAuth client, providing the foundation for `server.js` to handle the auth flow.

### Developer Checklist

- [x] Use your OAuth client library to implement a login flow
- [x] Include a login button that initiates the OAuth process
- [x] Handle the OAuth callback and securely manage tokens
- [x] Display user information after successful authentication
- [x] Ensure the library is platform-agnostic, capable of running in both browser and server environments without relying on browser-specific APIs
# REST API Endpoints

## `/api/callback`

Callback handler for OAuth flow.

## `/api/claims`

Returns the claims of the current ID token as a JSON object.

## `/api/session`

Returns session data (which is currently based on the response from [FusionAuth's `/oauth2/userinfo` endpoint][1]).

[1]: https://fusionauth.io/docs/v1/tech/oauth/endpoints/#introspect

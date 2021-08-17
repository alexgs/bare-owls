import * as env from 'env-var';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const FUSIONAUTH_CLIENT_ID = env.get('FUSIONAUTH_CLIENT_ID').required().asString();
const FUSIONAUTH_CLIENT_SECRET = env.get('FUSIONAUTH_CLIENT_SECRET').required().asString();
const FUSIONAUTH_HOST_EXTERNAL = env.get('FUSIONAUTH_HOST_EXTERNAL').required().asString(); // Root URL from outside the Docker network
const FUSIONAUTH_HOST_INTERNAL = env.get('FUSIONAUTH_HOST_INTERNAL').required().asString(); // Root URL from inside the Docker network

export default NextAuth({
  providers: [
    Providers.FusionAuth({
      clientId: FUSIONAUTH_CLIENT_ID,
      clientSecret: FUSIONAUTH_CLIENT_SECRET,

      // Override the following values (side effect: no need to set the `domain` field)
      authorizationUrl: `${FUSIONAUTH_HOST_EXTERNAL}/oauth2/authorize?response_type=code`,
      accessTokenUrl: `${FUSIONAUTH_HOST_INTERNAL}/oauth2/token`,
      profileUrl: `${FUSIONAUTH_HOST_INTERNAL}/oauth2/userinfo`,
    }),
  ],
});

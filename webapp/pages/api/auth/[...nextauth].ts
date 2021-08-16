import * as env from 'env-var';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const FUSIONAUTH_CLIENT_ID = env.get('FUSIONAUTH_CLIENT_ID').required().asString();
const FUSIONAUTH_CLIENT_SECRET = env.get('FUSIONAUTH_CLIENT_SECRET').required().asString();
const FUSIONAUTH_DOMAIN = env.get('FUSIONAUTH_DOMAIN').required().asString();
const WEBAPP_FUSIONAUTH_HOST = env.get('WEBAPP_FUSIONAUTH_HOST').required().asString();

// noinspection HttpUrlsUsage
export default NextAuth({
  providers: [
    Providers.FusionAuth({
      clientId: FUSIONAUTH_CLIENT_ID,
      clientSecret: FUSIONAUTH_CLIENT_SECRET,
      domain: FUSIONAUTH_DOMAIN,

      // Override values until TLS is working for FusionAuth
      authorizationUrl: `http://${FUSIONAUTH_DOMAIN}/oauth2/authorize?response_type=code`,

      // These two are called on the server and need the Docker hostname
      accessTokenUrl: `http://${WEBAPP_FUSIONAUTH_HOST}/oauth2/token`,
      profileUrl: `http://${WEBAPP_FUSIONAUTH_HOST}/oauth2/userinfo`,
    }),
  ],
});

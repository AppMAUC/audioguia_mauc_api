const admin = require("firebase-admin");

/**
 * Firebase Admin SDK service account configuration object.
 *
 * @typedef {Object} ServiceAccount
 * @property {string} type - The type of the service account.
 * @property {string} project_id - The project ID.
 * @property {string} private_key_id - The private key ID.
 * @property {string} private_key - The private key.
 * @property {string} client_email - The client email.
 * @property {string} client_id - The client ID.
 * @property {string} auth_uri - The authentication URI.
 * @property {string} token_uri - The token URI.
 * @property {string} auth_provider_x509_cert_url - The auth provider x509 certificate URL.
 * @property {string} client_x509_cert_url - The client x509 certificate URL.
 * @property {string} universe_domain - The universe domain.
 */
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.split(String.raw`\n`).join('\n'), // Corrigindo as quebras de linha
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

/**
 * Initializes Firebase Admin SDK with the provided service account credentials.
*
* @param {ServiceAccount} serviceAccount - The service account configuration object.
* @returns {void}
*/
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

/**
 * Firebase storage bucket instance.
*
* @type {admin.storage.Bucket}
 * @module
 */
const bucket = admin.storage().bucket();

module.exports = { bucket };

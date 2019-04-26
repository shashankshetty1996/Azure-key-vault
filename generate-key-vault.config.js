require("dotenv").config();

const KeyVault = require("azure-keyvault");
const AuthenticationContext = require("adal-node").AuthenticationContext;

const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
const vaultUri = process.env.vaultUri;

// Authenticator - retrieves the access token
const authenticator = function(challenge, callback) {
  // Create a new authentication context.
  const context = new AuthenticationContext(challenge.authorization);

  // Use the context to acquire an authentication token.
  return context.acquireTokenWithClientCredentials(
    challenge.resource,
    clientId,
    clientSecret,
    function(err, tokenResponse) {
      if (err) throw err;
      // Calculate the value to be set in the request's Authorization header and resume the call.
      const authorizationValue =
        tokenResponse.tokenType + " " + tokenResponse.accessToken;

      return callback(null, authorizationValue);
    }
  );
};

const credentials = new KeyVault.KeyVaultCredentials(authenticator);
const client = new KeyVault.KeyVaultClient(credentials);

const secretName = "mysecret";
const value = "myValue";
const optionsOpt = {
  contentType: "sometype"
  // tags: 'sometag',
  // secretAttributes: 'someAttributes',
  // contentType: 'sometype',
  // customHeaders: 'customHeaders'
};

client.setSecret(vaultUri, secretName, value, optionsOpt).then(results => {
  console.log(results);
});

const secretVersion = ""; //leave this blank to get the latest version;
client.getSecret(vaultUri, secretName, secretVersion).then(result => {
  console.log(result);
});

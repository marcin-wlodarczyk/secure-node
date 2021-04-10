const authConfig = {
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS_URI,
    audience: process.env.AUTH0_AUDIENCE,
    issuer: process.env.AUTH0_ISSUER,
    appMetadataClaim: process.env.AUTH0_APP_METADATA_CLAIM,
};

console.log(authConfig);

export {authConfig}

import jwt, {RequestHandler} from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';
import {INTERNAL_SERVER_ERROR, NOT_FOUND} from 'http-status-codes';
import {authConfig} from '../config';
import {JWTClaims} from '../interfaces';

export class Middleware {
    public static validateAndDecodeJWT(): RequestHandler {
        return jwt({
            secret: jwksRsa.expressJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: authConfig.jwksRequestsPerMinute,
                jwksUri: authConfig.jwksUri as string,
            }),
            audience: authConfig.audience,
            issuer: authConfig.issuer,
            algorithms: ['RS256'],
        });
    }

    public static validateDecodedJWTClaims(req, res, next): any {
        if (!authConfig.appMetadataClaim) {
            return next(new Error(`Misconfiguration of AUTH0_APP_METADATA_CLAIM`));
        }

        let token = req.headers['authorization']; // Get Bearer token
        token = token.split(' ')[1]; // Get actual token

        if (!token) {
            return next(new Error(`Internal Error. Bearer token not found`));
        }

        const user = req.user;
        const metaData = user[authConfig.appMetadataClaim];
        const userRole = metaData && metaData.role ? metaData.role : null;

        const jwtClaims: JWTClaims = {
            role: userRole,
            userId: user.sub,
            accessToken: token,
        };

        req.user = jwtClaims;
        return next();
    }

    public static handle404Error = (req, res, next): void => {
        const err = new Error('Not Found') as any;
        err.status = NOT_FOUND;
        next(err);
    };

    public static handleError(error, req, res, next): void {
        const status = error.status || INTERNAL_SERVER_ERROR;
        const message = error.message || `Server error`;
        return res.status(status).send({message});
    }
}

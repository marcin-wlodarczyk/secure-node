import {Request} from 'express';

export interface JWTClaims {
    userId: string;
    role: string | null;
    accessToken: string;
}

export interface DecodedExpressRequest extends Request {
    user: JWTClaims;
}

import {Router, Request, Response} from 'express';
import {DecodedExpressRequest} from '../interfaces';

const openRouter = Router();
openRouter.get('/ping', (req: Request, res: Response) => res.json({message: 'pong'}));

const protectedRouter = Router();
protectedRouter.get('/', (req: Request, res: Response) => {
    const decodedRequest = req as DecodedExpressRequest;
    return res.json({
        message: `Hello ${decodedRequest.user.userId} from the protected route!`
    });
});

export {openRouter, protectedRouter};

import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import {Middleware} from './middleware/Middleware';
import {openRouter, protectedRouter} from './routes';

const origin = {
    origin: '*',
};

const app = express();

app.use(bodyParser.json({limit: '15mb'}));
app.use(bodyParser.urlencoded({limit: '15mb', extended: true}));
app.use(cors(origin));
app.use(compression());
app.use(helmet());
app.use(morgan('dev'));

/* ==============Auth0 & Protected Routes==============*/
app.use('/api/', openRouter);

app.use(Middleware.validateAndDecodeJWT());
app.use(Middleware.validateDecodedJWTClaims);
app.use('/api/protected', protectedRouter);

/* ==============404 ERROR HANDLER==============*/
app.use(Middleware.handle404Error);

/* ==============ERROR HANDLER==============*/
app.use(Middleware.handleError);

const port = process.env.PORT || 80;

/* ==============Database Setup==============*/
// (async (): Promise<any> => {
//     try {
//         // You can setup your DB here
//         console.log('Nice! Database looks fine');
//     } catch (err) {
//         console.log(err, 'Something went wrong with the Database Update!');
//         return process.exit(1);
//     }
// })();

app.listen(port, () => {
    console.log(`[App]: Listening on port ${port}`);
});

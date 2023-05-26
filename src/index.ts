import express from 'express';
import routes from './routes';
import consola from "consola";
import { connectDatabase } from './config/database/mongodb_config';

const app = express();

const { PORT = 4000, API_URL } = process.env

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', API_URL ?? "*")
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    next()
});

async function bootstrap() {

    try {
        await connectDatabase();
        app.use('/api/v1', routes);

        app.listen(PORT, () => {
            consola.success(`🚀 App is running at http://localhost:${PORT}`)
        })
    } catch (err) {
        consola.error(err);
    }
}
bootstrap();

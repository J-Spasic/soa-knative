import express, { Express } from 'express';

const app: Express = express();

app.use(express.json());

const PORT: number = parseInt(process.env.PORT as string, 10) || 8080;
app.listen(PORT, (): void => {
    console.log(`Listening on port ${PORT}`);
});

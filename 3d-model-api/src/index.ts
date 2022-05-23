import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 8080;
const assetsDirectoryPath: string = `${__dirname.substring(0, __dirname.length - 4)}assets`;

app.use(cors());
app.use(express.json());
app.use(express.static(assetsDirectoryPath));

app.get('/3dModels', async (req: Request, res: Response): Promise<void> => {
    fs.readdir(assetsDirectoryPath, (err: NodeJS.ErrnoException | null, files: string[]): void => {
        if (err) {
            console.log(`Unable to scan directory: ${err}`);
        } else {
            const availableModels: string[] = [];

            files.forEach((file: string) => {
                if (fs.statSync(`${assetsDirectoryPath}/${file}`).isDirectory()) {
                    availableModels.push(file);
                }
            });

            res.send(availableModels);
        }
    });
});

app.get('/3dModels/:modelName', async (req: Request, res: Response): Promise<void> => {
    const protocol: string = req.protocol;
    const host: string = req.hostname;
    // port is used only outside the Docker environment.
    // const port: number = parseInt(process.env.PORT as string, 10) || PORT;

    const modelName: string = req.params.modelName;

    const resourceUri: string = `${protocol}://${host}/${modelName}/scene.gltf`;
    res.send(resourceUri);
});

app.listen(PORT, (): void => {
    console.log(`Listening on port ${PORT}`);
});

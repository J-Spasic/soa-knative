import express, { Express, Request, Response } from 'express';
import fs from 'fs';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 8080;

app.use(express.json());

app.get('/3dModels', async (req: Request, res: Response): Promise<void> => {
    const rootPathLength: number = __dirname.length - 4;
    const assetsDirectoryPath: string = `${__dirname.substring(0, rootPathLength)}assets`;

    fs.readdir(assetsDirectoryPath, (err: NodeJS.ErrnoException | null, files: string[]): void => {
        if (err) {
            console.log(`Unable to scan directory: ${err}`);
        } else {
            const arrayOfModels: Array<string> = new Array<string>();

            files.forEach((file: string) => {
                if (fs.statSync(`${assetsDirectoryPath}/${file}`).isDirectory()) {
                    arrayOfModels.push(file);
                }
            });

            res.send(arrayOfModels);
        }
    });
});

app.get('/3dModels/:modelName', async (req: Request, res: Response): Promise<void> => {
    const protocol: string = req.protocol;
    const host: string = req.hostname;
    const port: number = parseInt(process.env.PORT as string, 10) || PORT;

    const modelName: string = req.params.modelName;

    const resourceUri: string = `${protocol}://${host}:${port}/assets/${modelName}/scene.gltf`;

    res.send(resourceUri);
});

app.listen(PORT, (): void => {
    console.log(`Listening on port ${PORT}`);
});

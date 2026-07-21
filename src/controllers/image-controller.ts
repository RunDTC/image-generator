import { Request, Response } from 'express';
import imageService from '../services/image-service';

class ImageController {

    public async preview(req: Request, res: Response): Promise<void> {

        try {

            console.log("Test log preview: Generating image preview...");


            const image = await imageService.generate();

            res.setHeader('Content-Type', 'image/jpeg');
            res.send(image);

        } catch (error) {

            console.error(error);

            const message =
                error instanceof Error
                    ? error.message
                    : 'Internal server error';

            res.status(500).json({
                error: message
            });

        }

    }

    public async getVersion(req: Request, res: Response): Promise<void> {
        res.send('v1');
    }

}

export default new ImageController();
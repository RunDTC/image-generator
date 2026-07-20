import { Request, Response } from 'express';
import imageService from '../services/image-service';

class ImageController {

    public async preview(req: Request, res: Response): Promise<void> {

        try {

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

}

export default new ImageController();
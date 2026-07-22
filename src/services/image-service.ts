import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

import personalization from '../config/personalization';
import fontService from './font-service';
import svgService from './svg-service';

class ImageService {

    public async generate(): Promise<Buffer> {

        const config = personalization.default;
        const imagePath = path.resolve(config.backgroundImage);
        const imageBuffer = await fs.readFile(imagePath);
        const image = sharp(imageBuffer);
        const metadata = await image.metadata();

        if (!metadata.width || !metadata.height) {
            throw new Error('Unable to determine image dimensions.');
        }

        // Exemplo com duas linhas (igual ao PHP)
//         const text = `Pedro
// Bento aps`;

        const text = `PedroC`;

        const lines = text.split('\n');

        const metrics = await Promise.all(

            lines.map(line =>
                fontService.bestFit({
                    text: line,
                    width: config.width,
                    fontFile: config.fontFile,
                    maxFontSize: config.maxFontSize

                })
            )

        );

        const svg = await svgService.render({
            text,
            metrics,
            fontFile: config.fontFile,
            color: config.color,
            strokeColor: config.strokeColor,
            strokeWidth: config.strokeWidth,
            x: config.x,
            y: config.y,
            width: config.width,
            height: config.height,
            imageWidth: metadata.width,
            imageHeight: metadata.height

        });

        return image
            .composite([
                {
                    input: Buffer.from(svg)
                }
            ])
            .jpeg({
                quality: 90
            })
            .toBuffer();

    }

}

export default new ImageService();
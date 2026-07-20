import opentype from 'opentype.js';

export interface FontMetrics {
    fontSize: number;
    width: number;
    height: number;
}

interface MeasureOptions {
    text: string;
    fontFile: string;
    fontSize: number;
}

interface BestFitOptions {
    text: string;
    width: number;
    fontFile: string;
    maxFontSize: number;
}

class FontService {

    private readonly cache = new Map<string, opentype.Font>();

    private async loadFont(fontFile: string): Promise<opentype.Font> {

        const cached = this.cache.get(fontFile);

        if (cached) {
            return cached;
        }

        const font = await opentype.load(fontFile);

        this.cache.set(fontFile, font);

        return font;

    }

    public async measure(options: MeasureOptions): Promise<Omit<FontMetrics, 'fontSize'>> {

        const font = await this.loadFont(options.fontFile);

        const path = font.getPath(
            options.text,
            0,
            0,
            options.fontSize
        );

        const box = path.getBoundingBox();

        return {
            width: box.x2 - box.x1,
            height: box.y2 - box.y1

        };

    }

    public async bestFit(options: BestFitOptions): Promise<FontMetrics> {

        let fontSize = options.maxFontSize;

        while (fontSize > 1) {

            const metrics = await this.measure({
                text: options.text,
                fontFile: options.fontFile,
                fontSize

            });

            if (metrics.width <= options.width) {

                return {
                    fontSize,
                    width: metrics.width,
                    height: metrics.height
                };

            }

            fontSize--;

        }

        return {
            fontSize: 1,
            width: 0,
            height: 0
        };

    }

}

export default new FontService();
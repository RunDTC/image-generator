import opentype from 'opentype.js';

interface FontMetric {
    fontSize: number;
    width: number;
    height: number;
}

interface RenderOptions {
    text: string;
    metrics: FontMetric[];
    fontFile: string;
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
    imageWidth: number;
    imageHeight: number;
}

class SvgService {

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

    public async render(options: RenderOptions): Promise<string> {

        const font = await this.loadFont(options.fontFile);

        const lines = options.text.split('\n');

        const lineHeight = options.height / lines.length;

        let paths = '';

        for (let i = 0; i < lines.length; i++) {

            const line = lines[i];

            const metric = options.metrics[i];

            const path = font.getPath(
                line,
                0,
                0,
                metric.fontSize
            );

            const box = path.getBoundingBox();

            const textWidth = box.x2 - box.x1;

            const centeredX = options.x - (textWidth / 2);

            const currentY = options.y + (i * lineHeight);

            const centeredPath = font.getPath(
                line,
                centeredX,
                currentY,
                metric.fontSize
            );

            paths += `
    <path
        d="${centeredPath.toPathData(3)}"
        fill="${options.color}" />`;

        }

        return `
<svg
    xmlns="http://www.w3.org/2000/svg"
    width="${options.imageWidth}"
    height="${options.imageHeight}"
    viewBox="0 0 ${options.imageWidth} ${options.imageHeight}">
${paths}
</svg>`;

    }

}

export default new SvgService();
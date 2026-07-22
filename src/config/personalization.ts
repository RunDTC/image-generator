import path from 'path';

export interface PersonalizationConfig {
    backgroundImage: string;
    fontFile: string;
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
    maxFontSize: number;
    strokeColor?: string;
    strokeWidth?: number;
}

// Background image
// Text X position
// Text Y position
// Text area width
// Text area height
// Maximum font size
// Maximum font size for multi-line text (if applicable)
// Text color
// Vertical alignment (if configurable)
// Font (only if products can use different fonts; otherwise we can keep a default font in the service)

const ROOT = process.cwd();

const personalization: { default: PersonalizationConfig } = {

    default: {

        backgroundImage: path.join(
            ROOT,
            'src',
            'assets',
            'images',
            'sample.jpg'
        ),

        fontFile: path.join(
            ROOT,
            'src',
            'assets',
            'fonts',
            'you-webfont.ttf'
        ),

        color: '#6641be',

        strokeColor: '#FFFFFF',

        strokeWidth: 12,

        x: 470,

        y: 900,

        width: 637,

        height: 115,

        maxFontSize: 122

    }

};

export default personalization;
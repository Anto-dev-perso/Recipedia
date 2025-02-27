import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

const {baseUrl, paths} = tsconfig.compilerOptions;

const getAliases = () => {
    return Object.entries(paths).reduce((aliases, alias) => {
        const key = alias[0].replace('/*', '');
        const value = baseUrl + alias[1][0].replace('*', '');
        return {
            ...aliases,
            [key]: value,
        };
    }, {});
};

export default function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    extensions: [
                        '.js',
                        '.jsx',
                        '.ts',
                        '.android.tsx',
                        '.ios.js',
                        '.ios.tsx',
                    ],
                    alias: getAliases(),
                },
            ],
        ],
    };
};

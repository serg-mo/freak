import path from 'node:path';
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/index.tsx',

  output: {
    path: path.resolve(__dirname, 'docs'),
    // publicPath: '/', // 'https://serg-mo.github.io/recipe/',
    filename: 'bundle.js',
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  plugins: [new HtmlWebpackPlugin({ template: './public/index.html' })],

  devServer: {
    static: './public',
    open: true,
    hot: true,
  },
};

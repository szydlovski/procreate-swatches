import {readSwatchesFile, createSwatchesFile} from './src/index.js';
import fs from 'fs';

(async () => {
  const data = fs.readFileSync('./test/sample/mypalette.swatches');
  console.log(data);
  const swatches = await readSwatchesFile(data);
  console.log(swatches);
})();
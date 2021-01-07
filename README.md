# procreate-swatches

Read and create Procreate `.swatches` palette files.

# Usage

```javascript
import { readSwatchesFile, createSwatchesFile } from 'procreate-swatches';

// Node.js
import { promises as fs } from 'fs';
(async () => {
  const data = await fs.readFile('path/to/palette.swatches');
  const swatches = readSwatchesFile(data);
})();

// Browser
(async () => {
  const response = await fetch('path/to/palette.swatches');
  const data = await response.arrayBuffer();
  const swatches = readSwatchesFile(data);
})();

// Creating a .swatches file
(async () => {
  const swatchesFile = createSwatchesFile('My Palette', [
    ['rgb', [255,0,0]],
    ['rgb', [0,255,0]],
    ['rgb', [0,0,255]]
  ]);
  console.log(swatchesFile); // ArrayBuffer
})();
```

This module is also available as `commonjs`:

```javascript
const { readSwatchesFile, createSwatchesFile } = require('procreate-swatches/cjs');
```

# API

## readSwatchesFile(data[, colorSpace = 'hsv'])

Reads the contents of a Procreate `.swatches` file and optionally converts the parsed colors to a different color space.

**Arguments:**
- data - required, the file to be parsed. Supported formats: `base64`, `text`, `binarystring`, `array`, `uint8array`, `arraybuffer`, `blob`, `nodebuffer`
- colorSpace - `string` - optional, the color space to convert the parsed colors to, defaults to `hsv`. Procreate stores swatches in HSB (an alias of HSV), so if you leave the second argument blank they will stay that way. Supported color spaces: `rgb`, `hsl`, `hsv`, `hwb`, `xyz`, `lab`, `lch`.

**Returns:**
- `object` - a plain object containing two properties:
  - name - `string` - the name of the parsed palette
  - colors - `array` - containing colors from the palette as `arrays` in the format `[colorSpace, [...colorValues]]`, i.e. `['rgb', [255,255,255]]`. Some elements of the colors array may be `null`, indicating an empty spot in the palette.

**Throws:**
- `ProcreateSwatchesError` - if the file is not a valid `.swatches` file, or if the requested color space is not supported

## createSwatchesFile(name, colors, format = 'uint8array')

Creates a new Procreate `.swatches` file.

**Arguments:**
 - name - `string` - the name of the palette
 - colors - `array` - containing the colors to be included in the palette, in the format `[colorSpace, [...colorValues]]`, i.e. `['rgb', [255,255,255]]` (spaces other than `hsv` will be converted). You may also include `null` to create an empty spot in the palette. A Procreate palette may only contain 30 colors, any more will be ignored.
 - format - `string` - the format to return the created file in. Supported formats: `base64`, `text`, `binarystring`, `array`, `uint8array`, `arraybuffer`, `blob`, `nodebuffer`

**Returns:**
- `arraybuffer` - raw contents of the created `.swatches` file

**Throws:**
- `TypeError` - if the provided `name` is not a string, or if `colors` are not an array following the format `[colorSpace, [...colorValues]]`
- `ProcreateSwatchesError` - if the color space of a color is not supported, or if the color is not valid

# License

MIT License

Copyright (c) 2021 Kamil Szydlowski <kamil.szydlovski@gmail.com> (http://www.szydlovski.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

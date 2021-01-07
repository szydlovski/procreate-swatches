import { decodeZipFile, encodeZipFile } from '@szydlovski/zip';
import {
	convertMap as colorConverters,
	getSupportedSpaces as getSupportedColorSpaces,
} from '@szydlovski/color-convert';
import { decodeText } from './helpers.js';

export class ProcreateSwatchesError extends Error {
	constructor(message) {
		super(message);
		this.name = 'ProcreateSwatchesError';
	}
}

function checkColorSpaceSupport(space) {
	if (!getSupportedColorSpaces().includes(space)) {
		throw new ProcreateSwatchesError(`Color space ${space} is not supported.`);
	}
}

export async function readSwatchesFile(data, space = 'hsv') {
	checkColorSpaceSupport(space);
	try {
		const zipContents = await decodeZipFile(data);
		const swatchesRawString = decodeText(zipContents['Swatches.json']);

		let swatchesData = JSON.parse(swatchesRawString);
		if (Array.isArray(swatchesData)) {
			swatchesData = swatchesData[0];
		}

		const { name, swatches } = swatchesData;

		return {
			name,
			colors: swatches.map((swatch) => {
        if (swatch === null) return null;
				const { hue, saturation, brightness } = swatch;
				let color = [hue * 360, saturation * 100, brightness * 100];
				if (space !== 'hsv') {
					color = colorConverters.hsv.to[space](...color);
				}
				return [color, space];
			}),
		};
	} catch (error) {
		throw new ProcreateSwatchesError('Invalid .swatches file.');
	}
}

export async function createSwatchesFile(name, colors, format = 'uint8array') {
	if (typeof name !== 'string') {
		throw new TypeError(`Name must be a string, got ${typeof name}`);
	}
	if (!Array.isArray(colors)) {
		throw new TypeError(`Colors must be an array`);
	}
	const swatchesData = {
		name,
		swatches: colors.map((entry) => {
      if (entry === null) return null;
			if (!Array.isArray(entry) || entry.length !== 2) {
				throw new TypeError(
					`Each entry in the palette must be null or an array containing [[...colorValues], colorSpace]`
				);
			}
			let [color, space] = entry;
			if (space !== 'hsv') {
				checkColorSpaceSupport(space);
				try {
					color = colorConverters[space].to.hsv(...color);
				} catch (error) {
					throw new ProcreateSwatchesError(`${color.join(',')} is not a valid ${space} color`);
				}
			}
			const [h, s, v] = color;
			return {
				hue: h / 360,
				saturation: s / 100,
				brightness: v / 100,
				alpha: 1,
				colorSpace: 0,
			};
		}).slice(0,30),
	};
	return encodeZipFile({
		'Swatches.json': JSON.stringify(swatchesData)
	}, { format });
}

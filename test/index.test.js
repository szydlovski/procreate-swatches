import fs from 'fs';
import path from 'path';
import chai from 'chai';
const { expect } = chai;

import { readSwatchesFile, createSwatchesFile, ProcreateSwatchesError } from '../src/index.js';

const sampleFilesDir = './test/sample';
const sampleFiles = fs
	.readdirSync(sampleFilesDir)
	.map((filename) => fs.readFileSync(path.join(sampleFilesDir, filename)));
const sampleSwatchesToCreate = [
	[
		'My palette',
		[
			[[255, 0, 0], 'rgb'],
			[[0, 255, 0], 'rgb'],
			[[0, 0, 255], 'rgb'],
		],
	],
];

describe('readSwatchesFile', function () {
	it('reads the contents of .swatches files', async function () {
		for (const sampleFile of sampleFiles) {
			const swatches = await readSwatchesFile(sampleFile);
			expect(swatches).to.be.an('object');
			expect(swatches).to.have.property('name').that.is.a('string');
			expect(swatches).to.have.property('colors').that.is.an('array');
			for (const color of swatches.colors) {
				if (color === null) continue;
				expect(color).to.be.an('array').that.has.lengthOf(2);
				const [colorValues, colorSpace] = color;
				expect(colorSpace).to.be.a('string');
				expect(colorSpace).to.not.be.empty;
				expect(colorValues).to.be.an('array');
				expect(colorValues).to.not.be.empty;
			}
		}
	});
	it('converts parsed colors', async function () {
		for (const sampleFile of sampleFiles) {
			const swatches = await readSwatchesFile(sampleFile, 'rgb');
			for (const color of swatches.colors) {
				if (color === null) continue;
				const [colorValues, colorSpace] = color;
				expect(colorSpace).to.equal('rgb');
				expect(colorValues).to.have.lengthOf(3);
				for (const value of colorValues) {
					expect(value).to.be.at.least(0);
					expect(value).to.be.at.most(255);
				}
			}
		}
	});
	it('throws an error if the color space is not supported', async function() {
		try {
			await readSwatchesFile(null, 'notavalidcolorspace');
		} catch (error) {
			expect(error).to.be.an.instanceof(ProcreateSwatchesError);
			expect(error.message).to.contain('Color space');
		}
	})
});

describe('createSwatchesFile', function () {
	it('creates a new swatches file', async function () {
		for (const [name, colors] of sampleSwatchesToCreate) {
      const swatchesFile = await createSwatchesFile(name, colors);
      const swatches = await readSwatchesFile(swatchesFile);
      expect(swatches.name).to.equal(name);
      expect(swatches.colors).to.have.lengthOf(colors.length);
		}
	});
	it('saves a maximum of 30 colors', async function () {
		const colors = new Array(100).fill([[255, 255, 255], 'rgb']);
		expect(colors).to.have.a.lengthOf(100);
		const swatchesFile = await createSwatchesFile('', colors);
		const swatches = await readSwatchesFile(swatchesFile);
		expect(swatches.colors).to.have.lengthOf(30);
	});
});

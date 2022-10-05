import { Line } from '@ngageoint/grid-js';
import { expect } from 'chai';
import { GridLine } from '../../lib/features/GridLine';

describe('GridLine Tests', function () {
    it('test copy', function () {
        const line = new Line();
        const gridLine = new GridLine(line);
        const gridLineCopy = gridLine.copy();
        expect(gridLine.equals(gridLineCopy)).to.be.true;
    });
});
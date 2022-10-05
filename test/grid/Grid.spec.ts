import { GridStyle } from '@ngageoint/grid-js';
import { expect } from 'chai';
import { Grid } from '../../lib/grid/Grid';
import { GridType } from '../../lib/grid/GridType';

describe('Grid Tests', function () {
    it('test precision', function () {
        const grid = new Grid(GridType.METER);
        expect(grid.getPrecision()).to.equal(GridType.METER);
    });

    it('test style', function () {
        const grid = new Grid(GridType.KILOMETER);
        expect(grid.getStyle()).to.be.undefined;

        expect(function () {
            grid.setStyle(new GridStyle(undefined, 0), GridType.METER);
        }).to.throw(Error);
    });

    it('test equals', function () {
        const grid = new Grid(GridType.METER);
        const grid2 = new Grid(GridType.METER);
        expect(grid.equals(grid2)).to.be.true;
    });
});
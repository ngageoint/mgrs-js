import { expect } from 'chai';
import { ZoomGrids } from '../../lib/grid/ZoomGrids';
import { GridType } from '../../lib/grid/GridType';
import { Grid } from '../../lib/grid/Grid';

describe('ZoomGrids Tests', function () {
  it('test precision', function () {
    const zoomGrids = new ZoomGrids(5);
    expect(zoomGrids.getPrecision()).to.be.undefined;

    zoomGrids.addGrid(new Grid(GridType.HUNDRED_KILOMETER));
    zoomGrids.addGrid(new Grid(GridType.TEN_KILOMETER));
    zoomGrids.addGrid(new Grid(GridType.METER));

    expect(zoomGrids.getPrecision()?.valueOf()).to.equal(GridType.METER.valueOf());
  });
});

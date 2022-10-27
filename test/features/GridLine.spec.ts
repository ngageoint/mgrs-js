import { Line, Point } from '@ngageoint/grid-js';
import { expect } from 'chai';
import { GridLine } from '../../lib/features/GridLine';
import { GridType } from '../../lib/grid/GridType';

describe('GridLine Tests', function () {
  it('test copy', function () {
    const point1 = Point.point(0, 0);
    const point2 = Point.point(1, 1);
    const gridLine = new GridLine(GridLine.line(point1, point2));
    gridLine.setGridType(GridType.KILOMETER);

    const gridLineCopy = gridLine.copy();
    expect(gridLineCopy.getGridType()).to.equal(gridLine.getGridType());
    expect(gridLineCopy.numPoints()).to.equal(gridLineCopy.numPoints());
    expect(gridLineCopy.equals(gridLine)).to.be.true;
  });

  it('test create from line', function () {
    const point1 = Point.point(0, 0);
    const point2 = Point.point(1, 1);
    const gridType = GridType.KILOMETER;
    const gridLine = GridLine.lineFromPoints(point1, point2, GridType.KILOMETER);
    expect(gridLine.numPoints()).to.equal(2);
    expect(gridLine.getGridType()).to.equal(gridType);
  });
});

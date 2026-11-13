import { expect } from 'chai';
import { Bounds } from '@ngageoint/grid-js';
import { GridType } from '../../lib/grid/GridType';
import { GridZones } from '../../lib/gzd/GridZones';
import { UTM } from '../../lib/utm/UTM';

describe('GridZone Tests', function () {
  /**
   * Test that the lines of grid squares crossing the zone bounds keep
   * following their easting and northing
   * (https://github.com/ngageoint/mgrs-js/issues/6)
   */
  it('test lines at zone bounds', function () {
    const zones = [
      GridZones.getGridZone(33, 'U'),
      GridZones.getGridZone(33, 'E'),
      GridZones.getGridZone(33, 'C'),
      GridZones.getGridZone(56, 'H'),
    ];
    for (const zone of zones) {
      const zoneBounds = zone.getBounds();
      // Tile bounds reaching into the western and eastern neighbor zones
      const tileBounds = Bounds.degrees(
        zoneBounds.getMinLongitude() - 1,
        zoneBounds.getMinLatitude(),
        zoneBounds.getMaxLongitude() + 1,
        zoneBounds.getMaxLatitude(),
      );
      for (const gridType of [GridType.HUNDRED_KILOMETER, GridType.TEN_KILOMETER]) {
        const lines = zone.getLines(tileBounds, gridType);
        expect(lines).to.not.be.undefined;
        for (let i = 0; i < lines!.length; i++) {
          const point1 = UTM.from(lines![i].getPoint1(), zone.getNumber(), zone.getHemisphere());
          const point2 = UTM.from(lines![i].getPoint2(), zone.getNumber(), zone.getHemisphere());
          if (i % 2 === 0) {
            // Vertical line
            expect(point1.getEasting()).to.be.closeTo(point2.getEasting(), 1);
          } else {
            // Horizontal line
            expect(point1.getNorthing()).to.be.closeTo(point2.getNorthing(), 1);
          }
        }
      }
    }
  });
});

import { expect } from 'chai';
import { GridRange } from '../../lib/gzd/GridRange';
import { MGRS } from '../../lib/MGRS';

describe('GridRange Tests', function () {
  it('test iterator', function () {
    let gridRange = new GridRange();

    for (const zone of gridRange) {
      let zoneNumber = zone.getNumber();
      let bandLetter = zone.getLetter();

      let gzd = zoneNumber.toString() + bandLetter;
      expect(MGRS.isMGRS(gzd)).to.be.true;
      let mgrs = MGRS.parse(gzd);
      expect(mgrs).to.not.be.null;
      expect(mgrs.getZone()).to.be.equal(zoneNumber);
      expect(mgrs.getBand()).to.be.equal(bandLetter);

      let point = mgrs.toPoint();
      let southwest = zone.getBounds().getSouthwest();

      expect(southwest.getLongitude()).to.be.approximately(point.getLongitude(), 0.0001);
      expect(southwest.getLatitude()).to.be.approximately(point.getLatitude(), 0.0001);
    }
  });
});

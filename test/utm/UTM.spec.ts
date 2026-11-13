import { Hemisphere, Point } from '@ngageoint/grid-js';
import { expect } from 'chai';
import { UTM } from '../../lib/utm/UTM';

describe('UTM Tests', function () {
  it('test to point', function () {
    const utm = UTM.create(0, Hemisphere.NORTH, 0, 0);
    const point = utm.toPoint();
    expect(point).to.not.be.undefined;
  });

  it('test from point', function () {
    const utm = UTM.create(0, Hemisphere.NORTH, 0, 0);
    const point = utm.toPoint();
    const from = UTM.from(point, utm.getZone(), utm.getHemisphere());
    expect(utm.toString() === from.toString()).to.be.true;
  });

  it('test is UTM', function () {
    const utm = UTM.create(0, Hemisphere.NORTH, 0, 0);

    expect(UTM.isUTM(utm.toString())).to.be.true;
    expect(UTM.isUTM('not utm')).to.be.false;
  });

  it('test parse', function () {
    const utm = UTM.create(0, Hemisphere.NORTH, 0, 0);
    const parsed = UTM.parse(utm.toString());

    expect(utm.toString() === parsed.toString()).to.be.true;
  });

  /**
   * Compare with GeographicLib GeoConvert (exact to a few nanometers)
   */
  it('test accuracy', function () {
    const cases: [number, number, number, Hemisphere, number, number][] = [
      [63.344656283826, 4.32988630647, 32, Hemisphere.NORTH, 266394.732062, 7032505.999214],
      [-32.000001, -180, 1, Hemisphere.SOUTH, 216576.776555, 6455629.979552],
      [45.649119337983, -120.001701963978, 10, Hemisphere.NORTH, 733625.999997, 5059436.556351],
    ];
    for (const [lat, lon, zone, hemisphere, easting, northing] of cases) {
      const utm = UTM.from(Point.degrees(lon, lat));
      expect(utm.getZone()).to.equal(zone);
      expect(utm.getHemisphere()).to.equal(hemisphere);
      expect(utm.getEasting()).to.be.closeTo(easting, 2e-6);
      expect(utm.getNorthing()).to.be.closeTo(northing, 2e-6);

      const point = UTM.create(zone, hemisphere, easting, northing).toPoint().toDegrees();
      expect(point.getLatitude()).to.be.closeTo(lat, 1e-10);
      expect(point.getLongitude()).to.be.closeTo(lon, 1e-10);
    }
  });
});

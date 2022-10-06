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
    const point = Point.point(0, 0);
    const utm = UTM.from(point);
    expect(utm).to.not.be.undefined;
  });

  it('test is UTM', function () {
    const utm = UTM.create(0, Hemisphere.NORTH, 0, 0);
    
    expect(UTM.isUTM(utm.toString())).to.be.true;
    expect(UTM.isUTM('not utm')).to.be.false;
  });
});

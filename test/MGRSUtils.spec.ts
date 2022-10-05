import { expect } from 'chai';
import { MGRSConstants } from '../lib/MGRSConstants';
import { MGRSUtils } from '../lib/MGRSUtils';

describe('MGRSUtils Tests', function () {
  it('test validate zone number', function () {
    expect(function () {
      MGRSUtils.validateZoneNumber(MGRSConstants.MIN_ZONE_NUMBER - 1);
    }).to.throw(Error);
    expect(function () {
      MGRSUtils.validateZoneNumber(MGRSConstants.MAX_ZONE_NUMBER + 1);
    }).to.throw(Error);
  });
});

import { expect } from 'chai';
import { GridZones } from '../../lib/gzd/GridZones';
import { BandLetterRange } from '../../lib/gzd/BandLetterRange';

const BAND_LETTERS = 'CDEFGHJKLMNPQRSTUVWXX';

/**
 * Test the full range
 */
describe('BandLetterRange Tests', function () {
  /**
   * Test the full range
   */
  it('test full range', function () {
    const bandRange = new BandLetterRange();
    for (const bandLetter of bandRange) {
      expect((BAND_LETTERS.indexOf(bandLetter) - 10) * 8).to.be.approximately(
        GridZones.getSouthLatitude(bandLetter),
        0.0,
      );
    }
  });
});

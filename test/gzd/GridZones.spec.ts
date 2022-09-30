import { expect } from 'chai';
import { GridZones } from '../../lib/gzd/GridZones';
import { MGRSConstants } from '../../lib/MGRSConstants';

describe('GridZones Tests', function () {

    /**
	 * Test zone numbers
	 */
    it('test zone numbers', function () {
        let zoneNumber = MGRSConstants.MIN_ZONE_NUMBER;
        for (let longitude = MGRSConstants.MIN_LON; longitude <= MGRSConstants.MAX_LON; longitude += MGRSConstants.ZONE_WIDTH) {

            const west = (longitude > MGRSConstants.MIN_LON
                && longitude < MGRSConstants.MAX_LON) ? zoneNumber - 1
                : zoneNumber;
            const east = zoneNumber;

            if (longitude < MGRSConstants.MAX_LON) {
                expect(~~Math.floor(longitude / 6 + 31)).to.equal(east);
            }

            expect(GridZones.getZoneNumberFromLongitude(longitude, false)).to.equal(west);
            expect(GridZones.getZoneNumberFromLongitude(longitude, true)).to.equal(east);
            expect(GridZones.getZoneNumberFromLongitude(longitude)).to.equal(east);

            if (zoneNumber < MGRSConstants.MAX_ZONE_NUMBER) {
                zoneNumber++;
            }

        }
    });
});
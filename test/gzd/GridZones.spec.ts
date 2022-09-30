import { expect } from 'chai';
import { GridZones } from '../../lib/gzd/GridZones';
import { MGRSConstants } from '../../lib/MGRSConstants';
import { MGRSUtils } from '../../lib/MGRSUtils';

const BAND_LETTERS = "CDEFGHJKLMNPQRSTUVWXX";

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

    /**
     * Test band letters
     */
    it('test band letters', function () {
        let bandLetter = MGRSConstants.MIN_BAND_LETTER;
        for (let latitude = MGRSConstants.MIN_LAT; latitude <= MGRSConstants.MAX_LAT;
            latitude += (latitude < 80.0 ? MGRSConstants.BAND_HEIGHT : 4.0)) {

            let south = (latitude > MGRSConstants.MIN_LAT && latitude < 80.0)
                ? MGRSUtils.previousBandLetter(bandLetter)
                : bandLetter;
            let north = bandLetter;

            expect(BAND_LETTERS.charAt(~~Math.floor(latitude / 8 + 10))).to.equal(north);

            expect(GridZones.getBandLetterFromLatitude(latitude, false)).to.equal(south);
            expect(GridZones.getBandLetterFromLatitude(latitude, true)).to.equal(north);
            expect(GridZones.getBandLetterFromLatitude(latitude)).to.equal(north);

            if (bandLetter < MGRSConstants.MAX_BAND_LETTER) {
                bandLetter = MGRSUtils.nextBandLetter(bandLetter);
            }

        }
    });
});
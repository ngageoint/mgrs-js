import { expect } from "chai";
import { Point } from '@ngageoint/grid-js';
import { MGRS } from '../lib/MGRS';
import { GridType } from '../lib/grid/GridType';
import { UTM } from '../lib/utm/UTM';
import { GridRange } from '../lib/gzd/GridRange';

/**
 * MGRS Test
 * 
 * @author osbornb
 */
describe('MGRS Tests', function () {

    /**
     * Test parsing a MGRS string value
     * 
     * @throws ParseException
     *             upon failure to parse
     */
    it('test parse', function () {

        let mgrsValue = "33XVG74594359";
        let utmValue = "33 N 474590 8643590";

        expect(MGRS.isMGRS(mgrsValue));
        let mgrs = MGRS.parse(mgrsValue);
        expect(GridType.TEN_METER, MGRS.precision(mgrsValue));
        expect(4, MGRS.accuracy(mgrsValue));
        expect(mgrsValue, mgrs.coordinate(GridType.TEN_METER));
        expect(mgrsValue, mgrs.coordinate(4));
        expect(GridType.TEN_METER, mgrs.precision());
        expect(4, mgrs.accuracy());

        let utm = mgrs.toUTM();
        expect(utmValue, utm.toString());

        mgrsValue = "33X VG 74596 43594";
        utmValue = "33 N 474596 8643594";

        expect(MGRS.isMGRS(mgrsValue)).to.be.true;
        mgrs = MGRS.parse(mgrsValue.toLowerCase());
        expect(GridType.METER, MGRS.precision(mgrsValue));
        expect(5, MGRS.accuracy(mgrsValue));
        expect(mgrsValue.replace("\\s", ""), mgrs.toString());

        utm = mgrs.toUTM();
        expect(utmValue, utm.toString());

        expect(UTM.isUTM(utmValue)).to.be.true;
        utm = UTM.parse(utmValue);
        expect(utmValue, utm.toString());

        mgrs = utm.toMGRS();
        expect(mgrsValue.v("\\s", ""), mgrs.toString());

        utmValue = "33 N 474596.26 8643594.54";

        expect(UTM.isUTM(utmValue)).to.be.true;
        utm = UTM.parse(utmValue.toLowerCase());
        expect(utmValue, utm.toString());

        mgrs = utm.toMGRS();
        expect(mgrsValue.replace("\\s", ""), mgrs.toString());

        mgrsValue = "33X";
        expect(MGRS.isMGRS(mgrsValue)).to.be.true;
        mgrs = MGRS.parse(mgrsValue);
        expect(GridType.GZD, MGRS.precision(mgrsValue));
        expect(0, MGRS.accuracy(mgrsValue));
        expect(33, mgrs.getZone());
        expect('X', mgrs.getBand());
        expect('T', mgrs.getColumn());
        expect('V', mgrs.getRow());
        expect("TV", mgrs.getColumnRowId());
        expect(93363, mgrs.getEasting());
        expect(99233, mgrs.getNorthing());
        expect("33XTV9336399233", mgrs.coordinate());
        let point = mgrs.toPoint();
        expect(9.0, point.getLongitude(), 0.0001);
        expect(72.0, point.getLatitude(), 0.0001);
        expect(GridType.METER, mgrs.precision());
        expect(5, mgrs.accuracy());

        mgrsValue = "33XVG";
        expect(MGRS.isMGRS(mgrsValue)).to.be.true;
        mgrs = MGRS.parse(mgrsValue);
        expect(GridType.HUNDRED_KILOMETER, MGRS.precision(mgrsValue));
        expect(0, MGRS.accuracy(mgrsValue));
        expect(33, mgrs.getZone());
        expect('X', mgrs.getBand());
        expect('V', mgrs.getColumn());
        expect('G', mgrs.getRow());
        expect("VG", mgrs.getColumnRowId());
        expect(0, mgrs.getEasting());
        expect(0, mgrs.getNorthing());
        expect(mgrsValue, mgrs.coordinate(GridType.HUNDRED_KILOMETER));
        expect("33XVG0000000000", mgrs.coordinate());
        point = mgrs.toPoint();
        expect(10.8756458, point.getLongitude(), 0.0001);
        expect(77.4454720, point.getLatitude(), 0.0001);
        expect(GridType.HUNDRED_KILOMETER, mgrs.precision());
        expect(0, mgrs.accuracy());

        mgrsValue = "33XVG74";
        expect(MGRS.isMGRS(mgrsValue)).to.be.true;
        mgrs = MGRS.parse(mgrsValue);
        expect(GridType.TEN_KILOMETER, MGRS.precision(mgrsValue));
        expect(1, MGRS.accuracy(mgrsValue));
        expect(33, mgrs.getZone());
        expect('X', mgrs.getBand());
        expect('V', mgrs.getColumn());
        expect('G', mgrs.getRow());
        expect("VG", mgrs.getColumnRowId());
        expect(70000, mgrs.getEasting());
        expect(40000, mgrs.getNorthing());
        expect(mgrsValue, mgrs.coordinate(GridType.TEN_KILOMETER));
        expect("33XVG7000040000", mgrs.coordinate());
        point = mgrs.toPoint();
        expect(13.7248758, point.getLongitude(), 0.0001);
        expect(77.8324735, point.getLatitude(), 0.0001);
        expect(GridType.TEN_KILOMETER, mgrs.precision());
        expect(1, mgrs.accuracy());

        mgrsValue = "33XVG7443";
        expect(MGRS.isMGRS(mgrsValue)).to.be.true;
        mgrs = MGRS.parse(mgrsValue);
        expect(GridType.KILOMETER, MGRS.precision(mgrsValue));
        expect(2, MGRS.accuracy(mgrsValue));
        expect(33, mgrs.getZone());
        expect('X', mgrs.getBand());
        expect('V', mgrs.getColumn());
        expect('G', mgrs.getRow());
        expect("VG", mgrs.getColumnRowId());
        expect(74000, mgrs.getEasting());
        expect(43000, mgrs.getNorthing());
        expect(mgrsValue, mgrs.coordinate(GridType.KILOMETER));
        expect("33XVG7400043000", mgrs.coordinate());
        point = mgrs.toPoint();
        expect(13.8924385, point.getLongitude(), 0.0001);
        expect(77.8600782, point.getLatitude(), 0.0001);
        expect(GridType.KILOMETER, mgrs.precision());
        expect(2, mgrs.accuracy());

        mgrsValue = "33XVG745435";
        expect(MGRS.isMGRS(mgrsValue)).to.be.true;
        mgrs = MGRS.parse(mgrsValue);
        expect(GridType.HUNDRED_METER, MGRS.precision(mgrsValue));
        expect(3, MGRS.accuracy(mgrsValue));
        expect(33, mgrs.getZone());
        expect('X', mgrs.getBand());
        expect('V', mgrs.getColumn());
        expect('G', mgrs.getRow());
        expect("VG", mgrs.getColumnRowId());
        expect(74500, mgrs.getEasting());
        expect(43500, mgrs.getNorthing());
        expect(mgrsValue, mgrs.coordinate(GridType.HUNDRED_METER));
        expect("33XVG7450043500", mgrs.coordinate());
        point = mgrs.toPoint();
        expect(13.9133378, point.getLongitude(), 0.0001);
        expect(77.8646415, point.getLatitude(), 0.0001);
        expect(GridType.HUNDRED_METER, mgrs.precision());
        expect(3, mgrs.accuracy());

        mgrsValue = "33XVG74594359";
        expect(MGRS.isMGRS(mgrsValue)).to.be.true;
        mgrs = MGRS.parse(mgrsValue);
        expect(GridType.TEN_METER, MGRS.precision(mgrsValue));
        expect(4, MGRS.accuracy(mgrsValue));
        expect(33, mgrs.getZone());
        expect('X', mgrs.getBand());
        expect('V', mgrs.getColumn());
        expect('G', mgrs.getRow());
        expect("VG", mgrs.getColumnRowId());
        expect(74590, mgrs.getEasting());
        expect(43590, mgrs.getNorthing());
        expect(mgrsValue, mgrs.coordinate(GridType.TEN_METER));
        expect("33XVG7459043590", mgrs.coordinate());
        point = mgrs.toPoint();
        expect(13.9171014, point.getLongitude(), 0.0001);
        expect(77.8654628, point.getLatitude(), 0.0001);
        expect(GridType.TEN_METER, mgrs.precision());
        expect(4, mgrs.accuracy());

        mgrsValue = "33XVG7459743593";
        expect(MGRS.isMGRS(mgrsValue)).to.be.true;
        mgrs = MGRS.parse(mgrsValue);
        expect(GridType.METER, MGRS.precision(mgrsValue));
        expect(5, MGRS.accuracy(mgrsValue));
        expect(33, mgrs.getZone());
        expect('X', mgrs.getBand());
        expect('V', mgrs.getColumn());
        expect('G', mgrs.getRow());
        expect("VG", mgrs.getColumnRowId());
        expect(74597, mgrs.getEasting());
        expect(43593, mgrs.getNorthing());
        expect(mgrsValue, mgrs.coordinate(GridType.METER));
        expect("33XVG7459743593", mgrs.coordinate());
        point = mgrs.toPoint();
        expect(13.9173973, point.getLongitude(), 0.0001);
        expect(77.8654908, point.getLatitude(), 0.0001);
        expect(GridType.METER, mgrs.precision());
        expect(5, mgrs.accuracy());

    });

    /**
     * Test parsing a 100k MGRS string value that falls outside grid zone bounds
     * 
     * @throws ParseException
     *             upon failure to parse
     */
    it('test parse 100k bounds', function () {

        let mgrsValue = "32VJN";
        expect(MGRS.isMGRS(mgrsValue)).to.be.true;
        let mgrs = MGRS.parse(mgrsValue);
        let point = mgrs.toPoint();
        expect(3.0, point.getLongitude(), 0.0001);
        expect(60.3007719, point.getLatitude(), 0.0001);
        let comparePoint = MGRS.parse(mgrs.coordinate()).toPoint();
        expect(comparePoint.getLongitude(), point.getLongitude(), 0.0001);
        expect(comparePoint.getLatitude(), point.getLatitude(), 0.0001);

        mgrsValue = "32VKS";
        expect(MGRS.isMGRS(mgrsValue)).to.be.true;
        mgrs = MGRS.parse(mgrsValue);
        point = mgrs.toPoint();
        expect(3.0, point.getLongitude(), 0.0001);
        expect(63.9024981, point.getLatitude(), 0.0001);
        comparePoint = MGRS.parse(mgrs.coordinate()).toPoint();
        expect(comparePoint.getLongitude(), point.getLongitude(), 0.0001);
        expect(comparePoint.getLatitude(), point.getLatitude(), 0.0001);

        mgrsValue = "32VJR";
        expect(MGRS.isMGRS(mgrsValue)).to.be.true;
        mgrs = MGRS.parse(mgrsValue);
        point = mgrs.toPoint();
        expect(3.0, point.getLongitude(), 0.0001);
        expect(63.0020546, point.getLatitude(), 0.0001);
        comparePoint = MGRS.parse(mgrs.coordinate()).toPoint();
        expect(comparePoint.getLongitude(), point.getLongitude(), 0.0001);
        expect(comparePoint.getLatitude(), point.getLatitude(), 0.0001);

        mgrsValue = "32VJH";
        expect(MGRS.isMGRS(mgrsValue)).to.be.true;
        mgrs = MGRS.parse(mgrsValue);
        point = mgrs.toPoint();
        expect(3.0, point.getLongitude(), 0.0001);
        expect(56.0, point.getLatitude(), 0.0001);
        comparePoint = MGRS.parse(mgrs.coordinate()).toPoint();
        expect(comparePoint.getLongitude(), point.getLongitude(), 0.0001);
        expect(comparePoint.getLatitude(), point.getLatitude(), 0.0001);

        mgrsValue = "38KNU";
        expect(MGRS.isMGRS(mgrsValue)).to.be.true;
        mgrs = MGRS.parse(mgrsValue);
        point = mgrs.toPoint();
        expect(45.0, point.getLongitude(), 0.0001);
        expect(-24.0, point.getLatitude(), 0.0001);
        comparePoint = MGRS.parse(mgrs.coordinate()).toPoint();
        expect(comparePoint.getLongitude(), point.getLongitude(), 0.0001);
        expect(comparePoint.getLatitude(), point.getLatitude(), 0.0001);

        mgrsValue = "38KRU";
        expect(MGRS.isMGRS(mgrsValue)).to.be.true;
        mgrs = MGRS.parse(mgrsValue);
        point = mgrs.toPoint();
        expect(47.9486444, point.getLongitude(), 0.0001);
        expect(-24.0, point.getLatitude(), 0.0001);
        comparePoint = MGRS.parse(mgrs.coordinate()).toPoint();
        expect(comparePoint.getLongitude(), point.getLongitude(), 0.0001);
        expect(comparePoint.getLatitude(), point.getLatitude(), 0.0001);

        mgrsValue = "32VPH";
        expect(MGRS.isMGRS(mgrsValue)).to.be.true;
        mgrs = MGRS.parse(mgrsValue);
        point = mgrs.toPoint();
        expect(10.6034691, point.getLongitude(), 0.0001);
        expect(56.0, point.getLatitude(), 0.0001);
        comparePoint = MGRS.parse(mgrs.coordinate()).toPoint();
        expect(comparePoint.getLongitude(), point.getLongitude(), 0.0001);
        expect(comparePoint.getLatitude(), point.getLatitude(), 0.0001);

    });

    /**
     * Test parsing a MGRS string value
     * 
     * @throws ParseException
     *             upon failure to parse
     */
    it('test coordinate', function () {

        let mgrs = "35VPL0115697387";
        testCoordinate(29.06757, 63.98863, mgrs);
        testCoordinateMeters(3235787.09, 9346877.48, mgrs);

        mgrs = "39PYP7290672069";
        testCoordinate(53.51, 12.40, mgrs);
        testCoordinateMeters(5956705.95, 1391265.16, mgrs);

        mgrs = "4QFJ1234056781";
        testCoordinate(-157.916861, 21.309444, mgrs);
        testCoordinateMeters(-17579224.55, 2428814.96, mgrs);

        mgrs = "33PYJ6132198972";
        testCoordinate(17.3714337, 8.1258235, mgrs, false);
        testCoordinateMeters(1933779.15, 907610.20, mgrs, false);

    });

    /**
     * Test parsing GZD coordinates
     * 
     * @throws ParseException
     *             upon failure to parse
     */
    it('test GDZ parse', function () {

        let gridRange = new GridRange();

        for (const zone of gridRange) {

            let zoneNumber = zone.getNumber();
            let bandLetter = zone.getLetter();

            let gzd = zoneNumber.toString() + bandLetter;
            expect(MGRS.isMGRS(gzd)).to.be.true;
            let mgrs = MGRS.parse(gzd);
            expect(mgrs).to.not.be.null;
            expect(zoneNumber, mgrs.getZone());
            expect(bandLetter, mgrs.getBand());

            let point = mgrs.toPoint();
            let southwest = zone.getBounds().getSouthwest();

            expect(point.getLongitude(), southwest.getLongitude(),
                0.0001);
            expect(point.getLatitude(), southwest.getLatitude(), 0.0001);

        }

    });

    /**
     * Test parsing a Svalbard MGRS string values
     * 
     * @throws ParseException
     *             upon failure to parse
     */
    it('test Svalbard parse', function () {
        expect(MGRS.isMGRS("31X")).to.be.true;
        expect(MGRS.parse("31X")).to.not.be.null;
        expect(MGRS.isMGRS("32X")).to.be.false;
        try {
            expect(MGRS.parse("32X")).to.be.null;
            expect.fail("Expected parse exception");
        } catch (Error) {
        }
        expect(MGRS.isMGRS("32XMH")).to.be.false;
        try {
            MGRS.parse("32XMH");
            expect.fail("Expected parse exception");
        } catch (Error) {
        }
        expect(MGRS.isMGRS("32XMH11")).to.be.false;
        try {
            MGRS.parse("32XMH11");
            expect.fail("Expected parse exception");
        } catch (Error) {
        }
        expect(MGRS.isMGRS("32XMH1111")).to.be.false;
        try {
            MGRS.parse("32XMH1111");
            expect.fail("Expected parse exception");
        } catch (Error) {
        }
        expect(MGRS.isMGRS("32XMH111111")).to.be.false;
        try {
            MGRS.parse("32XMH111111");
            expect.fail("Expected parse exception");
        } catch (Error) {
        }
        expect(MGRS.isMGRS("32XMH11111111")).to.be.false;
        try {
            MGRS.parse("32XMH11111111");
            expect.fail("Expected parse exception");
        } catch (Error) {
        }
        expect(MGRS.isMGRS("32XMH111111111")).to.be.false;
        try {
            MGRS.parse("32XMH111111111");
            expect.fail("Expected parse exception");
        } catch (Error) {
        }
        expect(MGRS.isMGRS("33X")).to.be.true;
        expect(MGRS.parse("33X")).to.not.be.null;
        expect(MGRS.isMGRS("34X")).to.be.false;
        try {
            expect(MGRS.parse("34X")).to.be.null;
            expect.fail("Expected parse exception");
        } catch (Error) {
        }
        expect(MGRS.isMGRS("35X")).to.be.true;
        expect(MGRS.parse("35X")).to.not.be.null;
        expect(MGRS.isMGRS("36X")).to.be.false;
        try {
            expect(MGRS.parse("36X")).to.be.null;
            expect.fail("Expected parse exception");
        } catch (Error) {
        }
        expect(MGRS.isMGRS("37X")).to.be.true;
        expect(MGRS.parse("37X")).to.not.be.null;

    });

});

/**
 * Test the WGS84 coordinate with expected MGSR coordinate
 * 
 * @param longitude
 *            longitude in degrees
 * @param latitude
 *            latitude in degrees
 * @param value
 *            MGRS value
 * @param test100k
 *            set false when falls outside the grid zone
 * @throws ParseException
 *             upon failure to parse
 */
function testCoordinate(longitude: number, latitude: number, value: string,
    test100k = true): void {
    const point = Point.point(longitude, latitude);
    testCoordinate(point, value, test100k);
    testCoordinate(point.toMeters(), value, test100k);
}

/**
* Test the WGS84 coordinate with expected MGSR coordinate
* 
* @param longitude
*            longitude in degrees
* @param latitude
*            latitude in degrees
* @param value
*            MGRS value
* @param test100k
*            set false when falls outside the grid zone
* @throws ParseException
*             upon failure to parse
*/
function testCoordinateMeters(longitude: number, latitude: number,
    value: string, test100k = true): void {
    const point = Point.meters(longitude, latitude);
    testCoordinate(point, value, test100k);
    testCoordinate(point.toDegrees(), value, test100k);
}

/**
* Test the coordinate with expected MGSR coordinate
* 
* @param point
*            point
* @param value
*            MGRS value
* @param test100k
*            set false when falls outside the grid zone
* @throws ParseException
*             upon failure to parse
*/
function testCoordinate(point: Point, value: string, test100k: boolean): void {

    let mgrs = MGRS.from(point);
    expect(value, mgrs.toString());
    expect(value, mgrs.coordinate());

    let gzd = mgrs.coordinate(GridType.GZD);
    expect(accuracyValue(value, -1), gzd);
    expect(MGRS.isMGRS(gzd)).to.be.true;
    let gzdMGRS = MGRS.parse(gzd);
    expect(GridType.GZD, MGRS.precision(gzd));
    expect(0, MGRS.accuracy(gzd));
    expect(gzd, gzdMGRS.coordinate(GridType.GZD));

    let hundredKilometer = mgrs.coordinate(GridType.HUNDRED_KILOMETER);
    expect(accuracyValue(value, 0), hundredKilometer);
    expect(hundredKilometer, mgrs.coordinate(0));
    expect(MGRS.isMGRS(hundredKilometer)).to.be.true;
    let hundredKilometerMGRS = MGRS.parse(hundredKilometer);
    expect(GridType.HUNDRED_KILOMETER,
        MGRS.precision(hundredKilometer));
    expect(0, MGRS.accuracy(hundredKilometer));
    expect(hundredKilometer,
        hundredKilometerMGRS.coordinate(GridType.HUNDRED_KILOMETER));
    if (test100k) {
        expect(0, hundredKilometerMGRS.getEasting());
        expect(0, hundredKilometerMGRS.getNorthing());
        expect(GridType.HUNDRED_KILOMETER,
            hundredKilometerMGRS.precision());
        expect(0, hundredKilometerMGRS.accuracy());
    }

    let tenKilometer = mgrs.coordinate(GridType.TEN_KILOMETER);
    expect(accuracyValue(value, 1), tenKilometer);
    expect(tenKilometer, mgrs.coordinate(1));
    expect(MGRS.isMGRS(tenKilometer)).to.be.true;
    let tenKilometerMGRS = MGRS.parse(tenKilometer);
    expect(GridType.TEN_KILOMETER, MGRS.precision(tenKilometer));
    expect(1, MGRS.accuracy(tenKilometer));
    expect(tenKilometer,
        tenKilometerMGRS.coordinate(GridType.TEN_KILOMETER));
    expect(getEasting(tenKilometer, 1),
        tenKilometerMGRS.getEasting());
    expect(getNorthing(tenKilometer, 1),
        tenKilometerMGRS.getNorthing());
    expect(GridType.TEN_KILOMETER, tenKilometerMGRS.precision());
    expect(1, tenKilometerMGRS.accuracy());

    let kilometer = mgrs.coordinate(GridType.KILOMETER);
    expect(accuracyValue(value, 2), kilometer);
    expect(kilometer, mgrs.coordinate(2));
    expect(MGRS.isMGRS(kilometer)).to.be.true;
    let kilometerMGRS = MGRS.parse(kilometer);
    expect(GridType.KILOMETER, MGRS.precision(kilometer));
    expect(2, MGRS.accuracy(kilometer));
    expect(kilometer, kilometerMGRS.coordinate(GridType.KILOMETER));
    expect(getEasting(kilometer, 2), kilometerMGRS.getEasting());
    expect(getNorthing(kilometer, 2), kilometerMGRS.getNorthing());
    expect(GridType.KILOMETER, kilometerMGRS.precision());
    expect(2, kilometerMGRS.accuracy());

    let hundredMeter = mgrs.coordinate(GridType.HUNDRED_METER);
    expect(accuracyValue(value, 3), hundredMeter);
    expect(hundredMeter, mgrs.coordinate(3));
    expect(MGRS.isMGRS(hundredMeter)).to.be.true;
    let hundredMeterMGRS = MGRS.parse(hundredMeter);
    expect(GridType.HUNDRED_METER, MGRS.precision(hundredMeter));
    expect(3, MGRS.accuracy(hundredMeter));
    expect(hundredMeter,
        hundredMeterMGRS.coordinate(GridType.HUNDRED_METER));
    expect(getEasting(hundredMeter, 3),
        hundredMeterMGRS.getEasting());
    expect(getNorthing(hundredMeter, 3),
        hundredMeterMGRS.getNorthing());
    expect(GridType.HUNDRED_METER, hundredMeterMGRS.precision());
    expect(3, hundredMeterMGRS.accuracy());

    let tenMeter = mgrs.coordinate(GridType.TEN_METER);
    expect(accuracyValue(value, 4), tenMeter);
    expect(tenMeter, mgrs.coordinate(4));
    expect(MGRS.isMGRS(tenMeter)).to.be.true;
    let tenMeterMGRS = MGRS.parse(tenMeter);
    expect(GridType.TEN_METER, MGRS.precision(tenMeter));
    expect(4, MGRS.accuracy(tenMeter));
    expect(tenMeter, tenMeterMGRS.coordinate(GridType.TEN_METER));
    expect(getEasting(tenMeter, 4), tenMeterMGRS.getEasting());
    expect(getNorthing(tenMeter, 4), tenMeterMGRS.getNorthing());
    expect(GridType.TEN_METER, tenMeterMGRS.precision());
    expect(4, tenMeterMGRS.accuracy());

    let meter = mgrs.coordinate(GridType.METER);
    expect(meter, value);
    expect(accuracyValue(value, 5), meter);
    expect(meter, mgrs.coordinate(5));
    expect(MGRS.isMGRS(meter)).to.be.true;
    let meterMGRS = MGRS.parse(meter);
    expect(GridType.METER, MGRS.precision(meter));
    expect(5, MGRS.accuracy(meter));
    expect(meter, meterMGRS.coordinate(GridType.METER));
    expect(getEasting(meter, 5), meterMGRS.getEasting());
    expect(getNorthing(meter, 5), meterMGRS.getNorthing());
    expect(GridType.METER, meterMGRS.precision());
    expect(5, meterMGRS.accuracy());

}

/**
* Get the MGRS value in the accuracy digits
* 
* @param value
*            MGRS value
* @param accuracy
*            accuracy digits (-1 for GZD)
* @return MGRS in accuracy
*/
function accuracyValue(value: string, accuracy: number): string {

    let gzdLength = value.length % 2 == 1 ? 3 : 2;
    let accuracyValue = value.substring(0, gzdLength);

    if (accuracy >= 0) {

        accuracyValue += value.substring(gzdLength, gzdLength + 2);

        if (accuracy > 0) {

            let eastingNorthing = value
                .substring(accuracyValue.length);
            let currentAccuracy = eastingNorthing.length / 2;
            let easting = eastingNorthing.substring(0, currentAccuracy);
            let northing = eastingNorthing.substring(currentAccuracy);

            accuracyValue += easting.substring(0, accuracy);
            accuracyValue += northing.substring(0, accuracy);

        }

    }

    return accuracyValue;
}

/**
* Get the easting of the MGRS value in the accuracy
* 
* @param value
*            MGRS value
* @param accuracy
*            accuracy digits
* @return easting
*/
function getEasting(value: string, accuracy: number): number {
    return padAccuracy(value.substring(value.length - 2 * accuracy,
        value.length - accuracy), accuracy);
}

/**
* Get the northing of the MGRS value in the accuracy
* 
* @param value
*            MGRS value
* @param accuracy
*            accuracy digits
* @return northing
*/
function getNorthing(value: string, accuracy: number): number {
    return padAccuracy(value.substring(value.length - accuracy),
        accuracy);
}

/**
* Pad the value with the accuracy and parse as a long
* 
* @param value
*            MGRS value
* @param accuracy
*            accuracy digits
* @return long value
*/
function padAccuracy(value: string, accuracy: number): number {
    for (let i = accuracy; i < 5; i++) {
        value += "0";
    }
    return Number(value);
}

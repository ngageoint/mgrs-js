import { expect } from 'chai';
import { Point } from '@ngageoint/grid-js';
import { MGRS } from '../lib/MGRS';
import { GridType } from '../lib/grid/GridType';
import { UTM } from '../lib/utm/UTM';
import { GridRange } from '../lib/gzd/GridRange';

/**
 * MGRS Test
 *
 *
 */
describe('MGRS Tests', function () {
  /**
   * Test parsing a MGRS string value
   *
   * @throws ParseException
   *             upon failure to parse
   */
  it('test parse', function () {
    let mgrsValue = '33XVG74594359';
    let utmValue = '33 N 474590 8643590';

    expect(MGRS.isMGRS(mgrsValue));
    let mgrs = MGRS.parse(mgrsValue);
    expect(MGRS.precision(mgrsValue)).to.equal(GridType.TEN_METER);
    expect(MGRS.accuracy(mgrsValue)).to.equal(4);
    expect(mgrs.coordinate(GridType.TEN_METER)).to.equal(mgrsValue);
    expect(mgrs.coordinateFromAccuracy(4)).to.equal(mgrsValue);
    expect(mgrs.precision()).to.equal(GridType.TEN_METER);
    expect(mgrs.accuracy()).to.equal(4);

    let utm = mgrs.toUTM();
    expect(utmValue, utm.toString());

    mgrsValue = '33X VG 74596 43594';
    utmValue = '33 N 474596 8643594';

    expect(MGRS.isMGRS(mgrsValue)).to.be.true;
    mgrs = MGRS.parse(mgrsValue.toLowerCase());
    expect(MGRS.precision(mgrsValue)).to.equal(GridType.METER);
    expect(MGRS.accuracy(mgrsValue)).to.equal(5);
    expect(mgrs.toString()).to.equal(mgrsValue.replace(/\s/g, ''));

    utm = mgrs.toUTM();
    expect(utm.toString()).to.equal(utmValue);

    expect(UTM.isUTM(utmValue)).to.be.true;
    utm = UTM.parse(utmValue);
    expect(utm.toString()).to.equal(utmValue);

    mgrs = utm.toMGRS();
    expect(mgrs.toString()).to.equal(mgrsValue.replace(/\s/g, ''));

    utmValue = '33 N 474596.26 8643594.54';

    expect(UTM.isUTM(utmValue)).to.be.true;
    utm = UTM.parse(utmValue.toLowerCase());
    expect(utm.toString()).to.equal(utmValue);

    mgrs = utm.toMGRS();
    expect(mgrs.toString()).to.equal(mgrsValue.replace(/\s/g, ''));

    mgrsValue = '33X';
    expect(MGRS.isMGRS(mgrsValue)).to.be.true;
    mgrs = MGRS.parse(mgrsValue);
    expect(MGRS.precision(mgrsValue)).to.equal(GridType.GZD);
    expect(MGRS.accuracy(mgrsValue)).to.equal(0);
    expect(mgrs.getZone()).to.equal(33);
    expect(mgrs.getBand()).to.equal('X');
    expect(mgrs.getColumn()).to.equal('T');
    expect(mgrs.getRow()).to.equal('V');
    expect(mgrs.getColumnRowId()).to.equal('TV');
    expect(mgrs.getEasting()).to.equal(93363);
    expect(mgrs.getNorthing()).to.equal(99233);
    expect(mgrs.coordinate()).to.equal('33XTV9336399233');
    let point = mgrs.toPoint();
    expect(point.getLongitude()).to.be.approximately(9.0, 0.0001);
    expect(point.getLatitude()).to.be.approximately(72.0, 0.0001);
    expect(mgrs.precision()).to.equal(GridType.METER);
    expect(mgrs.accuracy()).to.equal(5);

    mgrsValue = '33XVG';
    expect(MGRS.isMGRS(mgrsValue)).to.be.true;
    mgrs = MGRS.parse(mgrsValue);
    expect(MGRS.precision(mgrsValue)).to.equal(GridType.HUNDRED_KILOMETER);
    expect(MGRS.accuracy(mgrsValue)).to.equal(0);
    expect(mgrs.getZone()).to.equal(33);
    expect(mgrs.getBand()).to.equal('X');
    expect(mgrs.getColumn()).to.equal('V');
    expect(mgrs.getRow()).to.equal('G');
    expect(mgrs.getColumnRowId()).to.equal('VG');
    expect(mgrs.getEasting()).to.equal(0);
    expect(mgrs.getNorthing()).to.equal(0);
    expect(mgrs.coordinate(GridType.HUNDRED_KILOMETER)).to.equal(mgrsValue);
    expect(mgrs.coordinate()).to.equal('33XVG0000000000');
    point = mgrs.toPoint();
    expect(point.getLongitude()).to.be.approximately(10.8756458, 0.0001);
    expect(point.getLatitude()).to.be.approximately(77.445472, 0.0001);
    expect(mgrs.precision()).to.equal(GridType.HUNDRED_KILOMETER);
    expect(mgrs.accuracy()).to.equal(0);

    mgrsValue = '33XVG74';
    expect(MGRS.isMGRS(mgrsValue)).to.be.true;
    mgrs = MGRS.parse(mgrsValue);
    expect(MGRS.precision(mgrsValue)).to.equal(GridType.TEN_KILOMETER);
    expect(MGRS.accuracy(mgrsValue)).to.equal(1);
    expect(mgrs.getZone()).to.equal(33);
    expect(mgrs.getBand()).to.equal('X');
    expect(mgrs.getColumn()).to.equal('V');
    expect(mgrs.getRow()).to.equal('G');
    expect(mgrs.getColumnRowId()).to.equal('VG');
    expect(mgrs.getEasting()).to.equal(70000);
    expect(mgrs.getNorthing()).to.equal(40000);
    expect(mgrs.coordinate(GridType.TEN_KILOMETER)).to.equal(mgrsValue);
    expect(mgrs.coordinate()).to.equal('33XVG7000040000');
    point = mgrs.toPoint();
    expect(point.getLongitude()).to.be.approximately(13.7248758, 0.0001);
    expect(point.getLatitude()).to.be.approximately(77.8324735, 0.0001);
    expect(mgrs.precision()).to.equal(GridType.TEN_KILOMETER);
    expect(mgrs.accuracy()).to.equal(1);

    mgrsValue = '33XVG7443';
    expect(MGRS.isMGRS(mgrsValue)).to.be.true;
    mgrs = MGRS.parse(mgrsValue);
    expect(MGRS.precision(mgrsValue)).to.equal(GridType.KILOMETER);
    expect(MGRS.accuracy(mgrsValue)).to.equal(2);
    expect(mgrs.getZone()).to.equal(33);
    expect(mgrs.getBand()).to.equal('X');
    expect(mgrs.getColumn()).to.equal('V');
    expect(mgrs.getRow()).to.equal('G');
    expect(mgrs.getColumnRowId()).to.equal('VG');
    expect(mgrs.getEasting()).to.equal(74000);
    expect(mgrs.getNorthing()).to.equal(43000);
    expect(mgrs.coordinate(GridType.KILOMETER)).to.equal(mgrsValue);
    expect(mgrs.coordinate()).to.equal('33XVG7400043000');
    point = mgrs.toPoint();
    expect(point.getLongitude()).to.be.approximately(13.8924385, 0.0001);
    expect(point.getLatitude()).to.be.approximately(77.8600782, 0.0001);
    expect(mgrs.precision()).to.equal(GridType.KILOMETER);
    expect(mgrs.accuracy()).to.equal(2);

    mgrsValue = '33XVG745435';
    expect(MGRS.isMGRS(mgrsValue)).to.be.true;
    mgrs = MGRS.parse(mgrsValue);
    expect(MGRS.precision(mgrsValue)).to.equal(GridType.HUNDRED_METER);
    expect(MGRS.accuracy(mgrsValue)).to.equal(3);
    expect(mgrs.getZone()).to.equal(33);
    expect(mgrs.getBand()).to.equal('X');
    expect(mgrs.getColumn()).to.equal('V');
    expect(mgrs.getRow()).to.equal('G');
    expect(mgrs.getColumnRowId()).to.equal('VG');
    expect(mgrs.getEasting()).to.equal(74500);
    expect(mgrs.getNorthing()).to.equal(43500);
    expect(mgrs.coordinate(GridType.HUNDRED_METER)).to.equal(mgrsValue);
    expect(mgrs.coordinate()).to.equal('33XVG7450043500');
    point = mgrs.toPoint();
    expect(point.getLongitude()).to.be.approximately(13.9133378, 0.0001);
    expect(point.getLatitude()).to.be.approximately(77.8646415, 0.0001);
    expect(mgrs.precision()).to.equal(GridType.HUNDRED_METER);
    expect(mgrs.accuracy()).to.equal(3);

    mgrsValue = '33XVG74594359';
    expect(MGRS.isMGRS(mgrsValue)).to.be.true;
    mgrs = MGRS.parse(mgrsValue);
    expect(MGRS.precision(mgrsValue)).to.equal(GridType.TEN_METER);
    expect(MGRS.accuracy(mgrsValue)).to.equal(4);
    expect(mgrs.getZone()).to.equal(33);
    expect(mgrs.getBand()).to.equal('X');
    expect(mgrs.getColumn()).to.equal('V');
    expect(mgrs.getRow()).to.equal('G');
    expect(mgrs.getColumnRowId()).to.equal('VG');
    expect(mgrs.getEasting()).to.equal(74590);
    expect(mgrs.getNorthing()).to.equal(43590);
    expect(mgrs.coordinate(GridType.TEN_METER)).to.equal(mgrsValue);
    expect(mgrs.coordinate()).to.equal('33XVG7459043590');
    point = mgrs.toPoint();
    expect(point.getLongitude()).to.be.approximately(13.9171014, 0.0001);
    expect(point.getLatitude()).to.be.approximately(77.8654628, 0.0001);
    expect(mgrs.precision()).to.equal(GridType.TEN_METER);
    expect(mgrs.accuracy()).to.equal(4);

    mgrsValue = '33XVG7459743593';
    expect(MGRS.isMGRS(mgrsValue)).to.be.true;
    mgrs = MGRS.parse(mgrsValue);
    expect(MGRS.precision(mgrsValue)).to.equal(GridType.METER);
    expect(MGRS.accuracy(mgrsValue)).to.equal(5);
    expect(mgrs.getZone()).to.equal(33);
    expect(mgrs.getBand()).to.equal('X');
    expect(mgrs.getColumn()).to.equal('V');
    expect(mgrs.getRow()).to.equal('G');
    expect(mgrs.getColumnRowId()).to.equal('VG');
    expect(mgrs.getEasting()).to.equal(74597);
    expect(mgrs.getNorthing()).to.equal(43593);
    expect(mgrs.coordinate()).to.equal(mgrsValue);
    expect(mgrs.coordinate()).to.equal('33XVG7459743593');
    point = mgrs.toPoint();
    expect(point.getLongitude()).to.be.approximately(13.9173973, 0.0001);
    expect(point.getLatitude()).to.be.approximately(77.8654908, 0.0001);
    expect(mgrs.precision()).to.equal(GridType.METER);
    expect(mgrs.accuracy()).to.equal(5);
  });

  /**
   * Test parsing a 100k MGRS string value that falls outside grid zone bounds
   *
   * @throws ParseException
   *             upon failure to parse
   */
  it('test parse 100k bounds', function () {
    let mgrsValue = '32VJN';
    expect(MGRS.isMGRS(mgrsValue)).to.be.true;
    let mgrs = MGRS.parse(mgrsValue);
    let point = mgrs.toPoint();
    expect(point.getLongitude()).to.be.approximately(3.0, 0.0001);
    expect(point.getLatitude()).to.be.approximately(60.3007719, 0.0001);
    let comparePoint = MGRS.parse(mgrs.coordinate()).toPoint();
    expect(point.getLongitude()).to.be.approximately(comparePoint.getLongitude(), 0.0001);
    expect(point.getLatitude()).to.be.approximately(comparePoint.getLatitude(), 0.0001);

    mgrsValue = '32VKS';
    expect(MGRS.isMGRS(mgrsValue)).to.be.true;
    mgrs = MGRS.parse(mgrsValue);
    point = mgrs.toPoint();
    expect(point.getLongitude()).to.be.approximately(3.0, 0.0001);
    expect(point.getLatitude()).to.be.approximately(63.9024981, 0.0001);
    comparePoint = MGRS.parse(mgrs.coordinate()).toPoint();
    expect(point.getLongitude()).to.be.approximately(comparePoint.getLongitude(), 0.0001);
    expect(point.getLatitude()).to.be.approximately(comparePoint.getLatitude(), 0.0001);

    mgrsValue = '32VJR';
    expect(MGRS.isMGRS(mgrsValue)).to.be.true;
    mgrs = MGRS.parse(mgrsValue);
    point = mgrs.toPoint();
    expect(point.getLongitude()).to.be.approximately(3.0, 0.0001);
    expect(point.getLatitude()).to.be.approximately(63.0020546, 0.0001);
    comparePoint = MGRS.parse(mgrs.coordinate()).toPoint();
    expect(point.getLongitude()).to.be.approximately(comparePoint.getLongitude(), 0.0001);
    expect(point.getLatitude()).to.be.approximately(comparePoint.getLatitude(), 0.0001);

    mgrsValue = '32VJH';
    expect(MGRS.isMGRS(mgrsValue)).to.be.true;
    mgrs = MGRS.parse(mgrsValue);
    point = mgrs.toPoint();
    expect(point.getLongitude()).to.be.approximately(3.0, 0.0001);
    expect(point.getLatitude()).to.be.approximately(56.0, 0.0001);
    comparePoint = MGRS.parse(mgrs.coordinate()).toPoint();
    expect(point.getLongitude()).to.be.approximately(comparePoint.getLongitude(), 0.0001);
    expect(point.getLatitude()).to.be.approximately(comparePoint.getLatitude(), 0.0001);

    mgrsValue = '38KNU';
    expect(MGRS.isMGRS(mgrsValue)).to.be.true;
    mgrs = MGRS.parse(mgrsValue);
    point = mgrs.toPoint();
    expect(point.getLongitude()).to.be.approximately(45.0, 0.0001);
    expect(point.getLatitude()).to.be.approximately(-24.0, 0.0001);
    comparePoint = MGRS.parse(mgrs.coordinate()).toPoint();
    expect(point.getLongitude()).to.be.approximately(comparePoint.getLongitude(), 0.0001);
    expect(point.getLatitude()).to.be.approximately(comparePoint.getLatitude(), 0.0001);

    mgrsValue = '38KRU';
    expect(MGRS.isMGRS(mgrsValue)).to.be.true;
    mgrs = MGRS.parse(mgrsValue);
    point = mgrs.toPoint();
    expect(point.getLongitude()).to.be.approximately(47.9486444, 0.0001);
    expect(point.getLatitude()).to.be.approximately(-24.0, 0.0001);
    comparePoint = MGRS.parse(mgrs.coordinate()).toPoint();
    expect(point.getLongitude()).to.be.approximately(comparePoint.getLongitude(), 0.0001);
    expect(point.getLatitude()).to.be.approximately(comparePoint.getLatitude(), 0.0001);

    mgrsValue = '32VPH';
    expect(MGRS.isMGRS(mgrsValue)).to.be.true;
    mgrs = MGRS.parse(mgrsValue);
    point = mgrs.toPoint();
    expect(point.getLongitude()).to.be.approximately(10.6034691, 0.0001);
    expect(point.getLatitude()).to.be.approximately(56.0, 0.0001);
    comparePoint = MGRS.parse(mgrs.coordinate()).toPoint();
    expect(point.getLongitude()).to.be.approximately(comparePoint.getLongitude(), 0.0001);
    expect(point.getLatitude()).to.be.approximately(comparePoint.getLatitude(), 0.0001);
  });

  /**
   * Test parsing a MGRS string value
   *
   * @throws ParseException
   *             upon failure to parse
   */
  it('test coordinate', function () {
    let mgrs = '35VPL0115697387';
    testCoordinate(29.06757, 63.98863, mgrs);
    testCoordinateMeters(3235787.09, 9346877.48, mgrs);

    mgrs = '39PYP7290672069';
    testCoordinate(53.51, 12.4, mgrs);
    testCoordinateMeters(5956705.95, 1391265.16, mgrs);

    mgrs = '4QFJ1234056781';
    testCoordinate(-157.916861, 21.309444, mgrs);
    testCoordinateMeters(-17579224.55, 2428814.96, mgrs);

    mgrs = '33PYJ6132198972';
    testCoordinate(17.3714337, 8.1258235, mgrs, false);
    testCoordinateMeters(1933779.15, 907610.2, mgrs, false);
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
      expect(mgrs.getZone()).to.be.equal(zoneNumber);
      expect(mgrs.getBand()).to.be.equal(bandLetter);

      let point = mgrs.toPoint();
      let southwest = zone.getBounds().getSouthwest();

      expect(southwest.getLongitude()).to.be.approximately(point.getLongitude(), 0.0001);
      expect(southwest.getLatitude()).to.be.approximately(point.getLatitude(), 0.0001);
    }
  });

  /**
   * Test parsing a Svalbard MGRS string values
   *
   * @throws ParseException
   *             upon failure to parse
   */
  it('test Svalbard parse', function () {
    expect(MGRS.isMGRS('31X')).to.be.true;
    expect(MGRS.parse('31X')).to.not.be.null;
    expect(MGRS.isMGRS('32X')).to.be.false;
    try {
      expect(MGRS.parse('32X')).to.be.null;
      expect.fail('Expected parse exception');
    } catch (Error) {}
    expect(MGRS.isMGRS('32XMH')).to.be.false;
    try {
      MGRS.parse('32XMH');
      expect.fail('Expected parse exception');
    } catch (Error) {}
    expect(MGRS.isMGRS('32XMH11')).to.be.false;
    try {
      MGRS.parse('32XMH11');
      expect.fail('Expected parse exception');
    } catch (Error) {}
    expect(MGRS.isMGRS('32XMH1111')).to.be.false;
    try {
      MGRS.parse('32XMH1111');
      expect.fail('Expected parse exception');
    } catch (Error) {}
    expect(MGRS.isMGRS('32XMH111111')).to.be.false;
    try {
      MGRS.parse('32XMH111111');
      expect.fail('Expected parse exception');
    } catch (Error) {}
    expect(MGRS.isMGRS('32XMH11111111')).to.be.false;
    try {
      MGRS.parse('32XMH11111111');
      expect.fail('Expected parse exception');
    } catch (Error) {}
    expect(MGRS.isMGRS('32XMH111111111')).to.be.false;
    try {
      MGRS.parse('32XMH111111111');
      expect.fail('Expected parse exception');
    } catch (Error) {}
    expect(MGRS.isMGRS('33X')).to.be.true;
    expect(MGRS.parse('33X')).to.not.be.null;
    expect(MGRS.isMGRS('34X')).to.be.false;
    try {
      expect(MGRS.parse('34X')).to.be.null;
      expect.fail('Expected parse exception');
    } catch (Error) {}
    expect(MGRS.isMGRS('35X')).to.be.true;
    expect(MGRS.parse('35X')).to.not.be.null;
    expect(MGRS.isMGRS('36X')).to.be.false;
    try {
      expect(MGRS.parse('36X')).to.be.null;
      expect.fail('Expected parse exception');
    } catch (Error) {}
    expect(MGRS.isMGRS('37X')).to.be.true;
    expect(MGRS.parse('37X')).to.not.be.null;
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
function testCoordinate(longitude: number, latitude: number, value: string, test100k = true): void {
  const point = Point.point(longitude, latitude);
  testCoordinateByPoint(point, value, test100k);
  testCoordinateByPoint(point.toMeters(), value, test100k);
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
function testCoordinateMeters(longitude: number, latitude: number, value: string, test100k = true): void {
  const point = Point.meters(longitude, latitude);
  testCoordinateByPoint(point, value, test100k);
  testCoordinateByPoint(point.toDegrees(), value, test100k);
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
function testCoordinateByPoint(point: Point, value: string, test100k: boolean): void {
  let mgrs = MGRS.from(point);
  expect(value, mgrs.toString());
  expect(value, mgrs.coordinate());

  let gzd = mgrs.coordinate(GridType.GZD);
  expect(gzd).to.equal(accuracyValue(value, -1));
  expect(MGRS.isMGRS(gzd)).to.be.true;
  let gzdMGRS = MGRS.parse(gzd);
  expect(MGRS.precision(gzd)).to.equal(GridType.GZD);
  expect(MGRS.accuracy(gzd)).to.equal(0);
  expect(gzdMGRS.coordinate(GridType.GZD)).to.equal(gzd);

  let hundredKilometer = mgrs.coordinate(GridType.HUNDRED_KILOMETER);
  expect(hundredKilometer).to.equal(accuracyValue(value, 0));
  expect(mgrs.coordinateFromAccuracy(0)).to.equal(hundredKilometer);
  expect(MGRS.isMGRS(hundredKilometer)).to.be.true;
  let hundredKilometerMGRS = MGRS.parse(hundredKilometer);
  expect(MGRS.precision(hundredKilometer)).to.equal(GridType.HUNDRED_KILOMETER);
  expect(MGRS.accuracy(hundredKilometer)).to.equal(0);
  expect(hundredKilometer, hundredKilometerMGRS.coordinate(GridType.HUNDRED_KILOMETER)).to.equal(hundredKilometer);
  if (test100k) {
    expect(hundredKilometerMGRS.getEasting()).to.equal(0);
    expect(hundredKilometerMGRS.getNorthing()).to.equal(0);
    expect(hundredKilometerMGRS.precision()).to.equal(GridType.HUNDRED_KILOMETER);
    expect(hundredKilometerMGRS.accuracy()).to.equal(0);
  }

  let tenKilometer = mgrs.coordinate(GridType.TEN_KILOMETER);
  expect(tenKilometer).to.equal(accuracyValue(value, 1));
  expect(mgrs.coordinateFromAccuracy(1)).to.equal(tenKilometer);
  expect(MGRS.isMGRS(tenKilometer)).to.be.true;
  let tenKilometerMGRS = MGRS.parse(tenKilometer);
  expect(MGRS.precision(tenKilometer)).to.equal(GridType.TEN_KILOMETER);
  expect(MGRS.accuracy(tenKilometer)).to.equal(1);
  expect(tenKilometerMGRS.coordinate(GridType.TEN_KILOMETER)).to.equal(tenKilometer);
  expect(tenKilometerMGRS.getEasting()).to.equal(getEasting(tenKilometer, 1));
  expect(tenKilometerMGRS.getNorthing()).to.equal(getNorthing(tenKilometer, 1));
  expect(tenKilometerMGRS.precision()).to.equal(GridType.TEN_KILOMETER);
  expect(tenKilometerMGRS.accuracy()).to.equal(1);

  let kilometer = mgrs.coordinate(GridType.KILOMETER);
  expect(kilometer).to.equal(accuracyValue(value, 2));
  expect(mgrs.coordinateFromAccuracy(2)).to.equal(kilometer);
  expect(MGRS.isMGRS(kilometer)).to.be.true;
  let kilometerMGRS = MGRS.parse(kilometer);
  expect(MGRS.precision(kilometer)).to.equal(GridType.KILOMETER);
  expect(MGRS.accuracy(kilometer)).to.equal(2);
  expect(kilometerMGRS.coordinate(GridType.KILOMETER)).to.equal(kilometer);
  expect(kilometerMGRS.getEasting()).to.equal(getEasting(kilometer, 2));
  expect(kilometerMGRS.getNorthing()).to.equal(getNorthing(kilometer, 2));
  expect(kilometerMGRS.precision()).to.equal(GridType.KILOMETER);
  expect(kilometerMGRS.accuracy()).to.equal(2);

  let hundredMeter = mgrs.coordinate(GridType.HUNDRED_METER);
  expect(hundredMeter).to.equal(accuracyValue(value, 3));
  expect(mgrs.coordinateFromAccuracy(3)).to.equal(hundredMeter);
  expect(MGRS.isMGRS(hundredMeter)).to.be.true;
  let hundredMeterMGRS = MGRS.parse(hundredMeter);
  expect(MGRS.precision(hundredMeter)).to.equal(GridType.HUNDRED_METER);
  expect(MGRS.accuracy(hundredMeter)).to.equal(3);
  expect(hundredMeterMGRS.coordinate(GridType.HUNDRED_METER)).to.equal(hundredMeter);
  expect(hundredMeterMGRS.getEasting()).to.equal(getEasting(hundredMeter, 3));
  expect(hundredMeterMGRS.getNorthing()).to.equal(getNorthing(hundredMeter, 3));
  expect(hundredMeterMGRS.precision()).to.equal(GridType.HUNDRED_METER);
  expect(hundredMeterMGRS.accuracy()).to.equal(3);

  let tenMeter = mgrs.coordinate(GridType.TEN_METER);
  expect(tenMeter).to.equal(accuracyValue(value, 4));
  expect(mgrs.coordinateFromAccuracy(4)).to.equal(tenMeter);
  expect(MGRS.isMGRS(tenMeter)).to.be.true;
  let tenMeterMGRS = MGRS.parse(tenMeter);
  expect(MGRS.precision(tenMeter)).to.equal(GridType.TEN_METER);
  expect(MGRS.accuracy(tenMeter)).to.equal(4);
  expect(tenMeterMGRS.coordinate(GridType.TEN_METER)).to.equal(tenMeter);
  expect(tenMeterMGRS.getEasting()).to.equal(getEasting(tenMeter, 4));
  expect(tenMeterMGRS.getNorthing()).to.equal(getNorthing(tenMeter, 4));
  expect(tenMeterMGRS.precision()).to.equal(GridType.TEN_METER);
  expect(tenMeterMGRS.accuracy()).to.equal(4);

  let meter = mgrs.coordinate();
  expect(value).to.equal(meter);
  expect(meter).to.equal(accuracyValue(value, 5));
  expect(mgrs.coordinateFromAccuracy(5)).to.equal(meter);
  expect(MGRS.isMGRS(meter)).to.be.true;
  let meterMGRS = MGRS.parse(meter);
  expect(MGRS.precision(meter)).to.equal(GridType.METER);
  expect(MGRS.accuracy(meter)).to.equal(5);
  expect(meterMGRS.coordinate()).to.equal(meter);
  expect(meterMGRS.getEasting()).to.equal(getEasting(meter, 5));
  expect(meterMGRS.getNorthing()).to.equal(getNorthing(meter, 5));
  expect(meterMGRS.precision()).to.equal(GridType.METER);
  expect(meterMGRS.accuracy()).to.equal(5);
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
      let eastingNorthing = value.substring(accuracyValue.length);
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
  return padAccuracy(value.substring(value.length - 2 * accuracy, value.length - accuracy), accuracy);
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
  return padAccuracy(value.substring(value.length - accuracy), accuracy);
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
    value += '0';
  }
  return Number(value);
}

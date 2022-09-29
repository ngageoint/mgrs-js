import { Bounds } from "@ngageoint/grid-js";
import { BandLetterRange } from "./BandLetterRange";


/**
 * Grid Range
 * 
 * @author osbornb
 */
export class GridRange implements IterableIterator<GridZone> {

    /**
     * Zone Number Range
     */
    private zoneNumberRange: ZoneNumberRange;

    /**
     * Band Letter Range
     */
    private bandLetterRange: BandLetterRange;

    /**
     * Constructor
     * 
     * @param zoneNumberRange
     *            zone number range
     * @param bandLetterRange
     *            band letter range
     */
    constructor(zoneNumberRange = new ZoneNumberRange(),
        bandLetterRange = new BandLetterRange()) {
        this.zoneNumberRange = zoneNumberRange;
        this.bandLetterRange = bandLetterRange;
    }

    /**
     * Get the zone number range
     * 
     * @return zone number range
     */
    public getZoneNumberRange(): ZoneNumberRange {
        return this.zoneNumberRange;
    }

    /**
     * Set the zone number range
     * 
     * @param zoneNumberRange
     *            zone number range
     */
    public setZoneNumberRange(zoneNumberRange: ZoneNumberRange): void {
        this.zoneNumberRange = zoneNumberRange;
    }

    /**
     * Get the band letter range
     * 
     * @return band letter range
     */
    public getBandLetterRange(): BandLetterRange {
        return this.bandLetterRange;
    }

    /**
     * Set the band letter range
     * 
     * @param bandLetterRange
     *            band letter range
     */
    public setBandLetterRange(bandLetterRange: BandLetterRange): void {
        this.bandLetterRange = bandLetterRange;
    }

    /**
     * Get the grid range bounds
     * 
     * @return bounds
     */
    public getBounds(): Bounds {

        const west = this.zoneNumberRange.getWestLongitude();
        const south = this.bandLetterRange.getSouthLatitude();
        const east = this.zoneNumberRange.getEastLongitude();
        const north = this.bandLetterRange.getNorthLatitude();

        return Bounds.degrees(west, south, east, north);
    }

    public next(): IteratorResult<string> {
        // TODO implement
        return {
            done: true,
            value: null,
        };
    }

    [Symbol.iterator](): IterableIterator<GridZone> {
        return this;
    }

}

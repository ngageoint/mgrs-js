import { Hemisphere } from "@ngageoint/grid-js";
import { MGRSUtils } from "../MGRSUtils";


/**
 * Latitude (horizontal) band
 * 
 * @author osbornb
 */
export class LatitudeBand {

    /**
     * Band letter
     */
    private letter: string;

    /**
     * Southern latitude
     */
    private south: number;

    /**
     * Northern latitude
     */
    private north: number;

    /**
     * Hemisphere
     */
    private hemisphere: Hemisphere;

    /**
     * Constructor
     * 
     * @param letter
     *            band letter
     * @param south
     *            southern latitude
     * @param north
     *            northern latitude
     */
    constructor(letter: string, south: number, north: number) {
        this.setLetter(letter);
        this.south = south;
        this.north = north;
    }

    /**
     * Get the band letter
     * 
     * @return band letter
     */
    public getLetter(): string {
        return this.letter;
    }

    /**
     * Set the band letter
     * 
     * @param letter
     *            band letter
     */
    public setLetter(letter: string): void {
        this.letter = letter;
        this.hemisphere = MGRSUtils.getHemisphere(letter);
    }

    /**
     * Get the southern latitude
     * 
     * @return southern latitude
     */
    public getSouth(): number {
        return this.south;
    }

    /**
     * Set the southern latitude
     * 
     * @param south
     *            southern latitude
     */
    public setSouth(south: number): void {
        this.south = south;
    }

    /**
     * Get the northern latitude
     * 
     * @return northern latitude
     */
    public getNorth(): number {
        return this.north;
    }

    /**
     * Set the northern latitude
     * 
     * @param north
     *            northern latitude
     */
    public setNorth(north: number): void {
        this.north = north;
    }

    /**
     * Get the hemisphere
     * 
     * @return hemisphere
     */
    public getHemisphere(): Hemisphere {
        return this.hemisphere;
    }

}

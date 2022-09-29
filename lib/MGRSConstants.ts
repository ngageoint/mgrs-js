import { GridConstants } from "@ngageoint/grid-js";

/**
 * Military Grid Reference System Constants
 * 
 * @author osbornb
 */
export class MGRSConstants {

	/**
	 * Minimum longitude
	 */
	public static readonly MIN_LON = GridConstants.MIN_LON;

	/**
	 * Maximum longitude
	 */
	public static readonly MAX_LON = GridConstants.MAX_LON;

	/**
	 * Minimum latitude
	 */
	public static readonly MIN_LAT = -80.0;

	/**
	 * Maximum latitude
	 */
	public static readonly MAX_LAT = 84.0;

	/**
	 * Minimum grid zone number
	 */
	public static readonly MIN_ZONE_NUMBER = 1;

	/**
	 * Maximum grid zone number
	 */
	public static readonly MAX_ZONE_NUMBER = 60;

	/**
	 * Grid zone width
	 */
	public static readonly ZONE_WIDTH = 6.0;

	/**
	 * Minimum grid band letter
	 */
	public static readonly MIN_BAND_LETTER = 'C';

	/**
	 * Maximum grid band letter
	 */
	public static readonly MAX_BAND_LETTER = 'X';

	/**
	 * Number of bands
	 */
	public static readonly NUM_BANDS = 20;

	/**
	 * Grid band height for all by but the {@link #MAX_BAND_LETTER}
	 */
	public static readonly BAND_HEIGHT = 8.0;

	/**
	 * Grid band height for the {@link #MAX_BAND_LETTER}
	 */
	public static readonly MAX_BAND_HEIGHT = 12.0;

	/**
	 * Last southern hemisphere band letter
	 */
	public static readonly BAND_LETTER_SOUTH = 'M';

	/**
	 * First northern hemisphere band letter
	 */
	public static readonly BAND_LETTER_NORTH = 'N';

	/**
	 * Min zone number in Svalbard grid zones
	 */
	public static readonly MIN_SVALBARD_ZONE_NUMBER = 31;

	/**
	 * Max zone number in Svalbard grid zones
	 */
	public static readonly MAX_SVALBARD_ZONE_NUMBER = 37;

	/**
	 * Band letter in Svalbard grid zones
	 */
	public static readonly SVALBARD_BAND_LETTER = MGRSConstants.MAX_BAND_LETTER;

	/**
	 * Min zone number in Norway grid zones
	 */
	public static readonly MIN_NORWAY_ZONE_NUMBER = 31;

	/**
	 * Max zone number in Norway grid zones
	 */
	public static readonly MAX_NORWAY_ZONE_NUMBER = 32;

	/**
	 * Band letter in Norway grid zones
	 */
	public static readonly NORWAY_BAND_LETTER = 'V';

}

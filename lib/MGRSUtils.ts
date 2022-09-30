import { GridUtils, Hemisphere } from '@ngageoint/grid-js';
import { MGRSConstants } from './MGRSConstants';

/**
 * Military Grid Reference System utilities
 *
 * @author wnewman
 * @author osbornb
 */
export class MGRSUtils {
  /**
   * Validate the zone number
   *
   * @param zoneNumber
   *            zone number
   */
  public static validateZoneNumber(zoneNumber: number): void {
    if (zoneNumber < MGRSConstants.MIN_ZONE_NUMBER || zoneNumber > MGRSConstants.MAX_ZONE_NUMBER) {
      throw new Error(
        'Illegal zone number (expected ' +
          MGRSConstants.MIN_ZONE_NUMBER +
          ' - ' +
          MGRSConstants.MAX_ZONE_NUMBER +
          '): ' +
          zoneNumber,
      );
    }
  }

  /**
   * Validate the band letter
   *
   * @param letter
   *            band letter
   */
  public static validateBandLetter(letter: string): void {
    if (
      letter < MGRSConstants.MIN_BAND_LETTER ||
      letter > MGRSConstants.MAX_BAND_LETTER ||
      GridUtils.isOmittedBandLetter(letter)
    ) {
      throw new Error('Illegal band letter (CDEFGHJKLMNPQRSTUVWX): ' + letter);
    }
  }

  /**
   * Get the next band letter
   *
   * @param letter
   *            band letter
   * @return next band letter, 'Y' ({@link MGRSConstants#MAX_BAND_LETTER} + 1)
   *         if no next bands
   */
  public static nextBandLetter(letter: string): string {
    MGRSUtils.validateBandLetter(letter);

    let charLetter = letter.charCodeAt(0);

    charLetter++;
    if (GridUtils.isOmittedBandLetter(String.fromCharCode(charLetter))) {
      charLetter++;
    }
    return String.fromCharCode(charLetter);
  }

  /**
   * Get the previous band letter
   *
   * @param letter
   *            band letter
   * @return previous band letter, 'B' ({@link MGRSConstants#MIN_BAND_LETTER}
   *         - 1) if no previous bands
   */
  public static previousBandLetter(letter: string): string {
    MGRSUtils.validateBandLetter(letter);

    let charLetter = letter.charCodeAt(0);
    charLetter--;
    if (GridUtils.isOmittedBandLetter(String.fromCharCode(charLetter))) {
      charLetter--;
    }
    return String.fromCharCode(charLetter);
  }

  /**
   * Get the label name
   *
   * @param zoneNumber
   *            zone number
   * @param bandLetter
   *            band letter
   * @return name
   */
  public static getLabelName(zoneNumber: number, bandLetter: string): string {
    return zoneNumber + bandLetter;
  }

  /**
   * Get the hemisphere from the band letter
   *
   * @param bandLetter
   *            band letter
   * @return hemisphere
   */
  public static getHemisphere(bandLetter: string): Hemisphere {
    return bandLetter < MGRSConstants.BAND_LETTER_NORTH ? Hemisphere.SOUTH : Hemisphere.NORTH;
  }
}

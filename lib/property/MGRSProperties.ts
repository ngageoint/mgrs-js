import { GridProperties } from '@ngageoint/grid-js';
import * as config from '../../resources/mgrs.json';

/**
 * MGRS property loader
 */
export class MGRSProperties extends GridProperties {
  /**
   * Singleton instance
   */
  public static instance = new MGRSProperties(config);

  /**
   * Get the singleton instance
   *
   * @return instance
   */
  public static getInstance(): MGRSProperties {
    return MGRSProperties.instance;
  }
}

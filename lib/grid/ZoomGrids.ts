import { BaseZoomGrids } from '@ngageoint/grid-js';
import { Grid } from './Grid';
import { GridType } from './GridType';

/**
 * Zoom Level Matching Grids
 *
 * @author osbornb
 */
export class ZoomGrids extends BaseZoomGrids<Grid> {
  /**
   * Constructor
   *
   * @param zoom
   *            zoom level
   */
  constructor(zoom: number) {
    super(zoom);
  }

  /**
   * Get the grid type precision
   *
   * @return grid type precision
   */
  public getPrecision(): GridType | undefined {
    let type: GridType | undefined;
    if (super.hasGrids()) {
      type = this.grids.begin().value.getType();
    }
    return type;
  }
}

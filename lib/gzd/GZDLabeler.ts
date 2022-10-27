import { Color } from '@ngageoint/color-js';
import { GridLabel } from '../grid/GridLabel';
import { GridLabeler } from '../grid/GridLabeler';
import { GridType } from '../grid/GridType';
import { MGRS } from '../MGRS';
import { GridZone } from './GridZone';

/**
 * Grid Zone Designator labeler
 */
export class GZDLabeler extends GridLabeler {
  constructor(enabled: boolean, minZoom = 0, maxZoom?: number, color?: Color, textSize?: number, buffer?: number) {
    super(enabled, minZoom, maxZoom, color, textSize, buffer);
  }

  /**
   * {@inheritDoc}
   */
  public getLabels(gridType: GridType, zone: GridZone): GridLabel[] {
    const labels: GridLabel[] = [];
    const bounds = zone.getBounds();
    const center = bounds.getCentroid();
    labels.push(new GridLabel(zone.getName(), center, bounds, gridType, MGRS.from(center)));
    return labels;
  }
}

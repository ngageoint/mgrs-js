import { Color } from '@ngageoint/color-js';
import { BaseGrids, GridStyle, PropertyConstants } from '@ngageoint/grid-js';
import { GZDLabeler } from '../gzd/GZDLabeler';
import { MGRSProperties } from '../property/MGRSProperties';
import { Grid } from './Grid';
import { GridLabeler } from './GridLabeler';
import { GridType } from './GridType';
import { GridTypeUtils } from './GridTypeUtils';
import { MGRSLabeler } from './MGRSLabeler';
import { ZoomGrids } from './ZoomGrids';

/**
 * Grids
 *
 * @author osbornb
 */
export class Grids extends BaseGrids<Grid, ZoomGrids> {
  /**
   * Grids
   */
  private gridMap = new Map<GridType, Grid>();

  /**
   * Create with grids to enable
   *
   * @param types
   *            grid types to enable
   * @return grids
   */
  public static create(types?: GridType[]): Grids {
    return new Grids(types);
  }

  /**
   * Create only Grid Zone Designator grids
   *
   * @return grids
   */
  public static createGZD(): Grids {
    return Grids.create([GridType.GZD]);
  }

  /**
   * Constructor
   *
   * @param types
   *            grid types to enable
   */
  constructor(types?: GridType[]) {
    super(MGRSProperties.getInstance());

    if (types) {
      this.createGrids(false);
      for (const type of types) {
        const grid = this.getGrid(type);
        if (grid) {
          grid.setEnabled(true);
        }
      }
    } else {
      this.createGrids(undefined);
    }

    this.createZoomGrids();
  }

  /**
   * {@inheritDoc}
   */
  public getDefaultWidth(): number {
    return Grid.DEFAULT_WIDTH!;
  }

  /**
   * {@inheritDoc}
   */
  public grids(): Grid[] {
    const result: Grid[] = [];

    for (const grid of this.gridMap.values()) {
      result.push(grid);
    }

    return result;
  }

  /**
   * Create a new grid, override to create a specialized grid
   *
   * @param type
   *            grid type
   * @return grid
   */
  protected newGrid(type: GridType): Grid {
    return new Grid(type);
  }

  /**
   * {@inheritDoc}
   */
  protected newZoomGrids(zoom: number): ZoomGrids {
    return new ZoomGrids(zoom);
  }

  /**
   * Create the grids
   *
   * @param enabled
   *            enable created grids
   */
  private createGrids(enabled?: boolean): void {
    const propagate = this.properties.getBooleanProperty(
      false,
      PropertyConstants.GRIDS.toString(),
      PropertyConstants.PROPAGATE.toString(),
    );
    let styles: Map<GridType, GridStyle> | undefined;
    if (propagate) {
      styles = new Map<GridType, GridStyle>();
    }

    this.createGrid(GridType.GZD, new GZDLabeler(true), styles, enabled);
    this.createGrid(GridType.HUNDRED_KILOMETER, new MGRSLabeler(true), styles, enabled);
    this.createGrid(GridType.TEN_KILOMETER, new MGRSLabeler(true), styles, enabled);
    this.createGrid(GridType.KILOMETER, new MGRSLabeler(true), styles, enabled);
    this.createGrid(GridType.HUNDRED_METER, new MGRSLabeler(true), styles, enabled);
    this.createGrid(GridType.TEN_METER, new MGRSLabeler(true), styles, enabled);
    this.createGrid(GridType.METER, new MGRSLabeler(true), styles, enabled);
  }

  /**
   * Create the grid
   *
   * @param type
   *            grid type
   * @param styles
   *            propagate grid styles
   * @param enabled
   *            enable created grids
   * @param labeler
   *            grid labeler
   */
  private createGrid(type: GridType, labeler: GridLabeler, styles?: Map<GridType, GridStyle>, enabled?: boolean): void {
    const grid = this.newGrid(type);

    const gridKey = GridType[type].toLowerCase();

    this.loadGrid(grid, gridKey, labeler, enabled);

    if (styles) {
      styles.set(type, GridStyle.style(grid.getColor(), grid.getWidth()));
    }

    this.loadGridStyles(grid, gridKey, styles);

    this.gridMap.set(type, grid);
  }

  /**
   * Load grid styles within a higher precision grid
   *
   * @param grid
   *            grid
   * @param gridKey
   *            grid key
   * @param styles
   *            propagate grid styles
   */
  private loadGridStyles(grid: Grid, gridKey: string, styles?: Map<GridType, GridStyle>): void {
    const precision = grid.getPrecision();
    if (precision < GridType.HUNDRED_KILOMETER) {
      this.loadGridStyle(grid, gridKey, GridType.HUNDRED_KILOMETER, styles);
    }
    if (precision < GridType.TEN_KILOMETER) {
      this.loadGridStyle(grid, gridKey, GridType.TEN_KILOMETER, styles);
    }
    if (precision < GridType.KILOMETER) {
      this.loadGridStyle(grid, gridKey, GridType.KILOMETER, styles);
    }
    if (precision < GridType.HUNDRED_METER) {
      this.loadGridStyle(grid, gridKey, GridType.HUNDRED_METER, styles);
    }
    if (precision < GridType.TEN_METER) {
      this.loadGridStyle(grid, gridKey, GridType.TEN_METER, styles);
    }
  }

  /**
   * Load a grid style within a higher precision grid
   *
   * @param grid
   *            grid
   *
   * @param gridKey
   *            grid key
   * @param gridType
   *            style grid type
   * @param styles
   *            propagate grid styles
   */
  private loadGridStyle(grid: Grid, gridKey: string, gridType: GridType, styles?: Map<GridType, GridStyle>): void {
    const gridKey2 = GridType[gridType].toLowerCase();

    let color = this.loadGridStyleColor(gridKey, gridKey2);
    let width = this.loadGridStyleWidth(gridKey, gridKey2);

    if ((!color || !width) && styles) {
      const style = styles.get(gridType);
      if (style) {
        if (!color) {
          const styleColor = style.getColor();
          if (styleColor) {
            color = styleColor.copy();
          }
        }
        if (!width) {
          width = style.getWidth();
        }
      }
    }

    if (color || width) {
      const style = this.getGridStyle(grid, color, width);
      grid.setStyleWithGridType(gridType, style);

      if (styles) {
        styles.set(gridType, style);
      }
    }
  }

  /**
   * Get the grid
   *
   * @param type
   *            grid type
   * @return grid
   */
  public getGrid(type: GridType): Grid | undefined {
    return this.gridMap.get(type);
  }

  /**
   * Get the grid precision for the zoom level
   *
   * @param zoom
   *            zoom level
   * @return grid type precision
   */
  public getPrecision(zoom: number): GridType | undefined {
    let precision: GridType | undefined;
    const zoomGrids = this.getGrids(zoom);
    if (zoomGrids) {
      precision = zoomGrids.getPrecision();
    }
    return precision;
  }

  /**
   * Set the active grid types
   *
   * @param types
   *            grid types
   */
  public setGridTypes(types: GridType[]): void {
    const disableTypes = new Set<GridType>(GridTypeUtils.values());
    for (const gridType of types) {
      this.enableByType(gridType);
      disableTypes.delete(gridType);
    }
    this.disableTypes(disableTypes);
  }

  /**
   * Set the active grids
   *
   * @param grids
   *            grids
   */
  public setGrids(grids: Grid[]): void {
    const disableTypes = new Set<GridType>(GridTypeUtils.values());
    for (const grid of grids) {
      super.enable(grid);
      disableTypes.delete(grid.getType());
    }
    this.disableTypes(disableTypes);
  }

  /**
   * Enable grid types
   *
   * @param types
   *            grid types
   */
  public enableTypes(types: GridType[]): void {
    for (const type of types) {
      this.enableByType(type);
    }
  }

  /**
   * Disable grid types
   *
   * @param types
   *            grid types
   */
  public disableTypes(types: Set<GridType>): void {
    for (const type of types) {
      this.disableByType(type);
    }
  }

  /**
   * Is the grid type enabled
   *
   * @param type
   *            grid type
   * @return true if enabled
   */
  public isEnabled(type: GridType): boolean {
    return this.getGrid(type)!.isEnabled();
  }

  /**
   * Enable the grid type
   *
   * @param type
   *            grid type
   */
  public enableByType(type: GridType): void {
    this.enable(this.getGrid(type)!);
  }

  /**
   * Disable the grid type
   *
   * @param type
   *            grid type
   */
  public disableByType(type: GridType): void {
    this.disable(this.getGrid(type)!);
  }

  /**
   * Set the grid minimum zoom
   *
   * @param type
   *            grid type
   * @param minZoom
   *            minimum zoom
   */
  public setMinZoomByType(type: GridType, minZoom: number): void {
    super.setMinZoom(this.getGrid(type)!, minZoom);
  }

  /**
   * Set the grid maximum zoom
   *
   * @param type
   *            grid type
   * @param maxZoom
   *            maximum zoom
   */
  public setMaxZoomByType(type: GridType, maxZoom: number): void {
    super.setMaxZoom(this.getGrid(type)!, maxZoom);
  }

  /**
   * Set the grid zoom range
   *
   * @param type
   *            grid type
   * @param minZoom
   *            minimum zoom
   * @param maxZoom
   *            maximum zoom
   */
  public setZoomRangeByType(type: GridType, minZoom: number, maxZoom: number): void {
    super.setZoomRange(this.getGrid(type)!, minZoom, maxZoom);
  }

  /**
   * Set the grid minimum level override for drawing grid lines
   *
   * @param type
   *            grid type
   * @param minZoom
   *            minimum zoom level or null to remove
   */
  public setLinesMinZoom(type: GridType, minZoom: number): void {
    this.getGrid(type)!.setLinesMinZoom(minZoom);
  }

  /**
   * Set the grid maximum level override for drawing grid lines
   *
   * @param type
   *            grid type
   * @param maxZoom
   *            maximum zoom level or null to remove
   */
  public setLinesMaxZoom(type: GridType, maxZoom?: number): void {
    this.getGrid(type)!.setLinesMaxZoom(maxZoom);
  }

  /**
   * Set all grid line colors
   *
   * @param color
   *            grid line color
   */
  public setAllColors(color: Color): void {
    this.setColor(GridTypeUtils.values(), color);
  }

  /**
   * Set all grid line widths
   *
   * @param width
   *            grid line width
   */
  public setAllWidths(width: number): void {
    this.setWidth(GridTypeUtils.values(), width);
  }

  /**
   * Delete propagated styles for the grid types
   *
   * @param types
   *            grid types
   */
  public deletePropagatedStyles(types?: GridType[]): void {
    if (!types) {
      types = GridTypeUtils.values();
    }
    for (const type of types!) {
      this.getGrid(type)!.clearPrecisionStyles();
    }
  }

  /**
   * Set the grid type precision line color for the grid types
   *
   * @param types
   *            grid types
   * @param precisionTypes
   *            precision grid types
   * @param color
   *            grid line color
   */
  public setColor(types: GridType[], color: Color, precisionTypes?: GridType[]): void {
    if (precisionTypes) {
      for (const precisionType of precisionTypes) {
        for (const type of types) {
          this.getGrid(type)!.setColorWithGridType(precisionType, color);
        }
      }
    } else {
      for (const type of types) {
        this.getGrid(type)!.setColor(color);
      }
    }
  }

  /**
   * Set the grid type precision line width for the grid types
   *
   * @param types
   *            grid types
   * @param precisionType
   *            precision grid type
   * @param width
   *            grid line width
   */
  public setWidth(types: GridType[], width: number, precisionTypes?: GridType[]): void {
    if (precisionTypes) {
      for (const precisionType of precisionTypes) {
        for (const type of types) {
          this.getGrid(type)!.setWidthWithGridType(width, precisionType);
        }
      }
    } else {
      for (const type of types) {
        this.getGrid(type)!.setWidth(width);
      }
    }
  }

  /**
   * Get the labeler for the grid type
   *
   * @param type
   *            grid type
   * @return labeler or null
   */
  public getLabeler(type: GridType): GridLabeler {
    return this.getGrid(type)!.getLabeler();
  }

  /**
   * Has a labeler for the grid type
   *
   * @param type
   *            grid type
   * @return true if has labeler
   */
  public hasLabeler(type: GridType): boolean {
    return this.getGrid(type)!.hasLabeler();
  }

  /**
   * Set the labeler for the grid type
   *
   * @param type
   *            grid type
   * @param labeler
   *            labeler
   */
  public setLabeler(type: GridType, labeler: GridLabeler): void {
    this.getGrid(type)!.setLabeler(labeler);
  }

  /**
   * Disable all grid labelers
   */
  public disableAllLabelers(): void {
    this.disableLabelers(GridTypeUtils.values());
  }

  /**
   * Enable the labelers for the grid types
   *
   * @param types
   *            grid types
   */
  public enableLabelers(types: GridType[]): void {
    for (const type of types) {
      this.enableLabeler(type);
    }
  }

  /**
   * Disable the labelers for the grid types
   *
   * @param types
   *            grid types
   */
  public disableLabelers(types: GridType[]): void {
    for (const type of types) {
      this.disableLabeler(type);
    }
  }

  /**
   * Is a labeler enabled for the grid type
   *
   * @param type
   *            grid type
   * @return true if labeler enabled
   */
  public isLabelerEnabled(type: GridType): boolean {
    const labeler = this.getLabeler(type);
    return labeler !== null && labeler.isEnabled();
  }

  /**
   * Enable the grid type labeler
   *
   * @param type
   *            grid type
   */
  public enableLabeler(type: GridType): void {
    this.getRequiredLabeler(type).setEnabled(true);
  }

  /**
   * Disable the grid type labeler
   *
   * @param type
   *            grid type
   */
  public disableLabeler(type: GridType): void {
    const labeler = this.getLabeler(type);
    if (labeler) {
      labeler.setEnabled(false);
    }
  }

  /**
   * Get the labeler for the grid type
   *
   * @param type
   *            grid type
   * @return labeler or null
   */
  private getRequiredLabeler(type: GridType): GridLabeler {
    const labeler = this.getLabeler(type);
    if (!labeler) {
      throw new Error('Grid type does not have a labeler: ' + type);
    }
    return labeler;
  }

  /**
   * Set the grid minimum zoom
   *
   * @param type
   *            grid type
   * @param minZoom
   *            minimum zoom
   */
  public setLabelMinZoom(type: GridType, minZoom: number): void {
    const labeler = this.getRequiredLabeler(type);
    labeler.setMinZoom(minZoom);
    const maxZoom = labeler.getMaxZoom();
    if (maxZoom && maxZoom < minZoom) {
      labeler.setMaxZoom(minZoom);
    }
  }

  /**
   * Set the grid maximum zoom
   *
   * @param type
   *            grid type
   * @param maxZoom
   *            maximum zoom
   */
  public setLabelMaxZoom(type: GridType, maxZoom: number): void {
    const labeler = this.getRequiredLabeler(type);
    labeler.setMaxZoom(maxZoom);
    if (maxZoom && labeler.getMinZoom() > maxZoom) {
      labeler.setMinZoom(maxZoom);
    }
  }

  /**
   * Set the grid zoom range
   *
   * @param type
   *            grid type
   * @param minZoom
   *            minimum zoom
   * @param maxZoom
   *            maximum zoom
   */
  public setLabelZoomRange(type: GridType, minZoom: number, maxZoom: number): void {
    const labeler = this.getRequiredLabeler(type);
    if (maxZoom && maxZoom < minZoom) {
      throw new Error("Min zoom '" + minZoom + "' can not be larger than max zoom '" + maxZoom + "'");
    }
    labeler.setMinZoom(minZoom);
    labeler.setMaxZoom(maxZoom);
  }

  /**
   * Set the label grid edge buffer for the grid types
   *
   * @param buffer
   *            label buffer (greater than or equal to 0.0 and less than 0.5)
   * @param types
   *            grid types
   */
  public setLabelBuffer(buffer: number, types: GridType[]): void {
    for (const type of types) {
      this.getRequiredLabeler(type).setBuffer(buffer);
    }
  }

  /**
   * Get the label grid edge buffer
   *
   * @param type
   *            grid type
   * @return label buffer (greater than or equal to 0.0 and less than 0.5)
   */
  public getLabelBuffer(type: GridType): number {
    return this.getGrid(type)!.getLabelBuffer();
  }

  /**
   * Set all label colors
   *
   * @param color
   *            label color
   */
  public setAllLabelColors(color: Color): void {
    for (const grid of this.gridMap.values()) {
      if (grid.hasLabeler()) {
        this.setLabelColor(color, [grid.getType()]);
      }
    }
  }

  /**
   * Set the label color for the grid types
   *
   * @param color
   *            label color
   * @param types
   *            grid types
   */
  public setLabelColor(color: Color, types: GridType[]): void {
    for (const type of types) {
      this.getRequiredLabeler(type).setColor(color);
    }
  }

  /**
   * Set all label text sizes
   *
   * @param textSize
   *            label text size
   */
  public setAllLabelTextSizes(textSize: number): void {
    for (const grid of this.gridMap.values()) {
      if (grid.hasLabeler()) {
        this.setLabelTextSize(textSize, [grid.getType()]);
      }
    }
  }

  /**
   * Set the label text size for the grid types
   *
   * @param textSize
   *            label text size
   * @param types
   *            grid types
   */
  public setLabelTextSize(textSize: number, types: GridType[]): void {
    for (const type of types) {
      this.getRequiredLabeler(type).setTextSize(textSize);
    }
  }
}

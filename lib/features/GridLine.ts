import { Line, Point } from '@ngageoint/grid-js';
import { GridType } from '../grid/GridType';

/**
 * Line between two points
 *
 * @author wnewman
 * @author osbornb
 */
export class GridLine extends Line {
  /**
   * Grid type the line represents if any
   */
  private gridType?: GridType;

  /**
   * Create a line
   *
   * @param point1
   *            first point
   * @param point2
   *            second point
   * @param gridType
   *            line grid type (optional)
   * @return line
   */
  public static lineFromPoints(point1: Point, point2: Point, gridType?: GridType): GridLine {
    const gridLine = new GridLine(Line.line(point1, point2));
    gridLine.gridType = gridType;
    return gridLine;
  }

  /**
   * Create a line
   *
   * @param line
   *            line to copy
   * @param gridType
   *            line grid type (optional)
   * @return line
   */
  public static lineFromLine(line: Line, gridType?: GridType): GridLine {
    const gridLine = new GridLine(line);
    gridLine.gridType = gridType;
    return gridLine;
  }

  /**
   * Copy a line
   *
   * @param line
   *            line to copy
   * @return line
   */
  public static lineFromGridLine(line: GridLine): GridLine {
    return GridLine.lineFromLine(line, line.gridType);
  }

  /**
   * Constructor
   *
   * @param line
   *            line to copy
   */
  constructor(line: Line) {
    super(line);
  }

  /**
   * Get the line grid type
   *
   * @return grid type
   */
  public getGridType(): GridType | undefined {
    return this.gridType;
  }

  /**
   * Check if the line has a grid type
   *
   * @return true if has grid type
   */
  public hasGridType(): boolean {
    if (this.gridType) {
      return true;
    }
    return false;
  }

  /**
   * Set the line grid type
   *
   * @param gridType
   *            grid type
   */
  public setGridType(gridType: GridType): void {
    this.gridType = gridType;
  }

  /**
   * Copy the line
   *
   * @return line copy
   */
  public copy(): GridLine {
    return GridLine.lineFromGridLine(this);
  }

  /**
   * {@inheritDoc}
   */
  public equals(obj: any): boolean {
    if (this === obj) return true;
    if (!super.equals(obj)) return false;
    if (typeof this !== typeof obj) return false;
    const other = obj as GridLine;
    if (this.gridType !== other.gridType) return false;
    return true;
  }
}

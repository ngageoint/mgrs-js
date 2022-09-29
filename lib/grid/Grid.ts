import { Color } from "@ngageoint/color-js";
import { BaseGrid, Bounds, GridStyle, PropertyConstants } from "@ngageoint/grid-js";
import { GridLine } from "../features/GridLine";
import { GridType } from "./GridType";

/**
 * Grid
 * 
 * @author wnewman
 * @author osbornb
 */
export class Grid extends BaseGrid {

    /**
     * Default line width
     */
    public static readonly DEFAULT_WIDTH = MGRSProperties.getInstance()
        .getDoubleProperty(PropertyConstants.GRID.toString(), PropertyConstants.WIDTH.toString());

    /**
     * Grid type
     */
    private readonly type: GridType;

    /**
     * Grid line styles
     */
    private styles = new Map<GridType, GridStyle>();

    /**
     * Constructor
     * 
     * @param type
     *            grid type
     */
    constructor(type: GridType) {
        super();
        this.type = type;
    }

    /**
     * Get the grid type
     * 
     * @return grid type
     */
    public getType(): GridType {
        return this.type;
    }

    /**
     * Is the provided grid type
     * 
     * @param type
     *            grid type
     * @return true if the type
     */
    public isType(type: GridType): boolean {
        return this.type === type;
    }

    /**
     * Get the precision in meters
     * 
     * @return precision meters
     */
    public getPrecision(): number {
        return this.type;
    }

    /**
     * Get the grid type precision line style for the grid type
     * 
     * @param gridType
     *            grid type
     * @return grid type line style
     */
    public getStyle(gridType: GridType): GridStyle {
        let style: GridStyle;
        if (gridType === this.type) {
            style = this.getStyle();
        } else {
            style = this.styles.get(gridType);
        }
        return style;
    }

    /**
     * Get the grid type line style for the grid type or create it
     * 
     * @param gridType
     *            grid type
     * @return grid type line style
     */
    private getOrCreateStyle(gridType: GridType): GridStyle {
        let style = this.getStyle(gridType);
        if (!style) {
            style = new GridStyle();
            this.setStyle(gridType, style);
        }
        return style;
    }

    /**
     * Set the grid type precision line style
     * 
     * @param gridType
     *            grid type
     * @param style
     *            grid line style
     */
    public setStyle(gridType: GridType, style: GridStyle): void {
        if (gridType < this.getPrecision()) {
            throw new Error(
                "Grid can not define a style for a higher precision grid type. Type: "
                + this.type + ", Style Type: " + gridType);
        }
        if (gridType === this.type) {
            this.setStyle(style);
        } else {
            this.styles.set(gridType, style != null ? style : new GridStyle());
        }
    }

    /**
     * Clear the propagated grid type precision styles
     */
    public clearPrecisionStyles(): void {
        this.styles.clear();
    }

    /**
     * Get the grid type precision line color
     * 
     * @param gridType
     *            grid type
     * @return grid type line color
     */
    public getColor(gridType: GridType): Color {
        let color: Color;
        let style = this.getStyle(gridType);
        if (style) {
            color = style.getColor();
        }
        if (!color) {
            color = this.getColor();
        }
        return color;
    }

    /**
     * Set the grid type precision line color
     * 
     * @param gridType
     *            grid type
     * @param color
     *            grid line color
     */
    public setColor(gridType: GridType, color: Color): void {
        this.getOrCreateStyle(gridType).setColor(color);
    }

    /**
     * Get the grid type precision line width
     * 
     * @param gridType
     *            grid type
     * @return grid type line width
     */
    public getWidth(gridType: GridType): number {
        let width = 0;
        let style = getStyle(gridType);
        if (style) {
            width = style.getWidth();
        }
        if (width === 0) {
            width = this.getWidth();
        }
        return width;
    }

    /**
     * Set the grid type precision line width
     * 
     * @param gridType
     *            grid type
     * @param width
     *            grid line width
     */
    public setWidth(gridType: GridType, width: number): void {
        this.getOrCreateStyle(gridType).setWidth(width);
    }

    /**
     * Get the grid labeler
     * 
     * @return grid labeler
     */
    public getLabeler(): GridLabeler {
        return super.getLabeler() as GridLabeler;
    }

    /**
     * Set the grid labeler
     * 
     * @param labeler
     *            grid labeler
     */
    protected setLabeler(labeler: GridLabeler): void {
        super.setLabeler(labeler);
    }

    /**
     * Get the lines for the tile and zone
     * 
     * @param tile
     *            tile
     * @param zone
     *            grid zone
     * @return lines
     */
    public getLines(tile: GridTile, zone: GridZone): GridLine[] {
        return this.getLines(tile.getZoom(), tile.getBounds(), zone);
    }

    /**
     * Get the lines for the zoom, tile bounds, and zone
     * 
     * @param zoom
     *            zoom level
     * @param tileBounds
     *            tile bounds
     * @param zone
     *            grid zone
     * @return lines
     */
    public getLines(zoom: number, tileBounds: Bounds, zone: GridZone): GridLine[] {
        let lines: GridLine[];
        if (this.isLinesWithin(zoom)) {
            lines = this.getLines(tileBounds, zone);
        }
        return lines;
    }

    /**
     * Get the lines for the tile bounds and zone
     * 
     * @param tileBounds
     *            tile bounds
     * @param zone
     *            grid zone
     * @return lines
     */
    public getLines(tileBounds: Bounds, zone: GridZone): GridLine[] {
        return zone.getLines(tileBounds, this.type);
    }

    /**
     * Get the labels for the tile and zone
     * 
     * @param tile
     *            tile
     * @param zone
     *            grid zone
     * @return labels
     */
    public getLabels(tile: GridTile, zone: GridZone): GridLabel[] {
        return this.getLabels(tile.getZoom(), tile.getBounds(), zone);
    }

    /**
     * Get the labels for the zoom, tile bounds, and zone
     * 
     * @param zoom
     *            zoom level
     * @param tileBounds
     *            tile bounds
     * @param zone
     *            grid zone
     * @return labels
     */
    public getLabels(zoom: number, tileBounds: Bounds,
        zone: GridZone): GridLabel[] {
        let labels: GridLabel[];
        if (this.isLabelerWithin(zoom)) {
            labels = this.getLabeler().getLabels(tileBounds, this.type, zone);
        }
        return labels;
    }

    /**
     * {@inheritDoc}
     */
    public compareTo(other: Grid): number {
        return this.getPrecisionCompare() - other.getPrecisionCompare();
    }

    /**
     * Get the precision in meters
     * 
     * @return precision meters
     */
    public getPrecisionCompare(): number {
        let precision = this.getPrecision();
        if (precision <= GridType.GZD) {
            precision = Number.MAX_SAFE_INTEGER;
        }
        return precision;
    }

    /**
     * {@inheritDoc}
     */
    public equals(obj: any): boolean {
        if (this === obj)
            return true;
        if (!obj)
            return false;
        if (typeof this !== typeof obj)
            return false;
        const other = obj as Grid;
        if (this.type !== other.type)
            return false;
        return true;
    }

}

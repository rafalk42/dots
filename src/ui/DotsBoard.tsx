import { Component } from "react"
import { Canvas, MouseEvents, MouseButton } from "./Canvas"


export type GridStyle = {
    lineWidth: number
    lineColor: string
    backgroundColor: string
    lineSpacing: number
    margin: number
}

export type DotsStyle = {
    size: number
}
export type CampStyle = {
    lineWidth: number
    fillAlpha: number
}

export type PointerStyle = {
    thickness: number
    radius: number
}

export type GridGeometry = {
    width: number
    height: number
}

export interface PointerMove {
    (x: number, y: number)
}

export interface PointerOut {
    ()
}

export type PointerEvents = {
    move: PointerMove
    out: PointerOut
}

export type DotsBoardStyle = {
    grid: GridStyle
    geometry: GridGeometry
    dots: DotsStyle
    pointer: PointerStyle
}

export type DotsBoardProps = {
    style: DotsBoardStyle
    dots: Point[]
    pointers: Point[]
    pointerEvents: PointerEvents
}

export type Point = {
    x: number
    y: number
    color: string
}


export class DotsBoard extends Component<DotsBoardProps> {
    mouseEvents: MouseEvents

    constructor(props: DotsBoardProps) {
        super(props)

        this.mouseEvents = {
            move: this.mouseEventMove.bind(this),
            out: this.mouseEventOut.bind(this),
            button: this.mouseEventButton.bind(this)
        }
    }

    drawGrid(ctx: CanvasRenderingContext2D, style: GridStyle, geometry: GridGeometry) {
        ctx.beginPath();

        // vertical lines
        for (let i = 0; i < geometry.width; i++) {
            var x = i * style.lineSpacing + style.margin;
            ctx.moveTo(x, style.margin);
            ctx.lineTo(x, style.lineSpacing * (geometry.height - 1) + style.margin);
        }

        // horizontal lines
        for (let i = 0; i < geometry.height; i++) {
            var y = i * style.lineSpacing + style.margin;
            ctx.moveTo(style.margin, y);
            ctx.lineTo(style.lineSpacing * (geometry.width - 1) + style.margin, y);
        }

        ctx.lineWidth = style.lineWidth
        ctx.strokeStyle = style.lineColor
        ctx.stroke();
    }

    drawDots(ctx: CanvasRenderingContext2D, dots: Point[], gridStyle: GridStyle, dotsStyle: DotsStyle) {
        for (let i = 0; i < dots.length; i++) {
            var point = dots[i];

            var x = point.x * gridStyle.lineSpacing + gridStyle.margin;
            var y = point.y * gridStyle.lineSpacing + gridStyle.margin;

            ctx.beginPath();
            ctx.fillStyle = point.color;
            ctx.arc(x, y, dotsStyle.size, 0, 2 * Math.PI);
            ctx.fill();

            // debug label with coordinates
            ctx.font = "bold 12px Arial";
            ctx.fillStyle = "#000000";
            var text = "" + point.x + "," + point.y;
            ctx.fillText(text, x - 8, y + 4, 16);
        }
    }

    drawPointers(ctx: CanvasRenderingContext2D, pointers: Point[], gridStyle: GridStyle, pointersStyle: PointerStyle) {
        for (let i = 0; i < pointers.length; i++) {
            var pointer = pointers[i];

            var pointerX = pointer.x * gridStyle.lineSpacing + gridStyle.margin;
            var pointerY = pointer.y * gridStyle.lineSpacing + gridStyle.margin;

            ctx.beginPath();
            ctx.strokeStyle = pointer.color;
            ctx.lineWidth = pointersStyle.thickness
            ctx.arc(pointerX, pointerY, pointersStyle.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    draw(ctx: CanvasRenderingContext2D, frameCount: number) {
        // const style = this.props.gridStyle;
        // console.log(style);
        const style = this.props.style
        ctx.fillStyle = style.grid.backgroundColor
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        this.drawGrid(ctx, style.grid, style.geometry)
        this.drawDots(ctx, this.props.dots, style.grid, style.dots)
        this.drawPointers(ctx, this.props.pointers, style.grid, style.pointer)
    }

    mouseEventMove(x: number, y: number) {
        // console.log("X:", x, "Y:", y)

        const style = this.props.style
        const gridStyle = style.grid
        const geometry = style.geometry

        const gridX = Math.min(geometry.width - 1, Math.round((x - gridStyle.margin) / gridStyle.lineSpacing))
        const gridY = Math.min(geometry.height - 1, Math.round((y - gridStyle.margin) / gridStyle.lineSpacing))

        this.props.pointerEvents.move(gridX, gridY)
    }

    mouseEventOut() {
        this.props.pointerEvents.out()
    }

    mouseEventButton(button: MouseButton, down: boolean) {
        console.log("Button", button, down ? "DOWN" : "UP")
    }

    render() {
        return <Canvas draw={this.draw.bind(this)} mouseEvents={this.mouseEvents} id="board" />
    }
}

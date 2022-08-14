import { Component } from "react"
import { DotsBoard, DotsBoardStyle, Point } from './DotsBoard'


interface DotsProps {

}

interface DotsState {
    pointer: {
        in: boolean
        x: number
        y: number
    }
}

export class Dots extends Component<DotsProps, DotsState> {
    constructor(props: DotsProps) {
        console.log("Dots()")
        super(props)

        this.state = {
            pointer: {
                in: false,
                x: 0,
                y: 0
            }
        }
    }

    pointerMove(x: number, y: number) {
        // console.log("Dots::pointerMove():", x + ":" + y)
        if (this.state.pointer.x != x || this.state.pointer.y != y) {
            this.setState({
                pointer: { in: true, x: x, y: y }
            })
        }
    }

    pointerOut() {
        this.setState({
            pointer: { in: false, x: 0, y: 0 }
        })
    }

    render() {
        console.log("Dots::render()")
        const dots: Point[] = [
            { x: 1, y: 1, color: "red" },
            { x: 2, y: 1, color: "blue" },
            { x: 3, y: 1, color: "red" },
            { x: 1, y: 2, color: "red" },
            { x: 1, y: 3, color: "red" }
        ]
        const style: DotsBoardStyle = {
            geometry: {
                width: 5,
                height: 5
            },
            grid: {
                lineWidth: 3,
                lineColor: "#D9F2FF",
                backgroundColor: "#FFFFFF",
                lineSpacing: 40,
                margin: 15
                // base alpha: 0.4,
            },
            dots: {
                size: 6
            },
            pointer: {
                radius: 7,
                thickness: 3
            }
        }


        let pointers: Point[] = [];

        const pointer = this.state.pointer
        if (pointer.in) {
            pointers.push({ x: pointer.x, y: pointer.y, color: "pink" })
        }

        const pointerEvents = {
            move: this.pointerMove.bind(this),
            out: this.pointerOut.bind(this)
        }

        return <DotsBoard style={style} dots={dots} pointers={pointers} pointerEvents={pointerEvents} />
    }
}

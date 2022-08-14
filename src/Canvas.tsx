import * as React from 'react';


interface MouseMoveCallback {
    (x: number, y: number)
}

interface MouseOutCallback {
    ()
}

export enum MouseButton {
    Left = 0,
    Middle,
    Right,
}

interface MouseButtonCallback {
    (button: MouseButton, down: boolean)
}

export interface DrawCallback {
    (context: CanvasRenderingContext2D, frameCount: number)
}

export type MouseEvents = {
    readonly move: MouseMoveCallback
    readonly out: MouseOutCallback
    readonly button: MouseButtonCallback
}

export type CanvasProps = {
    readonly draw: DrawCallback
    readonly mouseEvents: MouseEvents
    readonly id: string
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
    const { width, height } = canvas.getBoundingClientRect()

    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        return true // here you can return some usefull information like delta width and delta height instead of just true
        // this information can be used in the next redraw...
    }

    return false
}

export const Canvas = (props: CanvasProps) => {
    const { draw, mouseEvents, ...rest } = props
    const canvasRef = React.useRef(null)

    function mouseHooks(canvas: HTMLCanvasElement) {
        canvas.addEventListener("mousemove", (event: MouseEvent) => {
            if (!event) {
                return
            }
            if (!(event.target instanceof Element)) {
                return
            }

            let clientRect = event.target.getBoundingClientRect()
            let mouseX: number = event.clientX - clientRect.left;
            let mouseY: number = event.clientY - clientRect.top;
            props.mouseEvents.move(mouseX, mouseY)
        });
        canvas.addEventListener("mouseleave", event => {
            props.mouseEvents.out();
        });
        canvas.addEventListener("mousedown", event => {
            props.mouseEvents.button(event.button, true)
        });
        canvas.addEventListener("mouseup", event => {
            props.mouseEvents.button(event.button, false)
        });
    }

    React.useEffect(() => {
        const canvas: HTMLCanvasElement = canvasRef.current!
        if (!canvas) {
            throw new Error("Canvas is null");
        }
        mouseHooks(canvas);
    }, [])

    React.useEffect(() => {
        const canvas: HTMLCanvasElement = canvasRef.current!
        if (!canvas) {
            throw new Error("Canvas is null");
        }

        const context = canvas.getContext('2d')
        if (!context) {
            return;
        }

        let frameCount: number = 0
        // let animationFrameId: number

        const render = () => {
            frameCount++
            resizeCanvasToDisplaySize(canvas);
            draw(context, frameCount)
            // animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            // window.cancelAnimationFrame(animationFrameId)
            // canvas.removeEventListener("mousemove")
        }
    }, [draw])

    return <canvas ref={canvasRef} {...rest} />
}

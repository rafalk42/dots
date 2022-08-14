import { Component, ReactNode } from 'react';
import { Dots } from './Dots'
import { Menu } from './Menu'


interface TheDotsGameProps {
}

enum State {
    MENU,
    GAME
}

interface TheDotsGameState {
    stage: State
}

export default class TheDotsGame extends Component<TheDotsGameProps, TheDotsGameState> {
    constructor(props: TheDotsGameProps) {
        super(props)

        this.state = {
            stage: State.MENU
        }
    }

    handleClickSingle() {
        console.log("SINGLE")
    }

    renderMenu(): ReactNode {
        const handlers = {
            single: this.handleClickSingle.bind(this),
            multi: () => {},
            settings: () => {}
        }
        return <Menu handleClick={handlers}/>
    }

    renderGame(): ReactNode {
        return <div id="board">
            <Dots />
        </div>
    }

    render() {
        switch (this.state.stage) {
            case State.MENU:
                return this.renderMenu()

            case State.GAME:
                return this.renderGame()
        }
    }
}

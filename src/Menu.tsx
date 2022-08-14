import { Component, ReactNode } from 'react';



interface Handler {
    ()
}

interface MenuProps {
    handleClick: {
        single: Handler
        multi: Handler
        settings: Handler
    }
}

interface MenuState {
}

export class Menu extends Component<MenuProps, MenuState> {
    render() {
        const s = this.props.handleClick.single.bind(this)

        return <ol className='menu'>
            <li onClick={s}>Single</li>
            <li>Multi</li>
            <li>Settings</li>
        </ol>
    }
}

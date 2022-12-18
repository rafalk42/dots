export type DotsGameState = {
    players: {
        dots: {
            x: number;
            y: number;
        }[];
        bases: {
        }[];
    }[]
}

export class DotsGameModel {
    readonly players: number[];
    playerIndex: number;
    // constructors:
    // () default - empty state
    // (DotsGameState) - load state
    constructor(state?: DotsGameState) {
        if(state) {

        }
        this.players = [1, 2];
        this.playerIndex = 0;
    };

    // play:
    // nextPlayer
    // isLegalDot
    // isLegalBase
    // placeDot
    // placeBase
    nextPlayer() {
        this.playerIndex++;
        if(this.playerIndex >= this.players.length) {
            this.playerIndex = 0;
        }
    }

    getPlayer() {
        return this.players[this.playerIndex];
    }

    // game state:
    // getState
    // 
}
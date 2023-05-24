const config = {
    initialState: 'stand',
    states: {
        stand: {
            transitions: {
                ArrowRight: 'walk',
                ArrowUp: 'jump',
                [' ']: 'attack',
                ArrowDown: 'squat',
            }
        },
        move: {
            initialState: 'walk',
            transitions: {
                ArrowLeft: 'stand',
            },
            states: {
                walk: {
                    entry: 'WALK_TIMER',
                    transitions: {
                        Shift: 'run',
                        TIMEOUT: 'stand',
                    }
                },
                run: {
                    entry: 'TIMER',
                    transitions: {
                        Shift: 'walk',
                    }
                },
            }
        },
        jump: {
            entry: 'JUMP_TIMER',
            transitions: {
                JUMP_TIMEOUT: 'stand',
            }
        },
        squat: {
            transitions: {
                ArrowUp: 'stand',
            }
        },
        attack: {
            entry: 'ATTACK_TIMER',
            transitions: {
                ATTACK_TIMEOUT: 'stand',
            }
        }
    }
}

const effects = (transition) =>  ({
    ATTACK_TIMER: () => {
        const id = setTimeout(() => {
            transition('ATTACK_TIMEOUT');
        }, 1000)

        return () => {
            clearTimeout(id);
        }
    },
    JUMP_TIMER: () => {
        const id = setTimeout(() => {
            transition('JUMP_TIMEOUT');
        }, 2000);

        return () => {
            clearTimeout(id);
        }
    },
    WALK_TIMER: () => {
        const id = setTimeout(() => {
            transition('TIMEOUT');
        }, 4000);

        return () => {
            clearTimeout(id);
        }
    }
})



class Game {
    constructor() {
        this.ui = new GameUI();

        this.ui.onKeyBoardEvent(this.handleKeyBoardEvent.bind(this));

        this.machine = new Machine(config);
        this.machine.addEffects(effects);
        this.machine.onChange(this.handleStateChange.bind(this));

        this.ui.render(this.machine.state)
    }

    handleKeyBoardEvent(event) {
        this.machine.transition(event);
    }

    handleStateChange(newState) {
        this.ui.render(newState);
    }
}

new Game();

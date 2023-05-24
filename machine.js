class Machine {
    constructor(config) {
        this.config = config;

        const initialState = this.getNextState(config.initialState, config.states);
        this.state = initialState.name;
        this.traverse(this.config.states, []);
    }

    traverse(states, path) {
        for (const [key, value] of Object.entries(states)) {
            const currentPath = [...path, key];
            value.path = currentPath
            if (value.states) {
                this.traverse(value.states, currentPath)
            }
        }
    }

    getNode(name, states) {
        for (const [key, node] of Object.entries(states)) {
            if (key === name) {
                return node;
            } else if (node.states) {
                const res = this.getNode(name, node.states)

                if (res) {
                    return res;
                }
            }
        }
    }

    getNextState(name, states) {
        const node = this.getNode(name, states)

        if (node?.initialState) {
            return this.getNextState(node.initialState, node.states);
        } else {
            return {name, node};
        }
    }

    getTransition(name, current) {
        for (const key of current.path) {
            const node = this.getNode(key, this.config.states);
            const nextName = node?.transitions[name];
            if (nextName) {
                return nextName;
            }
        }
    }

    transition(name) {
        const current = this.getNode(this.state, this.config.states);

        const nextName = this.getTransition(name, current);

        const nextState = this.getNextState(nextName, this.config.states);

        if (nextState.name) {
            this.state = nextState.name;

            this.runEffect(nextState.node);

            this.listener?.(this.state);
        }
    }

    runEffect(node) {
        const effectName = node.entry;

        if (effectName) {
            const effect = this.effects?.[effectName];

            const cleanup = this.effectCleanUps.get(effectName);
            cleanup?.();

            const newCleanUp = effect?.();
            this.effectCleanUps.set(effectName, newCleanUp);
        }
    }
    addEffects(effectCreator) {
        this.effects = effectCreator(this.transition.bind(this));
        this.effectCleanUps = new Map();
    }

    onChange(callback) {
        this.listener = callback;
    }
}

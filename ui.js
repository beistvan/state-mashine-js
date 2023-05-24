class GameUI {
    constructor() {
        this.character = document.getElementById('character');
        document.addEventListener("keydown", this.handleKeyBoardEvent.bind(this));
    }

    render(state) {
        this.character.innerHTML = `<img id="${state}" src="assets/${state}.gif?${new Date()}">`
    }

    handleKeyBoardEvent(event) {
        console.log(event.key)
        this.listener?.(event.key);
    }

    onKeyBoardEvent(callback) {
        this.listener = callback;
    }
}

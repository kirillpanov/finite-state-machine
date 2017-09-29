class FSM {
    constructor(config) {
        if (!config) {
            throw new Error('config is not definied. Set up the config');
        };
        this.config = config;
        this.states = config.states;
        this.state = config.initial;
        this.stateLogForUndo = [this.config.initial];
        this.stateLogForRedo = [];
    }
    getState() {
        return this.state;
    }

    changeState(state) {
        for (let key in this.config.states) {
            if ( key == state ) {
                this.stateLogForUndo.push(state);
                this.stateLogForRedo = [];
                return this.state = state;
            };
        };
        throw new Error('state does not exist. Check up the state');
    }

    trigger(event) {
        let _currentState;
        let _stateToSet;
        _currentState = this.getState();
        _stateToSet = this.states[_currentState].transitions[event];
        this.changeState(_stateToSet);
    }

    reset() {
        this.state = this.config.initial;
    }

    getStates(event) {
        let _states = [];
        if (!event) {
            for (let key in this.config.states) {
                _states.push(key); 
            }
        } else {
            for (let key in this.states) {
                if ( this.states[key].transitions[event])
                _states.push(key); 
            }
        }
        return _states;
    }

    undo() {
        let _length = this.stateLogForUndo.length
        let _stateToSet;
        if (_length<=1) {
            return false;
        };
        _stateToSet = this.stateLogForUndo.splice(-2,2);
        this.state = _stateToSet[0];
        this.stateLogForUndo.push(_stateToSet[0]);
        this.stateLogForRedo.push(_stateToSet[1]);
        return true;
    }

    redo() {
        let _length = this.stateLogForRedo.length
        let _stateToSet;
        if (_length<1) {
            return false;
        };
        _stateToSet = this.stateLogForRedo.pop();
        this.stateLogForUndo.pop();
        this.state = _stateToSet;
        return true;
    }

    clearHistory() {
        this.stateLogForUndo = [this.config.initial];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/

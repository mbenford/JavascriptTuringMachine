function TuringMachine() {
}

TuringMachine.prototype = {
	setStates: function(states) {
		this._states = states.split("");
	},
	
	setInputSymbols: function(symbols) {
		this._inputSymbols = symbols.split("");
	},
	
	setInitialState: function(state) {
		this._initialState = state;
	},
	
	setFinalStates: function(states) {
		this._finalStates = states.split("");
	},
	
	setTransitionTable: function(table) {
		this._table = table;
	},
	
	run: function(input) {		
		this._tape = input.split("");
		this._currentState = this._initialState;
		this._currentPosition = 0;
		
		while (!this._isInFinalState()) {
			this._currentSymbol = this._getCurrentSymbol();
			
			var nextState = this._getNextState();
			var nextSymbol = this._getNextSymbol();
			
			if (nextSymbol == "<=") this._moveLeft();
			else if (nextSymbol == "=>") this._moveRight();
			else this._write(nextSymbol);
			
			this._currentSymbol = nextSymbol;
			this._currentState = nextState;
		}
		
		return this._tape;
	},
	
	_getCurrentSymbol: function() {
		return this._tape[this._currentPosition];
	},
	
	_getNextState: function() {
		return this._table.get(this._currentState, this._currentSymbol).split(",")[0];
	},
	
	_getNextSymbol: function() {
		return this._table.get(this._currentState, this._currentSymbol).split(",")[1];
	},
	
	_moveLeft: function() {
		this._currentPosition--;
		if (this._currentPosition < 0) this._currentPosition = 0;
	},
	
	_moveRight: function() {
		this._currentPosition++;
		if (this._tape.length < this._currentPosition) this._tape.push("");
	},
	
	_write: function(symbol) {
		this._tape[this._currentPosition] = symbol;
	},
	
	_isInFinalState: function() {
		return this._finalStates.indexOf(this._currentState) != -1;
	}
}

function TransitionTable() {
	this._table = new Array();
}

TransitionTable.prototype = {
	add: function(state, symbol, newState, newSymbol) {
		this._table[this._getKey(state, symbol)] = newState + "," + newSymbol;
	},
	
	get: function(state, symbol) {
		return this._table[this._getKey(state, symbol)];
	},
	
	_getKey: function(state, symbol) {
		return state + "->" + symbol;
	}
}
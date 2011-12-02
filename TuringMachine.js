function TuringMachine() {
}

TuringMachine.prototype = {
	setStates: function(states) {
		this._states = this._removeSpaces(states).split("");
	},
	
	setInputSymbols: function(symbols) {
		this._inputSymbols = this._removeSpaces(symbols).split("");
	},
	
	setInitialState: function(state) {
		this._initialState = this._removeSpaces(state);
	},
	
	setFinalStates: function(states) {
		this._finalStates = this._removeSpaces(states).split("");
	},
	
	setTransitions: function(transitions) {
		var table = new TransitionTable();
		
		for (t in transitions) {
			var elements = this._removeSpaces(transitions[t]).split(",");
			var state = elements[0];
			var symbol = elements[1];
			var nextState = elements[2];
			var nextSymbol = elements[3];
			
			table.add(state, symbol, nextState, nextSymbol);
		}
		
		this._table = table;
	},
	
	setTape: function(tape) {
		this._tape = tape.split("");
	},
	
	getTape: function() {
		return this._tape.toString().replace(/,/g, "");
	},
	
	_removeSpaces: function(s) {
		return s.replace(/ /g, "");
	},
	
	run: function() {
		this._currentState = this._initialState;
		this._currentPosition = 0;
		
		while (!this._isInFinalState()) {
			this._currentSymbol = this._getCurrentSymbol();
			
			var nextStateAndChar = this._getNextStateAndChar();
			if (nextStateAndChar == null) break;
			
			var nextState = nextStateAndChar[0];
			var nextSymbol = nextStateAndChar[1];
			
			if (nextSymbol == "<<") this._moveLeft();
			else if (nextSymbol == ">>") this._moveRight();
			else this._write(nextSymbol);
						
			this._currentState = nextState;
		}
	},
	
	_getCurrentSymbol: function() {
		return this._tape[this._currentPosition];
	},
	
	_getNextStateAndChar: function() {		
		return this._table.get(this._currentState, this._currentSymbol);
	},
	
	_moveLeft: function() {
		this._currentPosition--;
		if (this._currentPosition < 0) this._currentPosition = 0;
	},
	
	_moveRight: function() {
		this._currentPosition++;
		if (this._tape.length < this._currentPosition) this._tape.push("_");
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
		this._table[this._getKey(state, symbol)] = [newState, newSymbol];
	},
	
	get: function(state, symbol) {
		return this._table[this._getKey(state, symbol)];
	},
	
	_getKey: function(state, symbol) {
		return state + "->" + symbol;
	}
}
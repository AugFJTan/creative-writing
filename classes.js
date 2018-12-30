class StoryElement {
	constructor(name, description) {
		this._name = name;
		this._description = description;
	}
	
	getName() {
		return this._name;
	}
	
	getDescription() {
		return this._description;
	}
	
	setDescription(text) {
		this._description = text;
	}
}

class StoryText extends StoryElement {
	constructor(name, description) {
		super(name, description);
	}
	
	includes(substring) {
		return super.getDescription().includes(substring);
	}
	
	replace(old_text, new_text) {
		super.setDescription(super.getDescription().replace(old_text, new_text));
	}
}

class Paragraph extends StoryText {
	constructor(name, description) {
		super(name, description);
	}
}

class Choice extends StoryText {
	constructor(name, description, outcomes) {
		super(name, description);
		this._outcomes = outcomes;
	}
	
	getOutcomes() {
		return this._outcomes;
	}
}

class Outcome {
	constructor(label, callback) {
		this._label = label;
		this._callback = callback;
	}
	
	getLabel() {
		return this._label;
	}
	
	getCallback() {
		return this._callback;
	}
}

class Friend extends StoryElement {
	constructor(name, description, bio, home) {
		super(name, description);
		this._bio = bio;
		this._home = home;
	}
	
	getBio() {
		return this._bio;
	}
	
	getHome() {
		return this._home;
	}
}

class Location extends StoryElement {
	constructor(name, description, gifts) {
		super(name, description);
		this._gifts = gifts;
	}
	
	getGifts() {
		return this._gifts;
	}
}

class Gift extends StoryElement {
	constructor(name, description, points) {
		super(name, description);
		this._points = points;
	}
	
	getPoints() {
		return this._points;
	}
}

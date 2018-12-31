class StoryElement {
	constructor(name, description) {
		this._name = name;
		this._description = description;
	}
	
	getName() {
		return this._name;
	}
	
	setName(name) {
		this._name = name;
	}
	
	getDescription() {
		return this._description;
	}
	
	setDescription(description) {
		this._description = description;
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
		this._complete = false;
	}
	
	getOutcomes() {
		return this._outcomes;
	}
	
	setComplete() {
		this._complete = true;
	}
	
	isComplete() {
		return this._complete;
	}
}

class Outcome extends StoryText {
	constructor(name, description) { // Technically label and callback respectively
		super(name, description);
	}
	
	includes(substring) {
		return super.getName().includes(substring);
	}
	
	replace(old_text, new_text) {
		super.setName(super.getName().replace(old_text, new_text));
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

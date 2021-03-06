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
	constructor(name, description, options) {
		super(name, description);
		this._options = options;
	}
	
	getOptions() {
		return this._options;
	}
}

class Option extends StoryText {
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
	constructor(name, description, gender, bio, home, script) {
		super(name, description);
		this._gender = gender;
		this._bio = bio;
		this._home = home;
		this._script = script;
	}
	
	getGender() {
		return this._gender;
	}
	
	getBio() {
		return this._bio;
	}
	
	getHome() {
		return this._home;
	}
	
	getScript() {
		return this._script;
	}
}

class Location extends StoryElement {
	constructor(name, description, browse, gift_type, gifts) {
		super(name, description);
		this._browse = browse;
		this._gift_type = gift_type;
		this._gifts = gifts;
	}
	
	getBrowse() {
		return this._browse;
	}
	
	getGiftType() {
		return this._gift_type;
	}
	
	getGifts() {
		return this._gifts;
	}
}

class Gift extends StoryElement {
	constructor(name, description, alias) {
		super(name, description);
		this._alias = alias;
	}
	
	getAlias() {
		return this._alias;
	}
}

var story = document.getElementById("story");

var friends = [];
var locations = [];
var thoughts = null;

var script = [];

var values = {}; // Variable for key-value pairs
var visit = {};  // Variable for user choice objects

var current_choice = null;
var word_count = 0;

var reaction = { "NEGATIVE" : 0, "NEUTRAL"  : 1, "POSITIVE" : 2, "SPECIAL" : 3};

loadFile("data.json", loadData);
loadFile("script.json", loadScript);

run();

function loadFile(file, callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var json = JSON.parse(this.responseText);
			callback(json);
		}
	};
	xhttp.open("GET", file, false);
	xhttp.send();
}

function loadData(json) {
	var f = json.friends;
	var l = json.locations;
	
	for (var i = 0; i < f.length; i++) {
		friends.push(new Friend(f[i].name, f[i].description, f[i].gender, f[i].bio, f[i].home, f[i].script));
		
		values["[friend-" + (i+1) + "]"] = f[i].name;
		values["[friend-" + (i+1) + "-desc]"] = f[i].description;
	}
	
	for (var i = 0; i < l.length; i++) {
		var g = l[i].gifts;
		var gifts = []
		
		for (var j = 0; j < g.length; j++)
			gifts.push(new Gift(g[j].name, g[j].description, g[j].alias));
		
		locations.push(new Location(l[i].name, l[i].description, l[i].browse, l[i].gift_type, gifts));
		
		values["[location-" + (i+1) + "]"] = l[i].name;
	}
	
	thoughts = json.thoughts;
}

function loadScript(json) {
	for (var i = 0; i < json.length; i++) {
		if (json[i].name === "normal-text")
			script.push(new Paragraph(json[i].name, json[i].description));
		else {
			var o = json[i].options;
			var options = [];
			
			for (var j = 0; j < o.length; j++)
				options.push(new Option(o[j].label, o[j].callback));
			
			script.push(new Choice(json[i].name, json[i].description, options));
		}
	}
	script = script.reverse(); // Make array a FIFO stack
}

function createParagraphWithText(text) {
	return createTagText("p", text);
}

function createTagText(tag, text) {
	var element = document.createElement(tag);
	element.appendChild(document.createTextNode(text));
	return element;
}

function appendParagraph(paragraph, scroll) {
	updateWordCount(paragraph);
	story.appendChild(paragraph);
	if (scroll)
		paragraph.scrollIntoView();
}

function appendChoice(choice) {
	var list = document.createElement("ol");
	list.setAttribute("type", "A");
	
	var p = createParagraphWithText(choice.getDescription());
	p.setAttribute("style", "font-weight:bold");
	appendParagraph(p, false);
	
	for (var i = 0; i < choice.getOptions().length; i++) {
		var item = document.createElement("li");
		
		updateStoryText(choice.getOptions()[i]); // Update label
		
		var option = createTagText("div", choice.getOptions()[i].getName());
		option.setAttribute("id", choice.getName() + "-" + (i+1));
		option.setAttribute("class", "link");
		
		option.setAttribute("onclick", choice.getOptions()[i].getDescription()); // Set callback
		
		item.appendChild(option);
		list.appendChild(item);
	}
	
	story.appendChild(list);
	
	current_choice = choice;
}

function run() {
	var scroll = true;
	
	while(script.length > 0 && script[script.length-1] instanceof Paragraph) {
		updateStoryText(script[script.length-1]);
		appendParagraph(createParagraphWithText(script.pop().getDescription()), scroll);
		scroll = false;
	}
	
	if (script.length > 0) { // Display choice
		updateStoryText(script[script.length-1]);
		appendChoice(script.pop());
	} else
		displayFinalWordCount();
}

function updateStoryText(story_text) {
	// Replace text using key-value pair
	for (var key in values)
		if (story_text.includes(key))
			story_text.replace(key, values[key]);
	
	// Special regex case
	if (visit.friend != null) {
		if (story_text.includes("[friend]"))
			story_text.replace(/\[friend\]/g, visit.friend.getName()); // Global regex literal
	}
}

function showOutcome(choice, result) {
	var selected = result.charCodeAt(0) - 'A'.charCodeAt(0);
	
	// Side effects
	switch (choice) {
		case 1:
			visit.friend = friends[selected]; // Select friend to visit
			values["[him/her]"] = (visit.friend.getGender() === "male") ? "him" : "her";
			values["[bio]"] = visit.friend.getBio();
			values["[home]"] = visit.friend.getHome();
			break;
		case 2:
			visit.location = locations[selected];
			values["[location]"] = visit.location.getName();
			values["[location-desc]"] = visit.location.getDescription();
			values["[browse]"] = visit.location.getBrowse();
			values["[gift-type]"] = visit.location.getGiftType();
			for (var i = 0; i < visit.location.getGifts().length; i++)
				values["[gift-" + (i+1) + "]"] = visit.location.getGifts()[i].getName();
			break;
		case 3:
			visit.gift = visit.location.getGifts()[selected];
			values["[gift-desc]"] = visit.gift.getDescription();
			values["[gift-alias]"] = visit.gift.getAlias();
			for (var i = 0; i < visit.friend.getScript().length-2; i++) {
				var friend_script = visit.friend.getScript()[i];
				values["[" + friend_script.name + "]"] = friend_script.description;
			}
			visit.reaction = null;
			if (visit.friend.getName() === "Tiffany") { // Tiffany likes cooking and knick-knacks
				if (visit.location.getGiftType() === "knick-knacks")
					visit.reaction = reaction.POSITIVE;
				else if (visit.gift.getAlias() === "cookbook")
					visit.reaction = reaction.SPECIAL;
				else if (visit.location.getGiftType() === "food and drinks")
					visit.reaction = reaction.NEUTRAL;
				else
					visit.reaction = reaction.NEGATIVE;
			} else if (visit.friend.getName() === "Bryan") { // Bryan likes to read
				if (visit.location.getGiftType() === "books")
					visit.reaction = reaction.POSITIVE;
				else if (visit.gift.getAlias() === "alarm clock")
					visit.reaction = reaction.SPECIAL;
				else if (visit.location.getGiftType() === "food and drinks")
					visit.reaction = reaction.NEUTRAL;
				else
					visit.reaction = reaction.NEGATIVE;
			} else { // Ellie likes food
				if (visit.location.getGiftType() === "food and drinks")
					visit.reaction = reaction.POSITIVE;
				else if (visit.gift.getAlias() === "cookbook")
					visit.reaction = reaction.SPECIAL;
				else if (visit.location.getGiftType() === "books")
					visit.reaction = reaction.NEUTRAL;
				else
					visit.reaction = reaction.NEGATIVE;
			}
			for (var i = visit.friend.getScript().length-2; i < visit.friend.getScript().length; i++) {
				var final_outcomes = visit.friend.getScript()[i];
				var outcome_text = new Paragraph(final_outcomes.name, final_outcomes.outcomes[visit.reaction]);
				updateStoryText(outcome_text);
				values["[" + outcome_text.getName() + "]"] = outcome_text.getDescription();
			}
			var thought_text = null;
			if (visit.reaction == reaction.NEGATIVE)
				thought_text = thoughts[0];
			else if (visit.reaction == reaction.NEUTRAL)
				thought_text = thoughts[1];
			else
				thought_text = thoughts[2];
			var final_thoughts = new Paragraph("", thought_text);
			updateStoryText(final_thoughts);
			values["[thoughts]"] = final_thoughts.getDescription();
			break;
		default:
			// Do nothing
	}
	
	for (var i = 0; i < current_choice.getOptions().length; i++) {
		var link = document.getElementById("choice-" + choice + "-" + (i+1));
		link.removeAttribute("class");
		link.removeAttribute("onclick");
		
		if (i == selected) {
			link.setAttribute("style", "font-weight:bold; color:blue"); // Highlight selected option
			updateWordCount(link);                                      // Include selected option in word count
		}
	}
	
	run();
}

function updateWordCount(element) {
	word_count += element.innerHTML.split(' ').length;
}

function displayFinalWordCount() {
	var p = createParagraphWithText("(" + word_count + " words)");
	p.style = "text-align: right";
	story.appendChild(p);
}

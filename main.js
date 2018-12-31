var story = document.getElementById("story");

var friends = [];
var locations = [];
var script = [];

var friend_visit = null;

var current_choice = null;
var script_index = 0;
var word_count = 0;

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
	
	for (var i = 0; i < f.length; i++)
		friends.push(new Friend(f[i].name, f[i].description, f[i].gender, f[i].bio, f[i].home));
	
	for (var i = 0; i < l.length; i++) {
		var g = l[i].gifts;
		var gifts = []
		
		for (var j = 0; j < g.length; j++)
			gifts.push(new Gift(g[j].name, g[j].description, g[j].points));
		
		locations.push(new Location(l[i].name, l[i].description, gifts));
	}
}

function loadScript(json) {
	for (var i = 0; i < json.length; i++) {
		if (json[i].name === "normal-text")
			script.push(new Paragraph(json[i].name, json[i].description));
		else {
			var o = json[i].outcomes;
			var outcomes = [];
			
			for (var j = 0; j < o.length; j++)
				outcomes.push(new Outcome(o[j].label, o[j].callback));
			
			script.push(new Choice(json[i].name, json[i].description, outcomes));
		}
	}
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
	
	for (var i = 0; i < choice.getOutcomes().length; i++) {
		var item = document.createElement("li");
		
		updateStoryText(choice.getOutcomes()[i]); // Update label
		
		var outcome = createTagText("div", choice.getOutcomes()[i].getName());
		outcome.setAttribute("id", choice.getName() + "-" + (i+1));
		outcome.setAttribute("class", "link");
		
		outcome.setAttribute("onclick", choice.getOutcomes()[i].getDescription()); // Set callback
		
		item.appendChild(outcome);
		list.appendChild(item);
	}
	
	story.appendChild(list);
	
	current_choice = choice;
}

function run() {
	var scroll = true;
	
	while(script[script_index] instanceof Paragraph && script_index <= script.length - 1) {
		updateStoryText(script[script_index]);
		appendParagraph(createParagraphWithText(script[script_index].getDescription()), scroll);
		scroll = false;
		script_index++;
	}
	
	if (script_index <= script.length - 1) {
		updateStoryText(script[script_index]);
		appendChoice(script[script_index]);
		script_index++;
	} else
		displayFinalWordCount();
}

function updateStoryText(story_text) {
	for (var i = 0; i < friends.length; i++) {
		if (story_text.includes("[friend-" + (i+1) + "]"))
			story_text.replace("[friend-" + (i+1) + "]", friends[i].getName());
		
		if (story_text.includes("[friend-" + (i+1) + "-desc]"))
			story_text.replace("[friend-" + (i+1) + "-desc]", friends[i].getDescription());
	}
	
	if (friend_visit != null) {
		if (story_text.includes("[friend]"))
			story_text.replace(new RegExp("\\[friend\\]", "g"), friend_visit.getName()); // Use global regex to replace multiple matches
		
		if (story_text.includes("[bio]"))
			story_text.replace("[bio]", friend_visit.getBio());
		
		if (story_text.includes("[him/her]")) {
			var pronoun = (friend_visit.getGender() === "male") ? "him" : "her";
			story_text.replace("[him/her]", pronoun);
		}
	}
	
	for (var i = 0; i < locations.length; i++) {
		if (story_text.includes("[location-" + (i+1) + "]"))
			story_text.replace("[location-" + (i+1) + "]", locations[i].getName());
	}
}

function showOutcome(index, result) {
	var selected = result.charCodeAt(0) - 'A'.charCodeAt(0);
	index -= 1;
	
	// Side effects
	if (index == 0)                       // Choice 1
		friend_visit = friends[selected]; // Select friend to visit
	
	for (var i = 0; i < current_choice.getOutcomes().length; i++) {
		var link = document.getElementById("choice-" + (index+1) + "-" + (i+1));
		link.removeAttribute("class");
		link.removeAttribute("onclick");
		
		// Highlight selected outcome
		if (i == selected)
			link.setAttribute("style", "font-weight:bold; color:blue");
	}
	
	run();
}

function updateWordCount(paragraph) {
	word_count += paragraph.innerHTML.split(' ').length;
}

function displayFinalWordCount() {
	var p = createParagraphWithText("(" + word_count + " words)");
	p.style = "text-align: right";
	story.appendChild(p);
}

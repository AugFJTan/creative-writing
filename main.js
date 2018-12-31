var story = document.getElementById("story");

var friends = [];
var locations = [];
var script = [];

var visit = null;

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
		friends.push(new Friend(f[i].name, f[i].description, f.bio, f.home));
	
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

function createParagraph() {
	return document.createElement("p");
}

function createParagraphWithText(text) {
	var p = createParagraph();
	var t = createText(text);
	p.appendChild(t);
	return p;
}

function createText(text) {
	return document.createTextNode(text);
}

function createTagText(tag, text) {
	var element = document.createElement(tag);
	element.appendChild(document.createTextNode(text));
	return element;
}

function appendParagraph(paragraph) {
	updateWordCount(paragraph);
	story.appendChild(paragraph);
	paragraph.scrollIntoView();
}

function appendChoice(choice) {
	var list = document.createElement("ol");
	list.setAttribute("type", "A");
	
	var p = createParagraphWithText(choice.getDescription());
	p.setAttribute("style", "font-weight:bold");
	appendParagraph(p);
	
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
	list.scrollIntoView();
	
	current_choice = choice;
}

function run() {
	while(script[script_index] instanceof Paragraph && script_index <= script.length - 1) {
		updateStoryText(script[script_index]);
		appendParagraph(createParagraphWithText(script[script_index].getDescription()));
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
	
	if (story_text.includes("[friend]"))
		if (visit != null)
			story_text.replace("[friend]", visit.getName());
}

function showOutcome(index, result) {
	var selected = null;
	index -= 1;
	
	switch(result) {
		case 'A':
			selected = 0;
			break;
		case 'B':
			selected = 1;
			break;
		case 'C':
			selected = 2;
			break;
		case 'D':
			selected = 3;
			break;
		default:
			selected = 0;
	}
	
	// Side effects
	if (index == 0)                // Choice 1
		visit = friends[selected]; // Select friend to visit
	
	for (var i = 0; i < current_choice.getOutcomes().length; i++) {
		var link = document.getElementById("choice-" + (index+1) + "-" + (i+1));
		link.removeAttribute("class");
		link.removeAttribute("onclick");
		
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
	p.scrollIntoView();
}

var story = document.getElementById("story");

var friends = [];
var locations = [];
var script = [];
var choices = [false, false, false];

var visit = null;

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
}

function appendChoice(choice) {
	var list = document.createElement("ol");
	list.setAttribute("type", "A");
	
	appendParagraph(createParagraphWithText(choice.getDescription()));
	
	for (var i = 0; i < choice.getOutcomes().length; i++) {
		var item = document.createElement("li");
		var outcome = createTagText("a", choice.getOutcomes()[i].getLabel());
		
		outcome.setAttribute("href", "#!");
		outcome.setAttribute("onclick", choice.getOutcomes()[i].getCallback());
		
		item.appendChild(outcome);
		list.appendChild(item);
	}
	
	story.appendChild(list);
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
	if (story_text.includes("[friend]")) {
		if (visit != null)
			story_text.replace("[friend]", visit.getName());
	}
}

function choice1Result(result) {
	if (!choices[0]) {
		visit = friends[result];
		choices[0] = true;
		run();
	}
}

function updateWordCount(paragraph) {
	word_count += paragraph.innerHTML.split(' ').length;
}

function displayFinalWordCount() {
	var p = createParagraphWithText("(" + word_count + " words)");
	p.setAttribute("align", "right");
	story.appendChild(p);
}

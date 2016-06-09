var stats = {
	"emojisfixed": 0,
	"emojisignored": 0,
	"nodesprocessed": 0,
	"imagesprocessed": 0,
	"spansprocessed": 0,
	"mutationsdetected": 0
}

var observer = new MutationObserver(function(mutations) {
	stats.mutationsdetected += 1;
	mutations.forEach(function(mutation) {
		for (var i = 0; i < mutation.addedNodes.length; i++){
			var node = mutation.addedNodes[i];
			processNode(node);
			stats.nodesprocessed += 1;
		}
	})
});
observer.observe(document, { attributes: true, subtree: true, childList: true });

function processNode(node){
	if(node.tagName == "IMG"){
		updateEmojiImage(node);
	}else if(node.tagName == "SPAN"){
		updateEmojiChar(node);
	}
	if(node.getElementsByTagName){
		var images = node.getElementsByTagName("img");
		var spans = node.getElementsByTagName("span");
		for(var i=0; i<images.length; i++){
			updateEmojiImage(images[i]);
		}
		for(var j=0; j<spans.length; j++){
			updateEmojiChar(spans[j]);
		}
	}
}

function updateEmojiImage(img){
	stats.imagesprocessed += 1;
	if(!img.src || img.src.substring(0,45) != "https://static.xx.fbcdn.net/images/emoji.php/"){
		return;
	}
	var hex = img.src.split("/")[9].slice(0, -4);
	hex = emojiMap[hex] || hex;
	if(hexes.indexOf(hex) != -1){
		img.src = chrome.extension.getURL("emojis/emoji_" + hex + "_64.png");
		stats.emojisfixed += 1;
	}else{
		stats.emojisignored += 1;
	}
}

function updateEmojiChar(c){
	stats.spansprocessed += 1;
	if(!c.style || !c.style.backgroundImage || c.style.backgroundImage.substring(0,50) != 'url("https://static.xx.fbcdn.net/images/emoji.php/'){
		return;
	}
	var hex = c.style.backgroundImage.split("/")[9].slice(0, -6);
	hex = emojiMap[hex] || hex;
	if(hexes.indexOf(hex) != -1){
		var newurl = chrome.extension.getURL("emojis/emoji_" + hex + "_64.png");
		c.style.backgroundImage = 'url("' + newurl + '")';
		stats.emojisfixed += 1;
	}else{
		stats.emojisignored += 1;
	}
}

var images = document.getElementsByTagName("img");
var spans = document.getElementsByTagName("span");
for(var i=0; i<images.length; i++){
	updateEmojiImage(images[i]);
}
for(var j=0; j<spans.length; j++){
	updateEmojiChar(spans[j]);
}

console.log("Loaded FB Emoji Fix");

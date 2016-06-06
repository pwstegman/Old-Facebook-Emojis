var observeDOM = (function(){
    var MutationObserver = window.MutationObserver;
    return function(obj, callback){
		var obs = new MutationObserver(function(mutations, observer){
			if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
				callback();
		});
		obs.observe( obj, { childList:true, subtree:true });
	}
})();

function updateEmojis(elm){
	var images = elm.getElementsByTagName("img");
	for(var i=0; i<images.length; i++){
		var img = images[i];
		if(img.src.substring(0,45) == "https://static.xx.fbcdn.net/images/emoji.php/"){
			var hex = img.src.split("/")[9].slice(0, -4);
			if(typeof(emojiMap[hex]) !== "undefined"){
				hex = emojiMap[hex];
			}
			if(hexes.indexOf(hex) != -1){
				var newurl = chrome.extension.getURL("emojis/emoji_" + hex + "_64.png");
				img.src = newurl;
			}else{
				console.log("Unable to find matching emoji for", img.src);
			}
		}
	}
	
	var chars = elm.getElementsByClassName("_21wj");
	for(var i=0; i<chars.length; i++){
		var c = chars[i];
		if(c.style.backgroundImage.substring(0,50) == 'url("https://static.xx.fbcdn.net/images/emoji.php/'){
			var hex = c.style.backgroundImage.split("/")[9].slice(0, -6);
			if(typeof(emojiMap[hex]) !== "undefined"){
				hex = emojiMap[hex];
			}
			if(hexes.indexOf(hex) != -1){
				var newurl = chrome.extension.getURL("emojis/emoji_" + hex + "_64.png");
				c.style.backgroundImage = 'url("' + newurl + '")';
			}else{
				console.log("Unable to find matching emoji for", c.style.backgroundImage);
			}
		}
	}
	
	console.log("Fixed emojis");
}

updateEmojis(document);

observeDOM( document ,function(){ 
	updateEmojis(document);
});

console.log("Loaded FB Emoji Fix");

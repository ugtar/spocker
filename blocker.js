function insert_shim(elem) {
	var parentNode = elem.parentNode;
	var shim = document.createElement('div');
	shim.className = "blocker-shim";
	shim.innerText = "Click to show spoiler!";
	shim.onclick = function() {
		shim.style.display = "none";
		elem.style.display = "block";
	};
	parentNode.insertBefore(shim, elem);
}

function hide_spoilers() {
	var potential_spoilers = document.getElementsByClassName("userContent");
	for (var pt in potential_spoilers) {
		block_str = localStorage['blocks'];
		if (!block_str)
			return;
		var offending = new RegExp('.*' + block_str + '.*', 'i');
		elem = potential_spoilers[pt];
		if (elem.previousSibling && elem.previousSibling.className == "blocker-shim")
			continue;
		if (offending.test(elem.innerText)) {
			insert_shim(elem);
			elem.style.display = "none";
		}
	}
}

var stream_elem = document.getElementById("home_stream");
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(hide_spoilers);
var config = {childList: true};
observer.observe(stream_elem, config);
hide_spoilers();

function clear_blocks() {
	blocker_shims = document.getElementsByClassName("blocker-shim");
	for (bs in blocker_shims) {
		blocker_shim = blocker_shims[bs];
		blocked = blocker_shim.nextSibling;
		shims_parent = blocker_shim.parentNode;
		if (blocked)
			blocked.style.display = "block";
		if (shims_parent)
			shims_parent.removeChild(blocker_shim);
	}
}

chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse) {
			console.log(request.blocks);
			localStorage['blocks'] = request.blocks;
			sendResponse({farewell: "goodbye"});
			clear_blocks();
			hide_spoilers();
		});

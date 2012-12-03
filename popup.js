function save() {
	var newval = document.getElementById('block_strings').value;
	localStorage['blocks'] = newval
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {blocks: newval}, function(response) {
			console.log(response.farewell);
		});
	});
}

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('block_strings').value = localStorage['blocks'];
	document.getElementById('save_blocks').addEventListener('click', save);
});

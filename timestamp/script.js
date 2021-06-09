const currentTimestampElem = document.getElementById('current-timestamp');
const diffTimestampElem = document.getElementById('diff-timestamp');
let initialLocalTimestamp;
let laps = [];
let labels = [];

function computeCurrentTimestamp() {
	return new Date().getTime() - timestampDiff;
}

function setCurrentTimestamp() {
	currentTimestampElem.innerHTML = computeCurrentTimestamp();
}

let firstIndex = null;

function toggleDiff(index) {
	if (firstIndex === null) {
		firstIndex = index;
		document.getElementsByClassName('list-group-item')[index].classList.add('active');
	} else {
		if (firstIndex !== index) {
			const diff = Math.abs(laps[index].getTime() - laps[firstIndex].getTime()) / 1000;
			alert('Diff is ' + diff + ' seconds');
		}
		document.getElementsByClassName('list-group-item')[firstIndex].classList.remove('active');
		firstIndex = null;
	}
}

function addLap(lap) {
	if (lap === undefined) {
		var lap = new Date();
		lap.setTime(computeCurrentTimestamp());
	}

	var list = document.getElementById('timestamp-list');
	var elem = document.createElement('a');
	elem.href = "#";
	elem.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'justify-content-between', 'align-items-center');

	const index = laps.length;
	elem.onclick = () => {
		toggleDiff(index);
	};

	let innerHTML = '<span><b>' + lap.getTime() + '</b> (<i>' + lap.toLocaleString() + '</i>)';

	if (index > 0) {
		const diff = lap.getTime() - laps[index - 1].getTime();
		innerHTML += ' diff is ' + diff / 1000 + ' seconds';
	}
	innerHTML += '</span>';

	if (index < labels.length) {
		innerHTML += '<span class="badge badge-primary badge-pill">' + labels[index] + '</span>';
	}

	elem.innerHTML = innerHTML;

	list.appendChild(elem);
	laps.push(lap);
	console.log(laps);
}

function updateLabels() {
	labels = document.getElementById('labels').value.replace('\n', ';').split(';');
	document.getElementById('timestamp-list').innerHTML = '';
	const lapsCopy = laps;
	laps = [];
	lapsCopy.forEach(lap => addLap(lap));
}

function exportLaps() {
	data = 'labels,laps\n';
	laps.forEach((lap, index) => {
		data += lap.getTime() + ',';
		if (index < labels.length) {
			data += labels[index];
		}
		data += '\n';
	});
	const file = new Blob([data], {type: 'text/csv'});
	const a = document.createElement("a");
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = 'export.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

async function computeDiff() {
	let serverResponse = await fetch('api.php');
	const initialLocalTimestamp = new Date().getTime();
	const time = parseInt(await serverResponse.text());
	return initialLocalTimestamp - time;
}

async function init() {
	updateLabels();
	timestampDiff = await computeDiff();
	diffTimestampElem.innerHTML = timestampDiff;
	setInterval(setCurrentTimestamp, 100);
}

init();

/**
 * Adds mouse drag scrolling to a HTMLElemebt container.
 * @param {Element} container - The HTMLElement to add drag scrolling to.
 * @param {Function} keyModCallback - A callback function that returns true if the key modifier is active.
 */
const dragHint = 'drag-hint';
const dragging = 'drag-dragging';

export default function (container, keyModCallback) {
	let startY;
	let startX;
	let scrollLeft;
	let scrollTop;
	let isMouseDown;
	let isDragHint = false;
	let isDragging = false;

	container.addEventListener('mousedown', (e) => mouseIsDown(e));
	container.addEventListener('mouseup', () => mouseRelease());
	container.addEventListener('mouseleave', () => mouseRelease());
	container.addEventListener('mousemove', (e) => mouseMove(e));

	if (keyModCallback) {
		document.addEventListener('keydown', (e) => {
			if (!isDragHint && keyModCallback(e)) {
				container.classList.add(dragHint);
				isDragHint = true;
			}
		});

		document.addEventListener('keyup', () => {
			if (isDragHint) {
				container.classList.remove(dragHint);
				isDragHint = false;
			}
		});
	}

	function mouseIsDown(e) {
		if (!keyModCallback || keyModCallback(e)) {
			isMouseDown = true;
			startY = e.pageY - container.offsetTop;
			startX = e.pageX - container.offsetLeft;
			scrollLeft = container.scrollLeft;
			scrollTop = container.scrollTop;
			if (!isDragging) {
				container.classList.add(dragging);
				isDragging = true;
			}
		}
	}

	function mouseRelease() {
		isMouseDown = false;
		if (isDragging) {
			container.classList.remove(dragging);
			isDragging = false;
		}
	}

	function mouseMove(e) {
		if (isMouseDown) {
			e.preventDefault();
			//Move vertcally
			const y = e.pageY - container.offsetTop;
			const walkY = y - startY;
			container.scrollTop = scrollTop - walkY;
			//Move Horizontally
			const x = e.pageX - container.offsetLeft;
			const walkX = x - startX;
			container.scrollLeft = scrollLeft - walkX;
		}
	}
}

// =====
// Timer
// =====

function Timer(callback, delay) {
	this.timerId, this.start, this.remaining = delay;   
	this.callback = callback;
	
	this.resume();
};
Timer.prototype.callback;
Timer.prototype.timerId;
Timer.prototype.start;
Timer.prototype.remaining;

Timer.prototype.pause = function () {
	clearTimeout(this.timerId);
    this.remaining -= new Date() - this.start;
};

Timer.prototype.resume = function () {
	this.start = new Date();
    this.timerId = setTimeout(this.callback, this.remaining);
};
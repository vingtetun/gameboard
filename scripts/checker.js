class Checker {
	constructor(id,position,color) {
	this.id = id;
	this.position = position;
	this.color = color;
	this.status = "regular";
	}

	get position() {
		return this.position;
	}

	setStatus(newStatus) {
		this.status = newStatus;
	}
}
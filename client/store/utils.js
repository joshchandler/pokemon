import { put } from "redux-saga/effects";

export function* processError(err, callback) {
	if (err.message) yield put(callback(err.message));

	let body = err.body;
	if (body && typeof body === "string") {
		body = JSON.parse(body);
	}

	if (body) yield put(callback(body.detail));
}

export function keyMirror(prefix, object) {
	var newObject = {};

	for (let key in object) {
		newObject[key] = `@@${prefix}/${key}`;
	}

	return newObject;
}
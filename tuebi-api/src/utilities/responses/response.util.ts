export function sendSuccess<T>(data?: T) {
	if (data) {
		return {
			success: true,
			data
		};
	} else {
		return {
			success: true
		};
	}
}

export function sendError(error: Error | string) {
	let errMessage: string;
	if (typeof error === 'object') {
		if (error.message) {
			errMessage = error.message;
		}
	} else {
		errMessage = error;
	}
	return {
		success: false,
		error: errMessage
	};
}
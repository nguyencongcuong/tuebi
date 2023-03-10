import { sendError, sendSuccess } from './response.util';

describe('ResponsesUtil', () => {
	describe('send response', () => {
		it('should return a success response', () => {
			// Arrange
			const data = {title: 'tuebi.io'};
			const expected = {
				success: true,
				data: data
			};
			
			// Act
			const response = sendSuccess(data);
			
			// Assert
			expect(response).toEqual(expected);
		});
		
		it('should return a failure response when error is an instance of Error', () => {
			// Arrange
			const error = new Error('This is an error object');
			const expected = {
				success: false,
				error: error.message
			};
			
			// Act
			const response = sendError(error);
			
			// Assert
			expect(response).toEqual(expected);
		});
		
		it('should return a failure response when error is a string', () => {
			// Arrange
			const error = 'This is a string error';
			const expected = {
				success: false,
				error: error
			};
			
			// Act
			const response = sendError(error);
			
			// Assert
			expect(response).toEqual(expected);
		});
	});
});
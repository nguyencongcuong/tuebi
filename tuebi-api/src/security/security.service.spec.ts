import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import { SecurityService } from './security.service';

describe('SecurityService', () => {
	let service: SecurityService;
	
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [SecurityService],
			imports: [],
		}).compile();
		
		service = module.get<SecurityService>(SecurityService);
	});
	
	describe('encrypt & decrypt', () => {
		it('should should encrypt & decrypt correctly', async () => {
			// Arrange
			const text = 'string';
			const ivBuffer = randomBytes(16);
			const ivString = ivBuffer.toString('hex');
			
			// Act
			const encrypted = await service.encrypt(text, ivBuffer);
			const decrypted = await service.decrypt(encrypted, ivString);
			
			// Assert
			expect(decrypted).toEqual(text);
		});
	});
	
	describe('encryptString & decryptString', () => {
		it('should encrypt & decrypt a string correctly', async () => {
			// Arrange
			const bookmark_name = 'Google';
			const ivBuffer = randomBytes(16);
			const ivString = ivBuffer.toString('hex');
			
			// Act
			const encryptedString = await service.encryptString(
				bookmark_name,
				ivBuffer
			);
			const decryptedString = await service.decryptString(
				encryptedString,
				ivString
			);
			
			// Assert
			expect(encryptedString).toBeDefined();
			expect(decryptedString).toEqual('Google');
		});
	});
	
	describe('encryptNumber & decryptNumber', () => {
		it('should encrypt & decrypt a number correctly', async () => {
			// Arrange
			const number = 100000;
			const ivBuffer = randomBytes(16);
			const ivString = ivBuffer.toString('hex');
			
			// Act
			const encrypted = await service.encryptNumber(number, ivBuffer);
			const decrypted = await service.decryptNumber(encrypted, ivString);
			
			// Assert
			expect(encrypted).toBeDefined();
			expect(decrypted).toEqual(number);
		});
	});
	
	describe('encryptBoolean & decryptBoolean', () => {
		it('should encrypt & decrypt a boolean correctly', async () => {
			// Arrange
			const bool = true;
			const ivBuffer = randomBytes(16);
			const ivString = ivBuffer.toString('hex');
			
			// Act
			const encrypted = await service.encryptBoolean(bool, ivBuffer);
			const decrypted = await service.decryptBoolean(encrypted, ivString);
			
			// Assert
			expect(encrypted).toBeDefined();
			expect(decrypted).toEqual(bool);
		});
	});
	
	describe('encryptArray & decryptArray', () => {
		it('should encrypt & decrypt a string array correctly', async () => {
			// Arrange
			const ivBuffer = randomBytes(16);
			const ivString = ivBuffer.toString('hex');
			const array = ['element 1', 'element 2', 'element 3'];
			
			// Act
			const encrypted = await service.encryptArray(array, ivBuffer);
			const decrypted = await service.decryptArray(encrypted, ivString);
			
			// Assert
			expect(encrypted).toBeDefined();
			expect(decrypted).toEqual(array);
		});
		
		it('should encrypt & decrypt a number array correctly', async () => {
			// Arrange
			const ivBuffer = randomBytes(16);
			const ivString = ivBuffer.toString('hex');
			const array = [1, 2, 3];
			
			// Act
			const encrypted = await service.encryptArray(array, ivBuffer);
			const decrypted = await service.decryptArray(encrypted, ivString);
			
			// Assert
			expect(encrypted).toBeDefined();
			expect(decrypted).toEqual(array);
		});
		
		it('should encrypt & decrypt a boolean array correctly', async () => {
			// Arrange
			const ivBuffer = randomBytes(16);
			const ivString = ivBuffer.toString('hex');
			const array = [true, false, true];
			
			// Act
			const encrypted = await service.encryptArray(array, ivBuffer);
			const decrypted = await service.decryptArray(encrypted, ivString);
			
			// Assert
			expect(encrypted).toBeDefined();
			expect(decrypted).toEqual(array);
		});
		
		it('should encrypt & decrypt a 2-dimensional array correctly', async () => {
			// Arrange
			const ivBuffer = randomBytes(16);
			const ivString = ivBuffer.toString('hex');
			const array = [
				[1, 2, 3],
				['1', '2', '3'],
				[true, false],
				[{string: 'string', number: 1}],
			];
			
			// Act
			const encrypted = await service.encryptArray(array, ivBuffer);
			const decrypted = await service.decryptArray(encrypted, ivString);
			
			// Assert
			expect(encrypted).toBeDefined();
			expect(decrypted).toEqual(array);
		});
		
		it('should encrypt & decrypt an object array correctly', async () => {
			// Arrange
			const ivBuffer = randomBytes(16);
			const ivString = ivBuffer.toString('hex');
			const array = [
				{
					string: 'element',
					number: 1,
					boolean_true: true,
					boolean_false: false,
					string_array: ['element 1', 'element 2', 'element 3'],
					number_array: [1, 2, 3],
					boolean_array: [true, false, true],
					mixed_array: ['string', 1, true, false],
					object: {
						string: 'element',
						number: 1,
						boolean_true: true,
						boolean_false: false,
						string_array: ['element 1', 'element 2', 'element 3'],
						number_array: [1, 2, 3],
						boolean_array: [true, false, true],
						mixed_array: ['string', 1, true, false],
					},
					array: [
						{
							string: 'element',
							number: 1,
							boolean_true: true,
							boolean_false: false,
							string_array: ['element 1', 'element 2', 'element 3'],
							number_array: [1, 2, 3],
							boolean_array: [true, false, true],
							mixed_array: ['string', 1, true, false],
						},
					],
				},
			];
			
			// Act
			const encrypted = await service.encryptArray(array, ivBuffer);
			const decrypted = await service.decryptArray(encrypted, ivString);
			
			// Assert
			expect(encrypted).toBeDefined();
			expect(decrypted).toEqual(array);
		});
	});
	
	describe('encryptObject & decryptObject', () => {
		it('should encrypt * decrypt a object correctly', async () => {
			// Arrange
			const ivBuffer = randomBytes(16);
			const ivString = ivBuffer.toString('hex');
			const obj = {
				_id: '6339b26055c0ab2a3391ff72',
				string: 'string',
				number: 1,
				bool_true: true,
				bool_false: false,
				array_of_string: ['item 1', 'item 2', 'item 3'],
				array_of_number: [0, 1, 2, 3],
				array_of_object: [
					{
						string: 'string',
						number: 1,
						bool_true: true,
						bool_false: false,
						array_of_string: ['item 1', 'item 2', 'item 3'],
						array_of_number: [1, 2, 3],
						object: {
							string: 'string',
							number: 1,
							boolean_true: true,
							boolean_false: false,
							string_array: ['element 1', 'element 2', 'element 3'],
							number_array: [1, 2, 3],
							boolean_array: [true, false, true],
							mixed_array: ['string', 1, true, false],
						},
					},
				],
				object: {
					string: 'string',
					number: 1,
					boolean_true: true,
					boolean_false: false,
					string_array: ['element 1', 'element 2', 'element 3'],
					number_array: [1, 2, 3],
					boolean_array: [true, false, true],
					mixed_array: ['string', 1, true, false],
				},
			};
			
			// Act
			const includedFields = ['object'];
			const encryptedObject = await service.encryptObject(
				obj,
				ivBuffer,
				includedFields
			);
			const decryptedObject = await service.decryptObject(
				encryptedObject,
				ivString,
				includedFields
			);
			
			// Assert
			expect(encryptedObject).toBeDefined();
			expect(decryptedObject).toEqual(obj);
		});
	});
	
	describe('hash & valdiateHash', () => {
		it('should hash a text', () => {
			// Arrange
			const password = 'hello_world';
			
			// Act
			const hashed = service.hash(password);
			
			// Assert
			expect(hashed).toBeDefined();
		});
		
		it('should return true when the password is correct', () => {
			// Arrange
			const password = 'hello_world';
			const hashedPassword = service.hash(password);
			
			// Act
			const isPasswordCorrect = service.compareHash(password, hashedPassword);
			
			// Assert
			expect(isPasswordCorrect).toBeTruthy();
		});
	});
});

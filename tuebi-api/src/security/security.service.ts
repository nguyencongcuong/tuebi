import { Injectable, Logger } from '@nestjs/common';
import { createCipheriv, createDecipheriv, pbkdf2Sync } from 'crypto';
import { isArray, isBoolean, isNumber, isObject, isString } from 'lodash';
import { azAppSettings } from '../azure/azure-application-settings';

@Injectable()
export class SecurityService {
	private SALT = azAppSettings.SALT;
	private ENCRYPTION_ALGORITHM = azAppSettings.ENCRYPTION_ALGORITHM;
	private ENCRYPTION_SECRET_KEY = azAppSettings.ENCRYPTION_SECRET_KEY;
	private BOOLEAN_IDENTIFIER = 'BOOLEAN_IDENTIFIER';
	private STRING_IDENTIFIER = 'STRING_IDENTIFIER';
	private NUMBER_IDENTIFIER = 'NUMBER_IDENTIFIER';
	
	private logger = new Logger(SecurityService.name);
	
	// COMMON ENCRYPTION & DECRYPTION
	async encrypt(text: string, ivBuffer: Buffer) {
		try {
			const cipher = createCipheriv(
				this.ENCRYPTION_ALGORITHM,
				this.ENCRYPTION_SECRET_KEY,
				ivBuffer
			);
			const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
			return encrypted.toString('hex');
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async decrypt(text: string, ivString: string) {
		try {
			const decipher = createDecipheriv(
				this.ENCRYPTION_ALGORITHM,
				this.ENCRYPTION_SECRET_KEY,
				Buffer.from(ivString, 'hex')
			);
			const decrypted = Buffer.concat([
				decipher.update(Buffer.from(text, 'hex')),
				decipher.final(),
			]);
			return decrypted.toString();
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	// STRING
	async encryptString(text: string, ivBuffer: Buffer) {
		try {
			return await this.encrypt(text + this.STRING_IDENTIFIER, ivBuffer);
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async decryptString(text: string, ivString: string) {
		try {
			const decryptedWithIdentifier = await this.decrypt(text, ivString);
			return decryptedWithIdentifier.replace(this.STRING_IDENTIFIER, '');
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	// NUMBER
	async encryptNumber(number: number, ivBuffer: Buffer) {
		try {
			return this.encrypt(String(number) + this.NUMBER_IDENTIFIER, ivBuffer);
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async decryptNumber(text: string, ivString: string) {
		try {
			const decryptedWithIdentifier = await this.decrypt(text, ivString);
			return Number(
				decryptedWithIdentifier.replace(this.NUMBER_IDENTIFIER, '')
			);
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	// BOOLEAN
	async encryptBoolean(boolean: boolean, ivBuffer: Buffer) {
		const randomEven = () => {
			let number;
			
			do {
				number = Math.round(Math.random() * 100 + 1);
			} while (number % 2 !== 0);
			
			return number;
		};
		const randomOdd = () => {
			let number;
			
			do {
				number = Math.round(Math.random() * 100 + 1);
			} while (number % 2 === 0);
			
			return number;
		};
		
		try {
			if (boolean) {
				const text = randomEven() + this.BOOLEAN_IDENTIFIER;
				return await this.encrypt(text, ivBuffer);
			} else {
				const odd = randomOdd();
				const text = odd + this.BOOLEAN_IDENTIFIER;
				return await this.encrypt(text, ivBuffer);
			}
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async decryptBoolean(text: string, ivString: string) {
		try {
			const decryptedWithIdentifier = await this.decrypt(text, ivString);
			const decrypted = decryptedWithIdentifier.replace(
				this.BOOLEAN_IDENTIFIER,
				''
			);
			return Number(decrypted) % 2 === 0;
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	// ARRAY
	async encryptArray(
		array: Array<any>,
		ivBuffer: Buffer,
		includes: string[] = []
	) {
		try {
			const encryptedArray = [];
			
			for (const item of array) {
				if (isString(item)) {
					const encrypted = await this.encryptString(item, ivBuffer);
					encryptedArray.push(encrypted);
				} else if (isNumber(item)) {
					const encrypted = await this.encryptNumber(item, ivBuffer);
					encryptedArray.push(encrypted);
				} else if (isArray(item)) {
					const encrypted = await this.encryptArray(item, ivBuffer);
					encryptedArray.push(encrypted);
				} else if (isObject(item)) {
					const encrypted = await this.encryptObject(item, ivBuffer, includes);
					encryptedArray.push(encrypted);
				} else if (isBoolean(item)) {
					const encrypted = await this.encryptBoolean(item, ivBuffer);
					encryptedArray.push(encrypted);
				}
			}
			
			return encryptedArray;
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async decryptArray(
		array: Array<any>,
		ivString: string,
		includes: string[] = []
	) {
		try {
			const decryptedArray = [];
			
			for (const item of array) {
				if (isString(item)) {
					const decryptedWithIdentifier = await this.decrypt(item, ivString);
					if (decryptedWithIdentifier.includes(this.STRING_IDENTIFIER)) {
						decryptedArray.push(await this.decryptString(item, ivString));
						continue;
					}
					if (decryptedWithIdentifier.includes(this.NUMBER_IDENTIFIER)) {
						decryptedArray.push(await this.decryptNumber(item, ivString));
						continue;
					}
					if (decryptedWithIdentifier.includes(this.BOOLEAN_IDENTIFIER)) {
						decryptedArray.push(await this.decryptBoolean(item, ivString));
						continue;
					}
				}
				
				if (isArray(item)) {
					const decrypted = await this.decryptArray(item, ivString);
					decryptedArray.push(decrypted);
					continue;
				}
				
				if (isObject(item)) {
					const decrypted = await this.decryptObject(item, ivString, includes);
					decryptedArray.push(decrypted);
				}
			}
			
			return decryptedArray;
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	// OBJECT
	async encryptObject<T>(object: T, ivBuffer: Buffer, includes: string[] = []) {
		try {
			const objArray = Object.entries(object);
			const encryptedObject = {} as T;
			for (const [key, value] of objArray) {
				if (includes.includes(key)) {
					if (isString(value)) {
						encryptedObject[key] = await this.encryptString(value, ivBuffer);
					} else if (isNumber(value)) {
						encryptedObject[key] = await this.encryptNumber(value, ivBuffer);
					} else if (isBoolean(value)) {
						encryptedObject[key] = await this.encryptBoolean(value, ivBuffer);
					} else if (isArray(value)) {
						encryptedObject[key] = await this.encryptArray(
							value,
							ivBuffer,
							includes
						);
					} else if (isObject(value)) {
						encryptedObject[key] = await this.encryptObject(
							value,
							ivBuffer,
							includes
						);
					}
				} else {
					encryptedObject[key] = value;
				}
			}
			return encryptedObject;
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async decryptObject(object: Object, ivString, includes: string[] = []) {
		try {
			const objArray = Object.entries(object);
			let decryptedObject = {};
			
			for (const [key, value] of objArray) {
				if (includes.includes(key)) {
					if (isString(value)) {
						const decryptedWithIdentifier = await this.decrypt(value, ivString);
						if (decryptedWithIdentifier.includes(this.STRING_IDENTIFIER)) {
							decryptedObject[key] = await this.decryptString(value, ivString);
							continue;
						}
						if (decryptedWithIdentifier.includes(this.NUMBER_IDENTIFIER)) {
							decryptedObject[key] = await this.decryptNumber(value, ivString);
							continue;
						}
						if (decryptedWithIdentifier.includes(this.BOOLEAN_IDENTIFIER)) {
							decryptedObject[key] = await this.decryptBoolean(value, ivString);
							continue;
						}
					}
					
					if (isArray(value)) {
						decryptedObject[key] = await this.decryptArray(value, ivString);
						continue;
					}
					
					if (isObject(value)) {
						decryptedObject[key] = await this.decryptObject(
							value,
							ivString,
							includes
						);
					}
				} else {
					decryptedObject[key] = value;
				}
			}
			
			return decryptedObject;
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	hash(text: string) {
		try {
			return pbkdf2Sync(text, this.SALT, 1000, 32, `sha512`).toString(`hex`);
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	compareHash(text: string, hashedText: string) {
		try {
			const hashed = pbkdf2Sync(text, this.SALT, 1000, 32, `sha512`).toString(
				`hex`
			);
			return hashed === hashedText;
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async randomCode(length: number) {
		try {
			const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
			
			let str = '';
			for (let i = 0; i < length; i++) {
				const randomGeneratorIndex = Math.floor(Math.random() * 2);
				if (randomGeneratorIndex === 0) {
					const randomCharacter =
						ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
					str += randomCharacter;
				} else {
					const randomNumber = Math.floor(Math.random() * 10);
					str += randomNumber;
				}
			}
			return str.toUpperCase();
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
}

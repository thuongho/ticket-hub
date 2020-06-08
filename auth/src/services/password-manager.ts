// built in crypto node library
// scrypt is callback base
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// use promisify to turn scrypt into async await base
const scryptAsync = promisify(scrypt);

export class PasswordManager {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    // after we hash, we get back a buffer which is like an array with raw data
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return hashedPassword === buf.toString('hex');
  }
}

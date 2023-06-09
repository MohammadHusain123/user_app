import * as bcrypt from 'bcrypt';

export class PasswordHash {
    
    static async hash(password) {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        return hashPassword;
    }
}

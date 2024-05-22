import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { from } from 'rxjs';

const secret = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = (user: any) => {
  return jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  return from(new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  }));
};

export const hashPassword = (password: string) => {
  return from(bcrypt.hash(password, 8));
};

export const comparePassword = (password: string, hash: string) => {
  return from(bcrypt.compare(password, hash));
};

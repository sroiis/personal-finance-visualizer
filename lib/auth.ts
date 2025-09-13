import jwt from 'jsonwebtoken';

const JWT_SECRET = 'supersecret';

export const signToken = (payload: object) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

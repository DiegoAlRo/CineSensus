import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'TOKEN_NO_PROVIDO' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'TOKEN_INVALIDO' });
  }
}
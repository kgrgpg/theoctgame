import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validatePlayer = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    playerAddress: Joi.string().required(),
    score: Joi.number().integer().required()
  });
  const { error } = schema.validate(req.body);
  if (error) {
    console.log('Validation error:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

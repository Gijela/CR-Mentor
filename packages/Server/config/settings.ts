import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

interface Config {
  OPENAI_API_KEY: string;
  OPENAI_API_BASE: string;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  COLLECTION_NAME: string;
}

const config: Config = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_API_BASE: process.env.OPENAI_API_BASE || '',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_KEY || '',
  COLLECTION_NAME: 'documents2'
};

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

export { config, logger };
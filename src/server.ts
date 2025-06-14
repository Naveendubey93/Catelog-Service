import app from './app';
import config from 'config';
import logger from './config/logger';
import { initDb } from './config/db';
const startServer = async () => {
  try {
    initDb();
    logger.info('Database connected successfully');
    app.listen(config.get('server.port'), () => {
      logger.info(`Listening on ${config.get('server.port')}`);
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      logger.error(e.message);
      setTimeout(() => {
        logger.on('finished', () => {
          process.exit(1);
        });
      }, 1000);
    }
  }
};
void startServer();

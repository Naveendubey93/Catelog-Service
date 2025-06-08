import app from './app';
import config from 'config';
import logger from './config/logger';
const startServer = async () => {
  try {
    app.listen(config.get('server.port'), () => {
      logger.info(`Listening on ${config.get('server.port')}`);
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      logger.error(e.message);
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  }
};
void startServer();

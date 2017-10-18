// @flow
/* eslint-disable no-process-env */

// #region imports
const express               = require('express');
const chalk                 = require('chalk');
const next                  = require('next');
const { createReadStream }  = require('fs');
// #endregion

// #region variables/constants initialization
const port     = parseInt(process.env.PORT, 10) || 3000;
const ipAdress = 'localhost';
const dev      = process.env.NODE_ENV !== 'production';
const app      = next({ dev });
const handle   = app.getRequestHandler();
// #endregion

// #region start next application
prepareNextApplication();
// #endregion


async function prepareNextApplication() {
  await app.prepare();

  const server = express();

  // example of custom request handlers:
  // server.get('/a', (req, res) => app.render(req, res, '/b', req.query));
  // server.get('/b', (req, res) => app.render(req, res, '/a', req.query));

  // handles service worker file request:
  server.get('/sw.js', (req, res) => {
    res.setHeader('content-type', 'text/javascript');
    createReadStream('./offline/serviceWorker.js').pipe(res);
  });

  // default request handler by next handler:
  server.get('*', (req, res) => handle(req, res));

  server.listen(
    port,
    (err) =>  {
      if (err) {
        throw err;
      }

      /* eslint-disable no-console */
      console.log(`
        =====================================================
        -> Server (${chalk.bgBlue('NextJS PWA')}) 🏃 (running) on ${chalk.green(ipAdress)}:${chalk.green(port)}
        =====================================================
      `);
      /* eslint-enable no-console */
    }
  );
}

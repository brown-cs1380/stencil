// @ts-check
/* Create log file */
const fs = require('node:fs');
const path = require('node:path');

const logFile = path.join('/tmp', 'log.txt');

/**
 * @param {string} message
 * @param {string} [severity]
 */
function log(message, severity) {
  if (!severity) {
    severity = 'info';
  }

  const now = new Date();
  const date = `${
    new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
        .format(now)
  }.${String(now.getMilliseconds() * 1000).padStart(6, '0')}`;

  const sid = globalThis.distribution.util.id.getSID(
      globalThis.distribution.node.config,
  );
  fs.appendFileSync(
      logFile,
      `${date} [${globalThis.distribution.node.config.ip}:${globalThis.distribution.node.config.port} (${sid})] [${severity}] ${message}\n`,
  );
}

module.exports = log;

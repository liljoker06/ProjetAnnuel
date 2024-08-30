// consoleLog.js
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function consoleLog(message, color) {
  const currentDateTime = new Date().toLocaleString();
  const colorCode = colors[color] || colors.reset;
  console.log(`[${currentDateTime}] - ${colorCode}${message}${colors.reset}`);
}

module.exports = consoleLog;
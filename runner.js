var async = require('async');
var cp = require('child_process');


/**
 * Executes one or more shell commmands in a series.
 *
 * @example
 *
 *  var runner = new Runner();
 *
 *  runner.run('node', ['script.js'], callback);
 *  runner
 *    .add('node', ['script.js']);
 *    .start(callback);
 *  runner
 *    .add('node', ['script.js'])
 *    .add('node', ['otherScript.js'])
 *    .start(callback);
 */
function Runner() {
  this.commands = [];
  return this;
}


Runner.prototype.add = Runner.prototype.run = function(cmd, args, cb) {
  if (typeof args === 'function') {
    cb = args;
    args = null;
  }

  if (!args) args = [];

  // spawn expects as an array for args, and this library allows single arg
  if (!Array.isArray(args)) args = [args];

  this.commands.push({command: cmd, args: args});
  if (cb)
    return this.start(cb);
  else
    return this;
}



Runner.prototype.start = function(cb) {
  if (!cb) cb = function() {};

  function run(info, cb) {
    var cmd = cp.spawn(info.command, info.args, {stdio: 'inherit'});
    cmd.on('exit', cb);
  }

  if (this.commands.length > 0)
    async.forEach(this.commands, run, cb);
  else
    cb();
};


module.exports = Runner;

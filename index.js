var cp = require('child_process');
var __slice = [].slice;
var shelljs = require('shelljs');
var Path = require('path');
var Runner= require('./runner');

var Sex = {
  __proto__: shelljs
};


function delta(start, stop) {
  var d = new Date(stop - start);
  return {
    hours: d.getHours(),
    minutes: d.getMinutes(),
    seconds: d.getSeconds(),
    milliseconds: d.getMilliseconds()
  }
}


/**
 * Times a node script.
 */
Sex.timeNode = function(args, cb) {
  if (!Array.isArray(args)) args = [args];

  var start = new Date();
  var cmd = cp.spawn('node', args, {stdio: 'inherit'});
  cmd.on('exit', function() {
    var d =  delta(start, new Date());
    var s = "";
    if (d.minutes) s += d.minutes + ' m ';
    s += d.seconds + '.' + d.milliseconds + ' s';
    console.log('Time taken: ' + s);
    cb();
  });
}


/**
 * Runs a single shell command.
 */
Sex.run = function(cmd, args, cb)  {
  var runner = new Runner();
  runner.add(cmd, args);
  return runner.start(cb);
}


/**
 * Runs a series of commands.
 *
 * @example
 *  sex.runner
 *    .add('node', ['a.js'])
 *    .add('node', ['b.js'])
 *    .start(callback);
 */
Sex.__defineGetter__('runner', function() {
  return new Runner();
});




/**
 * Executes a nodeJS script.
 */
Sex.node = function(args, cb) {
  if (!Array.isArray(args)) args = [args];
  var cmd = cp.spawn('node', args, {stdio: 'inherit'});
  if (cb) cmd.on('exit', cb);
}


/**
 * Runs a CoffeeScript script.
 */
Sex.coffee = function(args, cb) {
  if (!Array.isArray(args)) args = [args];
  var newArgs = args.concat();
  newArgs.unshift(Path.join(__dirname, 'node_modules/coffee-script/bin/coffee'));
  var cmd = cp.spawn('node', newArgs, {stdio: 'inherit'});
  if (cb) cmd.on('exit', cb);
}

module.exports = Sex;

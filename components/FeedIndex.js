var noflo = require('noflo');
var knex = require('knex');
var path = require('path');

exports.getComponent = function() {
  var c = new noflo.Component();
  c.description = 'List feeds in the system';
  c.icon = 'bars';
  c.inPorts.add('req', {
    datatype: 'object'
  });
  c.inPorts.add('db', {
    datatype: 'string',
    control: true
  });
  c.outPorts.add('error', {
    datatype: 'object'
  });
  
  c.process(function (input, output) {
    if (!input.hasData('req', 'db')) {
      return;
    }
    
    var req = input.getData('req');
    var db = knex(require(path.resolve(process.cwd(), input.getData('db'))));
    
    db('feed')
  	.select('id', 'url')
    .then(function (rows) {
      req.res.json(rows);
      output.done();
    }, function (e) {
      req.res.send(500, e.message);
      output.done(e);
    });
  });
  
  return c;
};

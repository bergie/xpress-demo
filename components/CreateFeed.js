var noflo = require('noflo');
var knex = require('knex');
var path = require('path');

exports.getComponent = function() {
  var c = new noflo.Component();
  c.description = 'Register a new feed';
  c.icon = 'plus';
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
    .select('id')
    .where('url', req.body.url)
    .then(function (rows) {
      if (rows.length) {
        // Already exists
        return rows[0].id;
      }
      return db('feed')
      .insert({
        url: req.body.url
      })
      .returning('id')
      .then(function (result) {
        return result[1];
      });
    })
    .then(function (id) {
      req.res.header('location', '/' + id);
      req.res.status(201).end();
      output.done();
    });
  });
  
  return c;
};

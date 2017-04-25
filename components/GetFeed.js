var noflo = require('noflo');
var knex = require('knex');
var path = require('path');

exports.getComponent = function() {
  var c = new noflo.Component();
  c.description = 'Get feed URL for fetching';
  c.icon = 'file';
  c.inPorts.add('req', {
    datatype: 'object'
  });
  c.inPorts.add('db', {
    datatype: 'string',
    control: true
  });
  c.outPorts.add('req', {
    datatype: 'object'
  });
  c.outPorts.add('url', {
    datatype: 'string'
  });
  
  c.process(function (input, output) {
    if (!input.hasData('req', 'db')) {
      return;
    }
    
    var req = input.getData('req');
    var db = knex(require(path.resolve(process.cwd(), input.getData('db'))));
    console.log(req.params);
    db('feed')
  	.select('url')
    .where('id', req.params.id)
    .then(function (rows) {
      if (!rows.length) {
        req.res.send(404, "Feed not found");
        return output.done();
      }
      output.send({
        req: req,
        url: rows[0].url
      });
      output.done();
    });
  });
  
  return c;
};

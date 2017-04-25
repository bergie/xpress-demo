var noflo = require('noflo');

exports.getComponent = function() {
  var c = new noflo.Component();
  c.description = 'Send RSS fetching result to client';
  c.icon = 'forward';
  c.inPorts.add('req', {
    datatype: 'object'
  });
  c.inPorts.add('item', {
    datatype: 'object'
  });
  c.inPorts.add('error', {
    datatype: 'object'
  });
  
  c.process(function (input, output) {
    if (!input.hasData('req')) {
      return;
    }
    
    var req;
    
    if (input.hasData('error')) {
      req = input.getData('req');
      var error = input.getData('error');
      req.res.send(500, error.message);
      return output.done();
    }
    
    if (input.hasStream('item')) {
      req = input.getData('req');
      var items = input.getStream('item').filter(function (ip) {
        if (ip.type === 'data') {
          return true;
        }
        return false;
      }).map(function (ip) {
        return ip.data;
      });
      
      req.res.json(items);
      
      return output.done();
    }
  });
  
  return c;
};

const noflo = require('noflo');
const knex = require('knex');
const path = require('path');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'List feeds in the system';
  c.icon = 'bars';
  c.inPorts.add('req', {
    datatype: 'object',
  });
  c.inPorts.add('db', {
    datatype: 'string',
    control: true,
  });
  c.outPorts.add('error', {
    datatype: 'object',
  });

  return c.process((input, output) => {
    if (!input.hasData('req', 'db')) {
      return;
    }

    const req = input.getData('req');
    // eslint-disable-next-line
    const db = knex(require(path.resolve(process.cwd(), input.getData('db'))));

    db('feed')
      .select('id', 'url')
      .then((rows) => {
        req.res.json(rows);
        output.done();
      }, (e) => {
        req.res.status(500).send(e.message);
        output.done(e);
      });
  });
};

const noflo = require('noflo');
const knex = require('knex');
const path = require('path');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Get feed URL for fetching';
  c.icon = 'file';
  c.inPorts.add('req', {
    datatype: 'object',
  });
  c.inPorts.add('db', {
    datatype: 'string',
    control: true,
  });
  c.outPorts.add('req', {
    datatype: 'object',
  });
  c.outPorts.add('url', {
    datatype: 'string',
  });

  c.process((input, output) => {
    if (!input.hasData('req', 'db')) {
      return;
    }

    const req = input.getData('req');
    // eslint-disable-next-line
    const db = knex(require(path.resolve(process.cwd(), input.getData('db'))));

    db('feed')
      .select('url')
      .where('id', req.params.id)
      .then((rows) => {
        if (!rows.length) {
          req.res.send(404, 'Feed not found');
          output.done();
          return;
        }
        output.send({
          req,
          url: rows[0].url,
        });
        output.done();
      });
  });

  return c;
};

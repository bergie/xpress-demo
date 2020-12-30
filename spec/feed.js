const noflo = require('noflo');
const request = require('request');
const chai = require('chai');
const path = require('path');

const baseDir = path.resolve(__dirname, '../');

describe('Feed API', () => {
  let network = null;
  before(function () {
    this.timeout(10000);
    const graph = path.resolve(baseDir, 'graphs/main.json');
    return noflo.loadFile(graph, {
      baseDir,
    })
      .then((nw) => {
        network = nw;
      });
  });
  after(() => {
    if (!network) {
      return Promise.resolve();
    }
    return network.stop();
  });
  describe('Initially', () => {
    it('should provide an empty feed list', (done) => {
      request('http://localhost:5000/feed', (err, res, body) => {
        if (err) {
          done(err);
          return;
        }
        chai.expect(JSON.parse(body)).to.eql([]);
        done();
      });
    });
  });
  describe('Subscribing to a feed', () => {
    it('should succeed', (done) => {
      request.post({
        url: 'http://localhost:5000/feed',
        json: true,
        body: {
          url: 'http://bergie.iki.fi/blog/rss.xml',
        },
      }, (err, res) => {
        if (err) {
          done(err);
          return;
        }
        chai.expect(res.statusCode).to.equal(201);
        done();
      });
    });
    it('should provide an populated feed list', (done) => {
      request('http://localhost:5000/feed', (err, res, body) => {
        if (err) {
          done(err);
          return;
        }
        chai.expect(JSON.parse(body).length).to.eql(1);
        done();
      });
    });
    it('should provide a fetchable feed', function (done) {
      this.timeout(4000);
      request('http://localhost:5000/feed/1', (err, res, body) => {
        if (err) {
          done(err);
          return;
        }
        chai.expect(JSON.parse(body).length).to.be.above(1);
        done();
      });
    });
  });
});

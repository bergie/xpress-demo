var noflo = require('noflo');
var request = require('request');
var chai = require('chai');
var path = require('path');
var baseDir = path.resolve(__dirname, '../');

describe('Feed API', function () {
  var network = null;
  before(function (done) {
    var graph = path.resolve(baseDir, 'graphs/main.json');
    noflo.loadFile(graph, {
      baseDir: baseDir
    }, function (err, nw) {
      if (err) {
        return done(err);
      }
      network = nw;
      done();
    });
  });
  after(function (done) {
    network.stop(done);
  });
  describe('Initially', function () {
    it('should provide an empty feed list', function (done) {
      request('http://localhost:5000/feed', function (err, res, body) {
        if (err) {
          return done(err);
        }
        chai.expect(JSON.parse(body)).to.eql([]);
        done();
      });
    });
  });
  describe('Subscribing to a feed', function () {
    it('should succeed', function (done) {
      request.post({
        url: 'http://localhost:5000/feed',
        json: true,
        body: {
          url: 'http://bergie.iki.fi/blog/rss.xml'
        }
      }, function (err, res, body) {
        if (err) {
          return done(err);
        }
        chai.expect(res.statusCode).to.equal(201);
        done();
      });
    });
    it('should provide an populated feed list', function (done) {
      request('http://localhost:5000/feed', function (err, res, body) {
        if (err) {
          return done(err);
        }
        chai.expect(JSON.parse(body).length).to.eql(1);
        done();
      });
    });
    it('should provide a fetchable feed', function (done) {
      this.timeout(4000);
      request('http://localhost:5000/feed/1', function (err, res, body) {
        if (err) {
          return done(err);
        }
        chai.expect(JSON.parse(body).length).to.be.above(1);
        done();
      });
    });
  });
});

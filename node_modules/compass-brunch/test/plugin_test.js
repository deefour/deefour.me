var sysPath = require('path');
var fs = require('fs');

describe('Plugin', function() {
  var plugin;

  beforeEach(function() {
    plugin = new Plugin({
      paths: {
        root: '.',
        compass: './test/compass.rb'
      }
    });
  });

  it('should be an object', function() {
    expect(plugin).to.be.ok;
  });

  it('should has #compile method', function() {
    expect(plugin.compile).to.be.an.instanceof(Function);
  });

  it('should compile and produce valid result for scss', function(done) {
    var expected = '.test {\n  border-color: white;\n}\n';

    plugin.compile('', 'test/sass/file.scss', function(error, data) {
      expect(error).not.to.be.ok;
      fs.readFile('test/css/file.css', function(err, fileData){
        expect(err).not.to.be.ok;
        expect(fileData.toString('ascii')).to.equal(expected);
        done();
      });
    });
  });

});

var chai = require('chai')
  expect = chai.expect,
  fs = require('fs'),
  exec = require('child_process').exec
  path = process.cwd()

describe('Test osm-tile-list \n', function() {
  it('get tiles list without \'c\' option', function(done) {
    var out = exec(
      'node osm-tile-list.js test/fixtures/polygon.json -s 1 -e 2 | sort', 
      function(err, stdout, stderr) {
        if (err) throw err
        expect(stderr).to.be.equal('')
        var expTiles = fs.readFileSync(
          path + '/test/fixtures/output-without-c.txt','utf8')
        expect(stdout).to.be.equal(expTiles)
        done()
      }
    )
  })
  it('get tiles list with \'c\' option', function(done) {
    var out = exec(
      'node osm-tile-list.js test/fixtures/polygon.json -s 1 -e 2 -c| sort', 
      function(err, stdout, stderr) {
        if (err) throw err
        expect(stderr).to.be.equal('')
        var expTiles = fs.readFileSync(
          path + '/test/fixtures/output-with-c.txt','utf8')
        expect(stdout).to.be.equal(expTiles)
        done()
      }
    )
  })
})

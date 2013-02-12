module.exports = tasks

var stylusRender = require('stylus-renderer')
  , jadeRender = require('jade-renderer')
  , join = require('path').join
  , fs = require('fs')
  , child

function tasks(pliers) {

  pliers.filesets('templates', join(__dirname, '**.jade'))
  pliers.filesets('css', join(__dirname, 'css', '**.styl'))

  pliers('renderTemplates', function (done) {
    jadeRender([ { template: 'index' } ], {}, function (err) {
      if (err) pliers.logger.error(err.message)
      done(err)
    }).on('log', function (msg, level) { pliers.logger[level](msg) })
  })

  pliers('renderCss', function (done) {
    stylusRender(pliers.filesets.css, {}, function (err) {
      if (err) pliers.logger.error(err.message)
      done(err)
    }).on('log', function (msg, level) { pliers.logger[level](msg) })
  })

  pliers('server', function () {
    if (child) child.kill()
    child = pliers.exec('node server')
  })

  pliers('build', 'renderCss', 'renderTemplates', function (done) {
    pliers.logger.info('Built!')
    done()
  })

  pliers('watch', 'build', function (done) {

    pliers.watch(pliers.filesets.templates, function () {
      pliers.logger.info('Re-rendering templates')
      pliers.run('renderTemplates')
    })

    pliers.watch(pliers.filesets.css, function () {
      pliers.logger.info('Re-rendering CSS')
      pliers.run('renderCss')
    })

    pliers.run('server')

  })

}
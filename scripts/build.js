const { argv } = require('yargs')
const execa = require('execa')
const chalk = require('chalk')
const hackFather = require('./hack-father')

hackFather()

const { package, watch } = argv
const log = (message) => {
  console.log(chalk.green(message))
}
const parseArgs = () => {
  const options = []
  if (package) {
    process.env.PACKAGE = package
  }

  if (watch) {
    options.push('--watch')
  }
  return options
}
const opts = parseArgs()
log(
  `start build ${package ? `package:${package}` : ''} ${opts.length ? `with ${opts.join('')}` : ''}`
)

execa.sync('father', ['build', ...opts])

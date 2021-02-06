const { utils } = require('umi')
const exec = require('./utils/exec')

const { execa, chalk } = utils
const lernaCli = require.resolve('lerna/cli')

function printErrorAndExit(message) {
  console.error(chalk.red(message))
  process.exit(1)
}

function logStep(name) {
  console.log(`${chalk.gray('>> Release:')} ${chalk.magenta.bold(name)}`)
}

async function release() {
  // Check git status
  logStep('check git status')
  const gitStatus = execa.sync('git', ['status', '--porcelain']).stdout
  if (gitStatus.length) {
    printErrorAndExit(`Your git status is not clean. Aborting.`)
  }

  // Get updated packages
  logStep('check updated packages')
  const updatedStdout = execa.sync(lernaCli, ['changed']).stdout
  const pkgs = updatedStdout
    .split('\n')
    .map((pkg) => {
      return pkg.split('/')[1]
    })
    .filter(Boolean)
  if (!pkgs.length) {
    printErrorAndExit('Release failed, no package is updated.')
  }

  // bump version
  logStep('bump version with lerna version')
  await exec('lerna', [
    'version',
    '--message',
    '"chore(release): publish"',
    '--conventional-commits',
    '--no-push',
  ])

  logStep('done')
}

release().catch((err) => {
  console.error(err)
  process.exit(1)
})

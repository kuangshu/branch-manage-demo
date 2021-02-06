const { writeFileSync, readdirSync, existsSync, mkdirSync } = require('fs')
const path = require('path')
const { utils } = require('umi')

const { chalk } = utils

const pkgs = ['antd', 'component', 'biz', 'chart']

function logStep(name) {
  console.log(`${chalk.gray('>> Combine less:')} ${chalk.magenta.bold(name)}`)
}

async function combine() {
  logStep('start to combine less')
  const pkgDir = 'packages'
  pkgs.forEach(pkg => {
    const base = path.join(pkgDir, pkg, 'es')
    const items = readdirSync(base, { withFileTypes: true })

    let content = ''
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item.isDirectory) continue

      const stylePath = path.join(base, item.name, 'style/index.less')
      if (existsSync(stylePath)) {
        const importPath = `..\/${path.join(item.name, 'style/index.less').replace(/\\/g, '/')}`
        content += `@import '${importPath}';\n`
      }
    }

    const styleDir = path.join(base, 'style')
    if (!existsSync(styleDir)) {
      mkdirSync(styleDir)
    }
    const lessPath = path.join(styleDir, 'component.less')
    writeFileSync(lessPath, content)
    logStep(`[ ${pkg} ]: ${lessPath}`)
  })

  logStep('done')
}

combine()

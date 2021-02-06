const fs = require('fs')
const path = require('path')
/**
 *
 * 没办法覆盖father内置的@babel/preset-env
 * presets执行顺序为从后往前执行且代码转换不可逆
 *
 * presets:[env.chrome=71, env.chrome=11]
 *
 * const a = 0
 *
 * ==>
 * chrome=11
 * var a = 0
 * ==>
 * chrome=71
 * var a = 0
 */
const hackFather = () => {
  const fatherPath = require.resolve('father-build')
  const filename = path.resolve(fatherPath, '../getBabelConfig.js')
  const hackContent = fs.readFileSync(path.join(__dirname, 'getBabelConfig.js'))

  fs.writeFileSync(filename, hackContent)
}

hackFather()

// module.exports = hackFather

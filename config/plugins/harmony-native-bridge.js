'use strict'

const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..', '..')
const HARMONY_SOURCES = path.join(PROJECT_ROOT, 'native', 'harmony')
const BRIDGE_SOURCE = path.join(HARMONY_SOURCES, 'NativeBridge.ets')
const BACKUP_ABILITY_SOURCE = path.join(HARMONY_SOURCES, 'EntryBackupAbility.ets')

const IMPORT_LINE = "import './native-bridge/NativeBridge'"
const RUNTIME_IMPORT =
  "import '@taro-oh/library/src/main/ets/npm/@tarojs/plugin-platform-harmony-cpp/dist/runtime/runtime-harmony'"

function syncNativeBridge(harmonyConfig) {
  if (!harmonyConfig || !harmonyConfig.projectPath) {
    return
  }

  const etsDir = path.join(
    harmonyConfig.projectPath,
    harmonyConfig.hapName || 'entry',
    'src',
    'main',
    'ets'
  )
  const appPath = path.join(etsDir, 'app.ets')

  // Taro 会清空整个 ets 目录，需恢复 module.json5 中引用的备份 Ability
  const backupDir = path.join(etsDir, 'entrybackupability')
  fs.mkdirSync(backupDir, { recursive: true })
  fs.copyFileSync(BACKUP_ABILITY_SOURCE, path.join(backupDir, 'EntryBackupAbility.ets'))

  if (!fs.existsSync(appPath) || !fs.existsSync(BRIDGE_SOURCE)) {
    return
  }

  const targetDir = path.join(etsDir, 'native-bridge')
  fs.mkdirSync(targetDir, { recursive: true })
  fs.copyFileSync(BRIDGE_SOURCE, path.join(targetDir, 'NativeBridge.ets'))

  const code = fs.readFileSync(appPath, 'utf8')
  const eol = code.includes('\r\n') ? '\r\n' : '\n'
  let nextCode = code

  // 修复 Taro 模板中未初始化变量导致的 ArkTS 严格模式编译错误
  nextCode = nextCode.replace(/let levelRes:\s*number(?!\s*=)/, 'let levelRes: number = 0')

  const pageDir = path.join(etsDir, 'pages')
  if (fs.existsSync(pageDir)) {
    const pageFiles = []
    const collectEts = dir => {
      fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          collectEts(fullPath)
        } else if (entry.name.endsWith('.ets')) {
          pageFiles.push(fullPath)
        }
      })
    }
    collectEts(pageDir)
    pageFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8')
      const patched = content.replace(/let pendingAreaChange:\s*TaroAny(?!\s*=)/, 'let pendingAreaChange: TaroAny = undefined')
      if (patched !== content) {
        fs.writeFileSync(file, patched, 'utf8')
      }
    })
  }

  if (!nextCode.includes(IMPORT_LINE)) {
    if (nextCode.includes(RUNTIME_IMPORT)) {
      nextCode = nextCode.replace(RUNTIME_IMPORT, `${RUNTIME_IMPORT}${eol}${IMPORT_LINE}`)
    } else {
      nextCode = `${IMPORT_LINE}${eol}${nextCode}`
    }
  }
  fs.writeFileSync(appPath, nextCode, 'utf8')
}

module.exports = function harmonyNativeBridgePlugin(ctx) {
  ctx.onBuildFinish(() => {
    try {
      const harmonyConfig = ctx.initialConfig && ctx.initialConfig.harmony
      syncNativeBridge(harmonyConfig)
    } catch (err) {
      console.warn('[harmony-native-bridge] 注入原生桥接失败:', err)
    }
  })
}

'use strict'

const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const projectRoot = path.resolve(__dirname, '..')
const watchDirs = ['src', 'config', 'native'].map(dir => path.join(projectRoot, dir))
const watchPattern = /\.(tsx?|jsx?|scss|css|less|json|ets)$/

let debounceTimer = null
let currentBuild = null
let suppressUntil = 0

function shouldWatch(filename) {
  if (!filename || !watchPattern.test(filename)) return false
  const parts = filename.split(/[\\/]/)
  return !parts.some(part => part.startsWith('.') || part === 'node_modules')
}

function runBuild() {
  if (currentBuild) return

  suppressUntil = Date.now() + 10000
  console.log('[watch] 开始构建 harmony_cpp...')
  currentBuild = spawn('npm', ['run', 'build:harmony'], {
    cwd: projectRoot,
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true
  })

  const finish = code => {
    currentBuild = null
    suppressUntil = Date.now() + 3000
    console.log(`[watch] 构建结束，退出码 ${code}`)
  }
  currentBuild.on('exit', finish)
  currentBuild.on('error', err => {
    finish(1)
    console.error('[watch] 构建进程启动失败:', err)
  })
}

function scheduleBuild(filename) {
  console.log(`[watch] 检测到变更: ${filename}`)
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(runBuild, 500)
}

runBuild()

watchDirs.forEach(dir => {
  if (!fs.existsSync(dir)) return
  fs.watch(dir, { recursive: true }, (event, filename) => {
    if (Date.now() < suppressUntil) return
    if (shouldWatch(filename)) scheduleBuild(filename)
  })
})

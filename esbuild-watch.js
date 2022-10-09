const spawn = require('child_process').spawn;
const esbuild = require('esbuild')

const print = console.log

var nodeServerProcess = null

function launchApp() {
  nodeServerProcess = spawn('node', ['dist/server.js'])

  nodeServerProcess.stdout.setEncoding('utf8');
  nodeServerProcess.stdout.on('data', (data) => print(data))

  nodeServerProcess.stderr.setEncoding('utf8');
  nodeServerProcess.stderr.on('data', (data) => print(data))

  nodeServerProcess.on('close', (code) => print('Exit code: ' + code))
}

esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/server.js',
  bundle: true,
  platform: 'node',
  watch: {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error)
      else {
        print('watch build succeeded:', result)
        // HERE: somehow restart the server from here, e.g., by sending a signal that you trap and react to inside the server.
        if (nodeServerProcess !== null) nodeServerProcess.kill()

        launchApp();
      }
    },
  },
}).then(result => {
  print('watching...')
  launchApp();
})
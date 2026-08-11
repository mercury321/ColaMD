const { execSync } = require('child_process')
const path = require('path')

exports.default = async function (context) {
  if (process.platform === 'win32') {
    const appInfo = context.packager.appInfo
    const executablePath = path.join(context.appOutDir, `${appInfo.productFilename}.exe`)
    const numericVersion = `${appInfo.version.split('-')[0]}.0`
    const { rcedit } = await import('rcedit')

    await rcedit(executablePath, {
      'version-string': {
        CompanyName: 'Mercury321',
          FileDescription: 'ColaMD Mercury定制版',
          InternalName: 'ColaMD Mercury CE',
        OriginalFilename: `${appInfo.productFilename}.exe`,
          ProductName: 'ColaMD Mercury定制版'
      },
      'file-version': numericVersion,
      'product-version': numericVersion
    })
    return
  }

  if (process.platform !== 'darwin') return

  const appPath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`)
  console.log(`Cleaning extended attributes and resource forks from ${appPath}`)
  // Remove extended attributes
  execSync(`xattr -cr "${appPath}"`)
  // Remove HFS+ resource forks that xattr -cr doesn't handle
  execSync(`find "${appPath}" -type f -exec sh -c 'cat /dev/null > "$1/..namedfork/rsrc" 2>/dev/null; true' _ {} \\;`)
}

var fs = require('fs')

if (!fs.existsSync('./.setting.js')) {
	console.error('ERROR: Нет файла ./.setting.js')
	process.exit()
}

var setting   = require('./.setting.js'),
	FtpDeploy = require('ftp-deploy'),
	ftpDeploy = new FtpDeploy()
	config    = {
		username   : setting.ftp.login,
		password   : setting.ftp.password,
		host       : setting.ftp.host,
		port       : setting.ftp.port,
		localRoot  : __dirname + setting.ftp.localRoot,
		remoteRoot : setting.ftp.remoteRoot,
		exclude    : [
			'bitrix/*',
		]
	}

ftpDeploy.on('uploading', function(data) {
	console.log(data.filename)
})

ftpDeploy.deploy(config, function(err) {
	if (err) {
		console.log(err)
	} else {
		console.log('\n# finished')
	}
})

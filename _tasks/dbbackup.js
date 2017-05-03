#! /usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const execSync = require('child_process').execSync;

const projectRootPath = path.join(__dirname, '../');
const dbBackupFolderPath = path.join(os.homedir(), 'Dropbox/dbbackups/music-player-server');

const dbConfig = JSON.parse(fs.readFileSync(path.join(projectRootPath, 'src/database/config.json'), 'utf8'));

execSync(`/usr/local/bin/mysqldump -u${dbConfig.development.username} -p${dbConfig.development.password} music-player > ${dbBackupFolderPath}/$(date +%Y%m%d-%H%M%S).sql`);

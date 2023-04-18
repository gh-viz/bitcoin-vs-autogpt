const fs = require('fs');
const path = require('path');

class VercelEnv {
  static cat() {
    const evidenceSetting = fs.readFileSync(path.join(__dirname, '.evidence/template/evidence.settings.json'));
    const evidenceSettingJson = JSON.parse(evidenceSetting);
    const output = `
DATABASE=mysql
MYSQL_HOST=${evidenceSettingJson.credentials.host}
MYSQL_DATABASE=${evidenceSettingJson.credentials.database}
MYSQL_USER=${evidenceSettingJson.credentials.user}
MYSQL_PASSWORD=${evidenceSettingJson.credentials.password}
MYSQL_PORT=${evidenceSettingJson.credentials.port}
MYSQL_SSL=${evidenceSettingJson.credentials.ssl}
`;
    console.log(output);
  }
}

VercelEnv.cat();

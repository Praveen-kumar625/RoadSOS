import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const output = fs.createWriteStream('../../RoadSoS_DivineCoders_Submission.zip');
const archive = archiver('zip', { zlib: { level: 9 } });
output.on('close', () => console.log('Archive created: ' + archive.pointer() + ' bytes'));
archive.pipe(output);
archive.glob('**/*', {
  cwd: '../../',
  ignore: ['node_modules/**', '.git/**', '.env.local', '**/*.zip', 'tools/scripts/node_modules/**']
});
archive.finalize();
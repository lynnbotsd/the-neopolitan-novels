import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const files=['index.html','app.mjs','model.mjs','data.mjs','routing.mjs','styles.css','tests/spoilers.test.mjs','tests/routing.test.mjs'];
const source=await Promise.all(files.map(async name=>[name,(await readFile(new URL(name,root),'utf8')).replace(/\?v=[a-f0-9]+/g,'')]));
const version=createHash('sha256').update(source.map(([n,s])=>n+'\n'+s).join('\n')).digest('hex').slice(0,12);
for(const [name,text] of source){
  const output=text.replace(/(\.\/(?:app\.mjs|model\.mjs|data\.mjs|routing\.mjs|styles\.css))(?=['"])/g,`$1?v=${version}`);
  await writeFile(new URL(name,root),output);
}
console.log(`Versioned all browser assets: ${version}`);

import test from 'node:test';
import assert from 'node:assert/strict';
import {snapshot,connections,validBook} from '../model.mjs';
import {people,relationships} from '../data.mjs';

test('fresh / invalid progress defaults to Book 1',()=>{for(const v of [undefined,0,5,'garbage',1.5])assert.equal(validBook(v),1);});
test('all references resolve and event versions are ordered',()=>{
  const ids=new Set(people.map(p=>p.id));assert.equal(ids.size,people.length);
  for(const r of relationships){assert.ok(ids.has(r.a)&&ids.has(r.b),r.id);assert.ok(r.versions.every((v,i,a)=>v.book>=1&&v.book<=4&&(!i||v.book>a[i-1].book)),r.id);}
});
test('Book 1 includes Elena–Antonio and Donato assault, without later sex or family',()=>{
  const s=snapshot(1),list=connections(s,'elena');
  assert.ok(list.some(r=>r.id==='elena-antonio'));
  const d=list.find(r=>r.id==='elena-donato');assert.match(d.label,/assault/i);assert.doesNotMatch(JSON.stringify(d),/seventeen|later sexual|intercourse|at 17/i);
  const text=JSON.stringify(s);for(const future of ['Imma','Silvana','Eleonora','Mirko','Gennaro','Pietro','Franco','Tina','widowed','breakup'])assert.ok(!new RegExp('\\b'+future+'\\b').test(text),future);
});
test('later people and relationship histories are removed when stepping back',()=>{
  const later=snapshot(4);assert.ok(later.people.some(p=>p.id==='silvana'));
  const earlier=snapshot(2);assert.ok(!earlier.people.some(p=>p.id==='silvana'));
  for(const r of earlier.relationships){assert.ok(!('versions' in r));assert.ok(r.history.every(v=>v.book<=2));}
  assert.ok(!earlier.relationships.some(r=>r.id==='stefano-marisa'));
});
test('Gennaro’s parentage follows the reader’s knowledge',()=>{
  const b2=snapshot(2).relationships.find(r=>r.id==='lila-stefano');assert.match(b2.note,/believes Nino/);assert.doesNotMatch(b2.note,/conclude|strongly points/);
  const b3=snapshot(3).relationships.find(r=>r.id==='lila-stefano');assert.match(b3.note,/conclude.*Stefano/);
});
test('Elena and Nino’s connection changes without leaking Imma into Book 3',()=>{
  assert.equal(snapshot(1).relationships.find(r=>r.id==='elena-nino').label,'Elena’s longstanding crush');
  const b3=snapshot(3).relationships.find(r=>r.id==='elena-nino');assert.match(b3.label,/affair/i);assert.deepEqual(b3.children,[]);
  assert.deepEqual(snapshot(4).relationships.find(r=>r.id==='elena-nino').children,['Imma']);
});
test('every visible connection has visible endpoints at every cutoff',()=>{
  for(let book=1;book<=4;book++){const s=snapshot(book),ids=new Set(s.people.map(p=>p.id));for(const r of s.relationships)assert.ok(ids.has(r.a)&&ids.has(r.b));}
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {snapshot,connections,validBook} from '../model.mjs?v=6975619567b7';
import {people,relationships} from '../data.mjs?v=6975619567b7';

test('dating is distinct from affairs and changes with the book',()=>{
  for(let book=1;book<=3;book++)assert.equal(snapshot(book).relationships.find(r=>r.id==='elena-gino').type,'dating');
  for(let book=1;book<=3;book++)assert.equal(snapshot(book).relationships.find(r=>r.id==='elena-antonio').type,'dating');
  assert.equal(snapshot(4).relationships.find(r=>r.id==='elena-antonio').type,'encounter');
  assert.equal(snapshot(1).relationships.find(r=>r.id==='elena-nino').type,'attraction');
  assert.equal(snapshot(3).relationships.find(r=>r.id==='elena-nino').type,'affair');
  assert.equal(people.find(p=>p.id==='gino').subtitle,'The pharmacist’s son');
});

test('no friendship or Elena–Lila connection reaches any book snapshot',()=>{
  for(let book=1;book<=4;book++){
    const s=snapshot(book);
    assert.ok(s.relationships.every(r=>r.type!=='friendship'));
    assert.ok(!s.relationships.some(r=>[r.a,r.b].includes('elena')&&[r.a,r.b].includes('lila')));
  }
});

test('snapshot rejects accidentally reintroduced platonic data',()=>{
  const friendship={id:'accidental-friendship',a:'elena',b:'lila',type:'friendship',versions:[{book:1,label:'Friendship',children:[],note:''}]};
  relationships.push(friendship);
  try{for(let book=1;book<=4;book++)assert.ok(!snapshot(book).relationships.some(r=>r.id===friendship.id));}
  finally{relationships.pop();}
});

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

test('book-specific characters and their edges do not carry into later books',()=>{
  for(const id of ['gino','bruno','manuela']){
    assert.ok(snapshot(3).people.some(p=>p.id===id));
    assert.ok(!snapshot(4).people.some(p=>p.id===id));
    assert.ok(!snapshot(4).relationships.some(r=>r.a===id||r.b===id));
    assert.ok(snapshot(4).families.every(f=>!f.parents.includes(id)&&!f.children.includes(id)));
  }
  assert.ok(!snapshot(1).relationships.find(r=>r.id==='elena-gino').past);
  for(const book of [2,3])assert.equal(snapshot(book).relationships.find(r=>r.id==='elena-gino').past,true);
  assert.equal(snapshot(3).relationships.find(r=>r.id==='elena-gino').label,'Former boyfriend');
  assert.ok(snapshot(1).people.some(p=>p.id==='gino'));
});

test('Book 1 includes Enzo and Pasquale’s one-sided feelings without later spoilers',()=>{
  const b1=snapshot(1);
  for(const id of ['lila-enzo','lila-pasquale']){
    const r=b1.relationships.find(r=>r.id===id);
    assert.ok(r,id);assert.equal(r.type,'attraction');assert.ok(!r.past);
    assert.deepEqual(r.children,[]);assert.equal(r.history.length,1);
    assert.ok(connections(b1,'lila').some(c=>c.id===id));
    assert.ok(connections(b1,id==='lila-enzo'?'enzo':'pasquale').some(c=>c.id===id));
  }
  assert.equal(snapshot(3).relationships.find(r=>r.id==='lila-enzo').type,'partnership');
  assert.equal(snapshot(2).relationships.find(r=>r.id==='lila-pasquale').past,true);
});

test('Elena and Donato are marked past only after Book 2',()=>{
  for(const book of [1,2])assert.ok(!snapshot(book).relationships.find(r=>r.id==='elena-donato').past);
  for(const book of [3,4]){
    const r=snapshot(book).relationships.find(r=>r.id==='elena-donato');
    assert.equal(r.past,true);assert.equal(r.type,'abuse');
    assert.equal(r.label,'Past assault and sexual encounter');
  }
});

test('chronology follows first involvement without revealing future connections',()=>{
  assert.deepEqual(connections(snapshot(1),'elena').map(r=>r.id),['elena-nino','elena-gino','elena-donato','elena-antonio']);
  for(let book=1;book<=4;book++)for(const r of snapshot(book).relationships){
    assert.ok(Number.isFinite(r.chronology.rank),r.id);
    assert.equal(r.chronology.period,r.history[0].chronology.period);
    assert.ok(r.history[0].book<=book);
  }
  const last=connections(snapshot(4),'nino').filter(r=>['nino-doctor','nino-silvana','nino-mirella'].includes(r.id));
  assert.equal(new Set(last.map(r=>r.chronology.rank)).size,1);
  assert.ok(last.every(r=>r.chronology.period.includes('uncertain')));
});

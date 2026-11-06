import test from 'node:test';
import assert from 'node:assert/strict';
import {snapshot,connections} from '../model.mjs?v=ba4471fc9e8c';
import {typeLabels} from '../data.mjs?v=ba4471fc9e8c';
import {routeConnections,segmentHitsBox} from '../routing.mjs?v=ba4471fc9e8c';
function fixture(state,selected){
  const positions=new Map();
  state.families.forEach((f,i)=>{
    const cx=140+i*210;
    f.parents.forEach((id,j)=>positions.set(id,{x:cx+(f.parents.length===2?(j?51:-51):0),y:145,w:f.parents.length===2?94:145,h:38,parent:true,column:i}));
    f.children.forEach((id,j)=>positions.set(id,{x:cx+10,y:280+j*61,w:148,h:42,column:i}));
  });
  const relationships=connections(state,selected),connected=new Set([selected,...relationships.flatMap(r=>[r.a,r.b])]);
  state.people.filter(p=>!positions.has(p.id)&&connected.has(p.id)).forEach((p,i)=>positions.set(p.id,{x:140+state.families.length*210,y:280+i*61,w:168,h:42}));
  return {positions,relationships,selected,labelFor:(r,id)=>({name:state.people.find(p=>p.id===id).label,category:typeLabels[r.type]})};
}
test('every character in every book has routes clear of cards and other labels',()=>{
  for(let book=1;book<=4;book++){
    const state=snapshot(book);
    for(const person of state.people){
      const input=fixture(state,person.id),before=JSON.stringify([...input.positions]),result=routeConnections(input);
      assert.equal(result.routes.length,input.relationships.length,`${book}/${person.id}`);
      assert.equal(JSON.stringify([...input.positions]),before,'Routing moved a character');
      for(const route of result.routes){
        const {points,relationship:r,label}=route;
        for(let i=1;i<points.length;i++){
          assert.ok(points[i].x===points[i-1].x||points[i].y===points[i-1].y);
          for(const [id,card]of input.positions){
            if((i===1&&id===r.a)||(i===points.length-1&&id===r.b))continue;
            assert.ok(!segmentHitsBox(points[i-1],points[i],card,1),`${book}/${r.id} crosses ${id}`);
          }
          for(const other of result.routes)if(other!==route)assert.ok(!segmentHitsBox(points[i-1],points[i],other.label,1),`${r.id} crosses ${other.id} label`);
        }
        for(const card of input.positions.values())assert.ok(Math.abs(label.x-card.x)>=(label.w+card.w)/2||Math.abs(label.y-card.y)>=(label.h+card.h)/2,'Label overlaps a card');
        assert.ok(label.y+label.h/2<result.height);
      }
    }
  }
});
test('Elena uses separate ports and nearby gaps instead of bottom loops',()=>{
  const input=fixture(snapshot(1),'elena'),result=routeConnections(input);
  const starts=result.routes.map(r=>r.relationship.a==='elena'?r.points[0]:r.points.at(-1));
  assert.equal(new Set(starts.map(p=>p.y)).size,starts.length);
  const antonio=result.routes.find(r=>r.id==='elena-antonio');
  const bottom=Math.max(...[...input.positions.values()].map(p=>p.y+p.h/2));
  assert.ok(antonio.label.y<bottom);
  assert.deepEqual(routeConnections(input),result,'Routes must be deterministic');
});

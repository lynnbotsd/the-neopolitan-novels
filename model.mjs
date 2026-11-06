import {families,people,relationships} from './data.mjs?v=1939ae38b125';
export const mappedRelationshipTypes = new Set(['marriage','partnership','dating','affair','attraction','relationship','abuse','encounter','pursuit']);
export function validBook(value){const n=Number(value);return Number.isInteger(n)&&n>=1&&n<=4?n:1;}
export function snapshot(bookValue){
  const book=validBook(bookValue);
  const visiblePeople=people.filter(p=>p.introduced<=book&&(!p.appearsIn||p.appearsIn.includes(book)));
  const ids=new Set(visiblePeople.map(p=>p.id));
  const visibleRelationships=relationships.flatMap(r=>{
    if(!mappedRelationshipTypes.has(r.type))return [];
    const history=r.versions.filter(v=>v.book<=book);
    if(!history.length||!ids.has(r.a)||!ids.has(r.b))return [];
    // Never return future versions, even in an otherwise-hidden data attribute.
    const {versions,...base}=r;return [{...base,...history.at(-1),chronology:history[0].chronology,history}];
  });
  return {book,people:visiblePeople,families:families.filter(f=>(f.introduced||1)<=book).map(f=>({...f,parents:f.parents.filter(id=>ids.has(id)),children:f.children.filter(id=>ids.has(id))})),relationships:visibleRelationships};
}
export function connections(state,id){return state.relationships.filter(r=>r.a===id||r.b===id).sort((a,b)=>(a.chronology?.rank??Infinity)-(b.chronology?.rank??Infinity));}

import {books,typeLabels} from './data.mjs?v=216bcf6f76f8';
import {snapshot,connections,validBook} from './model.mjs?v=216bcf6f76f8';

const $=s=>document.querySelector(s);
const ns='http://www.w3.org/2000/svg';
let book=1,selected='elena',zoom=.75,state=snapshot(1),layout;
function el(tag,attrs={},text){const node=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))node.setAttribute(k,v);if(text!==undefined)node.textContent=text;return node;}
function html(tag,className,text){const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;}
function person(id){return state.people.find(p=>p.id===id);}
function familyOf(id){return state.families.find(f=>f.parents.includes(id)||f.children.includes(id));}
function name(id){const p=person(id),f=familyOf(id);return p.label+(f?' '+f.name:'');}

function buildLayout(){
  const width=Math.max(1500,state.families.length*210+70),positions=new Map();
  state.families.forEach((f,i)=>{
    const cx=140+i*210;
    f.parents.forEach((id,j)=>positions.set(id,{x:cx+(f.parents.length===2?(j?51:-51):0),y:145,w:f.parents.length===2?94:145,h:38,parent:true,column:i}));
    f.children.forEach((id,j)=>positions.set(id,{x:cx+10,y:280+j*61,w:148,h:42,column:i}));
  });
  const outside=state.people.filter(p=>!positions.has(p.id));
  outside.forEach((p,i)=>positions.set(p.id,{x:140+(i%Math.floor((width-70)/190))*190,y:730+Math.floor(i/Math.floor((width-70)/190))*62,w:168,h:42,outside:true}));
  const list=connections(state,selected);
  return {width,height:Math.max(1030,920+list.length*70),positions,outside,list};
}
function nodeGraphic(p,pos,related){
  const g=el('g',{class:'person-node'+(pos.parent?' parent':'')+(p.id===selected?' selected':related.has(p.id)?' related':''),role:'button',tabindex:'0','aria-label':name(p.id)+(p.subtitle?', '+p.subtitle:'')+'; show connections','aria-pressed':String(p.id===selected),'data-person':p.id,transform:`translate(${pos.x},${pos.y})`});
  g.append(el('rect',{x:-pos.w/2,y:-pos.h/2,width:pos.w,height:pos.h}));
  g.append(el('text',{x:0,y:p.subtitle?-3:4},p.label));
  if(p.subtitle)g.append(el('text',{x:0,y:13,class:'node-subtitle'},p.subtitle));
  return g;
}
function drawMap(){
  layout=buildLayout();const svg=$('#family-map');svg.replaceChildren();svg.setAttribute('width',layout.width);svg.setAttribute('height',layout.height);svg.setAttribute('viewBox',`0 0 ${layout.width} ${layout.height}`);
  svg.append(el('title',{id:'map-title'},`Family relationships through Book ${book}`));
  svg.append(el('desc',{id:'map-desc'},`${state.families.length} families aligned across the top. Parent branches descend to their children. Lines below trace ${name(selected)}’s known relationships. Select a name for details.`));
  const lines=el('g',{'aria-hidden':'true'});svg.append(lines);
  state.families.forEach((f,i)=>{
    const cx=140+i*210;svg.append(el('text',{x:cx,y:48,'text-anchor':'middle',class:'family-heading'},f.name));
    svg.append(el('text',{x:cx,y:71,'text-anchor':'middle',class:'family-trade'},f.trade));
    svg.append(el('line',{x1:cx-83,x2:cx+83,y1:90,y2:90,class:'family-rule'}));
    const childBottom=280+(f.children.length-1)*61;
    if(f.parents.length){
      let d=`M${cx} 165 V210 H${cx-83} V${childBottom}`;
      if(f.parents.length===2)d+=` M${cx-51} 164 V185 H${cx+51} V164 M${cx} 185 V210`;
      lines.append(el('path',{d,class:'family-line'}));
    }else lines.append(el('path',{d:`M${cx-83} 240 V${childBottom}`,class:'family-line'}));
    f.children.forEach(id=>{const p=layout.positions.get(id);lines.append(el('path',{d:`M${cx-83} ${p.y} H${p.x-p.w/2}`,class:'family-line'}));});
  });
  svg.append(el('text',{x:56,y:235,class:'generation-label'},'THE CHILDHOOD GENERATION'));
  if(layout.outside.length)svg.append(el('text',{x:56,y:674,class:'other-heading'},'OTHER PEOPLE · INTRODUCED BY THIS BOOK'));
  const nodes=el('g');const related=new Set(layout.list.flatMap(r=>[r.a,r.b]));
  const edges=el('g',{'aria-hidden':'true'});
  layout.list.forEach((r,i)=>{
    const a=layout.positions.get(r.a),b=layout.positions.get(r.b),y=870+i*70;
    const ax=a.x+a.w/2,bx=b.x+b.w/2,ag=ax+13,bg=bx+13;
    const min=Math.min(ag,bg),max=Math.max(ag,bg),center=(min+max)/2;
    let d=`M${ax} ${a.y} H${ag} V${y-8} Q${ag} ${y} ${ag+8} ${y} H${bg-8} Q${bg} ${y} ${bg} ${y-8} V${b.y} H${bx}`;
    if(ag>bg)d=`M${ax} ${a.y} H${ag} V${y-8} Q${ag} ${y} ${ag-8} ${y} H${bg+8} Q${bg} ${y} ${bg} ${y-8} V${b.y} H${bx}`;
    edges.append(el('path',{d,class:'connection-line '+r.type}));
    const label=person(r.a).label+' + '+person(r.b).label;
    const labelWidth=Math.max(180,label.length*6.5+24);
    edges.append(el('rect',{x:center-labelWidth/2,y:y-15,width:labelWidth,height:30,class:'connection-label-bg'}));
    edges.append(el('text',{x:center,y:y+4,class:'connection-label'},label));
    const sub=r.children.length?'↓ '+r.children.join(' · '):typeLabels[r.type];
    edges.append(el('text',{x:center,y:y+32,class:'child-label'},sub));
  });
  svg.append(edges);
  state.people.forEach(p=>nodes.append(nodeGraphic(p,layout.positions.get(p.id),related)));svg.append(nodes);
  $('#map-caption').textContent=`Book ${book} · ${name(selected)}’s connections`;
  resizeMap();
}
function drawPanel(){
  const p=person(selected),f=familyOf(selected),list=connections(state,selected),panel=$('#person-panel');panel.replaceChildren();
  panel.append(html('p','panel-eyebrow',`Through Book ${book}`));
  panel.append(html('h2','person-name',name(selected)));
  panel.append(html('p','person-role',p.role));
  panel.append(html('span','family-pill',f?f.trade:'Beyond the neighborhood'));
  const heading=html('h3','panel-heading','Known connections');heading.append(html('span','',String(list.length)));panel.append(heading);
  if(!list.length)panel.append(html('p','empty-connections','No romantic or sexual connection is mapped for this person at this point. Their family branch is shown above.'));
  list.forEach(r=>{
    const other=r.a===selected?r.b:r.a;const item=html('section','relationship-item');
    const b=html('button','partner-button',name(other));b.type='button';b.dataset.person=other;b.append(html('span','','↗'));item.append(b);
    if(person(other).subtitle)item.append(html('p','partner-subtitle',person(other).subtitle));
    item.append(html('p','relationship-type',typeLabels[r.type]));item.append(html('p','relationship-status',r.label));
    if(r.children.length){const c=html('p','children');c.append(html('strong','','Children · '));c.append(document.createTextNode(r.children.join(', ')));item.append(c);}
    if(r.note)item.append(html('p','relationship-note',r.note));
    if(r.history.length>1){const detail=html('details'),sum=html('summary','','How this changes across the books'),ol=html('ol');r.history.forEach(v=>ol.append(html('li','',`Book ${v.book}: ${v.label}`)));detail.append(sum,ol);item.append(detail);}
    panel.append(item);
  });
}
function resizeMap(){if(!layout)return;$('#family-map').style.transform=`scale(${zoom})`;$('#map-size').style.width=layout.width*zoom+'px';$('#map-size').style.height=layout.height*zoom+'px';$('#zoom-label').textContent=Math.round(zoom*100)+'%';}
function render(){drawMap();drawPanel();}
function setBook(value){book=validBook(value);state=snapshot(book);if(!person(selected))selected='elena';document.querySelectorAll('[data-book]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.book)===book)));$('#reading-note').textContent=`Showing only information revealed through the end of Book ${book}.`;render();}
function selectPerson(id){if(!person(id))return;selected=id;render();}
document.addEventListener('click',e=>{const b=e.target.closest('[data-book]');if(b)setBook(b.dataset.book);const p=e.target.closest('[data-person]');if(p)selectPerson(p.dataset.person);});
$('#family-map').addEventListener('keydown',e=>{const p=e.target.closest('[data-person]');if(p&&(e.key==='Enter'||e.key===' ')){e.preventDefault();selectPerson(p.dataset.person);const restored=$('#family-map').querySelector(`[data-person="${selected}"]`);restored?.focus({preventScroll:true});}});
$('#zoom-out').addEventListener('click',()=>{zoom=Math.max(.3,zoom-.15);resizeMap();});
$('#zoom-in').addEventListener('click',()=>{zoom=Math.min(1.6,zoom+.15);resizeMap();});
$('#fit').addEventListener('click',()=>{zoom=Math.min(1,($('#map-scroll').clientWidth-24)/layout.width);resizeMap();$('#map-scroll').scrollTo(0,0);});
$('#sources-toggle').addEventListener('click',()=>{const open=$('#sources').hidden;$('#sources').hidden=!open;$('#sources-toggle').setAttribute('aria-expanded',String(open));});
render();

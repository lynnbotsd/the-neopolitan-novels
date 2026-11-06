// Routes only the selected person's visible connections. Character positions stay fixed.
export function segmentHitsBox(a,b,box,pad=0){
  const left=box.x-box.w/2-pad,right=box.x+box.w/2+pad;
  const top=box.y-box.h/2-pad,bottom=box.y+box.h/2+pad;
  if(a.x===b.x)return a.x>left&&a.x<right&&Math.max(a.y,b.y)>top&&Math.min(a.y,b.y)<bottom;
  return a.y>top&&a.y<bottom&&Math.max(a.x,b.x)>left&&Math.min(a.x,b.x)<right;
}
const segments=points=>points.slice(1).map((p,i)=>[points[i],p]);
const overlap=(a,b,pad=0)=>Math.abs(a.x-b.x)<(a.w+b.w)/2+pad&&Math.abs(a.y-b.y)<(a.h+b.h)/2+pad;
function crosses(a,b,c,d){
  if((a.x===b.x)===(c.x===d.x))return false;
  const [v1,v2,h1,h2]=a.x===b.x?[a,b,c,d]:[c,d,a,b];
  return v1.x>Math.min(h1.x,h2.x)&&v1.x<Math.max(h1.x,h2.x)&&h1.y>Math.min(v1.y,v2.y)&&h1.y<Math.max(v1.y,v2.y);
}
export function routeConnections({positions,relationships,selected,labelFor}){
  const cards=[...positions.values()];
  const bottom=Math.max(...cards.map(p=>p.y+p.h/2));
  const edges=[...relationships].sort((a,b)=>(a.chronology?.rank??Infinity)-(b.chronology?.rank??Infinity));
  const ports=new Map();
  for(const [id,p]of positions){
    const attached=edges.filter(r=>r.a===id||r.b===id).sort((a,b)=>{
      const other=r=>positions.get(r.a===id?r.b:r.a).x;
      return other(a)-other(b)||a.id.localeCompare(b.id);
    });
    attached.forEach((r,i)=>{
      // Left-hand parents exit outward, avoiding their spouse's card.
      const side=p.parent&&p.x<=140+p.column*210?-1:1;
      const y=p.y+(i-(attached.length-1)/2)*Math.min(4,(p.h-12)/Math.max(1,attached.length-1));
      ports.set(r.id+':'+id,{x:p.x+side*p.w/2,y,rail:p.x+side*(p.w/2+10+i*4)});
    });
  }
  const routes=[];
  const obstacles=[...cards,{x:90,y:233,w:70,h:18}]; // generation heading
  // Keep the horizontal stack entirely below every visible character card.
  const laneYs=Array.from({length:edges.length+1},(_,i)=>bottom+44+i*64);
  for(const r of edges){
    const a=ports.get(r.id+':'+r.a),b=ports.get(r.id+':'+r.b);
    const other=r.a===selected?r.b:r.a;
    const labels=labelFor(r,other);
    // Keep labels between rail columns, including rails of connections routed later.
    // This prevents an early label from blocking a later chronological lane.
    const railXs=[...new Set([...ports.values()].map(p=>p.rail))].sort((x,y)=>x-y);
    const low=Math.min(a.rail,b.rail),high=Math.max(a.rail,b.rail);
    const intervals=railXs.slice(1).map((x,i)=>[Math.max(low+8,railXs[i]+6),Math.min(high-8,x-6)]).filter(([l,h])=>h>l);
    let text,labelWidth,labelX;
    for(const candidate of [labels.name]){
      const w=Math.max(56,candidate.length*6+20,labels.category.length*5.2+16);
      const slots=intervals.filter(([l,h])=>h-l>=w).map(([l,h])=>Math.max(l+w/2,Math.min((low+high)/2,h-w/2)));
      if(slots.length){text=candidate;labelWidth=w;labelX=slots.sort((x,y)=>Math.abs(x-(low+high)/2)-Math.abs(y-(low+high)/2))[0];break;}
    }
    if(!text)throw Error('No label space for '+r.id);
    let best;
    for(const y of laneYs){
      if(routes.length&&y<routes.at(-1).laneY+64)continue;
      const points=[{x:a.x,y:a.y},{x:a.rail,y:a.y},{x:a.rail,y},{x:b.rail,y},{x:b.rail,y:b.y},{x:b.x,y:b.y}];
      const parts=segments(points);
      if(parts.some(([s,t],i)=>obstacles.some(box=>{
        if((i===0&&box===positions.get(r.a))||(i===parts.length-1&&box===positions.get(r.b)))return false;
        return segmentHitsBox(s,t,box,1);
      })))continue;
      const label={x:labelX,y:y+10,w:labelWidth,h:52};
      if(obstacles.some(box=>overlap(label,box,1)))continue;
      if(routes.some(route=>overlap(label,route.label,5)||parts.some(([s,t])=>segmentHitsBox(s,t,route.label,3))||segments(route.points).some(([s,t])=>segmentHitsBox(s,t,label,3))))continue;
      // Never share a horizontal track over the same span.
      if(routes.some(route=>route.laneY===y&&Math.max(Math.min(a.rail,b.rail),Math.min(route.points[2].x,route.points[3].x))<Math.min(Math.max(a.rail,b.rail),Math.max(route.points[2].x,route.points[3].x))))continue;
      const crossings=routes.reduce((sum,route)=>sum+parts.reduce((n,[s,t])=>n+segments(route.points).filter(([u,v])=>crosses(s,t,u,v)).length,0),0);
      const length=parts.reduce((sum,[s,t])=>sum+Math.abs(s.x-t.x)+Math.abs(s.y-t.y),0);
      const score=length+crossings*24;
      if(!best||score<best.score)best={id:r.id,relationship:r,points,label,laneY:y,text,subtitle:labels.category,score};
    }
    if(!best)throw Error('No clear route for '+r.id+' selected='+selected);
    routes.push(best);
  }
  return {routes,height:Math.max(bottom+45,...routes.map(r=>r.label.y+45))};
}
export function routePath(points){return points.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' ');}

// Book cutoffs are REVELATION dates, not necessarily event dates.
// Do not put future plot information in a character's static role or label.
export const books = ['My Brilliant Friend','The Story of a New Name','Those Who Leave and Those Who Stay','The Story of the Lost Child'];
const person = (id, label, role, introduced=1, subtitle='') => ({ id, label, role, introduced, ...(subtitle?{subtitle}:{}) });
export const families = [
  {id:'greco',name:'Greco',trade:'The porter’s family',parents:['vittorio','immacolata'],children:['elena','elisa','peppe','gianni']},
  {id:'cappuccio',name:'Cappuccio',trade:'Melina’s family',parents:['melina'],children:['antonio','ada']},
  {id:'sarratore',name:'Sarratore',trade:'The railway-worker poet’s family',parents:['donato','lidia'],children:['nino','marisa','pino','clelia','ciro']},
  {id:'cerullo',name:'Cerullo',trade:'The shoemaker’s family',parents:['fernando','nunzia'],children:['lila','rino']},
  {id:'carracci',name:'Carracci',trade:'The grocer’s family',parents:['achille','maria'],children:['stefano','pinuccia','alfonso']},
  {id:'scanno',name:'Scanno',trade:'The fruit sellers’ family',parents:['nicola','assunta'],children:['enzo']},
  {id:'peluso',name:'Peluso',trade:'The carpenter’s family',parents:['alfredo','giuseppina'],children:['pasquale','carmen']},
  {id:'solara',name:'Solara',trade:'The bar-pastry shop family',parents:['silvio','manuela'],children:['marcello','michele']},
  {id:'spagnuolo',name:'Spagnuolo',trade:'The pastry maker’s family',parents:[],children:['gigliola']},
  {id:'airota',name:'Airota',trade:'The academic family',parents:['guido','adele'],children:['pietro','mariarosa'],introduced:2},
  {id:'galiani',name:'Galiani',trade:'The teacher’s family',parents:['profgaliani'],children:['nadia'],introduced:2}
];
export const people = [
  person('vittorio','Vittorio','Elena’s father; a porter'),person('immacolata','Immacolata','Elena’s mother'),
  person('elena','Elena / Lenù','The narrator; daughter of the Greco family'),person('elisa','Elisa','Elena’s younger sister'),person('peppe','Peppe','Elena’s younger brother'),person('gianni','Gianni','Elena’s younger brother'),
  person('melina','Melina','Widow; mother of Antonio and Ada'),person('antonio','Antonio','Mechanic; Ada’s brother'),person('ada','Ada','Antonio’s sister; Melina’s daughter'),
  person('donato','Donato','Railway worker and poet'),person('lidia','Lidia','Donato’s wife; Nino and Marisa’s mother'),person('nino','Nino','Donato’s eldest son'),person('marisa','Marisa','Nino’s sister'),person('pino','Pino','One of Nino’s younger siblings'),person('clelia','Clelia','One of Nino’s younger siblings'),person('ciro','Ciro','One of Nino’s younger siblings'),
  person('fernando','Fernando','Shoemaker; Lila and Rino’s father'),person('nunzia','Nunzia','Lila and Rino’s mother'),person('lila','Lila / Lina','Raffaella Cerullo; Elena’s childhood friend'),person('rino','Rino','Lila’s older brother'),
  person('achille','Don Achille','Father of Stefano, Pinuccia, and Alfonso'),person('maria','Maria','Mother of Stefano, Pinuccia, and Alfonso'),person('stefano','Stefano','Don Achille’s eldest son'),person('pinuccia','Pinuccia','Stefano and Alfonso’s sister'),person('alfonso','Alfonso','Stefano’s younger brother; Elena’s schoolmate'),
  person('nicola','Nicola','Enzo’s father; fruit seller'),person('assunta','Assunta','Enzo’s mother; fruit seller'),person('enzo','Enzo','Son of the fruit sellers'),
  person('alfredo','Alfredo','Carpenter; father of Pasquale and Carmen'),person('giuseppina','Giuseppina','Mother of Pasquale and Carmen'),person('pasquale','Pasquale','Construction worker; Carmen’s brother'),person('carmen','Carmen','Carmela Peluso; Pasquale’s sister'),
  person('silvio','Silvio','Father of Marcello and Michele'),person('manuela','Manuela','Mother of Marcello and Michele'),person('marcello','Marcello','Michele’s brother'),person('michele','Michele','Marcello’s brother'),person('gigliola','Gigliola','The pastry maker’s daughter'),
  person('guido','Guido','Pietro and Mariarosa’s father',2),person('adele','Adele','Pietro and Mariarosa’s mother',2),person('pietro','Pietro','Son of the Airota family',2),person('mariarosa','Mariarosa','Pietro’s sister',2),
  person('profgaliani','Professor Galiani','Elena’s teacher; Nadia’s mother',2),person('nadia','Nadia','Professor Galiani’s daughter',2),
  person('gino','Gino','The pharmacist’s son',1,'The pharmacist’s son'),person('franco','Franco Mari','Elena’s university acquaintance',2),person('bruno','Bruno Soccavo','Nino’s friend; son of a factory owner',2),
  person('roberto','Roberto','The gas-station man',2),person('eleonora','Eleonora','From a wealthy Neapolitan family',3),person('silvia','Silvia','A young mother in Mariarosa’s circle',3),
  person('germanwife','Antonio’s wife','A German woman; not a neighborhood family member',4),person('silvana','Silvana','A housekeeper',4),person('mirella','Mirella','A babysitter',4),person('gynecologist','The gynecologist','A doctor known to Nino',4)
];
// A version is cumulative knowledge through the end of that book.
// Children and uncertain paternity belong inside versions so later revelations cannot leak backward.
const v = (book,label,children=[],note='',type) => ({book,label,children,note,...(type?{type}:{})});
export const relationships = [
  {id:'elena-antonio',a:'elena',b:'antonio',type:'dating',versions:[v(1,'Dating'),v(2,'Their youthful relationship ends'),v(4,'Former partners; a later sexual encounter',[],'Antonio is married when they sleep together again.','encounter')]},
  {id:'elena-donato',a:'elena',b:'donato',type:'abuse',versions:[v(1,'Sexual assault on Ischia',[],'Donato assaults Elena when she is fifteen. This is not a dating relationship.'),v(2,'Earlier assault; later sexual encounter',[],'At seventeen Elena has intercourse with Donato on the beach. Their history is exploitative; he is an adult who already assaulted her.')]},
  {id:'elena-gino',a:'elena',b:'gino',type:'dating',versions:[v(1,'Dating')]},
  {id:'elena-franco',a:'elena',b:'franco',type:'dating',versions:[v(2,'University relationship; later ends')]},
  {id:'elena-pietro',a:'elena',b:'pietro',type:'marriage',versions:[v(2,'Engaged'),v(3,'Marriage; Elena leaves at the end of the book',['Dede','Elsa']),v(4,'Separated; continuing ties as parents',['Dede','Elsa'])]},
  {id:'elena-nino',a:'elena',b:'nino',type:'attraction',versions:[v(1,'Elena’s longstanding crush',[],'A kiss on Ischia does not become a sustained relationship.'),v(2,'Elena remains in love with Nino'),v(3,'An affair begins',[],'','affair'),v(4,'Shared household; eventual breakup',['Imma'],'Nino maintains his marriage to Eleonora.','affair')]},
  {id:'lila-stefano',a:'lila',b:'stefano',type:'marriage',versions:[v(1,'Married at the end of the book'),v(2,'Abusive marriage; Lila leaves',['Gennaro / Rino'],'Lila believes Nino is Gennaro’s father at this stage.'),v(3,'Separated',['Gennaro / Rino'],'The children’s resemblance leads Lila to conclude that Stefano is Gennaro’s father.'),v(4,'Separated; parents of Gennaro',['Gennaro / Rino'],'The later narrative strongly points to Stefano as father; no biological test is supplied.')]},
  {id:'lila-nino',a:'lila',b:'nino',type:'affair',versions:[v(2,'Affair; brief cohabitation; breakup',[],'Lila initially believes her pregnancy is by Nino.'),v(3,'Former lovers',[],'Lila now believes Gennaro is Stefano’s son.'),v(4,'Former lovers; renewed advances rejected',[],'Lila tells Elena that Nino repeatedly tried to resume their relationship.')]},
  {id:'lila-enzo',a:'lila',b:'enzo',type:'partnership',versions:[v(2,'Enzo helps Lila; they share a household',[],'Sharing a home does not yet mean a sexual partnership.'),v(3,'A partnership develops'),v(4,'Long-term partnership; eventual separation',['Nunzia / Tina'])]},
  {id:'lila-marcello',a:'lila',b:'marcello',type:'pursuit',versions:[v(1,'Marcello pursues Lila; she rejects him')]},
  {id:'lila-michele',a:'lila',b:'michele',type:'pursuit',versions:[v(2,'Michele pursues Lila; she rejects him'),v(3,'Unwanted pursuit; power and work entanglements'),v(4,'Hostile power struggle; not a partnership')]},
  {id:'rino-pinuccia',a:'rino',b:'pinuccia',type:'marriage',versions:[v(2,'Marriage',['Ferdinando / Dino','Other children']),v(3,'Abusive marriage',['Ferdinando / Dino','Other children']),v(4,'Pinuccia is widowed',['Ferdinando / Dino','Other children'])]},
  {id:'stefano-ada',a:'stefano',b:'ada',type:'affair',versions:[v(2,'Affair; they form a household',['Maria']),v(3,'Relationship; a daughter together',['Maria']),v(4,'Former relationship',['Maria'])]},
  {id:'stefano-marisa',a:'stefano',b:'marisa',type:'affair',versions:[v(4,'Affair / later relationship',['Two children'],'The children bear Alfonso’s name; Stefano is their biological father.')]},
  {id:'alfonso-marisa',a:'alfonso',b:'marisa',type:'marriage',versions:[v(1,'Youthful relationship',[],'','dating'),v(2,'Relationship continues',[],'','dating'),v(3,'Marriage',['Children']),v(4,'Marriage breaks down',['Two children'],'The children bear Alfonso’s name; Stefano is their biological father.')]},
  {id:'alfonso-michele',a:'alfonso',b:'michele',type:'relationship',versions:[v(4,'Sexual relationship; rejection and abuse')]},
  {id:'ada-pasquale',a:'ada',b:'pasquale',type:'dating',versions:[v(1,'Dating'),v(2,'Relationship ends')]},
  {id:'pasquale-nadia',a:'pasquale',b:'nadia',type:'partnership',versions:[v(3,'Romantic and political partnership'),v(4,'Former comrades; imprisonment and conflicting testimony')]},
  {id:'enzo-carmen',a:'enzo',b:'carmen',type:'dating',versions:[v(1,'Dating'),v(2,'Enzo ends their relationship')]},
  {id:'carmen-roberto',a:'carmen',b:'roberto',type:'marriage',versions:[v(2,'Engaged'),v(3,'Marriage and family',['Children']),v(4,'Marriage and family',['Children'])]},
  {id:'antonio-wife',a:'antonio',b:'germanwife',type:'marriage',versions:[v(4,'Marriage in Germany',['Three children'])]},
  {id:'elisa-marcello',a:'elisa',b:'marcello',type:'marriage',versions:[v(3,'Engaged'),v(4,'Marriage; Elisa is later widowed',['Silvio'])]},
  {id:'michele-gigliola',a:'michele',b:'gigliola',type:'marriage',versions:[v(1,'Courtship'),v(2,'Engaged'),v(3,'Marriage; infidelity and mistreatment',['Two children']),v(4,'Estrangement; both die later',['Two children'])]},
  {id:'donato-melina',a:'donato',b:'melina',type:'affair',versions:[v(1,'An affair; its aftermath divides the families')]},
  {id:'nino-nadia',a:'nino',b:'nadia',type:'dating',versions:[v(2,'Relationship; Nino leaves Nadia for Lila')]},
  {id:'nino-silvia',a:'nino',b:'silvia',type:'dating',versions:[v(3,'Earlier relationship; Nino leaves Silvia',['Mirko'])]},
  {id:'nino-eleonora',a:'nino',b:'eleonora',type:'marriage',versions:[v(3,'Marriage',['Albertino']),v(4,'Marriage continues',['Albertino','Lidia'],'Nino does not leave this marriage for Elena.')]},
  {id:'nino-silvana',a:'nino',b:'silvana',type:'encounter',versions:[v(4,'Elena discovers them having sex',[],'The scene alone does not establish the duration of the relationship.')]},
  {id:'nino-mirella',a:'nino',b:'mirella',type:'affair',versions:[v(4,'Affair reported by Antonio')]},
  {id:'nino-doctor',a:'nino',b:'gynecologist',type:'affair',versions:[v(4,'Affair reported by Antonio')]},
  {id:'pinuccia-bruno',a:'pinuccia',b:'bruno',type:'pursuit',versions:[v(2,'Pinuccia’s attraction on Ischia',[],'Not shown as a consummated affair.')]}
];
export const typeLabels = {marriage:'Marriage / engagement',partnership:'Partnership',dating:'Dating',affair:'Affair',attraction:'Crush / attraction',relationship:'Sexual relationship',abuse:'Sexual abuse / encounter',encounter:'Sexual encounter',pursuit:'Pursuit / attraction'};

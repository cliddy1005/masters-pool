// ─── AMA-TING TOUR · APP.JS ───────────────────────────────────────────────────

const MISSED_CUT = 20;
const CHALK = ['Rory McIlroy','Scottie Scheffler'];
const ADMIN_PIN  = '1005';
const STORE      = 'amt_';

const TOURNAMENTS = [
  { id:'masters',  name:'The Masters',      short:'Masters',   course:'Augusta National',    location:'Augusta, GA',        dates:'Apr 9–12, 2026',  start:'2026-04-09', end:'2026-04-12', feed:null,                                                                                                                           type:'hardcoded', cutPos:50, cutRound:2 },
  { id:'pga',      name:'PGA Championship', short:'PGA Champ', course:'Aronimink Golf Club',  location:'Newtown Square, PA', dates:'May 14–17, 2026', start:'2026-05-14', end:'2026-05-17', feed:null, type:'hardcoded', cutPos:70, cutRound:2 },
  { id:'usopen',   name:'US Open',           short:'US Open',   course:'Shinnecock Hills',     location:'Southampton, NY',    dates:'Jun 18–21, 2026', start:'2026-06-18', end:'2026-06-21', feed:null, type:'hardcoded', cutPos:60, cutRound:2 },
  { id:'theopen',  name:'The Open',          short:'The Open',  course:'Royal Birkdale',       location:'Southport, England', dates:'Jul 16–19, 2026', start:'2026-07-16', end:'2026-07-19', feed:'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?tournamentId=401811957', type:'espn',      cutPos:70, cutRound:2 },
];

// ─── PICKS PER TOURNAMENT ─────────────────────────────────────────────────────
// Each tournament can have different picks.
// Admin can override any tournament via admin.html.

const MASTERS_PICKS = [
  { id:'storm',  name:'Storm',  picks:['Ludvig Åberg','Bryson DeChambeau','Tommy Fleetwood','Justin Thomas'] },
  { id:'rick',   name:'Rick',   picks:['Brooks Koepka','Collin Morikawa','Jon Rahm','Bryson DeChambeau'] },
  { id:'bryan',  name:'Bryan',  picks:['Bryson DeChambeau','Jon Rahm','Ludvig Åberg','Xander Schauffele'] },
  { id:'jarryd', name:'Jarryd', picks:['Bryson DeChambeau','Ludvig Åberg','Matt Fitzpatrick','Jon Rahm'] },
  { id:'rhys',   name:'Rhys',   picks:['Justin Rose','Ludvig Åberg','Patrick Reed','Cameron Smith'] },
  { id:'ddog',   name:'D.Dog',  picks:['Justin Rose','Cameron Young','Xander Schauffele','Tommy Fleetwood'] },
  { id:'ciaran', name:'Ciaran', picks:['Bryson DeChambeau','Justin Rose','Cameron Smith','Jon Rahm'] },
  { id:'mp',     name:'MP',     picks:['Bryson DeChambeau','Ludvig Åberg','Xander Schauffele','Collin Morikawa'] },
  { id:'mattf',  name:'Matt F', picks:['Matt Fitzpatrick','Bryson DeChambeau','Jon Rahm','Ludvig Åberg'] },
  { id:'rayne',  name:'Rayne',  picks:['Jon Rahm','Collin Morikawa','Dustin Johnson','Cameron Young'] },
  { id:'devon',  name:'Devon',  picks:['Rasmus Højgaard','Sepp Straka','Ryan Gerard','Jon Rahm'] },
];

const PGA_PICKS = [
  { id:'storm',      name:'Storm',       picks:['Matt Fitzpatrick','Cameron Young','Justin Rose','Tommy Fleetwood'] },
  { id:'rick',       name:'Rick',        picks:['Tommy Fleetwood','Bryson DeChambeau','Collin Morikawa','Cameron Smith'] },
  { id:'ddog',       name:'D.Dog',       picks:['Matt Fitzpatrick','Xander Schauffele','Ludvig Åberg','Akshay Bhatia'] },
  { id:'rayne',      name:'Rayne',       picks:['Brooks Koepka','Shane Lowry','Matt Fitzpatrick','Jon Rahm'] },
  { id:'mattf',      name:'Matt F',      picks:['Matt Fitzpatrick','Justin Rose','Cameron Young','Rickie Fowler'] },
  { id:'rhys',       name:'Rhys',        picks:['Cameron Young','Matt Fitzpatrick','Tommy Fleetwood','Ben Griffin'] },
  { id:'devon',      name:'Devon',       picks:['Cameron Young','Matt Fitzpatrick','Russell Henley','Keegan Bradley'] },
  { id:'mp',         name:'MP',          picks:['Ludvig Åberg','Alex Fitzpatrick','Bryson DeChambeau','Brooks Koepka'] },
  { id:'ciaran',     name:'Ciaran',      picks:['Tommy Fleetwood','Cameron Young','Xander Schauffele','Justin Rose'] },
];

const USOPEN_PICKS = [
  { id:'storm',  name:'Storm',  picks:['Tommy Fleetwood','Cameron Young','Justin Rose','Justin Thomas'] },
  { id:'rhys',   name:'Rhys',   picks:['Jon Rahm','Justin Thomas','Ludvig Åberg','Justin Rose'] },
  { id:'mp',     name:'MP',     picks:['Tommy Fleetwood','Ludvig Åberg','Shane Lowry','Jon Rahm'] },
  { id:'devon',  name:'Devon',  picks:['Cameron Young','Xander Schauffele','Jon Rahm','Matt Fitzpatrick'] },
  { id:'ciaran', name:'Ciaran', picks:['Xander Schauffele','Tommy Fleetwood','Jon Rahm','Shane Lowry'] },
  { id:'ddog',   name:'D.Dog',  picks:['Brooks Koepka','Xander Schauffele','Justin Thomas','Cameron Young'] },
  { id:'rick',   name:'Rick',   picks:['Xander Schauffele','Ludvig Åberg','Jon Rahm','Cameron Young'] },
  { id:'mattf',  name:'Matt F', picks:['Jon Rahm','Tyrrell Hatton','Cameron Smith','Viktor Hovland'] },
  { id:'rayne',  name:'Rayne',  picks:['Jordan Spieth','Justin Rose','Collin Morikawa','Tommy Fleetwood'] },
  { id:'bryan',  name:'Bryan',  picks:['Tommy Fleetwood','Matt Fitzpatrick','Xander Schauffele','Daniel Berger'] },
  { id:'jarryd', name:'Jarryd', picks:['Jon Rahm','Tommy Fleetwood','Xander Schauffele','Brooks Koepka'] },
];

const THEOPEN_PICKS = [
  { id:'rick',    name:'Rick',    picks:['Matt Fitzpatrick','Collin Morikawa','Ludvig Åberg','Tommy Fleetwood'] },
  { id:'ddog',    name:'D.Dog',   picks:['Jon Rahm','Xander Schauffele','Cameron Young','Matt Fitzpatrick'] },
  { id:'storm',   name:'Storm',   picks:['Robert MacIntyre','Matt Fitzpatrick','Tommy Fleetwood','Viktor Hovland'] },
  { id:'rhys',    name:'Rhys',    picks:['Rory McIlroy','Tommy Fleetwood','Tom Kim','Robert MacIntyre'] },
  { id:'bryan',   name:'Bryan',   picks:['Alex Fitzpatrick','Tommy Fleetwood','Jon Rahm','Collin Morikawa'] },
  { id:'mp',      name:'MP',      picks:['Rory McIlroy','Ludvig Åberg','Tommy Fleetwood','Jon Rahm'] },
  { id:'rayne',   name:'Rayne',   picks:['Matt Fitzpatrick','Collin Morikawa','Viktor Hovland','Justin Rose'] },
  { id:'ciaran',  name:'Ciaran',  picks:['Viktor Hovland','Tom Kim','Tommy Fleetwood','Matt Fitzpatrick'] },
  { id:'mattf',   name:'Matt F',  picks:['Ludvig Åberg','Justin Rose','Xander Schauffele','Justin Thomas'] },
];

const DEFAULT_PICKS = {
  masters: MASTERS_PICKS,
  pga:     PGA_PICKS,
  usopen:  USOPEN_PICKS,
  theopen: THEOPEN_PICKS,
};

// ─── MASTERS 2026 FINAL RESULTS (official, hardcoded as permanent fallback) ──
// Source: ESPN leaderboard · espn.co.uk/golf/leaderboard/_/tournamentId/401811941

const MASTERS_2026_FINAL = [
  { name:'Rory McIlroy',              score:-12, thru:'F', pos:'1',   status:'active' },
  { name:'Scottie Scheffler',         score:-11, thru:'F', pos:'2',   status:'active' },
  { name:'Tyrrell Hatton',            score:-10, thru:'F', pos:'T3',  status:'active' },
  { name:'Russell Henley',            score:-10, thru:'F', pos:'T3',  status:'active' },
  { name:'Justin Rose',               score:-10, thru:'F', pos:'T3',  status:'active' },
  { name:'Cameron Young',             score:-10, thru:'F', pos:'T3',  status:'active' },
  { name:'Collin Morikawa',           score:-9,  thru:'F', pos:'T7',  status:'active' },
  { name:'Sam Burns',                 score:-9,  thru:'F', pos:'T7',  status:'active' },
  { name:'Max Homa',                  score:-8,  thru:'F', pos:'T9',  status:'active' },
  { name:'Xander Schauffele',         score:-8,  thru:'F', pos:'T9',  status:'active' },
  { name:'Jake Knapp',                score:-7,  thru:'F', pos:'11',  status:'active' },
  { name:'Jordan Spieth',             score:-5,  thru:'F', pos:'T12', status:'active' },
  { name:'Hideki Matsuyama',          score:-5,  thru:'F', pos:'T12', status:'active' },
  { name:'Brooks Koepka',             score:-5,  thru:'F', pos:'T12', status:'active' },
  { name:'Patrick Cantlay',           score:-5,  thru:'F', pos:'T12', status:'active' },
  { name:'Patrick Reed',              score:-5,  thru:'F', pos:'T12', status:'active' },
  { name:'Jason Day',                 score:-5,  thru:'F', pos:'T12', status:'active' },
  { name:'Maverick McNealy',          score:-4,  thru:'F', pos:'T18', status:'active' },
  { name:'Viktor Hovland',            score:-4,  thru:'F', pos:'T18', status:'active' },
  { name:'Matt Fitzpatrick',          score:-4,  thru:'F', pos:'T18', status:'active' },
  { name:'Keegan Bradley',            score:-3,  thru:'F', pos:'T21', status:'active' },
  { name:'Ludvig Åberg',              score:-3,  thru:'F', pos:'T21', status:'active' },
  { name:'Wyndham Clark',             score:-3,  thru:'F', pos:'T21', status:'active' },
  { name:'Matt McCarty',              score:-2,  thru:'F', pos:'T24', status:'active' },
  { name:'Adam Scott',                score:-2,  thru:'F', pos:'T24', status:'active' },
  { name:'Sam Stevens',               score:-2,  thru:'F', pos:'T24', status:'active' },
  { name:'Brian Campbell',            score:-2,  thru:'F', pos:'T24', status:'active' },
  { name:'Michael Brennan',           score:-2,  thru:'F', pos:'T24', status:'active' },
  { name:'Chris Gotterup',            score:-2,  thru:'F', pos:'T24', status:'active' },
  { name:'Alex Noren',                score:-1,  thru:'F', pos:'T30', status:'active' },
  { name:'Harris English',            score:-1,  thru:'F', pos:'T30', status:'active' },
  { name:'Shane Lowry',               score:-1,  thru:'F', pos:'T30', status:'active' },
  { name:'Gary Woodland',             score:0,   thru:'F', pos:'T33', status:'active' },
  { name:'Dustin Johnson',            score:0,   thru:'F', pos:'T33', status:'active' },
  { name:'Brian Harman',              score:0,   thru:'F', pos:'T33', status:'active' },
  { name:'Tommy Fleetwood',           score:0,   thru:'F', pos:'T33', status:'active' },
  { name:'Ben Griffin',               score:0,   thru:'F', pos:'T33', status:'active' },
  { name:'Jon Rahm',                  score:1,   thru:'F', pos:'T38', status:'active' },
  { name:'Ryan Gerard',               score:1,   thru:'F', pos:'T38', status:'active' },
  { name:'Haotong Li',                score:1,   thru:'F', pos:'T38', status:'active' },
  { name:'Justin Thomas',             score:2,   thru:'F', pos:'T41', status:'active' },
  { name:'Jacob Bridgeman',           score:2,   thru:'F', pos:'T41', status:'active' },
  { name:'Sepp Straka',               score:2,   thru:'F', pos:'T41', status:'active' },
  { name:'Nick Taylor',               score:2,   thru:'F', pos:'T41', status:'active' },
  { name:'Kristoffer Reitan',         score:2,   thru:'F', pos:'T41', status:'active' },
  { name:'Sungjae Im',                score:3,   thru:'F', pos:'46',  status:'active' },
  { name:'Si Woo Kim',                score:4,   thru:'F', pos:'47',  status:'active' },
  { name:'Aaron Rai',                 score:5,   thru:'F', pos:'48',  status:'active' },
  { name:'Corey Conners',             score:6,   thru:'F', pos:'T49', status:'active' },
  { name:'Marco Penge',               score:6,   thru:'F', pos:'T49', status:'active' },
  { name:'Kurt Kitayama',             score:7,   thru:'F', pos:'51',  status:'active' },
  { name:'Sergio García',             score:8,   thru:'F', pos:'52',  status:'active' },
  { name:'Rasmus Højgaard',           score:10,  thru:'F', pos:'53',  status:'active' },
  { name:'Charl Schwartzel',          score:12,  thru:'F', pos:'54',  status:'active' },
  // Missed cut
  { name:'Harry Hall',                score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Ryan Fox',                  score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Danny Willett',             score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Bubba Watson',              score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'J.J. Spaun',               score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Nicolai Højgaard',          score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Bryson DeChambeau',         score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Zach Johnson',              score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Akshay Bhatia',             score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Robert MacIntyre',          score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Rasmus Neergaard-Petersen', score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Andrew Novak',              score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Tom McKibbin',              score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Cameron Smith',             score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Casey Jarvis',              score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Daniel Berger',             score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Michael Kim',               score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Fred Couples',              score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'José María Olazábal',       score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Mike Weir',                 score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Vijay Singh',               score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Carlos Ortiz',              score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Min Woo Lee',               score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Davis Riley',               score:0, thru:'', pos:'CUT', status:'CUT' },
];

const PGA_2026_FINAL = [
  { name:'Aaron Rai'                        , score:  -9, thru:'F', pos:'1'   , status:'active' },
  { name:'Jon Rahm'                         , score:  -6, thru:'F', pos:'T2'  , status:'active' },
  { name:'Alex Smalley'                     , score:  -6, thru:'F', pos:'T2'  , status:'active' },
  { name:'Ludvig Åberg'                     , score:  -5, thru:'F', pos:'T4'  , status:'active' },
  { name:'Justin Thomas'                    , score:  -5, thru:'F', pos:'T4'  , status:'active' },
  { name:'Matti Schmid'                     , score:  -5, thru:'F', pos:'T4'  , status:'active' },
  { name:'Cameron Smith'                    , score:  -4, thru:'F', pos:'T7'  , status:'active' },
  { name:'Xander Schauffele'                , score:  -4, thru:'F', pos:'T7'  , status:'active' },
  { name:'Rory McIlroy'                     , score:  -4, thru:'F', pos:'T7'  , status:'active' },
  { name:'Kurt Kitayama'                    , score:  -3, thru:'F', pos:'T10' , status:'active' },
  { name:'Patrick Reed'                     , score:  -3, thru:'F', pos:'T10' , status:'active' },
  { name:'Chris Gotterup'                   , score:  -3, thru:'F', pos:'T10' , status:'active' },
  { name:'Justin Rose'                      , score:  -3, thru:'F', pos:'T10' , status:'active' },
  { name:'Ben Griffin'                      , score:  -2, thru:'F', pos:'T14' , status:'active' },
  { name:'Max Greyserman'                   , score:  -2, thru:'F', pos:'T14' , status:'active' },
  { name:'Scottie Scheffler'                , score:  -2, thru:'F', pos:'T14' , status:'active' },
  { name:'Matt Fitzpatrick'                 , score:  -2, thru:'F', pos:'T14' , status:'active' },
  { name:'David Puig'                       , score:  -1, thru:'F', pos:'T18' , status:'active' },
  { name:'Joaquin Niemann'                  , score:  -1, thru:'F', pos:'T18' , status:'active' },
  { name:'Stephan Jaeger'                   , score:  -1, thru:'F', pos:'T18' , status:'active' },
  { name:'Harris English'                   , score:  -1, thru:'F', pos:'T18' , status:'active' },
  { name:'Min Woo Lee'                      , score:  -1, thru:'F', pos:'T18' , status:'active' },
  { name:'Padraig Harrington'               , score:  -1, thru:'F', pos:'T18' , status:'active' },
  { name:'Maverick McNealy'                 , score:  -1, thru:'F', pos:'T18' , status:'active' },
  { name:'Jordan Spieth'                    , score:  -1, thru:'F', pos:'T18' , status:'active' },
  { name:'Tom Hoge'                         , score:   0, thru:'F', pos:'T26' , status:'active' },
  { name:'Sam Burns'                        , score:   0, thru:'F', pos:'T26' , status:'active' },
  { name:'Alex Noren'                       , score:   0, thru:'F', pos:'T26' , status:'active' },
  { name:'Bud Cauley'                       , score:   0, thru:'F', pos:'T26' , status:'active' },
  { name:'Daniel Hillier'                   , score:   0, thru:'F', pos:'T26' , status:'active' },
  { name:'Andrew Novak'                     , score:   0, thru:'F', pos:'T26' , status:'active' },
  { name:'Hideki Matsuyama'                 , score:   0, thru:'F', pos:'T26' , status:'active' },
  { name:'Nick Taylor'                      , score:   0, thru:'F', pos:'T26' , status:'active' },
  { name:'Cameron Young'                    , score:   0, thru:'F', pos:'T26' , status:'active' },
  { name:'Aldrich Potgieter'                , score:   1, thru:'F', pos:'T35' , status:'active' },
  { name:'Patrick Cantlay'                  , score:   1, thru:'F', pos:'T35' , status:'active' },
  { name:'Si Woo Kim'                       , score:   1, thru:'F', pos:'T35' , status:'active' },
  { name:'Ryan Fox'                         , score:   1, thru:'F', pos:'T35' , status:'active' },
  { name:'Ryo Hisatsune'                    , score:   1, thru:'F', pos:'T35' , status:'active' },
  { name:'Martin Kaymer'                    , score:   1, thru:'F', pos:'T35' , status:'active' },
  { name:'Haotong Li'                       , score:   1, thru:'F', pos:'T35' , status:'active' },
  { name:'Daniel Berger'                    , score:   1, thru:'F', pos:'T35' , status:'active' },
  { name:'Christiaan Bezuidenhout'          , score:   1, thru:'F', pos:'T35' , status:'active' },
  { name:'Denny McCarthy'                   , score:   2, thru:'F', pos:'T44' , status:'active' },
  { name:'Taylor Pendrith'                  , score:   2, thru:'F', pos:'T44' , status:'active' },
  { name:'Nicolai Højgaard'                 , score:   2, thru:'F', pos:'T44' , status:'active' },
  { name:'Jhonattan Vegas'                  , score:   2, thru:'F', pos:'T44' , status:'active' },
  { name:'Kristoffer Reitan'                , score:   2, thru:'F', pos:'T44' , status:'active' },
  { name:'Chris Kirk'                       , score:   2, thru:'F', pos:'T44' , status:'active' },
  { name:'Michael Kim'                      , score:   2, thru:'F', pos:'T44' , status:'active' },
  { name:'Dustin Johnson'                   , score:   2, thru:'F', pos:'T44' , status:'active' },
  { name:'Matt Wallace'                     , score:   2, thru:'F', pos:'T44' , status:'active' },
  { name:'Shane Lowry'                      , score:   2, thru:'F', pos:'T44' , status:'active' },
  { name:'Cooper Blanchett'                 , score:   2, thru:'F', pos:'T44' , status:'active' },
  { name:'Brooks Koepka'                    , score:   3, thru:'F', pos:'T55' , status:'active' },
  { name:'Mikael Lindberg'                  , score:   3, thru:'F', pos:'T55' , status:'active' },
  { name:'Andrew Putnam'                    , score:   3, thru:'F', pos:'T55' , status:'active' },
  { name:'Corey Conners'                    , score:   3, thru:'F', pos:'T55' , status:'active' },
  { name:'Collin Morikawa'                  , score:   3, thru:'F', pos:'T55' , status:'active' },
  { name:'Rico Hoey'                        , score:   4, thru:'F', pos:'T60' , status:'active' },
  { name:'Brian Harman'                     , score:   4, thru:'F', pos:'T60' , status:'active' },
  { name:'Sahith Theegala'                  , score:   4, thru:'F', pos:'T60' , status:'active' },
  { name:'Rickie Fowler'                    , score:   4, thru:'F', pos:'T60' , status:'active' },
  { name:'Sami Välimäki'                    , score:   4, thru:'F', pos:'T60' , status:'active' },
  { name:'Keith Mitchell'                   , score:   6, thru:'F', pos:'T65' , status:'active' },
  { name:'Jason Day'                        , score:   6, thru:'F', pos:'T65' , status:'active' },
  { name:'Rasmus Højgaard'                  , score:   6, thru:'F', pos:'T65' , status:'active' },
  { name:'Casey Jarvis'                     , score:   6, thru:'F', pos:'T65' , status:'active' },
  { name:'Sam Stevens'                      , score:   6, thru:'F', pos:'T65' , status:'active' },
  { name:'Ryan Gerard'                      , score:   7, thru:'F', pos:'T70' , status:'active' },
  { name:'William Mouw'                     , score:   7, thru:'F', pos:'T70' , status:'active' },
  { name:'Kaito Higa'                       , score:   7, thru:'F', pos:'T70' , status:'active' },
  { name:'John Parry'                       , score:   7, thru:'F', pos:'T70' , status:'active' },
  { name:'Luke Donald'                      , score:   7, thru:'F', pos:'T70' , status:'active' },
  { name:'Alex Fitzpatrick'                 , score:   8, thru:'F', pos:'T75' , status:'active' },
  { name:'Daniel Brown'                     , score:   8, thru:'F', pos:'T75' , status:'active' },
  { name:'Elvis Smylie'                     , score:   8, thru:'F', pos:'T75' , status:'active' },
  { name:'Rasmus Neergaard-Petersen'        , score:   8, thru:'F', pos:'T75' , status:'active' },
  { name:'Johnny Keefer'                    , score:   9, thru:'F', pos:'79'  , status:'active' },
  { name:'Ben Kern'                         , score:  10, thru:'F', pos:'80'  , status:'active' },
  { name:'Michael Brennan'                  , score:  11, thru:'F', pos:'81'  , status:'active' },
  { name:'Brian Campbell'                   , score:  18, thru:'F', pos:'82'  , status:'active' },
  { name:'Garrick Higgo'                    , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Wyndham Clark'                    , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Thomas Detry'                     , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Kazuki Kaneko'                    , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Michael Block'                    , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Sungjae Im'                       , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Akshay Bhatia'                    , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Jimmy Walker'                     , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'J.T. Poston'                      , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Russell Henley'                   , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Robert MacIntyre'                 , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Tommy Fleetwood'                  , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Andy Sullivan'                    , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Gary Woodland'                    , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Tyrrell Hatton'                   , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Max McGreevy'                     , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Takanori Collet'                  , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Brandt Snedeker'                  , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Angel Ayora'                      , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Jackson Gumberg'                  , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'David Lipsky'                     , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Ben Polland'                      , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Stewart Cink'                     , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'J.J. Spaun'                       , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Pierceson Coody'                  , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Viktor Hovland'                   , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Adam Schenk'                      , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Sepp Straka'                      , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Keegan Bradley'                   , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Harry Hall'                       , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Tom McKibbin'                     , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Bryson DeChambeau'                , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Ricky Castillo'                   , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Patrick Rodgers'                  , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Tim Smyth'                        , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Austin Smotherman'                , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Billy Horschel'                   , score:   8, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Jacob Bridgeman'                  , score:   8, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Joe Highsmith'                    , score:   8, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Steven Fisk'                      , score:   8, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Jason Dufner'                     , score:   8, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Adam Scott'                       , score:   8, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Emiliano Grillo'                  , score:   8, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Bernd Wiesberger'                 , score:   8, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Yang Yong-eun'                    , score:   9, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Lucas Glover'                     , score:   9, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Grant Sapp'                       , score:   9, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Shaun Micheel'                    , score:  10, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Nico Echavarria'                  , score:  10, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Jayden Schaper'                   , score:  10, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Sudarshan Yellamaraju'            , score:  10, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Matt McCarty'                     , score:  11, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Preston McClure'                  , score:  11, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Michael Thorbjornsen'             , score:  11, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Davis Riley'                      , score:  11, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Isaiah Holt'                      , score:  12, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Adrien Saddier'                   , score:  12, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Max Homa'                         , score:  12, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Jordan Smith'                     , score:  12, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Marco Penge'                      , score:  12, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Chris Gabriele'                   , score:  14, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Jonathan Jones'                   , score:  14, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Zach Haynes'                      , score:  14, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Frederic Bide'                    , score:  15, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Ryan Lenahan'                     , score:  15, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Aman Hurt'                        , score:  15, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Tyler Wiseman'                    , score:  15, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Ben Shattuck'                     , score:  16, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Dylan Berg'                       , score:  16, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Reese Vermeer'                    , score:  17, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Max Kartrude'                     , score:  18, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Jackson Droemer'                  , score:  18, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Mitchell Geddes'                  , score:  21, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Ben Fisher'                       , score:  22, thru:'',  pos:'CUT', status:'CUT'    },
];

// ─── US OPEN 2026 FINAL RESULTS (official, hardcoded as permanent fallback) ──
// Source: ESPN leaderboard · Shinnecock Hills · Jun 18–21, 2026

const USOPEN_2026_FINAL = [
  { name:'Wyndham Clark'                    , score:  -4, thru:'F', pos:'1'   , status:'active' },
  { name:'Sam Burns'                        , score:  -3, thru:'F', pos:'2'   , status:'active' },
  { name:'Tom Kim'                          , score:  -1, thru:'F', pos:'3'   , status:'active' },
  { name:'Keith Mitchell'                   , score:   0, thru:'F', pos:'T4'  , status:'active' },
  { name:'Scottie Scheffler'                , score:   0, thru:'F', pos:'T4'  , status:'active' },
  { name:'J.T. Poston'                      , score:   0, thru:'F', pos:'T4'  , status:'active' },
  { name:'Sam Stevens'                      , score:   1, thru:'F', pos:'T7'  , status:'active' },
  { name:'Tyrrell Hatton'                   , score:   1, thru:'F', pos:'T7'  , status:'active' },
  { name:'Gary Woodland'                    , score:   1, thru:'F', pos:'T7'  , status:'active' },
  { name:'Joaquin Niemann'                  , score:   1, thru:'F', pos:'T7'  , status:'active' },
  { name:'Tommy Fleetwood'                  , score:   2, thru:'F', pos:'T11' , status:'active' },
  { name:'Sahith Theegala'                  , score:   2, thru:'F', pos:'T11' , status:'active' },
  { name:'John Parry'                       , score:   2, thru:'F', pos:'T11' , status:'active' },
  { name:'Aaron Rai'                        , score:   2, thru:'F', pos:'T11' , status:'active' },
  { name:'Xander Schauffele'                , score:   2, thru:'F', pos:'T11' , status:'active' },
  { name:'Justin Rose'                      , score:   2, thru:'F', pos:'T11' , status:'active' },
  { name:'Ludvig Åberg'                     , score:   3, thru:'F', pos:'T17' , status:'active' },
  { name:'Collin Morikawa'                  , score:   3, thru:'F', pos:'T17' , status:'active' },
  { name:'Ben Griffin'                      , score:   3, thru:'F', pos:'T17' , status:'active' },
  { name:'Justin Thomas'                    , score:   3, thru:'F', pos:'T17' , status:'active' },
  { name:'Akshay Bhatia'                    , score:   3, thru:'F', pos:'T17' , status:'active' },
  { name:'Matt Fitzpatrick'                 , score:   4, thru:'F', pos:'22'  , status:'active' },
  { name:'Emiliano Grillo'                  , score:   5, thru:'F', pos:'T23' , status:'active' },
  { name:'Jackson Koivun'                   , score:   5, thru:'F', pos:'T23' , status:'active' },
  { name:'B. James'                         , score:   5, thru:'F', pos:'T23' , status:'active' },
  { name:'Alex Fitzpatrick'                 , score:   5, thru:'F', pos:'T23' , status:'active' },
  { name:'R. Cowan'                         , score:   5, thru:'F', pos:'T23' , status:'active' },
  { name:'Pierceson Coody'                  , score:   5, thru:'F', pos:'T23' , status:'active' },
  { name:'Ryan Fox'                         , score:   5, thru:'F', pos:'T23' , status:'active' },
  { name:'Corey Conners'                    , score:   5, thru:'F', pos:'T23' , status:'active' },
  { name:'Ben Kohles'                       , score:   5, thru:'F', pos:'T23' , status:'active' },
  { name:'Keegan Bradley'                   , score:   6, thru:'F', pos:'T32' , status:'active' },
  { name:'Rory McIlroy'                     , score:   6, thru:'F', pos:'T32' , status:'active' },
  { name:'Maverick McNealy'                 , score:   6, thru:'F', pos:'T32' , status:'active' },
  { name:'Brian Harman'                     , score:   6, thru:'F', pos:'T32' , status:'active' },
  { name:'Max McGreevy'                     , score:   6, thru:'F', pos:'T32' , status:'active' },
  { name:'Zac Blair'                        , score:   6, thru:'F', pos:'T32' , status:'active' },
  { name:'Dustin Johnson'                   , score:   6, thru:'F', pos:'T32' , status:'active' },
  { name:'M. Russell'                       , score:   7, thru:'F', pos:'T39' , status:'active' },
  { name:'Jacob Bridgeman'                  , score:   7, thru:'F', pos:'T39' , status:'active' },
  { name:'Robert MacIntyre'                 , score:   7, thru:'F', pos:'T39' , status:'active' },
  { name:'Johnny Keefer'                    , score:   7, thru:'F', pos:'T39' , status:'active' },
  { name:'Harry Higgs'                      , score:   8, thru:'F', pos:'T43' , status:'active' },
  { name:'Chris Gotterup'                   , score:   8, thru:'F', pos:'T43' , status:'active' },
  { name:'Sungjae Im'                       , score:   8, thru:'F', pos:'T43' , status:'active' },
  { name:'Cameron Young'                    , score:   8, thru:'F', pos:'T43' , status:'active' },
  { name:'Max Greyserman'                   , score:   8, thru:'F', pos:'T43' , status:'active' },
  { name:'Michael Kim'                      , score:   8, thru:'F', pos:'T43' , status:'active' },
  { name:'N. Moller'                        , score:   8, thru:'F', pos:'T43' , status:'active' },
  { name:'Laurie Canter'                    , score:   8, thru:'F', pos:'T43' , status:'active' },
  { name:'Michael Brennan'                  , score:   8, thru:'F', pos:'T43' , status:'active' },
  { name:'Ryo Hisatsune'                    , score:   8, thru:'F', pos:'T43' , status:'active' },
  { name:'Adrien Dumont de Chassart'        , score:   9, thru:'F', pos:'T53' , status:'active' },
  { name:'Kurt Kitayama'                    , score:   9, thru:'F', pos:'T53' , status:'active' },
  { name:'Ángel Hidalgo'                    , score:   9, thru:'F', pos:'T53' , status:'active' },
  { name:'Peter Uihlein'                    , score:  10, thru:'F', pos:'T56' , status:'active' },
  { name:'Bud Cauley'                       , score:  10, thru:'F', pos:'T56' , status:'active' },
  { name:'Nico Echavarria'                  , score:  10, thru:'F', pos:'T56' , status:'active' },
  { name:'Jordan Spieth'                    , score:  10, thru:'F', pos:'T56' , status:'active' },
  { name:'M. Fleming'                       , score:  10, thru:'F', pos:'T56' , status:'active' },
  { name:'Jackson Van Paris'                , score:  11, thru:'F', pos:'T61' , status:'active' },
  { name:'S. Tibbits'                       , score:  11, thru:'F', pos:'T61' , status:'active' },
  { name:'C. Surratt'                       , score:  13, thru:'F', pos:'T63' , status:'active' },
  { name:'E. Lee'                           , score:  13, thru:'F', pos:'T63' , status:'active' },
  { name:'J. Nicholas'                      , score:  14, thru:'F', pos:'T65' , status:'active' },
  { name:'William Mouw'                     , score:  14, thru:'F', pos:'T65' , status:'active' },
  { name:'Neal Shipley'                     , score:  14, thru:'F', pos:'T65' , status:'active' },
  { name:'Andrew Putnam'                    , score:  14, thru:'F', pos:'T65' , status:'active' },
  { name:'Russell Henley'                   , score:  14, thru:'F', pos:'T65' , status:'active' },
  { name:'Hideki Matsuyama'                 , score:  14, thru:'F', pos:'T65' , status:'active' },
  { name:'Patrick Rodgers'                  , score:  17, thru:'F', pos:'71'  , status:'active' },
  { name:'Dylan Wu'                         , score:  18, thru:'F', pos:'72'  , status:'active' },
  // Missed cut
  { name:'Jackson Suber'                    , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Matthew Jordan'                   , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Rickie Fowler'                    , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Andrew Novak'                     , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Patrick Reed'                     , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Nick Taylor'                      , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Harris English'                   , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Filippo Celli'                    , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Sudarshan Yellamaraju'            , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Bryson DeChambeau'                , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Viktor Hovland'                   , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Ryan Gerard'                      , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Billy Horschel'                   , score:   5, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Nathan Kimsey'                    , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Cameron Smith'                    , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Kristoffer Reitan'                , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Lucas Herbert'                    , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Si Woo Kim'                       , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Alex Noren'                       , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Shane Lowry'                      , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Carlos Ortiz'                     , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Jon Rahm'                         , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Patrick Cantlay'                  , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Cole Hammer'                      , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'J. Schoenberger'                  , score:   6, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Jimmy Stanger'                    , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Brandon Wu'                       , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Sepp Straka'                      , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Kensei Onishi'                    , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'B. Lee'                           , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Adrien Saddier'                   , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Min Woo Lee'                      , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'M. Shah'                          , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'G. Puebla'                        , score:   7, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Alejandro Tosti'                  , score:   8, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Ben Silverman'                    , score:   8, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Adam Scott'                       , score:   8, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'J.J. Spaun'                       , score:   8, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'M. Howell'                        , score:   8, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Jake Knapp'                       , score:   8, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Marcelo Rozo'                     , score:   8, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Chandler Phillips'                , score:   9, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'J. Herrington'                    , score:   9, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Yuan Yechun'                      , score:   9, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'J.B. Holmes'                      , score:   9, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Ugo Coussaud'                     , score:   9, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Chris Kirk'                       , score:   9, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Kevin Roy'                        , score:   9, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'David Puig'                       , score:   9, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'P. Stout'                         , score:   9, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Alex Smalley'                     , score:   9, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Nicolai Højgaard'                 , score:   9, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Taiga Sato'                       , score:   9, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Jayden Schaper'                   , score:  10, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Brooks Koepka'                    , score:  10, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Daniel Berger'                    , score:  10, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Rintaro Oiwa'                     , score:  10, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'B. Holtz'                         , score:  10, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Davis Thompson'                   , score:  10, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'T. Montgomery'                    , score:  11, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'H. Coleman'                       , score:  11, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'E. Fang'                          , score:  11, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'D. Cooper'                        , score:  11, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Padraig Harrington'               , score:  11, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'J. Peacock'                       , score:  11, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'L. Reilly'                        , score:  11, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Harry Hall'                       , score:  11, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'M. Pulcini'                       , score:  11, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'C. Kyes'                          , score:  12, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Graeme McDowell'                  , score:  12, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'V. Harber'                        , score:  12, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'H. Du Plessis'                    , score:  12, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Matt McCarty'                     , score:  12, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Nick Hardy'                       , score:  12, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'J. Sollon'                        , score:  13, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'Matti Schmid'                     , score:  14, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'T.K. Kim'                         , score:  16, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'M. Robles'                        , score:  16, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'R. Repetto Taylor'                , score:  17, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'R. Higgins'                       , score:  19, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'J. Ormond'                        , score:  20, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'G. Leach'                         , score:  21, thru:'',  pos:'CUT', status:'CUT'    },
  { name:'G.Á. Sveinsson'                   , score:  21, thru:'',  pos:'CUT', status:'CUT'    },
  // Withdrew
  { name:'Jason Day'                        , score:   7, thru:'',  pos:'WD' , status:'WD'     },
];

const HARDCODED_FINALS = { masters: MASTERS_2026_FINAL, pga: PGA_2026_FINAL, usopen: USOPEN_2026_FINAL };

// ─── STORAGE ──────────────────────────────────────────────────────────────────

function store(k,v)    { try{localStorage.setItem(STORE+k,JSON.stringify(v));}catch(e){} }
function retrieve(k,fb){ try{const r=localStorage.getItem(STORE+k);return r!==null?JSON.parse(r):fb;}catch(e){return fb;} }

function getPicks(tid)         { return retrieve('picks_'+tid, DEFAULT_PICKS[tid]||[]); }
function savePicks(tid,picks)  { store('picks_'+tid, picks); }
function getCached(tid)        { return retrieve('cache_'+tid, null); }
function setCache(tid,data)    { store('cache_'+tid, {scores:data, fetchedAt:new Date().toISOString()}); }
function getFinal(tid)         { return retrieve('final_'+tid, null); }
function saveFinal(tid, pool)  { store('final_'+tid, {pool, savedAt:new Date().toISOString()}); }

// ─── NAME MATCHING ────────────────────────────────────────────────────────────

const NAME_MAP = {
  'ludvig aberg':'Ludvig Åberg','ludvig åberg':'Ludvig Åberg',
  'cam young':'Cameron Young','cameron young':'Cameron Young',
  'cam smith':'Cameron Smith','cameron smith':'Cameron Smith',
  'matt fitzpatrick':'Matt Fitzpatrick','matthew fitzpatrick':'Matt Fitzpatrick',
  'bryson dechambeau':'Bryson DeChambeau','bryson de chambeau':'Bryson DeChambeau',
  'jon rahm':'Jon Rahm','xander schauffele':'Xander Schauffele',
  'collin morikawa':'Collin Morikawa','brooks koepka':'Brooks Koepka',
  'justin rose':'Justin Rose','tommy fleetwood':'Tommy Fleetwood',
  'rory mcilroy':'Rory McIlroy','scottie scheffler':'Scottie Scheffler',
  'patrick reed':'Patrick Reed','dustin johnson':'Dustin Johnson',
  'rickie fowler':'Rickie Fowler','ricky fowler':'Rickie Fowler',
  'alex fitzpatrick':'Alex Fitzpatrick',
  'russell henley':'Russell Henley','russel henley':'Russell Henley',
  'ben griffin':'Ben Griffin',
  'akshay bhatia':'Akshay Bhatia',
  'shane lowry':'Shane Lowry',
  'keegan bradley':'Keegan Bradley',
  'cameron smith':'Cameron Smith',
  'viktor hovland':'Viktor Hovland','victor hovland':'Viktor Hovland',
  'robert macintyre':'Robert MacIntyre','bob macintyre':'Robert MacIntyre',
  'tom kim':'Tom Kim','joohyung kim':'Tom Kim',
  'justin thomas':'Justin Thomas','jordan spieth':'Jordan Spieth',
};
function norm(s)  { return s.toLowerCase().replace(/[àáâãäå]/g,'a').replace(/[èéêë]/g,'e').replace(/[òóôõöø]/g,'o').replace(/[ùúûü]/g,'u').replace(/[^a-z ]/g,'').replace(/\s+/g,' ').trim(); }
function canon(s) { return NAME_MAP[norm(s)]||s.trim(); }
function match(a,b){
  if(!a||!b) return false;
  const ra=canon(a), rb=canon(b);
  const na=norm(ra).replace(/ /g,''), nb=norm(rb).replace(/ /g,'');
  if(na===nb) return true;
  const wa=norm(ra).split(' ').filter(Boolean), wb=norm(rb).split(' ').filter(Boolean);
  // Single-word on either side: last name only comparison (e.g. pick entered as "Fitzpatrick")
  if(wa.length===1||wb.length===1){
    const la=wa[wa.length-1], lb=wb[wb.length-1];
    return la.length>4 && la===lb;
  }
  // Both have first + last name: require last names match AND first names start the same
  // This handles "Cam Young" == "Cameron Young" but NOT "Alex Fitzpatrick" == "Matt Fitzpatrick"
  const lastA=wa[wa.length-1], lastB=wb[wb.length-1];
  if(lastA!==lastB) return false;
  const firstA=wa[0], firstB=wb[0];
  return firstA.startsWith(firstB) || firstB.startsWith(firstA);
}

function isChalk(name){ return CHALK.some(c => match(c, name)); }

// ─── SCORE HELPERS ────────────────────────────────────────────────────────────

function parseScore(s){ if(s===null||s===undefined)return 0;const str=String(s).trim();if(!str||str==='E'||str==='e')return 0;return parseInt(str.replace('+',''),10)||0; }
function fmtScore(n)  { if(typeof n!=='number')return'E';return n===0?'E':n>0?'+'+n:String(n); }
function scoreClass(n){ return typeof n!=='number'?'even':n<0?'under':n>0?'over':'even'; }

// ─── POOL CALC ────────────────────────────────────────────────────────────────

function calcPool(picks, scores) {
  // Outright champion: active and sole leader at pos exactly '1'. A 'T1' tie does NOT count.
  const champ = scores.find(s => s.status==='active' && s.pos==='1');
  const chalkChamp = champ ? isChalk(champ.name) : false;
  const results = picks.map(p => {
    let total = 0;
    const golfers = p.picks.map(name => {
      const g = scores.find(s => match(s.name, name));
      if(!g){ total+=MISSED_CUT; return{name,score:MISSED_CUT,status:'notfound',thru:'?',chalk:isChalk(name)}; }
      const isOut=g.status==='CUT'||g.status==='WD';
      const score=isOut?MISSED_CUT:g.score; total+=score;
      return{name:g.name||name,score,status:g.status||'active',thru:g.thru||'',chalk:isChalk(g.name||name)};
    });
    golfers.sort((a,b)=>{
      const la=a.name.trim().split(' ').pop(), lb=b.name.trim().split(' ').pop();
      return la.localeCompare(lb);
    });
    const chalk    = golfers.some(g => g.chalk);
    const chalkWin = chalkChamp && golfers.some(g => match(g.name, champ.name));
    return{id:p.id,name:p.name,golfers,total,chalk,chalkWin};
  });
  // Assign positions by score
  results.sort((a,b)=>a.total-b.total);
  results.forEach((r,i)=>r.pos=i+1);
  return results;
}

// ─── SEASON STANDINGS ─────────────────────────────────────────────────────────

const DNS_PENALTY = 80; // fallback only — overridden dynamically in calcSeason

function calcSeason() {
  const people = {};
  const completedTourneys = TOURNAMENTS.filter(t => getFinal(t.id));

  completedTourneys.forEach(t => {
    const saved = getFinal(t.id);
    if(!saved?.pool?.length) return;
    const pool  = saved.pool;
    const worst = Math.max(...pool.map(r => r.total));

    pool.forEach(r => {
      const key = r.name;
      if(!people[key]) people[key] = { name:r.name, results:{}, totalScore:0, majorsPlayed:0, wins:0, rumblers:0 };
      people[key].results[t.id] = { pos:r.pos, total:r.total };
      people[key].totalScore   += r.total;
      people[key].majorsPlayed += 1;
      if(r.pos===1)       people[key].wins++;
      if(r.total===worst) people[key].rumblers++;
    });
  });

  // DNS penalty: previous tournament's worst pool score + 20
  // For the first tournament, fall back to DNS_PENALTY constant
  completedTourneys.forEach((t, i) => {
    const prevSaved = i > 0 ? getFinal(completedTourneys[i-1].id) : null;
    const prevWorst = prevSaved?.pool?.length
      ? Math.max(...prevSaved.pool.map(r => r.total)) + 20
      : DNS_PENALTY;

    Object.values(people).forEach(p => {
      if(!p.results[t.id]) {
        p.results[t.id] = { pos:null, total:prevWorst, dns:true };
        p.totalScore   += prevWorst;
      }
    });
  });

  return Object.values(people).sort((a,b) => a.totalScore - b.totalScore);
}

// ─── TOURNAMENT STATUS ────────────────────────────────────────────────────────

function tournStatus(t){ const now=new Date(),s=new Date(t.start+'T00:00:00'),e=new Date(t.end+'T23:59:59');if(now>=s&&now<=e)return'live';if(now>e)return'complete';return'upcoming'; }
function countdown(startStr){ const diff=new Date(startStr+'T00:00:00')-new Date();if(diff<=0)return null;return{days:Math.floor(diff/86400000),hours:Math.floor((diff%86400000)/3600000),mins:Math.floor((diff%3600000)/60000),secs:Math.floor((diff%60000)/1000)}; }

// ─── FEED PARSERS ─────────────────────────────────────────────────────────────

function parseESPN(data) {
  const competitors = data?.events?.[0]?.competitions?.[0]?.competitors||[];
  // Derive current tournament round from the data itself — find the highest
  // period number that any competitor has a linescore entry for.
  // More reliable than event.status.period which ESPN sometimes returns as 1 throughout.
  let eventPeriod = 1;
  for(const c of competitors) {
    for(const r of (c.linescores||[]).filter(r => 'value' in r)) {
      if(r.period > eventPeriod) eventPeriod = r.period;
    }
  }

  const parseDisp = s => {
    const str = String(s||'').trim();
    return (!str||str==='E') ? 0 : parseInt(str.replace('+',''),10)||0;
  };

  return competitors.map(c => {
    // Filter to actual rounds only — real rounds always have a 'value' property
    const rounds = (c.linescores||[]).filter(r => 'value' in r);

    // Cumulative score = sum of each round's score to par
    let score;
    if(rounds.length > 0) {
      score = rounds.reduce((sum, r) => sum + parseDisp(r.displayValue), 0);
    } else {
      const raw = c.score;
      score = typeof raw === 'number' ? raw : parseDisp(String(raw||''));
    }

    // Thru: show progress for the current event round only
    // If player hasn't started the current round, show nothing (not R1's 'F')
    const playerMaxPeriod = rounds.reduce((max,r) => r.period>max?r.period:max, 0);
    const currentRoundData = rounds.find(r => r.period === eventPeriod);
    const currentHoles = currentRoundData?.linescores?.length || 0;
    let thru = '';
    if(playerMaxPeriod < eventPeriod) {
      thru = ''; // finished previous round, hasn't teed off in current round yet
    } else if(currentHoles >= 18) {
      thru = 'F';
    } else if(currentHoles > 0) {
      thru = String(currentHoles);
    }

    const stType  = (c.status?.type||'').toLowerCase();
    const posName = (c.status?.position?.displayName||'').toLowerCase();
    // ESPN sometimes marks cut via status.type or position.displayName
    const explicitCut = stType.includes('cut') || posName.includes('cut');
    const wd          = stType.includes('wd') || stType.includes('withdraw');
    // Fallback: if tournament is in R3+ and player has no R3+ round data, they missed the cut
    const inferredCut = !explicitCut && !wd && eventPeriod >= 3 && playerMaxPeriod <= 2;
    const cut         = explicitCut || inferredCut;

    return {
      name:   c.athlete?.displayName||c.athlete?.fullName||'Unknown',
      score, thru, pos: c.status?.position?.displayName||'',
      status: cut?'CUT':wd?'WD':'active',
    };
  }).sort((a,b)=>{
    const ao=a.status!=='active'?1:0, bo=b.status!=='active'?1:0;
    return ao!==bo?ao-bo:a.score-b.score;
  }).map((p,i,arr)=>{
    if(p.status!=='active'){ p.pos='CUT'; return p; }
    if(p.pos) return p;
    const tied = arr.filter(x=>x.status==='active'&&x.score===p.score);
    p.pos = tied.length>1
      ? 'T'+(arr.filter(x=>x.status==='active'&&x.score<p.score).length+1)
      : String(arr.filter(x=>x.status==='active'&&x.score<p.score).length+1);
    return p;
  });
}

async function fetchLive(t){
  const res=await fetch(t.feed+'&_='+Date.now());
  if(!res.ok)throw new Error('HTTP '+res.status);
  const data=await res.json();
  return parseESPN(data);
}

function uniqueGolfers(picks){ const seen=new Set(),list=[];picks.forEach(p=>p.picks.forEach(g=>{const c=canon(g);if(!seen.has(c)){seen.add(c);list.push(c);}}));return list.sort(); }

// ─── INIT (runs after all declarations) ──────────────────────────────────────

// One-time clear of stale picks for non-Masters tournaments
(function clearStalePicks(){
  if(!retrieve('picks_cleared_v4')) {
    ['pga','usopen','theopen'].forEach(tid => localStorage.removeItem(STORE+'picks_'+tid));
    store('picks_cleared_v4', true);
  }
})();

// Clear stale score caches when match logic changes — bump this version when deploying match fixes
const CACHE_VERSION = 'v7';
(function clearStaleCache(){
  if(retrieve('cache_version') !== CACHE_VERSION) {
    ['masters','pga','usopen','theopen'].forEach(tid => localStorage.removeItem(STORE+'cache_'+tid));
    store('cache_version', CACHE_VERSION);
  }
})();

// Re-seed Masters final from hardcoded data whenever version changes.
// Must run after NAME_MAP and calcPool are declared.
const FINALS_DATA_VERSION = '2026-v7';
(function seedFinals(){
  if(retrieve('finals_data_version') !== FINALS_DATA_VERSION) {
    saveFinal('masters', calcPool(MASTERS_PICKS, MASTERS_2026_FINAL));
    saveFinal('pga',     calcPool(PGA_PICKS,     PGA_2026_FINAL));
    saveFinal('usopen',  calcPool(USOPEN_PICKS,  USOPEN_2026_FINAL));
    store('finals_data_version', FINALS_DATA_VERSION);
  }
})();

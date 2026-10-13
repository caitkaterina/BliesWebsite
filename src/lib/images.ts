// Representative stock imagery (Unsplash). NOT verified BLIES assets.
// Replace with approved BLIES photography (see src/lib/images.ts keys marked `fleet*`).
const u = (id: string) => (w: number, h?: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}${h ? `&h=${h}` : ''}&fit=crop&auto=format&q=72`

export const img = {
  ship: u('1597334948330-38795f25d05d'),
  port: u('1562892302-97faedd66f1c'),
  portShip: u('1670121180530-cfcba4438038'),
  plane: u('1571086291540-b137111fa1c7'),
  plane2: u('1628354215124-dd0ab72828ac'),
  truckBlue: u('1591768793355-74d04bb6608f'),
  truckRoad: u('1485575301924-6891ef935dcd'),
  truckWhite: u('1695222833131-54ee679ae8e5'),
  truckPortrait: u('1616432043562-3671ea2e5242'),
  warehouse: u('1587293852726-70cdb56c2866'),
  warehouse2: u('1684695749267-233af13276d0'),
  shelving: u('1627309366653-2dedc084cdf1'),
  machinery: u('1717386255773-1e3037c81788'),
  factory: u('1496247749665-49cf5b1022e9'),
  electrical: u('1716191300020-b52dec5b70a8'),
  gears: u('1711199694531-e982a79ea381'),
  gears2: u('1593062037896-764e9f52029e'),
  ppe: u('1662309376159-b95fb193d96b'),
  ppeWorker: u('1725811641350-f63dc7442725'),
  mining: u('1622645636770-11fbf0611463'),
  miningPit: u('1523848309072-c199db53f137'),
  miningRoad: u('1709489662983-3674d790b224'),
  oil: u('1726731782158-fcf6822b6ca4'),
  oil2: u('1516937941344-00b4e0337589'),
  construction: u('1599707254554-027aeb4deacd'),
  cranes: u('1575230167650-dce335edc7f4'),
  docs: u('1761558794306-466448dab4bc'),
  fmcg: u('1761059080249-3f0fe21958a5'),
  fmcg2: u('1710383934725-0895f9f20298'),
}

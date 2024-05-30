let { rock, roid } = require('../tiles/decoration.js'),
    { normal: ____, normalLaby: ___l, nest, cosmicRoom: sanc, cosmicRoomCenter: sacm, voidLeft: VL, voidRight: VR, voidMiddle: VoidMi, voidMiddle: VoidMiddlerr, wall: WALL } = require('../tiles/misc.js'),

room = [
    [____,____,____,____,____,____,roid,roid,roid,____,____,____,____,____,____,VL,VL,VL,VL,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VR,VR,VR,VR,VR,___l,___l,___l,___l,___l,___l,___l,___l,___l,___l,___l,___l,___l,___l,___l],
    [____,____,____,____,____,____,roid,roid,roid,____,____,____,____,____,____,VL,VL,VL,VL,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VR,VR,VR,VR,VR,___l,WALL,WALL,___l,WALL,WALL,WALL,WALL,___l,WALL,WALL,WALL,___l,WALL,___l],
    [____,____,rock,rock,____,____,____,____,____,____,____,rock,rock,____,____,VL,VL,VL,VL,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VR,VR,VR,VR,VR,___l,WALL,___l,___l,___l,___l,___l,___l,___l,WALL,WALL,___l,___l,___l,___l],
    [____,____,rock,rock,____,____,____,____,____,____,____,rock,rock,____,____,VL,VL,VL,VL,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VR,VR,VR,VR,VR,___l,WALL,WALL,___l,WALL,WALL,WALL,___l,WALL,___l,___l,___l,WALL,WALL,___l],
    [____,____,____,____,____,____,____,____,____,____,____,____,____,____,____,VL,VL,VL,VL,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VR,VR,VR,VR,VR,___l,WALL,WALL,___l,WALL,WALL,WALL,___l,WALL,WALL,WALL,___l,WALL,WALL,___l],
    [____,____,____,____,____,nest,nest,nest,nest,nest,____,____,____,____,____,VL,VL,VL,VL,VoidMi,sanc,sanc,sanc,sanc,sanc,VoidMiddlerr,VR,VR,VR,VR,___l,WALL,___l,___l,___l,___l,___l,___l,___l,___l,___l,___l,___l,WALL,___l],
    [roid,roid,____,____,____,nest,nest,nest,nest,nest,____,____,____,roid,roid,VL,VL,VL,VL,VoidMi,sanc,sanc,sanc,sanc,sanc,VoidMiddlerr,VR,VR,VR,VR,___l,WALL,___l,WALL,WALL,___l,___l,___l,___l,___l,WALL,WALL,___l,WALL,___l],
    [roid,roid,____,____,____,nest,nest,nest,nest,nest,____,____,____,roid,roid,VL,VL,VL,VL,VoidMi,sanc,sanc,sacm,sanc,sanc,VoidMiddlerr,VR,VR,VR,VR,___l,___l,___l,WALL,WALL,___l,___l,___l,___l,___l,WALL,WALL,___l,___l,___l],
    [roid,roid,____,____,____,nest,nest,nest,nest,nest,____,____,____,roid,roid,VL,VL,VL,VL,VoidMi,sanc,sanc,sanc,sanc,sanc,VoidMiddlerr,VR,VR,VR,VR,___l,WALL,___l,WALL,WALL,___l,___l,___l,___l,___l,WALL,WALL,___l,WALL,___l],
    [____,____,____,____,____,nest,nest,nest,nest,nest,____,____,____,____,____,VL,VL,VL,VL,VoidMi,sanc,sanc,sanc,sanc,sanc,VoidMiddlerr,VR,VR,VR,VR,___l,WALL,WALL,___l,___l,___l,___l,___l,___l,___l,___l,___l,___l,WALL,___l],
    [____,____,____,____,____,____,____,____,____,____,____,____,____,____,____,VL,VL,VL,VL,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VR,VR,VR,VR,VR,___l,WALL,WALL,___l,WALL,WALL,WALL,WALL,WALL,___l,WALL,WALL,___l,___l,___l],
    [____,____,rock,rock,____,____,____,____,____,____,____,rock,rock,____,____,VL,VL,VL,VL,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VR,VR,VR,VR,VR,___l,WALL,WALL,___l,WALL,___l,WALL,WALL,___l,___l,___l,WALL,___l,WALL,___l],
    [____,____,rock,rock,____,____,____,____,____,____,____,rock,rock,____,____,VL,VL,VL,VL,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VR,VR,VR,VR,VR,___l,___l,___l,___l,WALL,___l,___l,___l,___l,WALL,___l,___l,___l,WALL,___l],
    [____,____,____,____,____,____,roid,roid,roid,____,____,____,____,____,____,VL,VL,VL,VL,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VR,VR,VR,VR,VR,___l,WALL,WALL,WALL,WALL,WALL,WALL,___l,WALL,WALL,WALL,WALL,___l,WALL,___l],
    [____,____,____,____,____,____,roid,roid,roid,____,____,____,____,____,____,VL,VL,VL,VL,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VoidMi,VR,VR,VR,VR,VR,___l,___l,___l,___l,___l,___l,___l,___l,___l,___l,___l,___l,___l,___l,___l],
];

module.exports = room;
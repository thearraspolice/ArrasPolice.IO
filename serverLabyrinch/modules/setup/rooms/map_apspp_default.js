let { rock, roid } = require('../tiles/decoration.js'),
    { normal: ____} = require('../tiles/misc.js'),

room = [
    [____,____,____,____,____,____,roid,roid,roid,____,____,____,____,____,____],
    [____,____,____,____,____,____,roid,roid,roid,____,____,____,____,____,____],
    [____,____,rock,rock,____,____,____,____,____,____,____,rock,rock,____,____],
    [____,____,rock,rock,____,____,____,____,____,____,____,rock,rock,____,____],
    [____,____,____,____,____,____,____,____,____,____,____,____,____,____,____],
    [____,____,____,____,____,____,____,____,____,____,____,____,____,____,____],
    [roid,roid,____,____,____,____,____,____,____,____,____,____,____,roid,roid],
    [roid,roid,____,____,____,____,____,____,____,____,____,____,____,roid,roid],
    [roid,roid,____,____,____,____,____,____,____,____,____,____,____,roid,roid],
    [____,____,____,____,____,____,____,____,____,____,____,____,____,____,____],
    [____,____,____,____,____,____,____,____,____,____,____,____,____,____,____],
    [____,____,rock,rock,____,____,____,____,____,____,____,rock,rock,____,____],
    [____,____,rock,rock,____,____,____,____,____,____,____,rock,rock,____,____],
    [____,____,____,____,____,____,roid,roid,roid,____,____,____,____,____,____],
    [____,____,____,____,____,____,roid,roid,roid,____,____,____,____,____,____]
];

module.exports = room;
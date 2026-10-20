/* ============================================================
   枭潼 · 摄影作品集 — 数据
   图片来源：Unsplash CDN（images.unsplash.com）
            + Picsum 固定 ID（picsum.photos，亦源自 Unsplash）
   仅作占位示例，将陆续替换为实拍作品
   ============================================================ */
(function () {
  'use strict';

  function U(id) {
    return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=1600&q=80';
  }
  function P(id) {
    return 'https://picsum.photos/id/' + id + '/1600/1000';
  }
  /* [url, 中文短句, EN line] */
  function ph(list) {
    return list.map(function (p) { return { src: p[0], cn: p[1], en: p[2] }; });
  }

  var ATLAS = {
    hero: {
      img: U('1512273222628-4daea6e55abb') // 冰川雪山
    },
    about: {
      img: U('1488646953014-85cb44e25828') // 相机与地图
    },

    groups: {
      /* ------------------------------------------------ EUROPE */
      europe: [
        {
          id: 'iceland', cn: '冰岛', en: 'ICELAND', alias: '冰与火之岛',
          line: '黑沙滩尽头，极光落进海里。',
          notes: [
            { h: 'JOURNAL · 手记', p: '抵达雷克雅未克那天，风把雨吹成了横的。我沿着南岸一路向东，黑沙滩上的浪比想象中更高，像有人在海的深处翻身。夜里守到两点，极光终于落下来——原来它真的会发出声音，像很远的地方有人在抖一匹绸。' },
            { h: 'FRAME · 笔记', p: '在冰岛拍照，三脚架比相机更重要。风大的时候，我把背包挂在三脚架上当配重。极光用广角、高感、八秒——再久，绿色就会糊成一片雾。' }
          ],
          photos: ph([
            [U('1476610182048-b716b8518aae'), '雾起峡谷，水声先于形状抵达。', 'Mist rises; the sound arrives before the shape.'],
            [U('1500043357865-c6b8827edf10'), '黑沙把海浪写成白色。', 'On black sand, the tide writes in white.'],
            [U('1504893524553-b855bce32c67'), '苔原之下，火山仍在呼吸。', 'Beneath the moss, the volcano still breathes.'],
            [U('1531168556467-80aace0d0144'), '大地裂开的地方，光走了进去。', 'Where the earth splits, the light walks in.'],
            [U('1579033461380-adb47c3eb938'), '极光落下时，雪山没有出声。', 'The aurora fell, and the snow peak stayed silent.'],
            [U('1478827536114-da961b7f86d2'), '帐篷外，是整条银河。', 'Outside the tent lay an entire galaxy.'],
            [U('1519681393784-d120267933ba'), '星星低垂，仿佛伸手可及。', 'The stars hung low, almost within reach.'],
            [U('1506905925346-21bda4d32df4'), '云海之上，只剩峰顶与我。', 'Above the sea of clouds, only the summit and I.'],
            [U('1483728642387-6c3bdd6c93e5'), '雾把山湖折成一幅水墨。', 'Fog folded the lake into an ink painting.'],
            [U('1522124624696-7ea32eb9592c'), '紫色的夜，从山脊漫过来。', 'A violet night spilled over the ridge.'],
            [U('1458668383970-8ddd3927deed'), '云之上，时间失去了刻度。', 'Above the clouds, time loses its marks.']
          ])
        },
        {
          id: 'norway', cn: '挪威', en: 'NORWAY', alias: '峡湾之国',
          line: '峡湾把山折进水里，云低得可以触摸。',
          notes: [
            { h: 'JOURNAL · 手记', p: '峡湾的安静是有重量的。轮渡切开镜面一样的水，两岸的山把影子叠了一层又一层。在弗洛姆的小木屋住了三晚，每天早上被同一种鸟叫醒，后来才知道那叫欧鸲。' },
            { h: 'FRAME · 笔记', p: '峡湾适合竖构图——山太高，水太深，横着放不下。清晨水面平静时拍倒影，把地平线放在正中，对称本身就是一种语言。' }
          ],
          photos: ph([
            [U('1520769669658-f07657f5a307'), '峡湾尽头，旗帜与晚霞同色。', "At the fjord's end, the flag shares the sunset's color."],
            [U('1493246507139-91e8fad9978e'), '山把影子投进湖里，夜就开始了。', 'When the mountain casts its shadow, night begins.'],
            [U('1477346611705-65d1883cee1e'), '黎明是粉的，冷也是温柔的。', 'The dawn is pink; even the cold is gentle.'],
            [U('1469474968028-56623f02e42e'), '雾一层一层，把山读得很慢。', 'Layer by layer, the fog reads the mountains slowly.'],
            [U('1454496522488-7a8e488e8606'), '雪线以上，风替世界降噪。', 'Above the snow line, the wind mutes the world.'],
            [U('1439066615861-d1af74d74000'), '码头伸向湖心，像一句没说完的话。', 'The pier reaches out like an unfinished sentence.'],
            [U('1441716844725-09cedc13a4e7'), '雾大的时候，人是山的逗号。', 'In heavy fog, a person is the mountain’s comma.'],
            [U('1426604966848-d7adac402bff'), '花岗岩记得所有冰川的脾气。', 'The granite remembers every glacier’s temper.'],
            [U('1465056836041-7f43ac27dcb5'), '黄昏落在湖面，比落在心里轻。', 'Dusk lands lighter on the lake than on the heart.'],
            [P('257'), '水面静下来时，峡湾在照镜子。', 'When the water stills, the fjord looks in the mirror.']
          ])
        },
        {
          id: 'finland', cn: '芬兰', en: 'FINLAND', alias: '千湖之国',
          line: '极夜的森林，静得能听见雪落。',
          notes: [
            { h: 'JOURNAL · 手记', p: '极夜的白天只有三个小时，太阳贴着地平线走一圈就回去了。森林里的雪吸掉了所有声音，我甚至听见了自己的心跳。从桑拿房出来跳进雪地的瞬间，才明白芬兰人为什么不爱说话——冷，是最好的沉默。' },
            { h: 'FRAME · 笔记', p: '拍极夜要信任高感。蓝调时刻其实持续整个「白天」，色温压到 4500K 以下，雪会泛出一种近乎透明的青。森林里的光斑稍纵即逝，见到就按，不要等。' }
          ],
          photos: ph([
            [U('1483347756197-71ef80e95f73'), '极光在森林上空，绿得很轻。', 'Above the forest, the aurora glows a gentle green.'],
            [U('1499696010180-025ef6e1a8f9'), '小屋的灯，是雪原唯一的暖色。', 'The cabin lamp — the tundra’s only warm tone.'],
            [U('1418065460487-3e41a6c84dc5'), '雾走进森林，树比人先知道。', 'The trees know before we do when fog walks in.'],
            [U('1441974231531-c6227db76b6e'), '光从高处下来，经过每一棵树。', 'Light descends, passing through every tree.'],
            [U('1447752875215-b2761acb3c5d'), '木桥很短，森林很长。', 'The bridge is short; the forest is long.'],
            [U('1440342359743-84fcb8c21f21'), '抬头时，林冠替天空写了字。', 'Look up — the canopy has written on the sky.'],
            [U('1536257104079-aa99c6460a5a'), '黄昏是紫的，湖什么也没说。', 'The dusk is violet; the lake says nothing.'],
            [P('967'), '夜色裂开一道绿，像天空在呼吸。', 'A green rift in the night — the sky breathing.'],
            [P('730'), '霜落满林，连飞鸟也放轻了翅膀。', 'Frost crowns the forest; even birds soften their wings.'],
            [P('559'), '雪路向深处去，脚步自带回声。', 'The snowy path leads inward; footsteps carry their own echo.']
          ])
        },
        {
          id: 'sweden', cn: '瑞典', en: 'SWEDEN', alias: '北方森林',
          line: '松林与湖泊之间，光是慢的。',
          notes: [
            { h: 'JOURNAL · 手记', p: '从斯德哥尔摩往北开，城市退成小镇，小镇退成森林。路边的红木屋越来越多，像瑞典人撒在绿毯上的逗号。在达拉纳的湖边，我坐了整整一个下午，只为看一朵云从山的左边走到右边。' },
            { h: 'FRAME · 笔记', p: '瑞典的光是慢的，适合等。林间的光柱每天都有，但要等雾。雾是森林的显影液——有了它，光才有了形状。' }
          ],
          photos: ph([
            [U('1476231682828-37e571bc172f'), '松林笔直，像北方的标点。', 'Straight pines — punctuation marks of the north.'],
            [U('1511497584788-876760111969'), '雾漫进来，松林只剩轮廓。', 'Fog rolls in; the pines keep only outlines.'],
            [U('1476820865390-c52aeebb9891'), '公路穿过秋天，一直开向冬天。', 'The road runs through autumn, straight into winter.'],
            [U('1465146344425-f00d5f5c8f07'), '花田很短，夏天也是。', 'The flower field is brief; so is the summer.'],
            [P('190'), '光柱落下时，森林安静下来。', 'When the light shafts fall, the forest goes quiet.'],
            [P('202'), '树荫深处，光是稀客。', 'Deep in the shade, light is a rare guest.'],
            [P('476'), '林子很暗，路记得方向。', 'The woods are dark; the road remembers the way.'],
            [P('568'), '松脂的气味里，时间走得更慢。', 'In the scent of resin, time moves even slower.'],
            [P('727'), '红木屋站在旷野里，像一句瑞典语。', 'The red cabin stands in the field like a Swedish word.'],
            [P('1063'), '从空中看，森林有自己的航道。', 'From above, the forest has its own shipping lanes.']
          ])
        },
        {
          id: 'denmark', cn: '丹麦', en: 'DENMARK', alias: '童话王国',
          line: '新港的彩色房子，装着整个北欧的温柔。',
          notes: [
            { h: 'JOURNAL · 手记', p: '哥本哈根的自行车比人多，车铃声比人声多。新港的彩色房子在阴天里也亮着，像一排洗好的蜡笔。傍晚坐在运河边喝啤酒，看游船一班一班过去，忽然理解了 hygge——那不是点蜡烛，是把日子过慢。' },
            { h: 'FRAME · 笔记', p: '彩色房子不要在正午拍，颜色会吵。等阴天或者黄昏，饱和度降下来，才是北欧的脾气。倒影要在游船经过的间隙抢——水面一皱，童话就醒了。' }
          ],
          photos: ph([
            [U('1513622470522-26c3c8a854bc'), '新港的彩色房子，是北欧的童话注脚。', 'Nyhavn’s colored houses — a footnote to a Nordic tale.'],
            [U('1506973035872-a4ec16b8e8d9'), '船泊在港里，日子泊在水里。', 'Boats moored in the harbour; days moored in the water.'],
            [P('610'), '自行车靠在运河边，等一个晴天。', 'Bicycles by the canal, waiting for a clear day.'],
            [P('211'), '港口的色彩，比童话克制一些。', 'The harbour’s colors — more restrained than the fairy tales.'],
            [P('76'), '旧船屋的门后，是波罗的海的风。', 'Behind the boathouse door, the Baltic wind.'],
            [P('196'), '沙丘向北延伸，足迹被风收走。', 'The dunes run north; the wind collects the footprints.'],
            [P('330'), '白崖之外，海是另一种白。', 'Beyond the white cliffs, another kind of white.'],
            [P('756'), '灯塔站在沙滩尽头，替海看家。', 'The lighthouse keeps watch at the beach’s end.'],
            [P('796'), '沙滩空下来，只剩风在走。', 'The beach empties; only the wind keeps walking.'],
            [P('385'), '海平线很淡，像没画完的一笔。', 'The horizon — a stroke left unfinished.']
          ])
        },
        {
          id: 'uk', cn: '英国', en: 'UNITED KINGDOM', alias: '雾都群岛',
          line: '雾里的钟声，和老街的红色巴士。',
          notes: [
            { h: 'JOURNAL · 手记', p: '伦敦的雾没有书里写的那么浓，但钟声是真的。大本钟敲响时，鸽群从桥上升起来，泰晤士河把一切都冲淡了一层。后来去了七姐妹白崖，风大得站不稳，海天之间只剩一种倔强的白。' },
            { h: 'FRAME · 笔记', p: '拍雾中的城市，曝光补偿要加半档——雾是天然的柔光箱，也是天然的陷阱。红色巴士是伦敦给的礼物，等它入画，灰调的画面就有了心跳。' }
          ],
          photos: ph([
            [U('1486299267070-83823f5448dd'), '钟声穿过雾，落在泰晤士河上。', 'The bell cuts through fog, landing on the Thames.'],
            [U('1529655683826-aba9b3e77383'), '黄昏给老钟楼镀了一层温柔。', 'Dusk gilds the old clock tower with tenderness.'],
            [U('1526129318478-62ed807ebdf9'), '红色巴士驶过，街道有了心跳。', 'A red bus passes; the street gains a heartbeat.'],
            [U('1533929736458-ca588d08c8be'), '塔桥升起时，河流让了一次路。', 'When the bridge lifts, the river yields.'],
            [U('1502082553048-f009c37129b9'), '旷野上的一棵树，站成了地标。', 'A lone tree in the wild, standing as a landmark.'],
            [U('1518156677180-95a2893f3e9f'), '黑色的浪，有北大西洋的脾气。', 'Black waves carry the North Atlantic’s temper.'],
            [P('43'), '夜色把桥点亮，河水替它鼓掌。', 'Night lights the bridge; the river applauds.'],
            [P('44'), '雾很大，桥只剩一个念头。', 'The fog is thick; the bridge is only an idea.'],
            [P('619'), '红色电话亭里，住着旧伦敦。', 'Inside the red booth lives an older London.'],
            [P('485'), '白崖向着海，像一句倔强的告别。', 'The white cliffs face the sea — a stubborn farewell.']
          ])
        },
        {
          id: 'ireland', cn: '爱尔兰', en: 'IRELAND', alias: '翡翠岛',
          line: '大西洋的风，吹绿了整个岛。',
          notes: [
            { h: 'JOURNAL · 手记', p: '大西洋的风一路吹过来，把岛吹绿了又吹黄。莫赫悬崖上，云的影子在海面上跑，像一群赶路的鲸。酒吧里的老人说，爱尔兰的雨是「软雨」，下在身上不恼人——我淋了七天，信了。' },
            { h: 'FRAME · 笔记', p: '绿是很难拍的颜色，容易俗。阴天加偏振，绿色会沉下来，像丝绒。海岸线上别急着按快门，等一束云隙光——它每二十分钟来一次，很守时。' }
          ],
          photos: ph([
            [U('1518098268026-4e89f1a2cd8e'), '绿丘的尽头，公路开进了晚霞。', 'Beyond the green hills, the road drives into the afterglow.'],
            [U('1590089415225-401ed6f9db8e'), '海边的彩色小屋，守着一座老教堂。', 'Colored cottages by the sea guard an old church.'],
            [U('1470071459604-3b5ec3a7fe05'), '雾漫过绿丘，岛更绿了。', 'Fog spills over the hills; the island grows greener.'],
            [U('1471922694854-ff1b63b20054'), '鸟群先于风，抵达海的另一边。', 'The birds reach the far side before the wind.'],
            [U('1505142468610-359e7d316be0'), '海水绿得透明，像岛的呼吸。', 'The sea — translucent green, like the island breathing.'],
            [U('1518837695005-2083093ee35b'), '浪一层层，把蓝色推上岸。', 'Wave after wave pushes the blue ashore.'],
            [U('1510414842594-a61c69b5ae57'), '海湾弯成一只耳朵，听大西洋。', 'The bay curves into an ear, listening to the Atlantic.'],
            [U('1547036967-23d11aacaee0'), '从空中看，海岸是绿色的标点。', 'From above, the coast is a green punctuation mark.'],
            [U('1439405326854-014607f694d7'), '日落掉进海里，溅起金光。', 'The sun drops into the sea, splashing gold.'],
            [U('1500375592092-40eb2168fd21'), '浪花碎在礁石上，像一场慢动作。', 'Waves shatter on the rocks in slow motion.'],
            [U('1468581264429-2548ef9eb732'), '海很蓝，蓝得很安静。', 'The sea is blue — a very quiet blue.']
          ])
        },
        {
          id: 'france', cn: '法国', en: 'FRANCE', alias: '浪漫之都',
          line: '塞纳河的黄昏，从不需要滤镜。',
          notes: [
            { h: 'JOURNAL · 手记', p: '到巴黎的第一个黄昏，我在塞纳河边坐到灯亮。铁塔准点闪烁时，身边所有语言都变成了惊叹。后来在蒙马特迷路，在石阶上遇见拉手风琴的人，琴声一响，整个街区都成了电影。' },
            { h: 'FRAME · 笔记', p: '巴黎适合长焦压缩——屋顶、烟囱、铁塔，三层叠在一起，就是这座城的剖面。蓝调时刻只有二十分钟，桥上的灯一亮就按，别等天空完全黑透。' }
          ],
          photos: ph([
            [U('1502602898657-3e91760cbb34'), '铁塔亮起时，巴黎屏住了呼吸。', 'When the tower lights up, Paris holds its breath.'],
            [U('1431274172761-fca41d930114'), '晴天的铁塔，像一枚别在蓝天的针。', 'On a clear day, the tower pins itself to the blue.'],
            [U('1511739001486-6bfe10ce785f'), '云路过铁塔，放慢了脚步。', 'Clouds slow their pace passing the tower.'],
            [U('1499856871958-5b9627545d1a'), '桥上的黄昏，属于整条塞纳河。', 'The dusk on the bridge belongs to the whole Seine.'],
            [U('1520939817895-060bdaf4fe1b'), '从高处看，巴黎是一场整齐的浪漫。', 'From above, Paris is a tidy romance.'],
            [U('1507525428034-b723cf961d3e'), '海滩是粉的，像莫奈忘了收笔。', 'A pink beach — Monet forgetting to lift his brush.'],
            [U('1474433188271-d3f339f41911'), '绿松石色的海，把夏天留得很长。', 'The turquoise sea stretches the summer long.'],
            [U('1570698473651-b2de99bae12f'), '屋顶连成一片，是老城的天际线。', 'Rooftops merge — the old town’s skyline.'],
            [P('142'), '城堡睡在花园里，几世纪没醒。', 'The château sleeps in its garden, centuries deep.'],
            [P('1076'), '金字塔亮起时，艺术还没闭馆。', 'When the pyramid glows, art has not closed.']
          ])
        },
        {
          id: 'belgium', cn: '比利时', en: 'BELGIUM', alias: '中世纪回廊',
          line: '运河绕着老城，时间慢成鹅卵石。',
          notes: [
            { h: 'JOURNAL · 手记', p: '布鲁日的运河把老城泡在时间之外。鹅卵石被六百年的脚步磨圆，马车经过时，整条街都在轻轻晃。在华夫饼的甜香里拐错了一个弯，却撞见一面爬满常春藤的墙——在布鲁日，迷路是褒义词。' },
            { h: 'FRAME · 笔记', p: '老城的巷子窄，光只能斜着进来——这是布光师给的恩惠。清晨八点前，游客未至，运河如镜，是独属于早起者的布鲁日。' }
          ],
          photos: ph([
            [U('1467269204594-9661b134dd2b'), '花从窗台垂下来，街就有了表情。', 'Flowers spill from windowsills; the street gains expression.'],
            [P('164'), '运河绕着老城，时间慢成鹅卵石。', 'The canal circles the old town; time slows to cobblestones.'],
            [P('193'), '古堡站在草坪尽头，像一页历史。', 'The castle stands at the lawn’s end — a page of history.'],
            [P('419'), '电车叮当驶过，老街晃了一下。', 'The tram rattles by; the old street sways.'],
            [P('441'), '巷子很窄，夕光刚好挤进来。', 'The alley is narrow; the evening light just fits.'],
            [P('670'), '轨道穿过街道，也穿过旧时光。', 'The tracks cross the street — and the old days.'],
            [P('690'), '大街的立面，排着中世纪的队。', 'The grand façades queue up from medieval times.'],
            [P('782'), '入夜的巷子，只留一盏灯。', 'At night, the alley keeps a single lamp.'],
            [P('800'), '广场上的人散了，教堂还在听。', 'The square empties; the cathedral keeps listening.'],
            [P('1047'), '砖石窄巷深处，藏着布鲁日的下午。', 'Deep in the brick lanes hides a Bruges afternoon.']
          ])
        },
        {
          id: 'switzerland', cn: '瑞士', en: 'SWITZERLAND', alias: '阿尔卑斯之心',
          line: '山巅之上，云层之下，是另一种人间。',
          notes: [
            { h: 'JOURNAL · 手记', p: '坐金色山口列车翻过隘口，云雾在窗外裂开一道缝，雪峰就那么站着，一句话也不说。在采尔马特的清晨，等到第一缕光烧上马特洪峰的尖顶，整个山谷的人都屏住了呼吸。' },
            { h: 'FRAME · 笔记', p: '高山摄影，光是分层的：先烧峰顶，再漫山谷，最后才轮到人。提前查好日出方位，在峰顶亮起前十分钟就位。长焦里的人影，是给大山最好的比例尺。' }
          ],
          photos: ph([
            [U('1491555103944-7c647fd857e6'), '红衣服的人很小，山很大。', 'The red jacket is small; the mountain is vast.'],
            [U('1527668752968-14dc70a27c95'), '绿谷深处，湖水替天空值班。', 'Deep in the green valley, the lake stands in for the sky.'],
            [U('1530122037265-a5f1f91d3b99'), '山谷把绿色一路铺到雪线。', 'The valley lays its green all the way to the snow line.'],
            [U('1552083375-1447ce886485'), '湖心的岛，是蓝调色板上的一点。', 'The island — a single dab on a blue palette.'],
            [U('1508739773434-c26b3d09e071'), '日出把峰顶烧成了橙色。', 'Sunrise burns the summit orange.'],
            [U('1542224566-6e85f2e6772f'), '雾谷的清晨，光来得比人早。', 'In the misty valley, light arrives before people.'],
            [P('328'), '缆车升上去，山谷矮了下来。', 'The cable car rises; the valley shrinks.'],
            [P('572'), '雪落满村庄，屋顶先白了头。', 'Snow fills the village; the rooftops grey first.'],
            [P('906'), '山峰是金字塔，云是它的影子。', 'A pyramid peak, with the cloud as its shadow.'],
            [P('980'), '湖畔的灯亮了，山还没睡。', 'The lakeside lamps are on; the mountain stays awake.']
          ])
        }
      ],

      /* ------------------------------------------------- CHINA */
      china: [
        {
          id: 'chongqing', cn: '重庆', en: 'CHONGQING', alias: '山城',
          line: '两江交汇，灯火从崖壁上长出来。',
          notes: [
            { h: 'JOURNAL · 手记', p: '第一次站在千厮门大桥上往下看，我以为自己恐高——后来才知道，那是震撼。灯火从崖壁上一层一层长出来，嘉陵江和长江在脚下汇合，像两条发光的河在握手。重庆的夜景，看的不是灯，是山与城的角力。' },
            { h: 'FRAME · 笔记', p: '拍山城要爬楼。居民楼的天台、过街天桥的转角，都是机位。蓝调时刻的灯火最透，天全黑后光比太大，容易糊成一片。雾是重庆的常客——别躲它，它让灯火有了层次。' }
          ],
          photos: ph([
            [U('1444723121867-7a241cacace9'), '灯火从崖壁上长出来，江就有了岸。', 'Lights grow from the cliffs; the river gains its banks.'],
            [U('1493514789931-586cb221d7a7'), '楼挤着楼，山城把夜举得很高。', 'Towers shoulder to shoulder — the mountain city lifts the night.'],
            [U('1480714378408-67cf0d13bc1b'), '日落是金的，街道是暖的。', 'The sunset is gold; the streets are warm.'],
            [U('1444084316824-dc26d6657664'), '白天的天际线，也有山的轮廓。', 'By day, the skyline keeps the mountains’ outline.'],
            [U('1541336032412-2048a678540d'), '黄昏的剪影里，楼与山难分彼此。', 'In the dusk silhouette, towers and hills blur together.'],
            [P('220'), '车流在路口写字，写的是光。', 'Traffic writes at the junction — in light.'],
            [P('249'), '桥亮起蓝光，江面跟着醒了。', 'The bridge glows blue; the river wakes with it.'],
            [P('294'), '从山坡看下去，万家灯火在脚下。', 'From the hillside, ten thousand lights below.'],
            [P('985'), '隔着江，对岸的夜一层叠一层。', 'Across the river, the far bank’s night stacks layer on layer.'],
            [P('1067'), '全景的夜，是山城的呼吸。', 'The panoramic night — the mountain city breathing.']
          ])
        },
        {
          id: 'hongkong', cn: '香港', en: 'HONG KONG', alias: '东方之珠',
          line: '霓虹落进维港，夜色有了密度。',
          notes: [
            { h: 'JOURNAL · 手记', p: '在维港边等过一场雨。雨落下来时，霓虹全碎了，碎在街道上、雨伞上、双层巴士的车窗上。坐天星小轮回尖沙咀，海风把水腥味吹进船舱，两岸的楼高得让人仰头——这座城，连夜色都是立体的。' },
            { h: 'FRAME · 笔记', p: '雨夜是香港的第二副面孔，地面的反光比霓虹本身好看。拍密集的窗要用小光圈——每一扇窗后面都是一个故事，舍不得虚化。天星小轮上记得连拍，船在晃，光在流。' }
          ],
          photos: ph([
            [U('1536599018102-9f803c140fc1'), '维港的黄昏，楼比山先亮起。', 'At dusk in the harbour, towers light before the hills.'],
            [U('1519501025264-65ba15a82390'), '雨夜把霓虹，揉碎在街面上。', 'The rainy night kneads neon into the pavement.'],
            [U('1523731407965-2430cd12f5e4'), '楼挨着楼，夜色有了密度。', 'Towers packed tight — the night gains density.'],
            [U('1449824913935-59a10b8d2000'), '白天的港岛，玻璃也在发光。', 'By day, even the glass glows.'],
            [U('1514924013411-cbf25faa35bb'), '仰头看，楼群把天空切成格子。', 'Look up — the towers slice the sky into grids.'],
            [P('945'), '窗户密密麻麻，每扇都有剧情。', 'Windows dense as pixels, each with its own plot.'],
            [P('862'), '城市的峡谷里，风也要排队。', 'In the city’s canyon, even the wind queues.'],
            [P('391'), '天际线在暮色里，一页页翻开。', 'The skyline turns its pages in the twilight.'],
            [P('868'), '雾漫过高楼，城市只剩上半截。', 'Fog floods the towers; only the tops remain.'],
            [P('274'), '霓虹亮起来，街道开始夜谈。', 'When the neon comes on, the street starts its night talk.']
          ])
        }
      ]
    }
  };

  /* ============================================================
     照片可编辑层
     - 每张基础照片分配稳定 ID（regionId-index），禁用展示 index 回写
     - 用户编辑（新增 / 删除 / 显隐）持久化于 localStorage
     - applyAll() 将「基础 - 删除 + 新增」应用到 region.photos，
       其中被隐藏的照片带 hidden:true 标记；展示层用 ATLAS.display 过滤
     ============================================================ */
  var PHOTO_STORE_KEY = 'atlas-photo-overrides-v1';

  // 稳定 ID + 原始数据快照（不可变的可信数据源）
  Object.keys(ATLAS.groups).forEach(function (g) {
    ATLAS.groups[g].forEach(function (r) {
      r.photos.forEach(function (p, i) { p.id = r.id + '-' + i; });
      r._base = r.photos.slice();
    });
  });

  function loadPhotoStore() {
    try { return JSON.parse(localStorage.getItem(PHOTO_STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function savePhotoStore(s) {
    try { localStorage.setItem(PHOTO_STORE_KEY, JSON.stringify(s)); }
    catch (e) {}
  }
  function ensurePhotoStore(s) {
    s.added = s.added || {};
    s.removed = s.removed || {};
    s.hidden = s.hidden || {};
    return s;
  }

  ATLAS.PhotoStore = {
    // 取某地区「基础 - 删除 + 新增」后的完整照片列表（含 hidden 标记）
    getEffective: function (region) {
      var s = ensurePhotoStore(loadPhotoStore());
      var removed = s.removed[region.id] || [];
      var hidden = s.hidden[region.id] || [];
      var added = s.added[region.id] || [];
      var base = region._base.filter(function (p) {
        return removed.indexOf(p.id) === -1;
      }).map(function (p) {
        return { id: p.id, src: p.src, cn: p.cn, en: p.en, hidden: hidden.indexOf(p.id) !== -1 };
      });
      var extras = added.map(function (p) {
        return { id: p.id, src: p.src, cn: p.cn, en: p.en, hidden: !!p.hidden };
      });
      return base.concat(extras);
    },
    // 仅网站展示的照片（排除 hidden）
    display: function (region) {
      return this.getEffective(region).filter(function (p) { return !p.hidden; });
    },
    // 把编辑结果写回 region.photos，供现有展示代码直接读取
    applyAll: function () {
      var self = this;
      Object.keys(ATLAS.groups).forEach(function (g) {
        ATLAS.groups[g].forEach(function (r) { r.photos = self.getEffective(r); });
      });
    },
    add: function (region, photo) {
      var s = ensurePhotoStore(loadPhotoStore());
      s.added[region.id] = s.added[region.id] || [];
      var entry = {
        id: region.id + '-a' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        src: photo.src, cn: photo.cn || '', en: photo.en || '', hidden: false
      };
      s.added[region.id].push(entry);
      savePhotoStore(s);
      this.applyAll();
      return entry;
    },
    remove: function (region, photoId) {
      var s = ensurePhotoStore(loadPhotoStore());
      s.removed[region.id] = s.removed[region.id] || [];
      if (s.removed[region.id].indexOf(photoId) === -1) s.removed[region.id].push(photoId);
      if (s.added[region.id]) {
        s.added[region.id] = s.added[region.id].filter(function (p) { return p.id !== photoId; });
      }
      if (s.hidden[region.id]) {
        s.hidden[region.id] = s.hidden[region.id].filter(function (i) { return i !== photoId; });
      }
      savePhotoStore(s);
      this.applyAll();
    },
    setHidden: function (region, photoId, hidden) {
      var s = ensurePhotoStore(loadPhotoStore());
      s.hidden[region.id] = s.hidden[region.id] || [];
      var idx = s.hidden[region.id].indexOf(photoId);
      if (hidden && idx === -1) s.hidden[region.id].push(photoId);
      else if (!hidden && idx !== -1) s.hidden[region.id].splice(idx, 1);
      savePhotoStore(s);
      this.applyAll();
    },
    reset: function (region) {
      var s = ensurePhotoStore(loadPhotoStore());
      delete s.added[region.id];
      delete s.removed[region.id];
      delete s.hidden[region.id];
      savePhotoStore(s);
      this.applyAll();
    }
  };

  // 便捷：返回该地区当前展示照片（region.photos 中未隐藏的）
  ATLAS.display = function (region) {
    return (region.photos || []).filter(function (p) { return !p.hidden; });
  };

  ATLAS.PhotoStore.applyAll();

  window.ATLAS = ATLAS;
})();

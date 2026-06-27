import { existsSync as e, promises as t } from "node:fs";
import n from "node:path";
import { promisify as r } from "node:util";
import { execFile as i, spawn as a } from "node:child_process";
import { fileURLToPath as o } from "node:url";
import { brotliCompress as s, gzip as c } from "node:zlib";
//#region \0rolldown/runtime.js
var l = Object.defineProperty, u = /* @__PURE__ */ ((e, t) => {
	let n = {};
	for (var r in e) l(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || l(n, Symbol.toStringTag, { value: "Module" }), n;
})({
	Node: () => ot,
	Parser: () => k,
	Position: () => _e,
	SourceLocation: () => ve,
	TokContext: () => P,
	Token: () => Yt,
	TokenType: () => x,
	defaultOptions: () => be,
	getLineInfo: () => ye,
	isIdentifierChar: () => b,
	isIdentifierStart: () => y,
	isNewLine: () => ae,
	keywordTypes: () => re,
	lineBreak: () => D,
	lineBreakG: () => ie,
	nonASCIIwhitespace: () => se,
	parse: () => en,
	parseExpressionAt: () => tn,
	tokContexts: () => F,
	tokTypes: () => E,
	tokenizer: () => nn,
	version: () => $t
}), d = [
	509,
	0,
	227,
	0,
	150,
	4,
	294,
	9,
	1368,
	2,
	2,
	1,
	6,
	3,
	41,
	2,
	5,
	0,
	166,
	1,
	574,
	3,
	9,
	9,
	7,
	9,
	32,
	4,
	318,
	1,
	78,
	5,
	71,
	10,
	50,
	3,
	123,
	2,
	54,
	14,
	32,
	10,
	3,
	1,
	11,
	3,
	46,
	10,
	8,
	0,
	46,
	9,
	7,
	2,
	37,
	13,
	2,
	9,
	6,
	1,
	45,
	0,
	13,
	2,
	49,
	13,
	9,
	3,
	2,
	11,
	83,
	11,
	7,
	0,
	3,
	0,
	158,
	11,
	6,
	9,
	7,
	3,
	56,
	1,
	2,
	6,
	3,
	1,
	3,
	2,
	10,
	0,
	11,
	1,
	3,
	6,
	4,
	4,
	68,
	8,
	2,
	0,
	3,
	0,
	2,
	3,
	2,
	4,
	2,
	0,
	15,
	1,
	83,
	17,
	10,
	9,
	5,
	0,
	82,
	19,
	13,
	9,
	214,
	6,
	3,
	8,
	28,
	1,
	83,
	16,
	16,
	9,
	82,
	12,
	9,
	9,
	7,
	19,
	58,
	14,
	5,
	9,
	243,
	14,
	166,
	9,
	71,
	5,
	2,
	1,
	3,
	3,
	2,
	0,
	2,
	1,
	13,
	9,
	120,
	6,
	3,
	6,
	4,
	0,
	29,
	9,
	41,
	6,
	2,
	3,
	9,
	0,
	10,
	10,
	47,
	15,
	199,
	7,
	137,
	9,
	54,
	7,
	2,
	7,
	17,
	9,
	57,
	21,
	2,
	13,
	123,
	5,
	4,
	0,
	2,
	1,
	2,
	6,
	2,
	0,
	9,
	9,
	49,
	4,
	2,
	1,
	2,
	4,
	9,
	9,
	55,
	9,
	266,
	3,
	10,
	1,
	2,
	0,
	49,
	6,
	4,
	4,
	14,
	10,
	5350,
	0,
	7,
	14,
	11465,
	27,
	2343,
	9,
	87,
	9,
	39,
	4,
	60,
	6,
	26,
	9,
	535,
	9,
	470,
	0,
	2,
	54,
	8,
	3,
	82,
	0,
	12,
	1,
	19628,
	1,
	4178,
	9,
	519,
	45,
	3,
	22,
	543,
	4,
	4,
	5,
	9,
	7,
	3,
	6,
	31,
	3,
	149,
	2,
	1418,
	49,
	513,
	54,
	5,
	49,
	9,
	0,
	15,
	0,
	23,
	4,
	2,
	14,
	1361,
	6,
	2,
	16,
	3,
	6,
	2,
	1,
	2,
	4,
	101,
	0,
	161,
	6,
	10,
	9,
	357,
	0,
	62,
	13,
	499,
	13,
	245,
	1,
	2,
	9,
	233,
	0,
	3,
	0,
	8,
	1,
	6,
	0,
	475,
	6,
	110,
	6,
	6,
	9,
	4759,
	9,
	787719,
	239
], f = [
	0,
	11,
	2,
	25,
	2,
	18,
	2,
	1,
	2,
	14,
	3,
	13,
	35,
	122,
	70,
	52,
	268,
	28,
	4,
	48,
	48,
	31,
	14,
	29,
	6,
	37,
	11,
	29,
	3,
	35,
	5,
	7,
	2,
	4,
	43,
	157,
	19,
	35,
	5,
	35,
	5,
	39,
	9,
	51,
	13,
	10,
	2,
	14,
	2,
	6,
	2,
	1,
	2,
	10,
	2,
	14,
	2,
	6,
	2,
	1,
	4,
	51,
	13,
	310,
	10,
	21,
	11,
	7,
	25,
	5,
	2,
	41,
	2,
	8,
	70,
	5,
	3,
	0,
	2,
	43,
	2,
	1,
	4,
	0,
	3,
	22,
	11,
	22,
	10,
	30,
	66,
	18,
	2,
	1,
	11,
	21,
	11,
	25,
	7,
	25,
	39,
	55,
	7,
	1,
	65,
	0,
	16,
	3,
	2,
	2,
	2,
	28,
	43,
	28,
	4,
	28,
	36,
	7,
	2,
	27,
	28,
	53,
	11,
	21,
	11,
	18,
	14,
	17,
	111,
	72,
	56,
	50,
	14,
	50,
	14,
	35,
	39,
	27,
	10,
	22,
	251,
	41,
	7,
	1,
	17,
	5,
	57,
	28,
	11,
	0,
	9,
	21,
	43,
	17,
	47,
	20,
	28,
	22,
	13,
	52,
	58,
	1,
	3,
	0,
	14,
	44,
	33,
	24,
	27,
	35,
	30,
	0,
	3,
	0,
	9,
	34,
	4,
	0,
	13,
	47,
	15,
	3,
	22,
	0,
	2,
	0,
	36,
	17,
	2,
	24,
	20,
	1,
	64,
	6,
	2,
	0,
	2,
	3,
	2,
	14,
	2,
	9,
	8,
	46,
	39,
	7,
	3,
	1,
	3,
	21,
	2,
	6,
	2,
	1,
	2,
	4,
	4,
	0,
	19,
	0,
	13,
	4,
	31,
	9,
	2,
	0,
	3,
	0,
	2,
	37,
	2,
	0,
	26,
	0,
	2,
	0,
	45,
	52,
	19,
	3,
	21,
	2,
	31,
	47,
	21,
	1,
	2,
	0,
	185,
	46,
	42,
	3,
	37,
	47,
	21,
	0,
	60,
	42,
	14,
	0,
	72,
	26,
	38,
	6,
	186,
	43,
	117,
	63,
	32,
	7,
	3,
	0,
	3,
	7,
	2,
	1,
	2,
	23,
	16,
	0,
	2,
	0,
	95,
	7,
	3,
	38,
	17,
	0,
	2,
	0,
	29,
	0,
	11,
	39,
	8,
	0,
	22,
	0,
	12,
	45,
	20,
	0,
	19,
	72,
	200,
	32,
	32,
	8,
	2,
	36,
	18,
	0,
	50,
	29,
	113,
	6,
	2,
	1,
	2,
	37,
	22,
	0,
	26,
	5,
	2,
	1,
	2,
	31,
	15,
	0,
	24,
	43,
	261,
	18,
	16,
	0,
	2,
	12,
	2,
	33,
	125,
	0,
	80,
	921,
	103,
	110,
	18,
	195,
	2637,
	96,
	16,
	1071,
	18,
	5,
	26,
	3994,
	6,
	582,
	6842,
	29,
	1763,
	568,
	8,
	30,
	18,
	78,
	18,
	29,
	19,
	47,
	17,
	3,
	32,
	20,
	6,
	18,
	433,
	44,
	212,
	63,
	33,
	24,
	3,
	24,
	45,
	74,
	6,
	0,
	67,
	12,
	65,
	1,
	2,
	0,
	15,
	4,
	10,
	7381,
	42,
	31,
	98,
	114,
	8702,
	3,
	2,
	6,
	2,
	1,
	2,
	290,
	16,
	0,
	30,
	2,
	3,
	0,
	15,
	3,
	9,
	395,
	2309,
	106,
	6,
	12,
	4,
	8,
	8,
	9,
	5991,
	84,
	2,
	70,
	2,
	1,
	3,
	0,
	3,
	1,
	3,
	3,
	2,
	11,
	2,
	0,
	2,
	6,
	2,
	64,
	2,
	3,
	3,
	7,
	2,
	6,
	2,
	27,
	2,
	3,
	2,
	4,
	2,
	0,
	4,
	6,
	2,
	339,
	3,
	24,
	2,
	24,
	2,
	30,
	2,
	24,
	2,
	30,
	2,
	24,
	2,
	30,
	2,
	24,
	2,
	30,
	2,
	24,
	2,
	7,
	1845,
	30,
	7,
	5,
	262,
	61,
	147,
	44,
	11,
	6,
	17,
	0,
	322,
	29,
	19,
	43,
	485,
	27,
	229,
	29,
	3,
	0,
	208,
	30,
	2,
	2,
	2,
	1,
	2,
	6,
	3,
	4,
	10,
	1,
	225,
	6,
	2,
	3,
	2,
	1,
	2,
	14,
	2,
	196,
	60,
	67,
	8,
	0,
	1205,
	3,
	2,
	26,
	2,
	1,
	2,
	0,
	3,
	0,
	2,
	9,
	2,
	3,
	2,
	0,
	2,
	0,
	7,
	0,
	5,
	0,
	2,
	0,
	2,
	0,
	2,
	2,
	2,
	1,
	2,
	0,
	3,
	0,
	2,
	0,
	2,
	0,
	2,
	0,
	2,
	0,
	2,
	1,
	2,
	0,
	3,
	3,
	2,
	6,
	2,
	3,
	2,
	3,
	2,
	0,
	2,
	9,
	2,
	16,
	6,
	2,
	2,
	4,
	2,
	16,
	4421,
	42719,
	33,
	4381,
	3,
	5773,
	3,
	7472,
	16,
	621,
	2467,
	541,
	1507,
	4938,
	6,
	8489
], p = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-᫝᫠-᫫ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･", m = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-࢏ࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚ౜ౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽ೜-ೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-Ƛ꟱-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ", h = {
	3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
	5: "class enum extends super const export import",
	6: "enum",
	strict: "implements interface let package private protected public static yield",
	strictBind: "eval arguments"
}, g = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this", _ = {
	5: g,
	"5module": g + " export import",
	6: g + " const class extends export import super"
}, ee = /^in(stanceof)?$/, te = RegExp("[" + m + "]"), v = RegExp("[" + m + p + "]");
function ne(e, t) {
	for (var n = 65536, r = 0; r < t.length; r += 2) {
		if (n += t[r], n > e) return !1;
		if (n += t[r + 1], n >= e) return !0;
	}
	return !1;
}
function y(e, t) {
	return e < 65 ? e === 36 : e < 91 ? !0 : e < 97 ? e === 95 : e < 123 ? !0 : e <= 65535 ? e >= 170 && te.test(String.fromCharCode(e)) : t === !1 ? !1 : ne(e, f);
}
function b(e, t) {
	return e < 48 ? e === 36 : e < 58 ? !0 : e < 65 ? !1 : e < 91 ? !0 : e < 97 ? e === 95 : e < 123 ? !0 : e <= 65535 ? e >= 170 && v.test(String.fromCharCode(e)) : t === !1 ? !1 : ne(e, f) || ne(e, d);
}
var x = function(e, t) {
	t === void 0 && (t = {}), this.label = e, this.keyword = t.keyword, this.beforeExpr = !!t.beforeExpr, this.startsExpr = !!t.startsExpr, this.isLoop = !!t.isLoop, this.isAssign = !!t.isAssign, this.prefix = !!t.prefix, this.postfix = !!t.postfix, this.binop = t.binop || null, this.updateContext = null;
};
function S(e, t) {
	return new x(e, {
		beforeExpr: !0,
		binop: t
	});
}
var C = { beforeExpr: !0 }, w = { startsExpr: !0 }, re = {};
function T(e, t) {
	return t === void 0 && (t = {}), t.keyword = e, re[e] = new x(e, t);
}
var E = {
	num: new x("num", w),
	regexp: new x("regexp", w),
	string: new x("string", w),
	name: new x("name", w),
	privateId: new x("privateId", w),
	eof: new x("eof"),
	bracketL: new x("[", {
		beforeExpr: !0,
		startsExpr: !0
	}),
	bracketR: new x("]"),
	braceL: new x("{", {
		beforeExpr: !0,
		startsExpr: !0
	}),
	braceR: new x("}"),
	parenL: new x("(", {
		beforeExpr: !0,
		startsExpr: !0
	}),
	parenR: new x(")"),
	comma: new x(",", C),
	semi: new x(";", C),
	colon: new x(":", C),
	dot: new x("."),
	question: new x("?", C),
	questionDot: new x("?."),
	arrow: new x("=>", C),
	template: new x("template"),
	invalidTemplate: new x("invalidTemplate"),
	ellipsis: new x("...", C),
	backQuote: new x("`", w),
	dollarBraceL: new x("${", {
		beforeExpr: !0,
		startsExpr: !0
	}),
	eq: new x("=", {
		beforeExpr: !0,
		isAssign: !0
	}),
	assign: new x("_=", {
		beforeExpr: !0,
		isAssign: !0
	}),
	incDec: new x("++/--", {
		prefix: !0,
		postfix: !0,
		startsExpr: !0
	}),
	prefix: new x("!/~", {
		beforeExpr: !0,
		prefix: !0,
		startsExpr: !0
	}),
	logicalOR: S("||", 1),
	logicalAND: S("&&", 2),
	bitwiseOR: S("|", 3),
	bitwiseXOR: S("^", 4),
	bitwiseAND: S("&", 5),
	equality: S("==/!=/===/!==", 6),
	relational: S("</>/<=/>=", 7),
	bitShift: S("<</>>/>>>", 8),
	plusMin: new x("+/-", {
		beforeExpr: !0,
		binop: 9,
		prefix: !0,
		startsExpr: !0
	}),
	modulo: S("%", 10),
	star: S("*", 10),
	slash: S("/", 10),
	starstar: new x("**", { beforeExpr: !0 }),
	coalesce: S("??", 1),
	_break: T("break"),
	_case: T("case", C),
	_catch: T("catch"),
	_continue: T("continue"),
	_debugger: T("debugger"),
	_default: T("default", C),
	_do: T("do", {
		isLoop: !0,
		beforeExpr: !0
	}),
	_else: T("else", C),
	_finally: T("finally"),
	_for: T("for", { isLoop: !0 }),
	_function: T("function", w),
	_if: T("if"),
	_return: T("return", C),
	_switch: T("switch"),
	_throw: T("throw", C),
	_try: T("try"),
	_var: T("var"),
	_const: T("const"),
	_while: T("while", { isLoop: !0 }),
	_with: T("with"),
	_new: T("new", {
		beforeExpr: !0,
		startsExpr: !0
	}),
	_this: T("this", w),
	_super: T("super", w),
	_class: T("class", w),
	_extends: T("extends", C),
	_export: T("export"),
	_import: T("import", w),
	_null: T("null", w),
	_true: T("true", w),
	_false: T("false", w),
	_in: T("in", {
		beforeExpr: !0,
		binop: 7
	}),
	_instanceof: T("instanceof", {
		beforeExpr: !0,
		binop: 7
	}),
	_typeof: T("typeof", {
		beforeExpr: !0,
		prefix: !0,
		startsExpr: !0
	}),
	_void: T("void", {
		beforeExpr: !0,
		prefix: !0,
		startsExpr: !0
	}),
	_delete: T("delete", {
		beforeExpr: !0,
		prefix: !0,
		startsExpr: !0
	})
}, D = /\r\n?|\n|\u2028|\u2029/, ie = new RegExp(D.source, "g");
function ae(e) {
	return e === 10 || e === 13 || e === 8232 || e === 8233;
}
function oe(e, t, n) {
	n === void 0 && (n = e.length);
	for (var r = t; r < n; r++) {
		var i = e.charCodeAt(r);
		if (ae(i)) return r < n - 1 && i === 13 && e.charCodeAt(r + 1) === 10 ? r + 2 : r + 1;
	}
	return -1;
}
var se = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/, O = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g, ce = Object.prototype, le = ce.hasOwnProperty, ue = ce.toString, de = Object.hasOwn || (function(e, t) {
	return le.call(e, t);
}), fe = Array.isArray || (function(e) {
	return ue.call(e) === "[object Array]";
}), pe = Object.create(null);
function me(e) {
	return pe[e] || (pe[e] = RegExp("^(?:" + e.replace(/ /g, "|") + ")$"));
}
function he(e) {
	return e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode((e >> 10) + 55296, (e & 1023) + 56320));
}
var ge = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/, _e = function(e, t) {
	this.line = e, this.column = t;
};
_e.prototype.offset = function(e) {
	return new _e(this.line, this.column + e);
};
var ve = function(e, t, n) {
	this.start = t, this.end = n, e.sourceFile !== null && (this.source = e.sourceFile);
};
function ye(e, t) {
	for (var n = 1, r = 0;;) {
		var i = oe(e, r, t);
		if (i < 0) return new _e(n, t - r);
		++n, r = i;
	}
}
var be = {
	ecmaVersion: null,
	sourceType: "script",
	strict: !1,
	onInsertedSemicolon: null,
	onTrailingComma: null,
	allowReserved: null,
	allowReturnOutsideFunction: !1,
	allowImportExportEverywhere: !1,
	allowAwaitOutsideFunction: null,
	allowSuperOutsideMethod: null,
	allowHashBang: !1,
	checkPrivateFields: !0,
	locations: !1,
	onToken: null,
	onComment: null,
	ranges: !1,
	program: null,
	sourceFile: null,
	directSourceFile: null,
	preserveParens: !1
}, xe = !1;
function Se(e) {
	var t = {};
	for (var n in be) t[n] = e && de(e, n) ? e[n] : be[n];
	if (t.ecmaVersion === "latest" ? t.ecmaVersion = 1e8 : t.ecmaVersion == null ? (!xe && typeof console == "object" && console.warn && (xe = !0, console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.")), t.ecmaVersion = 11) : t.ecmaVersion >= 2015 && (t.ecmaVersion -= 2009), t.allowReserved ??= t.ecmaVersion < 5, (!e || e.allowHashBang == null) && (t.allowHashBang = t.ecmaVersion >= 14), fe(t.onToken)) {
		var r = t.onToken;
		t.onToken = function(e) {
			return r.push(e);
		};
	}
	if (fe(t.onComment) && (t.onComment = Ce(t, t.onComment)), t.sourceType === "commonjs" && t.allowAwaitOutsideFunction) throw Error("Cannot use allowAwaitOutsideFunction with sourceType: commonjs");
	return t;
}
function Ce(e, t) {
	return function(n, r, i, a, o, s) {
		var c = {
			type: n ? "Block" : "Line",
			value: r,
			start: i,
			end: a
		};
		e.locations && (c.loc = new ve(this, o, s)), e.ranges && (c.range = [i, a]), t.push(c);
	};
}
var we = 1, Te = 2, Ee = 4, De = 8, Oe = 16, ke = 32, Ae = 64, je = 128, Me = 256, Ne = 512, Pe = 1024, Fe = we | Te | Me;
function Ie(e, t) {
	return Te | (e ? Ee : 0) | (t ? De : 0);
}
var Le = 0, Re = 1, ze = 2, Be = 3, Ve = 4, He = 5, k = function(e, t, n) {
	this.options = e = Se(e), this.sourceFile = e.sourceFile, this.keywords = me(_[e.ecmaVersion >= 6 ? 6 : e.sourceType === "module" ? "5module" : 5]);
	var r = "";
	e.allowReserved !== !0 && (r = h[e.ecmaVersion >= 6 ? 6 : e.ecmaVersion === 5 ? 5 : 3], e.sourceType === "module" && (r += " await")), this.reservedWords = me(r);
	var i = (r ? r + " " : "") + h.strict;
	this.reservedWordsStrict = me(i), this.reservedWordsStrictBind = me(i + " " + h.strictBind), this.input = String(t), this.containsEsc = !1, n ? (this.pos = n, this.lineStart = this.input.lastIndexOf("\n", n - 1) + 1, this.curLine = this.input.slice(0, this.lineStart).split(D).length) : (this.pos = this.lineStart = 0, this.curLine = 1), this.type = E.eof, this.value = null, this.start = this.end = this.pos, this.startLoc = this.endLoc = this.curPosition(), this.lastTokEndLoc = this.lastTokStartLoc = null, this.lastTokStart = this.lastTokEnd = this.pos, this.context = this.initialContext(), this.exprAllowed = !0, this.inModule = e.sourceType === "module", this.strict = this.inModule || e.strict === !0 || this.strictDirective(this.pos), this.potentialArrowAt = -1, this.potentialArrowInForAwait = !1, this.yieldPos = this.awaitPos = this.awaitIdentPos = 0, this.labels = [], this.undefinedExports = Object.create(null), this.pos === 0 && e.allowHashBang && this.input.slice(0, 2) === "#!" && this.skipLineComment(2), this.scopeStack = [], this.enterScope(this.options.sourceType === "commonjs" ? Te : we), this.regexpState = null, this.privateNameStack = [];
}, A = {
	inFunction: { configurable: !0 },
	inGenerator: { configurable: !0 },
	inAsync: { configurable: !0 },
	canAwait: { configurable: !0 },
	allowReturn: { configurable: !0 },
	allowSuper: { configurable: !0 },
	allowDirectSuper: { configurable: !0 },
	treatFunctionsAsVar: { configurable: !0 },
	allowNewDotTarget: { configurable: !0 },
	allowUsing: { configurable: !0 },
	inClassStaticBlock: { configurable: !0 }
};
k.prototype.parse = function() {
	var e = this, t = this.options.program || this.startNode();
	return this.nextToken(), this.catchStackOverflow(function() {
		return e.parseTopLevel(t);
	});
}, A.inFunction.get = function() {
	return (this.currentVarScope().flags & Te) > 0;
}, A.inGenerator.get = function() {
	return (this.currentVarScope().flags & De) > 0;
}, A.inAsync.get = function() {
	return (this.currentVarScope().flags & Ee) > 0;
}, A.canAwait.get = function() {
	for (var e = this.scopeStack.length - 1; e >= 0; e--) {
		var t = this.scopeStack[e].flags;
		if (t & (Me | Ne)) return !1;
		if (t & Te) return (t & Ee) > 0;
	}
	return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
}, A.allowReturn.get = function() {
	return !!(this.inFunction || this.options.allowReturnOutsideFunction && this.currentVarScope().flags & we);
}, A.allowSuper.get = function() {
	return (this.currentThisScope().flags & Ae) > 0 || this.options.allowSuperOutsideMethod;
}, A.allowDirectSuper.get = function() {
	return (this.currentThisScope().flags & je) > 0;
}, A.treatFunctionsAsVar.get = function() {
	return this.treatFunctionsAsVarInScope(this.currentScope());
}, A.allowNewDotTarget.get = function() {
	for (var e = this.scopeStack.length - 1; e >= 0; e--) {
		var t = this.scopeStack[e].flags;
		if (t & (Me | Ne) || t & Te && !(t & Oe)) return !0;
	}
	return !1;
}, A.allowUsing.get = function() {
	var e = this.currentScope().flags;
	return !(e & Pe || !this.inModule && e & we);
}, A.inClassStaticBlock.get = function() {
	return (this.currentVarScope().flags & Me) > 0;
}, k.extend = function() {
	for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
	for (var n = this, r = 0; r < e.length; r++) n = e[r](n);
	return n;
}, k.parse = function(e, t) {
	return new this(t, e).parse();
}, k.parseExpressionAt = function(e, t, n) {
	var r = new this(n, e, t);
	return r.nextToken(), r.parseExpression();
}, k.tokenizer = function(e, t) {
	return new this(t, e);
}, Object.defineProperties(k.prototype, A);
var j = k.prototype, Ue = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
j.strictDirective = function(e) {
	if (this.options.ecmaVersion < 5) return !1;
	for (;;) {
		O.lastIndex = e, e += O.exec(this.input)[0].length;
		var t = Ue.exec(this.input.slice(e));
		if (!t) return !1;
		if ((t[1] || t[2]) === "use strict") {
			O.lastIndex = e + t[0].length;
			var n = O.exec(this.input), r = n.index + n[0].length, i = this.input.charAt(r);
			return i === ";" || i === "}" || D.test(n[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(i) || i === "!" && this.input.charAt(r + 1) === "=");
		}
		e += t[0].length, O.lastIndex = e, e += O.exec(this.input)[0].length, this.input[e] === ";" && e++;
	}
}, j.eat = function(e) {
	return this.type === e ? (this.next(), !0) : !1;
}, j.isContextual = function(e) {
	return this.type === E.name && this.value === e && !this.containsEsc;
}, j.eatContextual = function(e) {
	return this.isContextual(e) ? (this.next(), !0) : !1;
}, j.catchStackOverflow = function(e) {
	try {
		return e();
	} catch (e) {
		if (e instanceof Error && (/\bstack\b.*\b(exceeded|overflow)\b/i.test(e.message) || /\btoo much recursion\b/i.test(e.message))) this.raise(this.start, "Not enough stack space to parse input");
		else throw e;
	}
}, j.expectContextual = function(e) {
	this.eatContextual(e) || this.unexpected();
}, j.canInsertSemicolon = function() {
	return this.type === E.eof || this.type === E.braceR || D.test(this.input.slice(this.lastTokEnd, this.start));
}, j.insertSemicolon = function() {
	if (this.canInsertSemicolon()) return this.options.onInsertedSemicolon && this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc), !0;
}, j.semicolon = function() {
	!this.eat(E.semi) && !this.insertSemicolon() && this.unexpected();
}, j.afterTrailingComma = function(e, t) {
	if (this.type === e) return this.options.onTrailingComma && this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc), t || this.next(), !0;
}, j.expect = function(e) {
	this.eat(e) || this.unexpected();
}, j.unexpected = function(e) {
	this.raise(e ?? this.start, "Unexpected token");
};
var We = function() {
	this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
j.checkPatternErrors = function(e, t) {
	if (e) {
		e.trailingComma > -1 && this.raiseRecoverable(e.trailingComma, "Comma is not permitted after the rest element");
		var n = t ? e.parenthesizedAssign : e.parenthesizedBind;
		n > -1 && this.raiseRecoverable(n, t ? "Assigning to rvalue" : "Parenthesized pattern");
	}
}, j.checkExpressionErrors = function(e, t) {
	if (!e) return !1;
	var n = e.shorthandAssign, r = e.doubleProto;
	if (!t) return n >= 0 || r >= 0;
	n >= 0 && this.raise(n, "Shorthand property assignments are valid only in destructuring patterns"), r >= 0 && this.raiseRecoverable(r, "Redefinition of __proto__ property");
}, j.checkYieldAwaitInDefaultParams = function() {
	this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos) && this.raise(this.yieldPos, "Yield expression cannot be a default value"), this.awaitPos && this.raise(this.awaitPos, "Await expression cannot be a default value");
}, j.isSimpleAssignTarget = function(e) {
	return e.type === "ParenthesizedExpression" ? this.isSimpleAssignTarget(e.expression) : e.type === "Identifier" || e.type === "MemberExpression";
};
var M = k.prototype;
M.parseTopLevel = function(e) {
	var t = Object.create(null);
	for (e.body ||= []; this.type !== E.eof;) {
		var n = this.parseStatement(null, !0, t);
		e.body.push(n);
	}
	if (this.inModule) for (var r = 0, i = Object.keys(this.undefinedExports); r < i.length; r += 1) {
		var a = i[r];
		this.raiseRecoverable(this.undefinedExports[a].start, "Export '" + a + "' is not defined");
	}
	return this.adaptDirectivePrologue(e.body), this.next(), e.sourceType = this.options.sourceType === "commonjs" ? "script" : this.options.sourceType, this.finishNode(e, "Program");
};
var Ge = { kind: "loop" }, Ke = { kind: "switch" };
M.isLet = function(e) {
	if (this.options.ecmaVersion < 6 || !this.isContextual("let")) return !1;
	O.lastIndex = this.pos;
	var t = O.exec(this.input), n = this.pos + t[0].length, r = this.fullCharCodeAt(n);
	if (r === 91 || r === 92) return !0;
	if (e) return !1;
	if (r === 123) return !0;
	if (y(r)) {
		var i = n;
		do
			n += r <= 65535 ? 1 : 2;
		while (b(r = this.fullCharCodeAt(n)));
		if (r === 92) return !0;
		var a = this.input.slice(i, n);
		if (!ee.test(a)) return !0;
	}
	return !1;
}, M.isAsyncFunction = function() {
	if (this.options.ecmaVersion < 8 || !this.isContextual("async")) return !1;
	O.lastIndex = this.pos;
	var e = O.exec(this.input), t = this.pos + e[0].length, n;
	return !D.test(this.input.slice(this.pos, t)) && this.input.slice(t, t + 8) === "function" && (t + 8 === this.input.length || !(b(n = this.fullCharCodeAt(t + 8)) || n === 92));
}, M.isUsingKeyword = function(e, t) {
	if (this.options.ecmaVersion < 17 || !this.isContextual(e ? "await" : "using")) return !1;
	O.lastIndex = this.pos;
	var n = O.exec(this.input), r = this.pos + n[0].length;
	if (D.test(this.input.slice(this.pos, r))) return !1;
	if (e) {
		var i = r + 5, a;
		if (this.input.slice(r, i) !== "using" || i === this.input.length || b(a = this.fullCharCodeAt(i)) || a === 92) return !1;
		O.lastIndex = i;
		var o = O.exec(this.input);
		if (r = i + o[0].length, o && D.test(this.input.slice(i, r))) return !1;
	}
	var s = this.fullCharCodeAt(r);
	if (!y(s) && s !== 92) return !1;
	var c = r;
	do
		r += s <= 65535 ? 1 : 2;
	while (b(s = this.fullCharCodeAt(r)));
	if (s === 92) return !0;
	var l = this.input.slice(c, r);
	if (ee.test(l)) return !1;
	if (t && !e && l === "of") {
		O.lastIndex = r;
		var u = O.exec(this.input);
		if (r += u[0].length, this.input.charCodeAt(r) !== 61 || (s = this.input.charCodeAt(r + 1)) === 61 || s === 62) return !1;
	}
	return !0;
}, M.isAwaitUsing = function(e) {
	return this.isUsingKeyword(!0, e);
}, M.isUsing = function(e) {
	return this.isUsingKeyword(!1, e);
}, M.parseStatement = function(e, t, n) {
	var r = this.type, i = this.startNode(), a;
	switch (this.isLet(e) && (r = E._var, a = "let"), r) {
		case E._break:
		case E._continue: return this.parseBreakContinueStatement(i, r.keyword);
		case E._debugger: return this.parseDebuggerStatement(i);
		case E._do: return this.parseDoStatement(i);
		case E._for: return this.parseForStatement(i);
		case E._function: return e && (this.strict || e !== "if" && e !== "label") && this.options.ecmaVersion >= 6 && this.unexpected(), this.parseFunctionStatement(i, !1, !e);
		case E._class: return e && this.unexpected(), this.parseClass(i, !0);
		case E._if: return this.parseIfStatement(i);
		case E._return: return this.parseReturnStatement(i);
		case E._switch: return this.parseSwitchStatement(i);
		case E._throw: return this.parseThrowStatement(i);
		case E._try: return this.parseTryStatement(i);
		case E._const:
		case E._var: return a ||= this.value, e && a !== "var" && this.unexpected(), this.parseVarStatement(i, a);
		case E._while: return this.parseWhileStatement(i);
		case E._with: return this.parseWithStatement(i);
		case E.braceL: return this.parseBlock(!0, i);
		case E.semi: return this.parseEmptyStatement(i);
		case E._export:
		case E._import:
			if (this.options.ecmaVersion > 10 && r === E._import) {
				O.lastIndex = this.pos;
				var o = O.exec(this.input), s = this.pos + o[0].length, c = this.input.charCodeAt(s);
				if (c === 40 || c === 46) return this.parseExpressionStatement(i, this.parseExpression());
			}
			return this.options.allowImportExportEverywhere || (t || this.raise(this.start, "'import' and 'export' may only appear at the top level"), this.inModule || this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'")), r === E._import ? this.parseImport(i) : this.parseExport(i, n);
		default:
			if (this.isAsyncFunction()) return e && this.unexpected(), this.next(), this.parseFunctionStatement(i, !0, !e);
			var l = this.isAwaitUsing(!1) ? "await using" : this.isUsing(!1) ? "using" : null;
			if (l) return this.allowUsing || this.raise(this.start, "Using declaration cannot appear in the top level when source type is `script` or in the bare case statement"), e && this.raise(this.start, "Using declaration is not allowed in single-statement positions"), l === "await using" && (this.canAwait || this.raise(this.start, "Await using cannot appear outside of async function"), this.next()), this.next(), this.parseVar(i, !1, l), this.semicolon(), this.finishNode(i, "VariableDeclaration");
			var u = this.value, d = this.parseExpression();
			return r === E.name && d.type === "Identifier" && this.eat(E.colon) ? this.parseLabeledStatement(i, u, d, e) : this.parseExpressionStatement(i, d);
	}
}, M.parseBreakContinueStatement = function(e, t) {
	var n = t === "break";
	this.next(), this.eat(E.semi) || this.insertSemicolon() ? e.label = null : this.type === E.name ? (e.label = this.parseIdent(), this.semicolon()) : this.unexpected();
	for (var r = 0; r < this.labels.length; ++r) {
		var i = this.labels[r];
		if ((e.label == null || i.name === e.label.name) && (i.kind != null && (n || i.kind === "loop") || e.label && n)) break;
	}
	return r === this.labels.length && this.raise(e.start, "Unsyntactic " + t), this.finishNode(e, n ? "BreakStatement" : "ContinueStatement");
}, M.parseDebuggerStatement = function(e) {
	return this.next(), this.semicolon(), this.finishNode(e, "DebuggerStatement");
}, M.parseDoStatement = function(e) {
	return this.next(), this.labels.push(Ge), e.body = this.parseStatement("do"), this.labels.pop(), this.expect(E._while), e.test = this.parseParenExpression(), this.options.ecmaVersion >= 6 ? this.eat(E.semi) : this.semicolon(), this.finishNode(e, "DoWhileStatement");
}, M.parseForStatement = function(e) {
	this.next();
	var t = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
	if (this.labels.push(Ge), this.enterScope(0), this.expect(E.parenL), this.type === E.semi) return t > -1 && this.unexpected(t), this.parseFor(e, null);
	var n = this.isLet();
	if (this.type === E._var || this.type === E._const || n) {
		var r = this.startNode(), i = n ? "let" : this.value;
		return this.next(), this.parseVar(r, !0, i), this.finishNode(r, "VariableDeclaration"), this.parseForAfterInit(e, r, t);
	}
	var a = this.isContextual("let"), o = !1, s = this.isUsing(!0) ? "using" : this.isAwaitUsing(!0) ? "await using" : null;
	if (s) {
		var c = this.startNode();
		return this.next(), s === "await using" && (this.canAwait || this.raise(this.start, "Await using cannot appear outside of async function"), this.next()), this.parseVar(c, !0, s), this.finishNode(c, "VariableDeclaration"), this.parseForAfterInit(e, c, t);
	}
	var l = this.containsEsc, u = new We(), d = this.start, f = t > -1 ? this.parseExprSubscripts(u, "await") : this.parseExpression(!0, u);
	return this.type === E._in || (o = this.options.ecmaVersion >= 6 && this.isContextual("of")) ? (t > -1 ? (this.type === E._in && this.unexpected(t), e.await = !0) : o && this.options.ecmaVersion >= 8 && (f.start === d && !l && f.type === "Identifier" && f.name === "async" ? this.unexpected() : this.options.ecmaVersion >= 9 && (e.await = !1)), a && o && this.raise(f.start, "The left-hand side of a for-of loop may not start with 'let'."), this.toAssignable(f, !1, u), this.checkLValPattern(f), this.parseForIn(e, f)) : (this.checkExpressionErrors(u, !0), t > -1 && this.unexpected(t), this.parseFor(e, f));
}, M.parseForAfterInit = function(e, t, n) {
	return (this.type === E._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && t.declarations.length === 1 ? (this.type === E._in ? ((t.kind === "using" || t.kind === "await using") && !t.declarations[0].init && this.raise(this.start, "Using declaration is not allowed in for-in loops"), this.options.ecmaVersion >= 9 && n > -1 && this.unexpected(n)) : this.options.ecmaVersion >= 9 && (e.await = n > -1), this.parseForIn(e, t)) : (n > -1 && this.unexpected(n), this.parseFor(e, t));
}, M.parseFunctionStatement = function(e, t, n) {
	return this.next(), this.parseFunction(e, Je | (n ? 0 : Ye), !1, t);
}, M.parseIfStatement = function(e) {
	return this.next(), e.test = this.parseParenExpression(), e.consequent = this.parseStatement("if"), e.alternate = this.eat(E._else) ? this.parseStatement("if") : null, this.finishNode(e, "IfStatement");
}, M.parseReturnStatement = function(e) {
	return this.allowReturn || this.raise(this.start, "'return' outside of function"), this.next(), this.eat(E.semi) || this.insertSemicolon() ? e.argument = null : (e.argument = this.parseExpression(), this.semicolon()), this.finishNode(e, "ReturnStatement");
}, M.parseSwitchStatement = function(e) {
	this.next(), e.discriminant = this.parseParenExpression(), e.cases = [], this.expect(E.braceL), this.labels.push(Ke), this.enterScope(Pe);
	for (var t, n = !1; this.type !== E.braceR;) if (this.type === E._case || this.type === E._default) {
		var r = this.type === E._case;
		t && this.finishNode(t, "SwitchCase"), e.cases.push(t = this.startNode()), t.consequent = [], this.next(), r ? t.test = this.parseExpression() : (n && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"), n = !0, t.test = null), this.expect(E.colon);
	} else t || this.unexpected(), t.consequent.push(this.parseStatement(null));
	return this.exitScope(), t && this.finishNode(t, "SwitchCase"), this.next(), this.labels.pop(), this.finishNode(e, "SwitchStatement");
}, M.parseThrowStatement = function(e) {
	return this.next(), D.test(this.input.slice(this.lastTokEnd, this.start)) && this.raise(this.lastTokEnd, "Illegal newline after throw"), e.argument = this.parseExpression(), this.semicolon(), this.finishNode(e, "ThrowStatement");
};
var qe = [];
M.parseCatchClauseParam = function() {
	var e = this.parseBindingAtom(), t = e.type === "Identifier";
	return this.enterScope(t ? ke : 0), this.checkLValPattern(e, t ? Ve : ze), this.expect(E.parenR), e;
}, M.parseTryStatement = function(e) {
	if (this.next(), e.block = this.parseBlock(), e.handler = null, this.type === E._catch) {
		var t = this.startNode();
		this.next(), this.eat(E.parenL) ? t.param = this.parseCatchClauseParam() : (this.options.ecmaVersion < 10 && this.unexpected(), t.param = null, this.enterScope(0)), t.body = this.parseBlock(!1), this.exitScope(), e.handler = this.finishNode(t, "CatchClause");
	}
	return e.finalizer = this.eat(E._finally) ? this.parseBlock() : null, !e.handler && !e.finalizer && this.raise(e.start, "Missing catch or finally clause"), this.finishNode(e, "TryStatement");
}, M.parseVarStatement = function(e, t, n) {
	return this.next(), this.parseVar(e, !1, t, n), this.semicolon(), this.finishNode(e, "VariableDeclaration");
}, M.parseWhileStatement = function(e) {
	return this.next(), e.test = this.parseParenExpression(), this.labels.push(Ge), e.body = this.parseStatement("while"), this.labels.pop(), this.finishNode(e, "WhileStatement");
}, M.parseWithStatement = function(e) {
	return this.strict && this.raise(this.start, "'with' in strict mode"), this.next(), e.object = this.parseParenExpression(), e.body = this.parseStatement("with"), this.finishNode(e, "WithStatement");
}, M.parseEmptyStatement = function(e) {
	return this.next(), this.finishNode(e, "EmptyStatement");
}, M.parseLabeledStatement = function(e, t, n, r) {
	for (var i = 0, a = this.labels; i < a.length; i += 1) a[i].name === t && this.raise(n.start, "Label '" + t + "' is already declared");
	for (var o = this.type.isLoop ? "loop" : this.type === E._switch ? "switch" : null, s = this.labels.length - 1; s >= 0; s--) {
		var c = this.labels[s];
		if (c.statementStart === e.start) c.statementStart = this.start, c.kind = o;
		else break;
	}
	return this.labels.push({
		name: t,
		kind: o,
		statementStart: this.start
	}), e.body = this.parseStatement(r ? r.indexOf("label") === -1 ? r + "label" : r : "label"), this.labels.pop(), e.label = n, this.finishNode(e, "LabeledStatement");
}, M.parseExpressionStatement = function(e, t) {
	return e.expression = t, this.semicolon(), this.finishNode(e, "ExpressionStatement");
}, M.parseBlock = function(e, t, n) {
	for (e === void 0 && (e = !0), t === void 0 && (t = this.startNode()), t.body = [], this.expect(E.braceL), e && this.enterScope(0); this.type !== E.braceR;) {
		var r = this.parseStatement(null);
		t.body.push(r);
	}
	return n && (this.strict = !1), this.next(), e && this.exitScope(), this.finishNode(t, "BlockStatement");
}, M.parseFor = function(e, t) {
	return e.init = t, this.expect(E.semi), e.test = this.type === E.semi ? null : this.parseExpression(), this.expect(E.semi), e.update = this.type === E.parenR ? null : this.parseExpression(), this.expect(E.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, "ForStatement");
}, M.parseForIn = function(e, t) {
	var n = this.type === E._in;
	return this.next(), t.type === "VariableDeclaration" && t.declarations[0].init != null && (!n || this.options.ecmaVersion < 8 || this.strict || t.kind !== "var" || t.declarations[0].id.type !== "Identifier") && this.raise(t.start, (n ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"), e.left = t, e.right = n ? this.parseExpression() : this.parseMaybeAssign(), this.expect(E.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, n ? "ForInStatement" : "ForOfStatement");
}, M.parseVar = function(e, t, n, r) {
	for (e.declarations = [], e.kind = n;;) {
		var i = this.startNode();
		if (this.parseVarId(i, n), this.eat(E.eq) ? i.init = this.parseMaybeAssign(t) : !r && n === "const" && !(this.type === E._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) ? this.unexpected() : !r && (n === "using" || n === "await using") && this.options.ecmaVersion >= 17 && this.type !== E._in && !this.isContextual("of") ? this.raise(this.lastTokEnd, "Missing initializer in " + n + " declaration") : !r && i.id.type !== "Identifier" && !(t && (this.type === E._in || this.isContextual("of"))) ? this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value") : i.init = null, e.declarations.push(this.finishNode(i, "VariableDeclarator")), !this.eat(E.comma)) break;
	}
	return e;
}, M.parseVarId = function(e, t) {
	e.id = t === "using" || t === "await using" ? this.parseIdent() : this.parseBindingAtom(), this.checkLValPattern(e.id, t === "var" ? Re : ze, !1);
};
var Je = 1, Ye = 2, Xe = 4;
M.parseFunction = function(e, t, n, r, i) {
	this.initFunction(e), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !r) && (this.type === E.star && t & Ye && this.unexpected(), e.generator = this.eat(E.star)), this.options.ecmaVersion >= 8 && (e.async = !!r), t & Je && (e.id = t & Xe && this.type !== E.name ? null : this.parseIdent(), e.id && !(t & Ye) && this.checkLValSimple(e.id, this.strict || e.generator || e.async ? this.treatFunctionsAsVar ? Re : ze : Be));
	var a = this.yieldPos, o = this.awaitPos, s = this.awaitIdentPos;
	return this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(Ie(e.async, e.generator)), t & Je || (e.id = this.type === E.name ? this.parseIdent() : null), this.parseFunctionParams(e), this.parseFunctionBody(e, n, !1, i), this.yieldPos = a, this.awaitPos = o, this.awaitIdentPos = s, this.finishNode(e, t & Je ? "FunctionDeclaration" : "FunctionExpression");
}, M.parseFunctionParams = function(e) {
	this.expect(E.parenL), e.params = this.parseBindingList(E.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams();
}, M.parseClass = function(e, t) {
	this.next();
	var n = this.strict;
	this.strict = !0, this.parseClassId(e, t), this.parseClassSuper(e);
	var r = this.enterClassBody(), i = this.startNode(), a = !1;
	for (i.body = [], this.expect(E.braceL); this.type !== E.braceR;) {
		var o = this.parseClassElement(e.superClass !== null);
		o && (i.body.push(o), o.type === "MethodDefinition" && o.kind === "constructor" ? (a && this.raiseRecoverable(o.start, "Duplicate constructor in the same class"), a = !0) : o.key && o.key.type === "PrivateIdentifier" && Ze(r, o) && this.raiseRecoverable(o.key.start, "Identifier '#" + o.key.name + "' has already been declared"));
	}
	return this.strict = n, this.next(), e.body = this.finishNode(i, "ClassBody"), this.exitClassBody(), this.finishNode(e, t ? "ClassDeclaration" : "ClassExpression");
}, M.parseClassElement = function(e) {
	if (this.eat(E.semi)) return null;
	var t = this.options.ecmaVersion, n = this.startNode(), r = "", i = !1, a = !1, o = "method", s = !1;
	if (this.eatContextual("static")) {
		if (t >= 13 && this.eat(E.braceL)) return this.parseClassStaticBlock(n), n;
		this.isClassElementNameStart() || this.type === E.star ? s = !0 : r = "static";
	}
	if (n.static = s, !r && t >= 8 && this.eatContextual("async") && ((this.isClassElementNameStart() || this.type === E.star) && !this.canInsertSemicolon() ? a = !0 : r = "async"), !r && (t >= 9 || !a) && this.eat(E.star) && (i = !0), !r && !a && !i) {
		var c = this.value;
		(this.eatContextual("get") || this.eatContextual("set")) && (this.isClassElementNameStart() ? o = c : r = c);
	}
	if (r ? (n.computed = !1, n.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc), n.key.name = r, this.finishNode(n.key, "Identifier")) : this.parseClassElementName(n), t < 13 || this.type === E.parenL || o !== "method" || i || a) {
		var l = !n.static && Qe(n, "constructor"), u = l && e;
		l && o !== "method" && this.raise(n.key.start, "Constructor can't have get/set modifier"), n.kind = l ? "constructor" : o, this.parseClassMethod(n, i, a, u);
	} else this.parseClassField(n);
	return n;
}, M.isClassElementNameStart = function() {
	return this.type === E.name || this.type === E.privateId || this.type === E.num || this.type === E.string || this.type === E.bracketL || this.type.keyword;
}, M.parseClassElementName = function(e) {
	this.type === E.privateId ? (this.value === "constructor" && this.raise(this.start, "Classes can't have an element named '#constructor'"), e.computed = !1, e.key = this.parsePrivateIdent()) : this.parsePropertyName(e);
}, M.parseClassMethod = function(e, t, n, r) {
	var i = e.key;
	e.kind === "constructor" ? (t && this.raise(i.start, "Constructor can't be a generator"), n && this.raise(i.start, "Constructor can't be an async method")) : e.static && Qe(e, "prototype") && this.raise(i.start, "Classes may not have a static property named prototype");
	var a = e.value = this.parseMethod(t, n, r);
	return e.kind === "get" && a.params.length !== 0 && this.raiseRecoverable(a.start, "getter should have no params"), e.kind === "set" && a.params.length !== 1 && this.raiseRecoverable(a.start, "setter should have exactly one param"), e.kind === "set" && a.params[0].type === "RestElement" && this.raiseRecoverable(a.params[0].start, "Setter cannot use rest params"), this.finishNode(e, "MethodDefinition");
}, M.parseClassField = function(e) {
	return Qe(e, "constructor") ? this.raise(e.key.start, "Classes can't have a field named 'constructor'") : e.static && Qe(e, "prototype") && this.raise(e.key.start, "Classes can't have a static field named 'prototype'"), this.eat(E.eq) ? (this.enterScope(Ne | Ae), e.value = this.parseMaybeAssign(), this.exitScope()) : e.value = null, this.semicolon(), this.finishNode(e, "PropertyDefinition");
}, M.parseClassStaticBlock = function(e) {
	e.body = [];
	var t = this.labels;
	for (this.labels = [], this.enterScope(Me | Ae); this.type !== E.braceR;) {
		var n = this.parseStatement(null);
		e.body.push(n);
	}
	return this.next(), this.exitScope(), this.labels = t, this.finishNode(e, "StaticBlock");
}, M.parseClassId = function(e, t) {
	this.type === E.name ? (e.id = this.parseIdent(), t && this.checkLValSimple(e.id, ze, !1)) : (t === !0 && this.unexpected(), e.id = null);
}, M.parseClassSuper = function(e) {
	e.superClass = this.eat(E._extends) ? this.parseExprSubscripts(null, !1) : null;
}, M.enterClassBody = function() {
	var e = {
		declared: Object.create(null),
		used: []
	};
	return this.privateNameStack.push(e), e.declared;
}, M.exitClassBody = function() {
	var e = this.privateNameStack.pop(), t = e.declared, n = e.used;
	if (this.options.checkPrivateFields) for (var r = this.privateNameStack.length, i = r === 0 ? null : this.privateNameStack[r - 1], a = 0; a < n.length; ++a) {
		var o = n[a];
		de(t, o.name) || (i ? i.used.push(o) : this.raiseRecoverable(o.start, "Private field '#" + o.name + "' must be declared in an enclosing class"));
	}
};
function Ze(e, t) {
	var n = t.key.name, r = e[n], i = "true";
	return t.type === "MethodDefinition" && (t.kind === "get" || t.kind === "set") && (i = (t.static ? "s" : "i") + t.kind), r === "iget" && i === "iset" || r === "iset" && i === "iget" || r === "sget" && i === "sset" || r === "sset" && i === "sget" ? (e[n] = "true", !1) : r ? !0 : (e[n] = i, !1);
}
function Qe(e, t) {
	var n = e.computed, r = e.key;
	return !n && (r.type === "Identifier" && r.name === t || r.type === "Literal" && r.value === t);
}
M.parseExportAllDeclaration = function(e, t) {
	return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (e.exported = this.parseModuleExportName(), this.checkExport(t, e.exported, this.lastTokStart)) : e.exported = null), this.expectContextual("from"), this.type !== E.string && this.unexpected(), e.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (e.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(e, "ExportAllDeclaration");
}, M.parseExport = function(e, t) {
	if (this.next(), this.eat(E.star)) return this.parseExportAllDeclaration(e, t);
	if (this.eat(E._default)) return this.checkExport(t, "default", this.lastTokStart), e.declaration = this.parseExportDefaultDeclaration(), this.finishNode(e, "ExportDefaultDeclaration");
	if (this.shouldParseExportStatement()) e.declaration = this.parseExportDeclaration(e), e.declaration.type === "VariableDeclaration" ? this.checkVariableExport(t, e.declaration.declarations) : this.checkExport(t, e.declaration.id, e.declaration.id.start), e.specifiers = [], e.source = null, this.options.ecmaVersion >= 16 && (e.attributes = []);
	else {
		if (e.declaration = null, e.specifiers = this.parseExportSpecifiers(t), this.eatContextual("from")) this.type !== E.string && this.unexpected(), e.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (e.attributes = this.parseWithClause());
		else {
			for (var n = 0, r = e.specifiers; n < r.length; n += 1) {
				var i = r[n];
				this.checkUnreserved(i.local), this.checkLocalExport(i.local), i.local.type === "Literal" && this.raise(i.local.start, "A string literal cannot be used as an exported binding without `from`.");
			}
			e.source = null, this.options.ecmaVersion >= 16 && (e.attributes = []);
		}
		this.semicolon();
	}
	return this.finishNode(e, "ExportNamedDeclaration");
}, M.parseExportDeclaration = function(e) {
	return this.parseStatement(null);
}, M.parseExportDefaultDeclaration = function() {
	var e;
	if (this.type === E._function || (e = this.isAsyncFunction())) {
		var t = this.startNode();
		return this.next(), e && this.next(), this.parseFunction(t, Je | Xe, !1, e);
	} else if (this.type === E._class) {
		var n = this.startNode();
		return this.parseClass(n, "nullableID");
	} else {
		var r = this.parseMaybeAssign();
		return this.semicolon(), r;
	}
}, M.checkExport = function(e, t, n) {
	e && (typeof t != "string" && (t = t.type === "Identifier" ? t.name : t.value), de(e, t) && this.raiseRecoverable(n, "Duplicate export '" + t + "'"), e[t] = !0);
}, M.checkPatternExport = function(e, t) {
	var n = t.type;
	if (n === "Identifier") this.checkExport(e, t, t.start);
	else if (n === "ObjectPattern") for (var r = 0, i = t.properties; r < i.length; r += 1) {
		var a = i[r];
		this.checkPatternExport(e, a);
	}
	else if (n === "ArrayPattern") for (var o = 0, s = t.elements; o < s.length; o += 1) {
		var c = s[o];
		c && this.checkPatternExport(e, c);
	}
	else n === "Property" ? this.checkPatternExport(e, t.value) : n === "AssignmentPattern" ? this.checkPatternExport(e, t.left) : n === "RestElement" && this.checkPatternExport(e, t.argument);
}, M.checkVariableExport = function(e, t) {
	if (e) for (var n = 0, r = t; n < r.length; n += 1) {
		var i = r[n];
		this.checkPatternExport(e, i.id);
	}
}, M.shouldParseExportStatement = function() {
	return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
}, M.parseExportSpecifier = function(e) {
	var t = this.startNode();
	return t.local = this.parseModuleExportName(), t.exported = this.eatContextual("as") ? this.parseModuleExportName() : t.local, this.checkExport(e, t.exported, t.exported.start), this.finishNode(t, "ExportSpecifier");
}, M.parseExportSpecifiers = function(e) {
	var t = [], n = !0;
	for (this.expect(E.braceL); !this.eat(E.braceR);) {
		if (n) n = !1;
		else if (this.expect(E.comma), this.afterTrailingComma(E.braceR)) break;
		t.push(this.parseExportSpecifier(e));
	}
	return t;
}, M.parseImport = function(e) {
	return this.next(), this.type === E.string ? (e.specifiers = qe, e.source = this.parseExprAtom()) : (e.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), e.source = this.type === E.string ? this.parseExprAtom() : this.unexpected()), this.options.ecmaVersion >= 16 && (e.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(e, "ImportDeclaration");
}, M.parseImportSpecifier = function() {
	var e = this.startNode();
	return e.imported = this.parseModuleExportName(), this.eatContextual("as") ? e.local = this.parseIdent() : (this.checkUnreserved(e.imported), e.local = e.imported), this.checkLValSimple(e.local, ze), this.finishNode(e, "ImportSpecifier");
}, M.parseImportDefaultSpecifier = function() {
	var e = this.startNode();
	return e.local = this.parseIdent(), this.checkLValSimple(e.local, ze), this.finishNode(e, "ImportDefaultSpecifier");
}, M.parseImportNamespaceSpecifier = function() {
	var e = this.startNode();
	return this.next(), this.expectContextual("as"), e.local = this.parseIdent(), this.checkLValSimple(e.local, ze), this.finishNode(e, "ImportNamespaceSpecifier");
}, M.parseImportSpecifiers = function() {
	var e = [], t = !0;
	if (this.type === E.name && (e.push(this.parseImportDefaultSpecifier()), !this.eat(E.comma))) return e;
	if (this.type === E.star) return e.push(this.parseImportNamespaceSpecifier()), e;
	for (this.expect(E.braceL); !this.eat(E.braceR);) {
		if (t) t = !1;
		else if (this.expect(E.comma), this.afterTrailingComma(E.braceR)) break;
		e.push(this.parseImportSpecifier());
	}
	return e;
}, M.parseWithClause = function() {
	var e = [];
	if (!this.eat(E._with)) return e;
	this.expect(E.braceL);
	for (var t = {}, n = !0; !this.eat(E.braceR);) {
		if (n) n = !1;
		else if (this.expect(E.comma), this.afterTrailingComma(E.braceR)) break;
		var r = this.parseImportAttribute(), i = r.key.type === "Identifier" ? r.key.name : r.key.value;
		de(t, i) && this.raiseRecoverable(r.key.start, "Duplicate attribute key '" + i + "'"), t[i] = !0, e.push(r);
	}
	return e;
}, M.parseImportAttribute = function() {
	var e = this.startNode();
	return e.key = this.type === E.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never"), this.expect(E.colon), this.type !== E.string && this.unexpected(), e.value = this.parseExprAtom(), this.finishNode(e, "ImportAttribute");
}, M.parseModuleExportName = function() {
	if (this.options.ecmaVersion >= 13 && this.type === E.string) {
		var e = this.parseLiteral(this.value);
		return ge.test(e.value) && this.raise(e.start, "An export name cannot include a lone surrogate."), e;
	}
	return this.parseIdent(!0);
}, M.adaptDirectivePrologue = function(e) {
	for (var t = 0; t < e.length && this.isDirectiveCandidate(e[t]); ++t) e[t].directive = e[t].expression.raw.slice(1, -1);
}, M.isDirectiveCandidate = function(e) {
	return this.options.ecmaVersion >= 5 && e.type === "ExpressionStatement" && e.expression.type === "Literal" && typeof e.expression.value == "string" && (this.input[e.start] === "\"" || this.input[e.start] === "'");
};
var N = k.prototype;
N.toAssignable = function(e, t, n) {
	if (this.options.ecmaVersion >= 6 && e) switch (e.type) {
		case "Identifier":
			this.inAsync && e.name === "await" && this.raise(e.start, "Cannot use 'await' as identifier inside an async function");
			break;
		case "ObjectPattern":
		case "ArrayPattern":
		case "AssignmentPattern":
		case "RestElement": break;
		case "ObjectExpression":
			e.type = "ObjectPattern", n && this.checkPatternErrors(n, !0);
			for (var r = 0, i = e.properties; r < i.length; r += 1) {
				var a = i[r];
				this.toAssignable(a, t), a.type === "RestElement" && (a.argument.type === "ArrayPattern" || a.argument.type === "ObjectPattern") && this.raise(a.argument.start, "Unexpected token");
			}
			break;
		case "Property":
			e.kind !== "init" && this.raise(e.key.start, "Object pattern can't contain getter or setter"), this.toAssignable(e.value, t);
			break;
		case "ArrayExpression":
			e.type = "ArrayPattern", n && this.checkPatternErrors(n, !0), this.toAssignableList(e.elements, t);
			break;
		case "SpreadElement":
			e.type = "RestElement", this.toAssignable(e.argument, t), e.argument.type === "AssignmentPattern" && this.raise(e.argument.start, "Rest elements cannot have a default value");
			break;
		case "AssignmentExpression":
			e.operator !== "=" && this.raise(e.left.end, "Only '=' operator can be used for specifying default value."), e.type = "AssignmentPattern", delete e.operator, this.toAssignable(e.left, t);
			break;
		case "ParenthesizedExpression":
			this.toAssignable(e.expression, t, n);
			break;
		case "ChainExpression":
			this.raiseRecoverable(e.start, "Optional chaining cannot appear in left-hand side");
			break;
		case "MemberExpression": if (!t) break;
		default: this.raise(e.start, "Assigning to rvalue");
	}
	else n && this.checkPatternErrors(n, !0);
	return e;
}, N.toAssignableList = function(e, t) {
	for (var n = e.length, r = 0; r < n; r++) {
		var i = e[r];
		i && this.toAssignable(i, t);
	}
	if (n) {
		var a = e[n - 1];
		this.options.ecmaVersion === 6 && t && a && a.type === "RestElement" && a.argument.type !== "Identifier" && this.unexpected(a.argument.start);
	}
	return e;
}, N.parseSpread = function(e) {
	var t = this.startNode();
	return this.next(), t.argument = this.parseMaybeAssign(!1, e), this.finishNode(t, "SpreadElement");
}, N.parseRestBinding = function() {
	var e = this.startNode();
	return this.next(), this.options.ecmaVersion === 6 && this.type !== E.name && this.unexpected(), e.argument = this.parseBindingAtom(), this.finishNode(e, "RestElement");
}, N.parseBindingAtom = function() {
	if (this.options.ecmaVersion >= 6) switch (this.type) {
		case E.bracketL:
			var e = this.startNode();
			return this.next(), e.elements = this.parseBindingList(E.bracketR, !0, !0), this.finishNode(e, "ArrayPattern");
		case E.braceL: return this.parseObj(!0);
	}
	return this.parseIdent();
}, N.parseBindingList = function(e, t, n, r) {
	for (var i = [], a = !0; !this.eat(e);) if (a ? a = !1 : this.expect(E.comma), t && this.type === E.comma) i.push(null);
	else if (n && this.afterTrailingComma(e)) break;
	else if (this.type === E.ellipsis) {
		var o = this.parseRestBinding();
		this.parseBindingListItem(o), i.push(o), this.type === E.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.expect(e);
		break;
	} else i.push(this.parseAssignableListItem(r));
	return i;
}, N.parseAssignableListItem = function(e) {
	var t = this.parseMaybeDefault(this.start, this.startLoc);
	return this.parseBindingListItem(t), t;
}, N.parseBindingListItem = function(e) {
	return e;
}, N.parseMaybeDefault = function(e, t, n) {
	if (n ||= this.parseBindingAtom(), this.options.ecmaVersion < 6 || !this.eat(E.eq)) return n;
	var r = this.startNodeAt(e, t);
	return r.left = n, r.right = this.parseMaybeAssign(), this.finishNode(r, "AssignmentPattern");
}, N.checkLValSimple = function(e, t, n) {
	t === void 0 && (t = Le);
	var r = t !== Le;
	switch (e.type) {
		case "Identifier":
			this.strict && this.reservedWordsStrictBind.test(e.name) && this.raiseRecoverable(e.start, (r ? "Binding " : "Assigning to ") + e.name + " in strict mode"), r && (t === ze && e.name === "let" && this.raiseRecoverable(e.start, "let is disallowed as a lexically bound name"), n && (de(n, e.name) && this.raiseRecoverable(e.start, "Argument name clash"), n[e.name] = !0), t !== He && this.declareName(e.name, t, e.start));
			break;
		case "ChainExpression":
			this.raiseRecoverable(e.start, "Optional chaining cannot appear in left-hand side");
			break;
		case "MemberExpression":
			r && this.raiseRecoverable(e.start, "Binding member expression");
			break;
		case "ParenthesizedExpression": return r && this.raiseRecoverable(e.start, "Binding parenthesized expression"), this.checkLValSimple(e.expression, t, n);
		default: this.raise(e.start, (r ? "Binding" : "Assigning to") + " rvalue");
	}
}, N.checkLValPattern = function(e, t, n) {
	switch (t === void 0 && (t = Le), e.type) {
		case "ObjectPattern":
			for (var r = 0, i = e.properties; r < i.length; r += 1) {
				var a = i[r];
				this.checkLValInnerPattern(a, t, n);
			}
			break;
		case "ArrayPattern":
			for (var o = 0, s = e.elements; o < s.length; o += 1) {
				var c = s[o];
				c && this.checkLValInnerPattern(c, t, n);
			}
			break;
		default: this.checkLValSimple(e, t, n);
	}
}, N.checkLValInnerPattern = function(e, t, n) {
	switch (t === void 0 && (t = Le), e.type) {
		case "Property":
			this.checkLValInnerPattern(e.value, t, n);
			break;
		case "AssignmentPattern":
			this.checkLValPattern(e.left, t, n);
			break;
		case "RestElement":
			this.checkLValPattern(e.argument, t, n);
			break;
		default: this.checkLValPattern(e, t, n);
	}
};
var P = function(e, t, n, r, i) {
	this.token = e, this.isExpr = !!t, this.preserveSpace = !!n, this.override = r, this.generator = !!i;
}, F = {
	b_stat: new P("{", !1),
	b_expr: new P("{", !0),
	b_tmpl: new P("${", !1),
	p_stat: new P("(", !1),
	p_expr: new P("(", !0),
	q_tmpl: new P("`", !0, !0, function(e) {
		return e.tryReadTemplateToken();
	}),
	f_stat: new P("function", !1),
	f_expr: new P("function", !0),
	f_expr_gen: new P("function", !0, !1, null, !0),
	f_gen: new P("function", !1, !1, null, !0)
}, $e = k.prototype;
$e.initialContext = function() {
	return [F.b_stat];
}, $e.curContext = function() {
	return this.context[this.context.length - 1];
}, $e.braceIsBlock = function(e) {
	var t = this.curContext();
	return t === F.f_expr || t === F.f_stat ? !0 : e === E.colon && (t === F.b_stat || t === F.b_expr) ? !t.isExpr : e === E._return || e === E.name && this.exprAllowed ? D.test(this.input.slice(this.lastTokEnd, this.start)) : e === E._else || e === E.semi || e === E.eof || e === E.parenR || e === E.arrow ? !0 : e === E.braceL ? t === F.b_stat : e === E._var || e === E._const || e === E.name ? !1 : !this.exprAllowed;
}, $e.inGeneratorContext = function() {
	for (var e = this.context.length - 1; e >= 1; e--) {
		var t = this.context[e];
		if (t.token === "function") return t.generator;
	}
	return !1;
}, $e.updateContext = function(e) {
	var t, n = this.type;
	n.keyword && e === E.dot ? this.exprAllowed = !1 : (t = n.updateContext) ? t.call(this, e) : this.exprAllowed = n.beforeExpr;
}, $e.overrideContext = function(e) {
	this.curContext() !== e && (this.context[this.context.length - 1] = e);
}, E.parenR.updateContext = E.braceR.updateContext = function() {
	if (this.context.length === 1) {
		this.exprAllowed = !0;
		return;
	}
	var e = this.context.pop();
	e === F.b_stat && this.curContext().token === "function" && (e = this.context.pop()), this.exprAllowed = !e.isExpr;
}, E.braceL.updateContext = function(e) {
	this.context.push(this.braceIsBlock(e) ? F.b_stat : F.b_expr), this.exprAllowed = !0;
}, E.dollarBraceL.updateContext = function() {
	this.context.push(F.b_tmpl), this.exprAllowed = !0;
}, E.parenL.updateContext = function(e) {
	var t = e === E._if || e === E._for || e === E._with || e === E._while;
	this.context.push(t ? F.p_stat : F.p_expr), this.exprAllowed = !0;
}, E.incDec.updateContext = function() {}, E._function.updateContext = E._class.updateContext = function(e) {
	e.beforeExpr && e !== E._else && !(e === E.semi && this.curContext() !== F.p_stat) && !(e === E._return && D.test(this.input.slice(this.lastTokEnd, this.start))) && !((e === E.colon || e === E.braceL) && this.curContext() === F.b_stat) ? this.context.push(F.f_expr) : this.context.push(F.f_stat), this.exprAllowed = !1;
}, E.colon.updateContext = function() {
	this.curContext().token === "function" && this.context.pop(), this.exprAllowed = !0;
}, E.backQuote.updateContext = function() {
	this.curContext() === F.q_tmpl ? this.context.pop() : this.context.push(F.q_tmpl), this.exprAllowed = !1;
}, E.star.updateContext = function(e) {
	if (e === E._function) {
		var t = this.context.length - 1;
		this.context[t] === F.f_expr ? this.context[t] = F.f_expr_gen : this.context[t] = F.f_gen;
	}
	this.exprAllowed = !0;
}, E.name.updateContext = function(e) {
	var t = !1;
	this.options.ecmaVersion >= 6 && e !== E.dot && (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) && (t = !0), this.exprAllowed = t;
};
var I = k.prototype;
I.checkPropClash = function(e, t, n) {
	if (!(this.options.ecmaVersion >= 9 && e.type === "SpreadElement") && !(this.options.ecmaVersion >= 6 && (e.computed || e.method || e.shorthand))) {
		var r = e.key, i;
		switch (r.type) {
			case "Identifier":
				i = r.name;
				break;
			case "Literal":
				i = String(r.value);
				break;
			default: return;
		}
		var a = e.kind;
		if (this.options.ecmaVersion >= 6) {
			i === "__proto__" && a === "init" && (t.proto && (n ? n.doubleProto < 0 && (n.doubleProto = r.start) : this.raiseRecoverable(r.start, "Redefinition of __proto__ property")), t.proto = !0);
			return;
		}
		i = "$" + i;
		var o = t[i];
		o ? (a === "init" ? this.strict && o.init || o.get || o.set : o.init || o[a]) && this.raiseRecoverable(r.start, "Redefinition of property") : o = t[i] = {
			init: !1,
			get: !1,
			set: !1
		}, o[a] = !0;
	}
}, I.parseExpression = function(e, t) {
	var n = this;
	return this.catchStackOverflow(function() {
		var r = n.start, i = n.startLoc, a = n.parseMaybeAssign(e, t);
		if (n.type === E.comma) {
			var o = n.startNodeAt(r, i);
			for (o.expressions = [a]; n.eat(E.comma);) o.expressions.push(n.parseMaybeAssign(e, t));
			return n.finishNode(o, "SequenceExpression");
		}
		return a;
	});
}, I.parseMaybeAssign = function(e, t, n) {
	if (this.isContextual("yield")) {
		if (this.inGenerator) return this.parseYield(e);
		this.exprAllowed = !1;
	}
	var r = !1, i = -1, a = -1, o = -1;
	t ? (i = t.parenthesizedAssign, a = t.trailingComma, o = t.doubleProto, t.parenthesizedAssign = t.trailingComma = -1) : (t = new We(), r = !0);
	var s = this.start, c = this.startLoc;
	(this.type === E.parenL || this.type === E.name) && (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = e === "await");
	var l = this.parseMaybeConditional(e, t);
	if (n && (l = n.call(this, l, s, c)), this.type.isAssign) {
		var u = this.startNodeAt(s, c);
		return u.operator = this.value, this.type === E.eq && (l = this.toAssignable(l, !1, t)), r || (t.parenthesizedAssign = t.trailingComma = t.doubleProto = -1), t.shorthandAssign >= l.start && (t.shorthandAssign = -1), this.type === E.eq ? this.checkLValPattern(l) : this.checkLValSimple(l), u.left = l, this.next(), u.right = this.parseMaybeAssign(e), o > -1 && (t.doubleProto = o), this.finishNode(u, "AssignmentExpression");
	} else r && this.checkExpressionErrors(t, !0);
	return i > -1 && (t.parenthesizedAssign = i), a > -1 && (t.trailingComma = a), l;
}, I.parseMaybeConditional = function(e, t) {
	var n = this.start, r = this.startLoc, i = this.parseExprOps(e, t);
	if (this.checkExpressionErrors(t)) return i;
	if (!(i.type === "ArrowFunctionExpression" && i.start === n) && this.eat(E.question)) {
		var a = this.startNodeAt(n, r);
		return a.test = i, a.consequent = this.parseMaybeAssign(), this.expect(E.colon), a.alternate = this.parseMaybeAssign(e), this.finishNode(a, "ConditionalExpression");
	}
	return i;
}, I.parseExprOps = function(e, t) {
	var n = this.start, r = this.startLoc, i = this.parseMaybeUnary(t, !1, !1, e);
	return this.checkExpressionErrors(t) || i.start === n && i.type === "ArrowFunctionExpression" ? i : this.parseExprOp(i, n, r, -1, e);
}, I.parseExprOp = function(e, t, n, r, i) {
	var a = this.type.binop;
	if (a != null && (!i || this.type !== E._in) && a > r) {
		var o = this.type === E.logicalOR || this.type === E.logicalAND, s = this.type === E.coalesce;
		s && (a = E.logicalAND.binop);
		var c = this.value;
		this.next();
		var l = this.start, u = this.startLoc, d = this.parseExprOp(this.parseMaybeUnary(null, !1, !1, i), l, u, a, i), f = this.buildBinary(t, n, e, d, c, o || s);
		return (o && this.type === E.coalesce || s && (this.type === E.logicalOR || this.type === E.logicalAND)) && this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses"), this.parseExprOp(f, t, n, r, i);
	}
	return e;
}, I.buildBinary = function(e, t, n, r, i, a) {
	r.type === "PrivateIdentifier" && this.raise(r.start, "Private identifier can only be left side of binary expression");
	var o = this.startNodeAt(e, t);
	return o.left = n, o.operator = i, o.right = r, this.finishNode(o, a ? "LogicalExpression" : "BinaryExpression");
}, I.parseMaybeUnary = function(e, t, n, r) {
	var i = this.start, a = this.startLoc, o;
	if (this.isContextual("await") && this.canAwait) o = this.parseAwait(r), t = !0;
	else if (this.type.prefix) {
		var s = this.startNode(), c = this.type === E.incDec;
		s.operator = this.value, s.prefix = !0, this.next(), s.argument = this.parseMaybeUnary(null, !0, c, r), this.checkExpressionErrors(e, !0), c ? this.checkLValSimple(s.argument) : this.strict && s.operator === "delete" && et(s.argument) ? this.raiseRecoverable(s.start, "Deleting local variable in strict mode") : s.operator === "delete" && tt(s.argument) ? this.raiseRecoverable(s.start, "Private fields can not be deleted") : t = !0, o = this.finishNode(s, c ? "UpdateExpression" : "UnaryExpression");
	} else if (!t && this.type === E.privateId) (r || this.privateNameStack.length === 0) && this.options.checkPrivateFields && this.unexpected(), o = this.parsePrivateIdent(), this.type !== E._in && this.unexpected();
	else {
		if (o = this.parseExprSubscripts(e, r), this.checkExpressionErrors(e)) return o;
		for (; this.type.postfix && !this.canInsertSemicolon();) {
			var l = this.startNodeAt(i, a);
			l.operator = this.value, l.prefix = !1, l.argument = o, this.checkLValSimple(o), this.next(), o = this.finishNode(l, "UpdateExpression");
		}
	}
	if (!n && this.eat(E.starstar)) if (t) this.unexpected(this.lastTokStart);
	else return this.buildBinary(i, a, o, this.parseMaybeUnary(null, !1, !1, r), "**", !1);
	else return o;
};
function et(e) {
	return e.type === "Identifier" || e.type === "ParenthesizedExpression" && et(e.expression);
}
function tt(e) {
	return e.type === "MemberExpression" && e.property.type === "PrivateIdentifier" || e.type === "ChainExpression" && tt(e.expression) || e.type === "ParenthesizedExpression" && tt(e.expression);
}
I.parseExprSubscripts = function(e, t) {
	var n = this.start, r = this.startLoc, i = this.parseExprAtom(e, t);
	if (i.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")") return i;
	var a = this.parseSubscripts(i, n, r, !1, t);
	return e && a.type === "MemberExpression" && (e.parenthesizedAssign >= a.start && (e.parenthesizedAssign = -1), e.parenthesizedBind >= a.start && (e.parenthesizedBind = -1), e.trailingComma >= a.start && (e.trailingComma = -1)), a;
}, I.parseSubscripts = function(e, t, n, r, i) {
	for (var a = this.options.ecmaVersion >= 8 && e.type === "Identifier" && e.name === "async" && this.lastTokEnd === e.end && !this.canInsertSemicolon() && e.end - e.start === 5 && this.potentialArrowAt === e.start, o = !1;;) {
		var s = this.parseSubscript(e, t, n, r, a, o, i);
		if (s.optional && (o = !0), s === e || s.type === "ArrowFunctionExpression") {
			if (o) {
				var c = this.startNodeAt(t, n);
				c.expression = s, s = this.finishNode(c, "ChainExpression");
			}
			return s;
		}
		e = s;
	}
}, I.shouldParseAsyncArrow = function() {
	return !this.canInsertSemicolon() && this.eat(E.arrow);
}, I.parseSubscriptAsyncArrow = function(e, t, n, r) {
	return this.parseArrowExpression(this.startNodeAt(e, t), n, !0, r);
}, I.parseSubscript = function(e, t, n, r, i, a, o) {
	var s = this.options.ecmaVersion >= 11, c = s && this.eat(E.questionDot);
	r && c && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
	var l = this.eat(E.bracketL);
	if (l || c && this.type !== E.parenL && this.type !== E.backQuote || this.eat(E.dot)) {
		var u = this.startNodeAt(t, n);
		u.object = e, l ? (u.property = this.parseExpression(), this.expect(E.bracketR)) : this.type === E.privateId && e.type !== "Super" ? u.property = this.parsePrivateIdent() : u.property = this.parseIdent(this.options.allowReserved !== "never"), u.computed = !!l, s && (u.optional = c), e = this.finishNode(u, "MemberExpression");
	} else if (!r && this.eat(E.parenL)) {
		var d = new We(), f = this.yieldPos, p = this.awaitPos, m = this.awaitIdentPos;
		this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
		var h = this.parseExprList(E.parenR, this.options.ecmaVersion >= 8, !1, d);
		if (i && !c && this.shouldParseAsyncArrow()) return this.checkPatternErrors(d, !1), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = f, this.awaitPos = p, this.awaitIdentPos = m, this.parseSubscriptAsyncArrow(t, n, h, o);
		this.checkExpressionErrors(d, !0), this.yieldPos = f || this.yieldPos, this.awaitPos = p || this.awaitPos, this.awaitIdentPos = m || this.awaitIdentPos;
		var g = this.startNodeAt(t, n);
		g.callee = e, g.arguments = h, s && (g.optional = c), e = this.finishNode(g, "CallExpression");
	} else if (this.type === E.backQuote) {
		(c || a) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
		var _ = this.startNodeAt(t, n);
		_.tag = e, _.quasi = this.parseTemplate({ isTagged: !0 }), e = this.finishNode(_, "TaggedTemplateExpression");
	}
	return e;
}, I.parseExprAtom = function(e, t, n) {
	this.type === E.slash && this.readRegexp();
	var r, i = this.potentialArrowAt === this.start;
	switch (this.type) {
		case E._super: return this.allowSuper || this.raise(this.start, "'super' keyword outside a method"), r = this.startNode(), this.next(), this.type === E.parenL && !this.allowDirectSuper && this.raise(r.start, "super() call outside constructor of a subclass"), this.type !== E.dot && this.type !== E.bracketL && this.type !== E.parenL && this.unexpected(), this.finishNode(r, "Super");
		case E._this: return r = this.startNode(), this.next(), this.finishNode(r, "ThisExpression");
		case E.name:
			var a = this.start, o = this.startLoc, s = this.containsEsc, c = this.parseIdent(!1);
			if (this.options.ecmaVersion >= 8 && !s && c.name === "async" && !this.canInsertSemicolon() && this.eat(E._function)) return this.overrideContext(F.f_expr), this.parseFunction(this.startNodeAt(a, o), 0, !1, !0, t);
			if (i && !this.canInsertSemicolon()) {
				if (this.eat(E.arrow)) return this.parseArrowExpression(this.startNodeAt(a, o), [c], !1, t);
				if (this.options.ecmaVersion >= 8 && c.name === "async" && this.type === E.name && !s && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) return c = this.parseIdent(!1), (this.canInsertSemicolon() || !this.eat(E.arrow)) && this.unexpected(), this.parseArrowExpression(this.startNodeAt(a, o), [c], !0, t);
			}
			return c;
		case E.regexp:
			var l = this.value;
			return r = this.parseLiteral(l.value), r.regex = {
				pattern: l.pattern,
				flags: l.flags
			}, r;
		case E.num:
		case E.string: return this.parseLiteral(this.value);
		case E._null:
		case E._true:
		case E._false: return r = this.startNode(), r.value = this.type === E._null ? null : this.type === E._true, r.raw = this.type.keyword, this.next(), this.finishNode(r, "Literal");
		case E.parenL:
			var u = this.start, d = this.parseParenAndDistinguishExpression(i, t);
			return e && (e.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(d) && (e.parenthesizedAssign = u), e.parenthesizedBind < 0 && (e.parenthesizedBind = u)), d;
		case E.bracketL: return r = this.startNode(), this.next(), r.elements = this.parseExprList(E.bracketR, !0, !0, e), this.finishNode(r, "ArrayExpression");
		case E.braceL: return this.overrideContext(F.b_expr), this.parseObj(!1, e);
		case E._function: return r = this.startNode(), this.next(), this.parseFunction(r, 0);
		case E._class: return this.parseClass(this.startNode(), !1);
		case E._new: return this.parseNew();
		case E.backQuote: return this.parseTemplate();
		case E._import: return this.options.ecmaVersion >= 11 ? this.parseExprImport(n) : this.unexpected();
		default: return this.parseExprAtomDefault();
	}
}, I.parseExprAtomDefault = function() {
	this.unexpected();
}, I.parseExprImport = function(e) {
	var t = this.startNode();
	if (this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword import"), this.next(), this.type === E.parenL && !e) return this.parseDynamicImport(t);
	if (this.type === E.dot) {
		var n = this.startNodeAt(t.start, t.loc && t.loc.start);
		return n.name = "import", t.meta = this.finishNode(n, "Identifier"), this.parseImportMeta(t);
	} else this.unexpected();
}, I.parseDynamicImport = function(e) {
	if (this.next(), e.source = this.parseMaybeAssign(), this.options.ecmaVersion >= 16) this.eat(E.parenR) ? e.options = null : (this.expect(E.comma), this.afterTrailingComma(E.parenR) ? e.options = null : (e.options = this.parseMaybeAssign(), this.eat(E.parenR) || (this.expect(E.comma), this.afterTrailingComma(E.parenR) || this.unexpected())));
	else if (!this.eat(E.parenR)) {
		var t = this.start;
		this.eat(E.comma) && this.eat(E.parenR) ? this.raiseRecoverable(t, "Trailing comma is not allowed in import()") : this.unexpected(t);
	}
	return this.finishNode(e, "ImportExpression");
}, I.parseImportMeta = function(e) {
	this.next();
	var t = this.containsEsc;
	return e.property = this.parseIdent(!0), e.property.name !== "meta" && this.raiseRecoverable(e.property.start, "The only valid meta property for import is 'import.meta'"), t && this.raiseRecoverable(e.start, "'import.meta' must not contain escaped characters"), this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere && this.raiseRecoverable(e.start, "Cannot use 'import.meta' outside a module"), this.finishNode(e, "MetaProperty");
}, I.parseLiteral = function(e) {
	var t = this.startNode();
	return t.value = e, t.raw = this.input.slice(this.start, this.end), t.raw.charCodeAt(t.raw.length - 1) === 110 && (t.bigint = t.value == null ? t.raw.slice(0, -1).replace(/_/g, "") : t.value.toString()), this.next(), this.finishNode(t, "Literal");
}, I.parseParenExpression = function() {
	this.expect(E.parenL);
	var e = this.parseExpression();
	return this.expect(E.parenR), e;
}, I.shouldParseArrow = function(e) {
	return !this.canInsertSemicolon();
}, I.parseParenAndDistinguishExpression = function(e, t) {
	var n = this.start, r = this.startLoc, i, a = this.options.ecmaVersion >= 8;
	if (this.options.ecmaVersion >= 6) {
		this.next();
		var o = this.start, s = this.startLoc, c = [], l = !0, u = !1, d = new We(), f = this.yieldPos, p = this.awaitPos, m;
		for (this.yieldPos = 0, this.awaitPos = 0; this.type !== E.parenR;) if (l ? l = !1 : this.expect(E.comma), a && this.afterTrailingComma(E.parenR, !0)) {
			u = !0;
			break;
		} else if (this.type === E.ellipsis) {
			m = this.start, c.push(this.parseParenItem(this.parseRestBinding())), this.type === E.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
			break;
		} else c.push(this.parseMaybeAssign(!1, d, this.parseParenItem));
		var h = this.lastTokEnd, g = this.lastTokEndLoc;
		if (this.expect(E.parenR), e && this.shouldParseArrow(c) && this.eat(E.arrow)) return this.checkPatternErrors(d, !1), this.checkYieldAwaitInDefaultParams(), this.yieldPos = f, this.awaitPos = p, this.parseParenArrowList(n, r, c, t);
		(!c.length || u) && this.unexpected(this.lastTokStart), m && this.unexpected(m), this.checkExpressionErrors(d, !0), this.yieldPos = f || this.yieldPos, this.awaitPos = p || this.awaitPos, c.length > 1 ? (i = this.startNodeAt(o, s), i.expressions = c, this.finishNodeAt(i, "SequenceExpression", h, g)) : i = c[0];
	} else i = this.parseParenExpression();
	if (this.options.preserveParens) {
		var _ = this.startNodeAt(n, r);
		return _.expression = i, this.finishNode(_, "ParenthesizedExpression");
	} else return i;
}, I.parseParenItem = function(e) {
	return e;
}, I.parseParenArrowList = function(e, t, n, r) {
	return this.parseArrowExpression(this.startNodeAt(e, t), n, !1, r);
};
var nt = [];
I.parseNew = function() {
	this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
	var e = this.startNode();
	if (this.next(), this.options.ecmaVersion >= 6 && this.type === E.dot) {
		var t = this.startNodeAt(e.start, e.loc && e.loc.start);
		t.name = "new", e.meta = this.finishNode(t, "Identifier"), this.next();
		var n = this.containsEsc;
		return e.property = this.parseIdent(!0), e.property.name !== "target" && this.raiseRecoverable(e.property.start, "The only valid meta property for new is 'new.target'"), n && this.raiseRecoverable(e.start, "'new.target' must not contain escaped characters"), this.allowNewDotTarget || this.raiseRecoverable(e.start, "'new.target' can only be used in functions and class static block"), this.finishNode(e, "MetaProperty");
	}
	var r = this.start, i = this.startLoc;
	return e.callee = this.parseSubscripts(this.parseExprAtom(null, !1, !0), r, i, !0, !1), e.callee.type === "Super" && this.raiseRecoverable(r, "Invalid use of 'super'"), this.eat(E.parenL) ? e.arguments = this.parseExprList(E.parenR, this.options.ecmaVersion >= 8, !1) : e.arguments = nt, this.finishNode(e, "NewExpression");
}, I.parseTemplateElement = function(e) {
	var t = e.isTagged, n = this.startNode();
	return this.type === E.invalidTemplate ? (t || this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal"), n.value = {
		raw: this.value.replace(/\r\n?/g, "\n"),
		cooked: null
	}) : n.value = {
		raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
		cooked: this.value
	}, this.next(), n.tail = this.type === E.backQuote, this.finishNode(n, "TemplateElement");
}, I.parseTemplate = function(e) {
	e === void 0 && (e = {});
	var t = e.isTagged;
	t === void 0 && (t = !1);
	var n = this.startNode();
	this.next(), n.expressions = [];
	var r = this.parseTemplateElement({ isTagged: t });
	for (n.quasis = [r]; !r.tail;) this.type === E.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(E.dollarBraceL), n.expressions.push(this.parseExpression()), this.expect(E.braceR), n.quasis.push(r = this.parseTemplateElement({ isTagged: t }));
	return this.next(), this.finishNode(n, "TemplateLiteral");
}, I.isAsyncProp = function(e) {
	return !e.computed && e.key.type === "Identifier" && e.key.name === "async" && (this.type === E.name || this.type === E.num || this.type === E.string || this.type === E.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === E.star) && !D.test(this.input.slice(this.lastTokEnd, this.start));
}, I.parseObj = function(e, t) {
	var n = this.startNode(), r = !0, i = {};
	for (n.properties = [], this.next(); !this.eat(E.braceR);) {
		if (r) r = !1;
		else if (this.expect(E.comma), this.options.ecmaVersion >= 5 && this.afterTrailingComma(E.braceR)) break;
		var a = this.parseProperty(e, t);
		e || this.checkPropClash(a, i, t), n.properties.push(a);
	}
	return this.finishNode(n, e ? "ObjectPattern" : "ObjectExpression");
}, I.parseProperty = function(e, t) {
	var n = this.startNode(), r, i, a, o;
	if (this.options.ecmaVersion >= 9 && this.eat(E.ellipsis)) return e ? (n.argument = this.parseIdent(!1), this.type === E.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.finishNode(n, "RestElement")) : (n.argument = this.parseMaybeAssign(!1, t), this.type === E.comma && t && t.trailingComma < 0 && (t.trailingComma = this.start), this.finishNode(n, "SpreadElement"));
	this.options.ecmaVersion >= 6 && (n.method = !1, n.shorthand = !1, (e || t) && (a = this.start, o = this.startLoc), e || (r = this.eat(E.star)));
	var s = this.containsEsc;
	return this.parsePropertyName(n), !e && !s && this.options.ecmaVersion >= 8 && !r && this.isAsyncProp(n) ? (i = !0, r = this.options.ecmaVersion >= 9 && this.eat(E.star), this.parsePropertyName(n)) : i = !1, this.parsePropertyValue(n, e, r, i, a, o, t, s), this.finishNode(n, "Property");
}, I.parseGetterSetter = function(e) {
	var t = e.key.name;
	this.parsePropertyName(e), e.value = this.parseMethod(!1), e.kind = t;
	var n = e.kind === "get" ? 0 : 1;
	if (e.value.params.length !== n) {
		var r = e.value.start;
		e.kind === "get" ? this.raiseRecoverable(r, "getter should have no params") : this.raiseRecoverable(r, "setter should have exactly one param");
	} else e.kind === "set" && e.value.params[0].type === "RestElement" && this.raiseRecoverable(e.value.params[0].start, "Setter cannot use rest params");
}, I.parsePropertyValue = function(e, t, n, r, i, a, o, s) {
	(n || r) && this.type === E.colon && this.unexpected(), this.eat(E.colon) ? (e.value = t ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(!1, o), e.kind = "init") : this.options.ecmaVersion >= 6 && this.type === E.parenL ? (t && this.unexpected(), e.method = !0, e.value = this.parseMethod(n, r), e.kind = "init") : !t && !s && this.options.ecmaVersion >= 5 && !e.computed && e.key.type === "Identifier" && (e.key.name === "get" || e.key.name === "set") && this.type !== E.comma && this.type !== E.braceR && this.type !== E.eq ? ((n || r) && this.unexpected(), this.parseGetterSetter(e)) : this.options.ecmaVersion >= 6 && !e.computed && e.key.type === "Identifier" ? ((n || r) && this.unexpected(), this.checkUnreserved(e.key), e.key.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = i), t ? e.value = this.parseMaybeDefault(i, a, this.copyNode(e.key)) : this.type === E.eq && o ? (o.shorthandAssign < 0 && (o.shorthandAssign = this.start), e.value = this.parseMaybeDefault(i, a, this.copyNode(e.key))) : e.value = this.copyNode(e.key), e.kind = "init", e.shorthand = !0) : this.unexpected();
}, I.parsePropertyName = function(e) {
	if (this.options.ecmaVersion >= 6) {
		if (this.eat(E.bracketL)) return e.computed = !0, e.key = this.parseMaybeAssign(), this.expect(E.bracketR), e.key;
		e.computed = !1;
	}
	return e.key = this.type === E.num || this.type === E.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
}, I.initFunction = function(e) {
	e.id = null, this.options.ecmaVersion >= 6 && (e.generator = e.expression = !1), this.options.ecmaVersion >= 8 && (e.async = !1);
}, I.parseMethod = function(e, t, n) {
	var r = this.startNode(), i = this.yieldPos, a = this.awaitPos, o = this.awaitIdentPos;
	return this.initFunction(r), this.options.ecmaVersion >= 6 && (r.generator = e), this.options.ecmaVersion >= 8 && (r.async = !!t), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(Ie(t, r.generator) | Ae | (n ? je : 0)), this.expect(E.parenL), r.params = this.parseBindingList(E.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(r, !1, !0, !1), this.yieldPos = i, this.awaitPos = a, this.awaitIdentPos = o, this.finishNode(r, "FunctionExpression");
}, I.parseArrowExpression = function(e, t, n, r) {
	var i = this.yieldPos, a = this.awaitPos, o = this.awaitIdentPos;
	return this.enterScope(Ie(n, !1) | Oe), this.initFunction(e), this.options.ecmaVersion >= 8 && (e.async = !!n), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, e.params = this.toAssignableList(t, !0), this.parseFunctionBody(e, !0, !1, r), this.yieldPos = i, this.awaitPos = a, this.awaitIdentPos = o, this.finishNode(e, "ArrowFunctionExpression");
}, I.parseFunctionBody = function(e, t, n, r) {
	var i = t && this.type !== E.braceL, a = this.strict, o = !1;
	if (i) e.body = this.parseMaybeAssign(r), e.expression = !0, this.checkParams(e, !1);
	else {
		var s = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(e.params);
		(!a || s) && (o = this.strictDirective(this.end), o && s && this.raiseRecoverable(e.start, "Illegal 'use strict' directive in function with non-simple parameter list"));
		var c = this.labels;
		this.labels = [], o && (this.strict = !0), this.checkParams(e, !a && !o && !t && !n && this.isSimpleParamList(e.params)), this.strict && e.id && this.checkLValSimple(e.id, He), e.body = this.parseBlock(!1, void 0, o && !a), e.expression = !1, this.adaptDirectivePrologue(e.body.body), this.labels = c;
	}
	this.exitScope();
}, I.isSimpleParamList = function(e) {
	for (var t = 0, n = e; t < n.length; t += 1) if (n[t].type !== "Identifier") return !1;
	return !0;
}, I.checkParams = function(e, t) {
	for (var n = Object.create(null), r = 0, i = e.params; r < i.length; r += 1) {
		var a = i[r];
		this.checkLValInnerPattern(a, Re, t ? null : n);
	}
}, I.parseExprList = function(e, t, n, r) {
	for (var i = [], a = !0; !this.eat(e);) {
		if (a) a = !1;
		else if (this.expect(E.comma), t && this.afterTrailingComma(e)) break;
		var o = void 0;
		n && this.type === E.comma ? o = null : this.type === E.ellipsis ? (o = this.parseSpread(r), r && this.type === E.comma && r.trailingComma < 0 && (r.trailingComma = this.start)) : o = this.parseMaybeAssign(!1, r), i.push(o);
	}
	return i;
}, I.checkUnreserved = function(e) {
	var t = e.start, n = e.end, r = e.name;
	this.inGenerator && r === "yield" && this.raiseRecoverable(t, "Cannot use 'yield' as identifier inside a generator"), this.inAsync && r === "await" && this.raiseRecoverable(t, "Cannot use 'await' as identifier inside an async function"), !(this.currentThisScope().flags & Fe) && r === "arguments" && this.raiseRecoverable(t, "Cannot use 'arguments' in class field initializer"), this.inClassStaticBlock && (r === "arguments" || r === "await") && this.raise(t, "Cannot use " + r + " in class static initialization block"), this.keywords.test(r) && this.raise(t, "Unexpected keyword '" + r + "'"), !(this.options.ecmaVersion < 6 && this.input.slice(t, n).indexOf("\\") !== -1) && (this.strict ? this.reservedWordsStrict : this.reservedWords).test(r) && (!this.inAsync && r === "await" && this.raiseRecoverable(t, "Cannot use keyword 'await' outside an async function"), this.raiseRecoverable(t, "The keyword '" + r + "' is reserved"));
}, I.parseIdent = function(e) {
	var t = this.parseIdentNode();
	return this.next(!!e), this.finishNode(t, "Identifier"), e || (this.checkUnreserved(t), t.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = t.start)), t;
}, I.parseIdentNode = function() {
	var e = this.startNode();
	return this.type === E.name ? e.name = this.value : this.type.keyword ? (e.name = this.type.keyword, (e.name === "class" || e.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46) && this.context.pop(), this.type = E.name) : this.unexpected(), e;
}, I.parsePrivateIdent = function() {
	var e = this.startNode();
	return this.type === E.privateId ? e.name = this.value : this.unexpected(), this.next(), this.finishNode(e, "PrivateIdentifier"), this.options.checkPrivateFields && (this.privateNameStack.length === 0 ? this.raise(e.start, "Private field '#" + e.name + "' must be declared in an enclosing class") : this.privateNameStack[this.privateNameStack.length - 1].used.push(e)), e;
}, I.parseYield = function(e) {
	this.yieldPos ||= this.start;
	var t = this.startNode();
	return this.next(), this.type === E.semi || this.canInsertSemicolon() || this.type !== E.star && !this.type.startsExpr ? (t.delegate = !1, t.argument = null) : (t.delegate = this.eat(E.star), t.argument = this.parseMaybeAssign(e)), this.finishNode(t, "YieldExpression");
}, I.parseAwait = function(e) {
	this.awaitPos ||= this.start;
	var t = this.startNode();
	return this.next(), t.argument = this.parseMaybeUnary(null, !0, !1, e), this.finishNode(t, "AwaitExpression");
};
var rt = k.prototype;
rt.raise = function(e, t) {
	var n = ye(this.input, e);
	t += " (" + n.line + ":" + n.column + ")", this.sourceFile && (t += " in " + this.sourceFile);
	var r = SyntaxError(t);
	throw r.pos = e, r.loc = n, r.raisedAt = this.pos, r;
}, rt.raiseRecoverable = rt.raise, rt.curPosition = function() {
	if (this.options.locations) return new _e(this.curLine, this.pos - this.lineStart);
};
var it = k.prototype, at = function(e) {
	this.flags = e, this.var = [], this.lexical = [], this.functions = [];
};
it.enterScope = function(e) {
	this.scopeStack.push(new at(e));
}, it.exitScope = function() {
	this.scopeStack.pop();
}, it.treatFunctionsAsVarInScope = function(e) {
	return e.flags & Te || !this.inModule && e.flags & we;
}, it.declareName = function(e, t, n) {
	var r = !1;
	if (t === ze) {
		var i = this.currentScope();
		r = i.lexical.indexOf(e) > -1 || i.functions.indexOf(e) > -1 || i.var.indexOf(e) > -1, i.lexical.push(e), this.inModule && i.flags & we && delete this.undefinedExports[e];
	} else if (t === Ve) this.currentScope().lexical.push(e);
	else if (t === Be) {
		var a = this.currentScope();
		r = this.treatFunctionsAsVar ? a.lexical.indexOf(e) > -1 : a.lexical.indexOf(e) > -1 || a.var.indexOf(e) > -1, a.functions.push(e);
	} else for (var o = this.scopeStack.length - 1; o >= 0; --o) {
		var s = this.scopeStack[o];
		if (s.lexical.indexOf(e) > -1 && !(s.flags & ke && s.lexical[0] === e) || !this.treatFunctionsAsVarInScope(s) && s.functions.indexOf(e) > -1) {
			r = !0;
			break;
		}
		if (s.var.push(e), this.inModule && s.flags & we && delete this.undefinedExports[e], s.flags & Fe) break;
	}
	r && this.raiseRecoverable(n, "Identifier '" + e + "' has already been declared");
}, it.checkLocalExport = function(e) {
	this.scopeStack[0].lexical.indexOf(e.name) === -1 && this.scopeStack[0].var.indexOf(e.name) === -1 && (this.undefinedExports[e.name] = e);
}, it.currentScope = function() {
	return this.scopeStack[this.scopeStack.length - 1];
}, it.currentVarScope = function() {
	for (var e = this.scopeStack.length - 1;; e--) {
		var t = this.scopeStack[e];
		if (t.flags & (Fe | Ne | Me)) return t;
	}
}, it.currentThisScope = function() {
	for (var e = this.scopeStack.length - 1;; e--) {
		var t = this.scopeStack[e];
		if (t.flags & (Fe | Ne | Me) && !(t.flags & Oe)) return t;
	}
};
var ot = function(e, t, n) {
	this.type = "", this.start = t, this.end = 0, e.options.locations && (this.loc = new ve(e, n)), e.options.directSourceFile && (this.sourceFile = e.options.directSourceFile), e.options.ranges && (this.range = [t, 0]);
}, st = k.prototype;
st.startNode = function() {
	return new ot(this, this.start, this.startLoc);
}, st.startNodeAt = function(e, t) {
	return new ot(this, e, t);
};
function ct(e, t, n, r) {
	return e.type = t, e.end = n, this.options.locations && (e.loc.end = r), this.options.ranges && (e.range[1] = n), e;
}
st.finishNode = function(e, t) {
	return ct.call(this, e, t, this.lastTokEnd, this.lastTokEndLoc);
}, st.finishNodeAt = function(e, t, n, r) {
	return ct.call(this, e, t, n, r);
}, st.copyNode = function(e) {
	var t = new ot(this, e.start, this.startLoc);
	for (var n in e) t[n] = e[n];
	return t;
};
var lt = "Berf Beria_Erfe Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sidetic Sidt Sunu Sunuwar Tai_Yo Tayo Todhri Todr Tolong_Siki Tols Tulu_Tigalari Tutg Unknown Zzzz", ut = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS", dt = ut + " Extended_Pictographic", ft = dt, pt = ft + " EBase EComp EMod EPres ExtPict", mt = pt, ht = {
	9: ut,
	10: dt,
	11: ft,
	12: pt,
	13: mt,
	14: mt
}, gt = {
	9: "",
	10: "",
	11: "",
	12: "",
	13: "",
	14: "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji"
}, _t = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu", vt = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb", yt = vt + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd", bt = yt + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho", xt = bt + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi", St = xt + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith", Ct = {
	9: vt,
	10: yt,
	11: bt,
	12: xt,
	13: St,
	14: St + " " + lt
}, wt = {};
function Tt(e) {
	var t = wt[e] = {
		binary: me(ht[e] + " " + _t),
		binaryOfStrings: me(gt[e]),
		nonBinary: {
			General_Category: me(_t),
			Script: me(Ct[e])
		}
	};
	t.nonBinary.Script_Extensions = t.nonBinary.Script, t.nonBinary.gc = t.nonBinary.General_Category, t.nonBinary.sc = t.nonBinary.Script, t.nonBinary.scx = t.nonBinary.Script_Extensions;
}
for (var Et = 0, Dt = [
	9,
	10,
	11,
	12,
	13,
	14
]; Et < Dt.length; Et += 1) {
	var Ot = Dt[Et];
	Tt(Ot);
}
var L = k.prototype, kt = function(e, t) {
	this.parent = e, this.base = t || this;
};
kt.prototype.separatedFrom = function(e) {
	for (var t = this; t; t = t.parent) for (var n = e; n; n = n.parent) if (t.base === n.base && t !== n) return !0;
	return !1;
}, kt.prototype.sibling = function() {
	return new kt(this.parent, this.base);
};
var R = function(e) {
	this.parser = e, this.validFlags = "gim" + (e.options.ecmaVersion >= 6 ? "uy" : "") + (e.options.ecmaVersion >= 9 ? "s" : "") + (e.options.ecmaVersion >= 13 ? "d" : "") + (e.options.ecmaVersion >= 15 ? "v" : ""), this.unicodeProperties = wt[e.options.ecmaVersion >= 14 ? 14 : e.options.ecmaVersion], this.source = "", this.flags = "", this.start = 0, this.switchU = !1, this.switchV = !1, this.switchN = !1, this.pos = 0, this.lastIntValue = 0, this.lastStringValue = "", this.lastAssertionIsQuantifiable = !1, this.numCapturingParens = 0, this.maxBackReference = 0, this.groupNames = Object.create(null), this.backReferenceNames = [], this.branchID = null;
};
R.prototype.reset = function(e, t, n) {
	var r = n.indexOf("v") !== -1, i = n.indexOf("u") !== -1;
	this.start = e | 0, this.source = t + "", this.flags = n, r && this.parser.options.ecmaVersion >= 15 ? (this.switchU = !0, this.switchV = !0, this.switchN = !0) : (this.switchU = i && this.parser.options.ecmaVersion >= 6, this.switchV = !1, this.switchN = i && this.parser.options.ecmaVersion >= 9);
}, R.prototype.raise = function(e) {
	this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + e);
}, R.prototype.at = function(e, t) {
	t === void 0 && (t = !1);
	var n = this.source, r = n.length;
	if (e >= r) return -1;
	var i = n.charCodeAt(e);
	if (!(t || this.switchU) || i <= 55295 || i >= 57344 || e + 1 >= r) return i;
	var a = n.charCodeAt(e + 1);
	return a >= 56320 && a <= 57343 ? (i << 10) + a - 56613888 : i;
}, R.prototype.nextIndex = function(e, t) {
	t === void 0 && (t = !1);
	var n = this.source, r = n.length;
	if (e >= r) return r;
	var i = n.charCodeAt(e), a;
	return !(t || this.switchU) || i <= 55295 || i >= 57344 || e + 1 >= r || (a = n.charCodeAt(e + 1)) < 56320 || a > 57343 ? e + 1 : e + 2;
}, R.prototype.current = function(e) {
	return e === void 0 && (e = !1), this.at(this.pos, e);
}, R.prototype.lookahead = function(e) {
	return e === void 0 && (e = !1), this.at(this.nextIndex(this.pos, e), e);
}, R.prototype.advance = function(e) {
	e === void 0 && (e = !1), this.pos = this.nextIndex(this.pos, e);
}, R.prototype.eat = function(e, t) {
	return t === void 0 && (t = !1), this.current(t) === e ? (this.advance(t), !0) : !1;
}, R.prototype.eatChars = function(e, t) {
	t === void 0 && (t = !1);
	for (var n = this.pos, r = 0, i = e; r < i.length; r += 1) {
		var a = i[r], o = this.at(n, t);
		if (o === -1 || o !== a) return !1;
		n = this.nextIndex(n, t);
	}
	return this.pos = n, !0;
}, L.validateRegExpFlags = function(e) {
	for (var t = e.validFlags, n = e.flags, r = !1, i = !1, a = 0; a < n.length; a++) {
		var o = n.charAt(a);
		t.indexOf(o) === -1 && this.raise(e.start, "Invalid regular expression flag"), n.indexOf(o, a + 1) > -1 && this.raise(e.start, "Duplicate regular expression flag"), o === "u" && (r = !0), o === "v" && (i = !0);
	}
	this.options.ecmaVersion >= 15 && r && i && this.raise(e.start, "Invalid regular expression flag");
};
function At(e) {
	for (var t in e) return !0;
	return !1;
}
L.validateRegExpPattern = function(e) {
	this.regexp_pattern(e), !e.switchN && this.options.ecmaVersion >= 9 && At(e.groupNames) && (e.switchN = !0, this.regexp_pattern(e));
}, L.regexp_pattern = function(e) {
	e.pos = 0, e.lastIntValue = 0, e.lastStringValue = "", e.lastAssertionIsQuantifiable = !1, e.numCapturingParens = 0, e.maxBackReference = 0, e.groupNames = Object.create(null), e.backReferenceNames.length = 0, e.branchID = null, this.regexp_disjunction(e), e.pos !== e.source.length && (e.eat(41) && e.raise("Unmatched ')'"), (e.eat(93) || e.eat(125)) && e.raise("Lone quantifier brackets")), e.maxBackReference > e.numCapturingParens && e.raise("Invalid escape");
	for (var t = 0, n = e.backReferenceNames; t < n.length; t += 1) {
		var r = n[t];
		e.groupNames[r] || e.raise("Invalid named capture referenced");
	}
}, L.regexp_disjunction = function(e) {
	var t = this.options.ecmaVersion >= 16;
	for (t && (e.branchID = new kt(e.branchID, null)), this.regexp_alternative(e); e.eat(124);) t && (e.branchID = e.branchID.sibling()), this.regexp_alternative(e);
	t && (e.branchID = e.branchID.parent), this.regexp_eatQuantifier(e, !0) && e.raise("Nothing to repeat"), e.eat(123) && e.raise("Lone quantifier brackets");
}, L.regexp_alternative = function(e) {
	for (; e.pos < e.source.length && this.regexp_eatTerm(e););
}, L.regexp_eatTerm = function(e) {
	return this.regexp_eatAssertion(e) ? (e.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(e) && e.switchU && e.raise("Invalid quantifier"), !0) : (e.switchU ? this.regexp_eatAtom(e) : this.regexp_eatExtendedAtom(e)) ? (this.regexp_eatQuantifier(e), !0) : !1;
}, L.regexp_eatAssertion = function(e) {
	var t = e.pos;
	if (e.lastAssertionIsQuantifiable = !1, e.eat(94) || e.eat(36)) return !0;
	if (e.eat(92)) {
		if (e.eat(66) || e.eat(98)) return !0;
		e.pos = t;
	}
	if (e.eat(40) && e.eat(63)) {
		var n = !1;
		if (this.options.ecmaVersion >= 9 && (n = e.eat(60)), e.eat(61) || e.eat(33)) return this.regexp_disjunction(e), e.eat(41) || e.raise("Unterminated group"), e.lastAssertionIsQuantifiable = !n, !0;
	}
	return e.pos = t, !1;
}, L.regexp_eatQuantifier = function(e, t) {
	return t === void 0 && (t = !1), this.regexp_eatQuantifierPrefix(e, t) ? (e.eat(63), !0) : !1;
}, L.regexp_eatQuantifierPrefix = function(e, t) {
	return e.eat(42) || e.eat(43) || e.eat(63) || this.regexp_eatBracedQuantifier(e, t);
}, L.regexp_eatBracedQuantifier = function(e, t) {
	var n = e.pos;
	if (e.eat(123)) {
		var r = 0, i = -1;
		if (this.regexp_eatDecimalDigits(e) && (r = e.lastIntValue, e.eat(44) && this.regexp_eatDecimalDigits(e) && (i = e.lastIntValue), e.eat(125))) return i !== -1 && i < r && !t && e.raise("numbers out of order in {} quantifier"), !0;
		e.switchU && !t && e.raise("Incomplete quantifier"), e.pos = n;
	}
	return !1;
}, L.regexp_eatAtom = function(e) {
	return this.regexp_eatPatternCharacters(e) || e.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e);
}, L.regexp_eatReverseSolidusAtomEscape = function(e) {
	var t = e.pos;
	if (e.eat(92)) {
		if (this.regexp_eatAtomEscape(e)) return !0;
		e.pos = t;
	}
	return !1;
}, L.regexp_eatUncapturingGroup = function(e) {
	var t = e.pos;
	if (e.eat(40)) {
		if (e.eat(63)) {
			if (this.options.ecmaVersion >= 16) {
				var n = this.regexp_eatModifiers(e), r = e.eat(45);
				if (n || r) {
					for (var i = 0; i < n.length; i++) {
						var a = n.charAt(i);
						n.indexOf(a, i + 1) > -1 && e.raise("Duplicate regular expression modifiers");
					}
					if (r) {
						var o = this.regexp_eatModifiers(e);
						!n && !o && e.current() === 58 && e.raise("Invalid regular expression modifiers");
						for (var s = 0; s < o.length; s++) {
							var c = o.charAt(s);
							(o.indexOf(c, s + 1) > -1 || n.indexOf(c) > -1) && e.raise("Duplicate regular expression modifiers");
						}
					}
				}
			}
			if (e.eat(58)) {
				if (this.regexp_disjunction(e), e.eat(41)) return !0;
				e.raise("Unterminated group");
			}
		}
		e.pos = t;
	}
	return !1;
}, L.regexp_eatCapturingGroup = function(e) {
	if (e.eat(40)) {
		if (this.options.ecmaVersion >= 9 ? this.regexp_groupSpecifier(e) : e.current() === 63 && e.raise("Invalid group"), this.regexp_disjunction(e), e.eat(41)) return e.numCapturingParens += 1, !0;
		e.raise("Unterminated group");
	}
	return !1;
}, L.regexp_eatModifiers = function(e) {
	for (var t = "", n = 0; (n = e.current()) !== -1 && jt(n);) t += he(n), e.advance();
	return t;
};
function jt(e) {
	return e === 105 || e === 109 || e === 115;
}
L.regexp_eatExtendedAtom = function(e) {
	return e.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e) || this.regexp_eatInvalidBracedQuantifier(e) || this.regexp_eatExtendedPatternCharacter(e);
}, L.regexp_eatInvalidBracedQuantifier = function(e) {
	return this.regexp_eatBracedQuantifier(e, !0) && e.raise("Nothing to repeat"), !1;
}, L.regexp_eatSyntaxCharacter = function(e) {
	var t = e.current();
	return Mt(t) ? (e.lastIntValue = t, e.advance(), !0) : !1;
};
function Mt(e) {
	return e === 36 || e >= 40 && e <= 43 || e === 46 || e === 63 || e >= 91 && e <= 94 || e >= 123 && e <= 125;
}
L.regexp_eatPatternCharacters = function(e) {
	for (var t = e.pos, n = 0; (n = e.current()) !== -1 && !Mt(n);) e.advance();
	return e.pos !== t;
}, L.regexp_eatExtendedPatternCharacter = function(e) {
	var t = e.current();
	return t !== -1 && t !== 36 && !(t >= 40 && t <= 43) && t !== 46 && t !== 63 && t !== 91 && t !== 94 && t !== 124 ? (e.advance(), !0) : !1;
}, L.regexp_groupSpecifier = function(e) {
	if (e.eat(63)) {
		this.regexp_eatGroupName(e) || e.raise("Invalid group");
		var t = this.options.ecmaVersion >= 16, n = e.groupNames[e.lastStringValue];
		if (n) if (t) for (var r = 0, i = n; r < i.length; r += 1) i[r].separatedFrom(e.branchID) || e.raise("Duplicate capture group name");
		else e.raise("Duplicate capture group name");
		t ? (n || (e.groupNames[e.lastStringValue] = [])).push(e.branchID) : e.groupNames[e.lastStringValue] = !0;
	}
}, L.regexp_eatGroupName = function(e) {
	if (e.lastStringValue = "", e.eat(60)) {
		if (this.regexp_eatRegExpIdentifierName(e) && e.eat(62)) return !0;
		e.raise("Invalid capture group name");
	}
	return !1;
}, L.regexp_eatRegExpIdentifierName = function(e) {
	if (e.lastStringValue = "", this.regexp_eatRegExpIdentifierStart(e)) {
		for (e.lastStringValue += he(e.lastIntValue); this.regexp_eatRegExpIdentifierPart(e);) e.lastStringValue += he(e.lastIntValue);
		return !0;
	}
	return !1;
}, L.regexp_eatRegExpIdentifierStart = function(e) {
	var t = e.pos, n = this.options.ecmaVersion >= 11, r = e.current(n);
	return e.advance(n), r === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e, n) && (r = e.lastIntValue), Nt(r) ? (e.lastIntValue = r, !0) : (e.pos = t, !1);
};
function Nt(e) {
	return y(e, !0) || e === 36 || e === 95;
}
L.regexp_eatRegExpIdentifierPart = function(e) {
	var t = e.pos, n = this.options.ecmaVersion >= 11, r = e.current(n);
	return e.advance(n), r === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e, n) && (r = e.lastIntValue), Pt(r) ? (e.lastIntValue = r, !0) : (e.pos = t, !1);
};
function Pt(e) {
	return b(e, !0) || e === 36 || e === 95 || e === 8204 || e === 8205;
}
L.regexp_eatAtomEscape = function(e) {
	return this.regexp_eatBackReference(e) || this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e) || e.switchN && this.regexp_eatKGroupName(e) ? !0 : (e.switchU && (e.current() === 99 && e.raise("Invalid unicode escape"), e.raise("Invalid escape")), !1);
}, L.regexp_eatBackReference = function(e) {
	var t = e.pos;
	if (this.regexp_eatDecimalEscape(e)) {
		var n = e.lastIntValue;
		if (e.switchU) return n > e.maxBackReference && (e.maxBackReference = n), !0;
		if (n <= e.numCapturingParens) return !0;
		e.pos = t;
	}
	return !1;
}, L.regexp_eatKGroupName = function(e) {
	if (e.eat(107)) {
		if (this.regexp_eatGroupName(e)) return e.backReferenceNames.push(e.lastStringValue), !0;
		e.raise("Invalid named reference");
	}
	return !1;
}, L.regexp_eatCharacterEscape = function(e) {
	return this.regexp_eatControlEscape(e) || this.regexp_eatCControlLetter(e) || this.regexp_eatZero(e) || this.regexp_eatHexEscapeSequence(e) || this.regexp_eatRegExpUnicodeEscapeSequence(e, !1) || !e.switchU && this.regexp_eatLegacyOctalEscapeSequence(e) || this.regexp_eatIdentityEscape(e);
}, L.regexp_eatCControlLetter = function(e) {
	var t = e.pos;
	if (e.eat(99)) {
		if (this.regexp_eatControlLetter(e)) return !0;
		e.pos = t;
	}
	return !1;
}, L.regexp_eatZero = function(e) {
	return e.current() === 48 && !Gt(e.lookahead()) ? (e.lastIntValue = 0, e.advance(), !0) : !1;
}, L.regexp_eatControlEscape = function(e) {
	var t = e.current();
	return t === 116 ? (e.lastIntValue = 9, e.advance(), !0) : t === 110 ? (e.lastIntValue = 10, e.advance(), !0) : t === 118 ? (e.lastIntValue = 11, e.advance(), !0) : t === 102 ? (e.lastIntValue = 12, e.advance(), !0) : t === 114 ? (e.lastIntValue = 13, e.advance(), !0) : !1;
}, L.regexp_eatControlLetter = function(e) {
	var t = e.current();
	return Ft(t) ? (e.lastIntValue = t % 32, e.advance(), !0) : !1;
};
function Ft(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122;
}
L.regexp_eatRegExpUnicodeEscapeSequence = function(e, t) {
	t === void 0 && (t = !1);
	var n = e.pos, r = t || e.switchU;
	if (e.eat(117)) {
		if (this.regexp_eatFixedHexDigits(e, 4)) {
			var i = e.lastIntValue;
			if (r && i >= 55296 && i <= 56319) {
				var a = e.pos;
				if (e.eat(92) && e.eat(117) && this.regexp_eatFixedHexDigits(e, 4)) {
					var o = e.lastIntValue;
					if (o >= 56320 && o <= 57343) return e.lastIntValue = (i - 55296) * 1024 + (o - 56320) + 65536, !0;
				}
				e.pos = a, e.lastIntValue = i;
			}
			return !0;
		}
		if (r && e.eat(123) && this.regexp_eatHexDigits(e) && e.eat(125) && It(e.lastIntValue)) return !0;
		r && e.raise("Invalid unicode escape"), e.pos = n;
	}
	return !1;
};
function It(e) {
	return e >= 0 && e <= 1114111;
}
L.regexp_eatIdentityEscape = function(e) {
	if (e.switchU) return this.regexp_eatSyntaxCharacter(e) ? !0 : e.eat(47) ? (e.lastIntValue = 47, !0) : !1;
	var t = e.current();
	return t !== 99 && (!e.switchN || t !== 107) ? (e.lastIntValue = t, e.advance(), !0) : !1;
}, L.regexp_eatDecimalEscape = function(e) {
	e.lastIntValue = 0;
	var t = e.current();
	if (t >= 49 && t <= 57) {
		do
			e.lastIntValue = 10 * e.lastIntValue + (t - 48), e.advance();
		while ((t = e.current()) >= 48 && t <= 57);
		return !0;
	}
	return !1;
};
var Lt = 0, Rt = 1, z = 2;
L.regexp_eatCharacterClassEscape = function(e) {
	var t = e.current();
	if (zt(t)) return e.lastIntValue = -1, e.advance(), Rt;
	var n = !1;
	if (e.switchU && this.options.ecmaVersion >= 9 && ((n = t === 80) || t === 112)) {
		e.lastIntValue = -1, e.advance();
		var r;
		if (e.eat(123) && (r = this.regexp_eatUnicodePropertyValueExpression(e)) && e.eat(125)) return n && r === z && e.raise("Invalid property name"), r;
		e.raise("Invalid property name");
	}
	return Lt;
};
function zt(e) {
	return e === 100 || e === 68 || e === 115 || e === 83 || e === 119 || e === 87;
}
L.regexp_eatUnicodePropertyValueExpression = function(e) {
	var t = e.pos;
	if (this.regexp_eatUnicodePropertyName(e) && e.eat(61)) {
		var n = e.lastStringValue;
		if (this.regexp_eatUnicodePropertyValue(e)) {
			var r = e.lastStringValue;
			return this.regexp_validateUnicodePropertyNameAndValue(e, n, r), Rt;
		}
	}
	if (e.pos = t, this.regexp_eatLoneUnicodePropertyNameOrValue(e)) {
		var i = e.lastStringValue;
		return this.regexp_validateUnicodePropertyNameOrValue(e, i);
	}
	return Lt;
}, L.regexp_validateUnicodePropertyNameAndValue = function(e, t, n) {
	de(e.unicodeProperties.nonBinary, t) || e.raise("Invalid property name"), e.unicodeProperties.nonBinary[t].test(n) || e.raise("Invalid property value");
}, L.regexp_validateUnicodePropertyNameOrValue = function(e, t) {
	if (e.unicodeProperties.binary.test(t)) return Rt;
	if (e.switchV && e.unicodeProperties.binaryOfStrings.test(t)) return z;
	e.raise("Invalid property name");
}, L.regexp_eatUnicodePropertyName = function(e) {
	var t = 0;
	for (e.lastStringValue = ""; Bt(t = e.current());) e.lastStringValue += he(t), e.advance();
	return e.lastStringValue !== "";
};
function Bt(e) {
	return Ft(e) || e === 95;
}
L.regexp_eatUnicodePropertyValue = function(e) {
	var t = 0;
	for (e.lastStringValue = ""; Vt(t = e.current());) e.lastStringValue += he(t), e.advance();
	return e.lastStringValue !== "";
};
function Vt(e) {
	return Bt(e) || Gt(e);
}
L.regexp_eatLoneUnicodePropertyNameOrValue = function(e) {
	return this.regexp_eatUnicodePropertyValue(e);
}, L.regexp_eatCharacterClass = function(e) {
	if (e.eat(91)) {
		var t = e.eat(94), n = this.regexp_classContents(e);
		return e.eat(93) || e.raise("Unterminated character class"), t && n === z && e.raise("Negated character class may contain strings"), !0;
	}
	return !1;
}, L.regexp_classContents = function(e) {
	return e.current() === 93 ? Rt : e.switchV ? this.regexp_classSetExpression(e) : (this.regexp_nonEmptyClassRanges(e), Rt);
}, L.regexp_nonEmptyClassRanges = function(e) {
	for (; this.regexp_eatClassAtom(e);) {
		var t = e.lastIntValue;
		if (e.eat(45) && this.regexp_eatClassAtom(e)) {
			var n = e.lastIntValue;
			e.switchU && (t === -1 || n === -1) && e.raise("Invalid character class"), t !== -1 && n !== -1 && t > n && e.raise("Range out of order in character class");
		}
	}
}, L.regexp_eatClassAtom = function(e) {
	var t = e.pos;
	if (e.eat(92)) {
		if (this.regexp_eatClassEscape(e)) return !0;
		if (e.switchU) {
			var n = e.current();
			(n === 99 || Jt(n)) && e.raise("Invalid class escape"), e.raise("Invalid escape");
		}
		e.pos = t;
	}
	var r = e.current();
	return r === 93 ? !1 : (e.lastIntValue = r, e.advance(), !0);
}, L.regexp_eatClassEscape = function(e) {
	var t = e.pos;
	if (e.eat(98)) return e.lastIntValue = 8, !0;
	if (e.switchU && e.eat(45)) return e.lastIntValue = 45, !0;
	if (!e.switchU && e.eat(99)) {
		if (this.regexp_eatClassControlLetter(e)) return !0;
		e.pos = t;
	}
	return this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e);
}, L.regexp_classSetExpression = function(e) {
	var t = Rt, n;
	if (!this.regexp_eatClassSetRange(e)) if (n = this.regexp_eatClassSetOperand(e)) {
		n === z && (t = z);
		for (var r = e.pos; e.eatChars([38, 38]);) {
			if (e.current() !== 38 && (n = this.regexp_eatClassSetOperand(e))) {
				n !== z && (t = Rt);
				continue;
			}
			e.raise("Invalid character in character class");
		}
		if (r !== e.pos) return t;
		for (; e.eatChars([45, 45]);) this.regexp_eatClassSetOperand(e) || e.raise("Invalid character in character class");
		if (r !== e.pos) return t;
	} else e.raise("Invalid character in character class");
	for (;;) if (!this.regexp_eatClassSetRange(e)) {
		if (n = this.regexp_eatClassSetOperand(e), !n) return t;
		n === z && (t = z);
	}
}, L.regexp_eatClassSetRange = function(e) {
	var t = e.pos;
	if (this.regexp_eatClassSetCharacter(e)) {
		var n = e.lastIntValue;
		if (e.eat(45) && this.regexp_eatClassSetCharacter(e)) {
			var r = e.lastIntValue;
			return n !== -1 && r !== -1 && n > r && e.raise("Range out of order in character class"), !0;
		}
		e.pos = t;
	}
	return !1;
}, L.regexp_eatClassSetOperand = function(e) {
	return this.regexp_eatClassSetCharacter(e) ? Rt : this.regexp_eatClassStringDisjunction(e) || this.regexp_eatNestedClass(e);
}, L.regexp_eatNestedClass = function(e) {
	var t = e.pos;
	if (e.eat(91)) {
		var n = e.eat(94), r = this.regexp_classContents(e);
		if (e.eat(93)) return n && r === z && e.raise("Negated character class may contain strings"), r;
		e.pos = t;
	}
	if (e.eat(92)) {
		var i = this.regexp_eatCharacterClassEscape(e);
		if (i) return i;
		e.pos = t;
	}
	return null;
}, L.regexp_eatClassStringDisjunction = function(e) {
	var t = e.pos;
	if (e.eatChars([92, 113])) {
		if (e.eat(123)) {
			var n = this.regexp_classStringDisjunctionContents(e);
			if (e.eat(125)) return n;
		} else e.raise("Invalid escape");
		e.pos = t;
	}
	return null;
}, L.regexp_classStringDisjunctionContents = function(e) {
	for (var t = this.regexp_classString(e); e.eat(124);) this.regexp_classString(e) === z && (t = z);
	return t;
}, L.regexp_classString = function(e) {
	for (var t = 0; this.regexp_eatClassSetCharacter(e);) t++;
	return t === 1 ? Rt : z;
}, L.regexp_eatClassSetCharacter = function(e) {
	var t = e.pos;
	if (e.eat(92)) return this.regexp_eatCharacterEscape(e) || this.regexp_eatClassSetReservedPunctuator(e) ? !0 : e.eat(98) ? (e.lastIntValue = 8, !0) : (e.pos = t, !1);
	var n = e.current();
	return n < 0 || n === e.lookahead() && Ht(n) || Ut(n) ? !1 : (e.advance(), e.lastIntValue = n, !0);
};
function Ht(e) {
	return e === 33 || e >= 35 && e <= 38 || e >= 42 && e <= 44 || e === 46 || e >= 58 && e <= 64 || e === 94 || e === 96 || e === 126;
}
function Ut(e) {
	return e === 40 || e === 41 || e === 45 || e === 47 || e >= 91 && e <= 93 || e >= 123 && e <= 125;
}
L.regexp_eatClassSetReservedPunctuator = function(e) {
	var t = e.current();
	return Wt(t) ? (e.lastIntValue = t, e.advance(), !0) : !1;
};
function Wt(e) {
	return e === 33 || e === 35 || e === 37 || e === 38 || e === 44 || e === 45 || e >= 58 && e <= 62 || e === 64 || e === 96 || e === 126;
}
L.regexp_eatClassControlLetter = function(e) {
	var t = e.current();
	return Gt(t) || t === 95 ? (e.lastIntValue = t % 32, e.advance(), !0) : !1;
}, L.regexp_eatHexEscapeSequence = function(e) {
	var t = e.pos;
	if (e.eat(120)) {
		if (this.regexp_eatFixedHexDigits(e, 2)) return !0;
		e.switchU && e.raise("Invalid escape"), e.pos = t;
	}
	return !1;
}, L.regexp_eatDecimalDigits = function(e) {
	var t = e.pos, n = 0;
	for (e.lastIntValue = 0; Gt(n = e.current());) e.lastIntValue = 10 * e.lastIntValue + (n - 48), e.advance();
	return e.pos !== t;
};
function Gt(e) {
	return e >= 48 && e <= 57;
}
L.regexp_eatHexDigits = function(e) {
	var t = e.pos, n = 0;
	for (e.lastIntValue = 0; Kt(n = e.current());) e.lastIntValue = 16 * e.lastIntValue + qt(n), e.advance();
	return e.pos !== t;
};
function Kt(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
}
function qt(e) {
	return e >= 65 && e <= 70 ? 10 + (e - 65) : e >= 97 && e <= 102 ? 10 + (e - 97) : e - 48;
}
L.regexp_eatLegacyOctalEscapeSequence = function(e) {
	if (this.regexp_eatOctalDigit(e)) {
		var t = e.lastIntValue;
		if (this.regexp_eatOctalDigit(e)) {
			var n = e.lastIntValue;
			t <= 3 && this.regexp_eatOctalDigit(e) ? e.lastIntValue = t * 64 + n * 8 + e.lastIntValue : e.lastIntValue = t * 8 + n;
		} else e.lastIntValue = t;
		return !0;
	}
	return !1;
}, L.regexp_eatOctalDigit = function(e) {
	var t = e.current();
	return Jt(t) ? (e.lastIntValue = t - 48, e.advance(), !0) : (e.lastIntValue = 0, !1);
};
function Jt(e) {
	return e >= 48 && e <= 55;
}
L.regexp_eatFixedHexDigits = function(e, t) {
	var n = e.pos;
	e.lastIntValue = 0;
	for (var r = 0; r < t; ++r) {
		var i = e.current();
		if (!Kt(i)) return e.pos = n, !1;
		e.lastIntValue = 16 * e.lastIntValue + qt(i), e.advance();
	}
	return !0;
};
var Yt = function(e) {
	this.type = e.type, this.value = e.value, this.start = e.start, this.end = e.end, e.options.locations && (this.loc = new ve(e, e.startLoc, e.endLoc)), e.options.ranges && (this.range = [e.start, e.end]);
}, B = k.prototype;
B.next = function(e) {
	!e && this.type.keyword && this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword), this.options.onToken && this.options.onToken(new Yt(this)), this.lastTokEnd = this.end, this.lastTokStart = this.start, this.lastTokEndLoc = this.endLoc, this.lastTokStartLoc = this.startLoc, this.nextToken();
}, B.getToken = function() {
	return this.next(), new Yt(this);
}, typeof Symbol < "u" && (B[Symbol.iterator] = function() {
	var e = this;
	return { next: function() {
		var t = e.getToken();
		return {
			done: t.type === E.eof,
			value: t
		};
	} };
}), B.nextToken = function() {
	var e = this.curContext();
	if ((!e || !e.preserveSpace) && this.skipSpace(), this.start = this.pos, this.options.locations && (this.startLoc = this.curPosition()), this.pos >= this.input.length) return this.finishToken(E.eof);
	if (e.override) return e.override(this);
	this.readToken(this.fullCharCodeAtPos());
}, B.readToken = function(e) {
	return y(e, this.options.ecmaVersion >= 6) || e === 92 ? this.readWord() : this.getTokenFromCode(e);
}, B.fullCharCodeAt = function(e) {
	var t = this.input.charCodeAt(e);
	if (t <= 55295 || t >= 56320) return t;
	var n = this.input.charCodeAt(e + 1);
	return n <= 56319 || n >= 57344 ? t : (t << 10) + n - 56613888;
}, B.fullCharCodeAtPos = function() {
	return this.fullCharCodeAt(this.pos);
}, B.skipBlockComment = function() {
	var e = this.options.onComment && this.curPosition(), t = this.pos, n = this.input.indexOf("*/", this.pos += 2);
	if (n === -1 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = n + 2, this.options.locations) for (var r = void 0, i = t; (r = oe(this.input, i, this.pos)) > -1;) ++this.curLine, i = this.lineStart = r;
	this.options.onComment && this.options.onComment(!0, this.input.slice(t + 2, n), t, this.pos, e, this.curPosition());
}, B.skipLineComment = function(e) {
	for (var t = this.pos, n = this.options.onComment && this.curPosition(), r = this.input.charCodeAt(this.pos += e); this.pos < this.input.length && !ae(r);) r = this.input.charCodeAt(++this.pos);
	this.options.onComment && this.options.onComment(!1, this.input.slice(t + e, this.pos), t, this.pos, n, this.curPosition());
}, B.skipSpace = function() {
	loop: for (; this.pos < this.input.length;) {
		var e = this.input.charCodeAt(this.pos);
		switch (e) {
			case 32:
			case 160:
				++this.pos;
				break;
			case 13: this.input.charCodeAt(this.pos + 1) === 10 && ++this.pos;
			case 10:
			case 8232:
			case 8233:
				++this.pos, this.options.locations && (++this.curLine, this.lineStart = this.pos);
				break;
			case 47:
				switch (this.input.charCodeAt(this.pos + 1)) {
					case 42:
						this.skipBlockComment();
						break;
					case 47:
						this.skipLineComment(2);
						break;
					default: break loop;
				}
				break;
			default: if (e > 8 && e < 14 || e >= 5760 && se.test(String.fromCharCode(e))) ++this.pos;
			else break loop;
		}
	}
}, B.finishToken = function(e, t) {
	this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
	var n = this.type;
	this.type = e, this.value = t, this.updateContext(n);
}, B.readToken_dot = function() {
	var e = this.input.charCodeAt(this.pos + 1);
	if (e >= 48 && e <= 57) return this.readNumber(!0);
	var t = this.input.charCodeAt(this.pos + 2);
	return this.options.ecmaVersion >= 6 && e === 46 && t === 46 ? (this.pos += 3, this.finishToken(E.ellipsis)) : (++this.pos, this.finishToken(E.dot));
}, B.readToken_slash = function() {
	var e = this.input.charCodeAt(this.pos + 1);
	return this.exprAllowed ? (++this.pos, this.readRegexp()) : e === 61 ? this.finishOp(E.assign, 2) : this.finishOp(E.slash, 1);
}, B.readToken_mult_modulo_exp = function(e) {
	var t = this.input.charCodeAt(this.pos + 1), n = 1, r = e === 42 ? E.star : E.modulo;
	return this.options.ecmaVersion >= 7 && e === 42 && t === 42 && (++n, r = E.starstar, t = this.input.charCodeAt(this.pos + 2)), t === 61 ? this.finishOp(E.assign, n + 1) : this.finishOp(r, n);
}, B.readToken_pipe_amp = function(e) {
	var t = this.input.charCodeAt(this.pos + 1);
	return t === e ? this.options.ecmaVersion >= 12 && this.input.charCodeAt(this.pos + 2) === 61 ? this.finishOp(E.assign, 3) : this.finishOp(e === 124 ? E.logicalOR : E.logicalAND, 2) : t === 61 ? this.finishOp(E.assign, 2) : this.finishOp(e === 124 ? E.bitwiseOR : E.bitwiseAND, 1);
}, B.readToken_caret = function() {
	return this.input.charCodeAt(this.pos + 1) === 61 ? this.finishOp(E.assign, 2) : this.finishOp(E.bitwiseXOR, 1);
}, B.readToken_plus_min = function(e) {
	var t = this.input.charCodeAt(this.pos + 1);
	return t === e ? t === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || D.test(this.input.slice(this.lastTokEnd, this.pos))) ? (this.skipLineComment(3), this.skipSpace(), this.nextToken()) : this.finishOp(E.incDec, 2) : t === 61 ? this.finishOp(E.assign, 2) : this.finishOp(E.plusMin, 1);
}, B.readToken_lt_gt = function(e) {
	var t = this.input.charCodeAt(this.pos + 1), n = 1;
	return t === e ? (n = e === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2, this.input.charCodeAt(this.pos + n) === 61 ? this.finishOp(E.assign, n + 1) : this.finishOp(E.bitShift, n)) : t === 33 && e === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45 ? (this.skipLineComment(4), this.skipSpace(), this.nextToken()) : (t === 61 && (n = 2), this.finishOp(E.relational, n));
}, B.readToken_eq_excl = function(e) {
	var t = this.input.charCodeAt(this.pos + 1);
	return t === 61 ? this.finishOp(E.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) : e === 61 && t === 62 && this.options.ecmaVersion >= 6 ? (this.pos += 2, this.finishToken(E.arrow)) : this.finishOp(e === 61 ? E.eq : E.prefix, 1);
}, B.readToken_question = function() {
	var e = this.options.ecmaVersion;
	if (e >= 11) {
		var t = this.input.charCodeAt(this.pos + 1);
		if (t === 46) {
			var n = this.input.charCodeAt(this.pos + 2);
			if (n < 48 || n > 57) return this.finishOp(E.questionDot, 2);
		}
		if (t === 63) return e >= 12 && this.input.charCodeAt(this.pos + 2) === 61 ? this.finishOp(E.assign, 3) : this.finishOp(E.coalesce, 2);
	}
	return this.finishOp(E.question, 1);
}, B.readToken_numberSign = function() {
	var e = this.options.ecmaVersion, t = 35;
	if (e >= 13 && (++this.pos, t = this.fullCharCodeAtPos(), y(t, !0) || t === 92)) return this.finishToken(E.privateId, this.readWord1());
	this.raise(this.pos, "Unexpected character '" + he(t) + "'");
}, B.getTokenFromCode = function(e) {
	switch (e) {
		case 46: return this.readToken_dot();
		case 40: return ++this.pos, this.finishToken(E.parenL);
		case 41: return ++this.pos, this.finishToken(E.parenR);
		case 59: return ++this.pos, this.finishToken(E.semi);
		case 44: return ++this.pos, this.finishToken(E.comma);
		case 91: return ++this.pos, this.finishToken(E.bracketL);
		case 93: return ++this.pos, this.finishToken(E.bracketR);
		case 123: return ++this.pos, this.finishToken(E.braceL);
		case 125: return ++this.pos, this.finishToken(E.braceR);
		case 58: return ++this.pos, this.finishToken(E.colon);
		case 96:
			if (this.options.ecmaVersion < 6) break;
			return ++this.pos, this.finishToken(E.backQuote);
		case 48:
			var t = this.input.charCodeAt(this.pos + 1);
			if (t === 120 || t === 88) return this.readRadixNumber(16);
			if (this.options.ecmaVersion >= 6) {
				if (t === 111 || t === 79) return this.readRadixNumber(8);
				if (t === 98 || t === 66) return this.readRadixNumber(2);
			}
		case 49:
		case 50:
		case 51:
		case 52:
		case 53:
		case 54:
		case 55:
		case 56:
		case 57: return this.readNumber(!1);
		case 34:
		case 39: return this.readString(e);
		case 47: return this.readToken_slash();
		case 37:
		case 42: return this.readToken_mult_modulo_exp(e);
		case 124:
		case 38: return this.readToken_pipe_amp(e);
		case 94: return this.readToken_caret();
		case 43:
		case 45: return this.readToken_plus_min(e);
		case 60:
		case 62: return this.readToken_lt_gt(e);
		case 61:
		case 33: return this.readToken_eq_excl(e);
		case 63: return this.readToken_question();
		case 126: return this.finishOp(E.prefix, 1);
		case 35: return this.readToken_numberSign();
	}
	this.raise(this.pos, "Unexpected character '" + he(e) + "'");
}, B.finishOp = function(e, t) {
	var n = this.input.slice(this.pos, this.pos + t);
	return this.pos += t, this.finishToken(e, n);
}, B.readRegexp = function() {
	for (var e, t, n = this.pos;;) {
		this.pos >= this.input.length && this.raise(n, "Unterminated regular expression");
		var r = this.input.charAt(this.pos);
		if (D.test(r) && this.raise(n, "Unterminated regular expression"), e) e = !1;
		else {
			if (r === "[") t = !0;
			else if (r === "]" && t) t = !1;
			else if (r === "/" && !t) break;
			e = r === "\\";
		}
		++this.pos;
	}
	var i = this.input.slice(n, this.pos);
	++this.pos;
	var a = this.pos, o = this.readWord1();
	this.containsEsc && this.unexpected(a);
	var s = this.regexpState ||= new R(this);
	s.reset(n, i, o), this.validateRegExpFlags(s), this.validateRegExpPattern(s);
	var c = null;
	try {
		c = new RegExp(i, o);
	} catch {}
	return this.finishToken(E.regexp, {
		pattern: i,
		flags: o,
		value: c
	});
}, B.readInt = function(e, t, n) {
	for (var r = this.options.ecmaVersion >= 12 && t === void 0, i = n && this.input.charCodeAt(this.pos) === 48, a = this.pos, o = 0, s = 0, c = 0, l = t ?? Infinity; c < l; ++c, ++this.pos) {
		var u = this.input.charCodeAt(this.pos), d = void 0;
		if (r && u === 95) {
			i && this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"), s === 95 && this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"), c === 0 && this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"), s = u;
			continue;
		}
		if (d = u >= 97 ? u - 97 + 10 : u >= 65 ? u - 65 + 10 : u >= 48 && u <= 57 ? u - 48 : Infinity, d >= e) break;
		s = u, o = o * e + d;
	}
	return r && s === 95 && this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"), this.pos === a || t != null && this.pos - a !== t ? null : o;
};
function Xt(e, t) {
	return t ? parseInt(e, 8) : parseFloat(e.replace(/_/g, ""));
}
function Zt(e) {
	return typeof BigInt == "function" ? BigInt(e.replace(/_/g, "")) : null;
}
B.readRadixNumber = function(e) {
	var t = this.pos;
	this.pos += 2;
	var n = this.readInt(e);
	return n ?? this.raise(this.start + 2, "Expected number in radix " + e), this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110 ? (n = Zt(this.input.slice(t, this.pos)), ++this.pos) : y(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(E.num, n);
}, B.readNumber = function(e) {
	var t = this.pos;
	!e && this.readInt(10, void 0, !0) === null && this.raise(t, "Invalid number");
	var n = this.pos - t >= 2 && this.input.charCodeAt(t) === 48;
	n && this.strict && this.raise(t, "Invalid number");
	var r = this.input.charCodeAt(this.pos);
	if (!n && !e && this.options.ecmaVersion >= 11 && r === 110) {
		var i = Zt(this.input.slice(t, this.pos));
		return ++this.pos, y(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(E.num, i);
	}
	n && /[89]/.test(this.input.slice(t, this.pos)) && (n = !1), r === 46 && !n && (++this.pos, this.readInt(10), r = this.input.charCodeAt(this.pos)), (r === 69 || r === 101) && !n && (r = this.input.charCodeAt(++this.pos), (r === 43 || r === 45) && ++this.pos, this.readInt(10) === null && this.raise(t, "Invalid number")), y(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
	var a = Xt(this.input.slice(t, this.pos), n);
	return this.finishToken(E.num, a);
}, B.readCodePoint = function() {
	var e = this.input.charCodeAt(this.pos), t;
	if (e === 123) {
		this.options.ecmaVersion < 6 && this.unexpected();
		var n = ++this.pos;
		t = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos), ++this.pos, t > 1114111 && this.invalidStringToken(n, "Code point out of bounds");
	} else t = this.readHexChar(4);
	return t;
}, B.readString = function(e) {
	for (var t = "", n = ++this.pos;;) {
		this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
		var r = this.input.charCodeAt(this.pos);
		if (r === e) break;
		r === 92 ? (t += this.input.slice(n, this.pos), t += this.readEscapedChar(!1), n = this.pos) : r === 8232 || r === 8233 ? (this.options.ecmaVersion < 10 && this.raise(this.start, "Unterminated string constant"), ++this.pos, this.options.locations && (this.curLine++, this.lineStart = this.pos)) : (ae(r) && this.raise(this.start, "Unterminated string constant"), ++this.pos);
	}
	return t += this.input.slice(n, this.pos++), this.finishToken(E.string, t);
};
var Qt = {};
B.tryReadTemplateToken = function() {
	this.inTemplateElement = !0;
	try {
		this.readTmplToken();
	} catch (e) {
		if (e === Qt) this.readInvalidTemplateToken();
		else throw e;
	}
	this.inTemplateElement = !1;
}, B.invalidStringToken = function(e, t) {
	if (this.inTemplateElement && this.options.ecmaVersion >= 9) throw Qt;
	this.raise(e, t);
}, B.readTmplToken = function() {
	for (var e = "", t = this.pos;;) {
		this.pos >= this.input.length && this.raise(this.start, "Unterminated template");
		var n = this.input.charCodeAt(this.pos);
		if (n === 96 || n === 36 && this.input.charCodeAt(this.pos + 1) === 123) return this.pos === this.start && (this.type === E.template || this.type === E.invalidTemplate) ? n === 36 ? (this.pos += 2, this.finishToken(E.dollarBraceL)) : (++this.pos, this.finishToken(E.backQuote)) : (e += this.input.slice(t, this.pos), this.finishToken(E.template, e));
		if (n === 92) e += this.input.slice(t, this.pos), e += this.readEscapedChar(!0), t = this.pos;
		else if (ae(n)) {
			switch (e += this.input.slice(t, this.pos), ++this.pos, n) {
				case 13: this.input.charCodeAt(this.pos) === 10 && ++this.pos;
				case 10:
					e += "\n";
					break;
				default:
					e += String.fromCharCode(n);
					break;
			}
			this.options.locations && (++this.curLine, this.lineStart = this.pos), t = this.pos;
		} else ++this.pos;
	}
}, B.readInvalidTemplateToken = function() {
	for (; this.pos < this.input.length; this.pos++) switch (this.input[this.pos]) {
		case "\\":
			++this.pos;
			break;
		case "$": if (this.input[this.pos + 1] !== "{") break;
		case "`": return this.finishToken(E.invalidTemplate, this.input.slice(this.start, this.pos));
		case "\r": this.input[this.pos + 1] === "\n" && ++this.pos;
		case "\n":
		case "\u2028":
		case "\u2029":
			++this.curLine, this.lineStart = this.pos + 1;
			break;
	}
	this.raise(this.start, "Unterminated template");
}, B.readEscapedChar = function(e) {
	var t = this.input.charCodeAt(++this.pos);
	switch (++this.pos, t) {
		case 110: return "\n";
		case 114: return "\r";
		case 120: return String.fromCharCode(this.readHexChar(2));
		case 117: return he(this.readCodePoint());
		case 116: return "	";
		case 98: return "\b";
		case 118: return "\v";
		case 102: return "\f";
		case 13: this.input.charCodeAt(this.pos) === 10 && ++this.pos;
		case 10: return this.options.locations && (this.lineStart = this.pos, ++this.curLine), "";
		case 56:
		case 57: if (this.strict && this.invalidStringToken(this.pos - 1, "Invalid escape sequence"), e) {
			var n = this.pos - 1;
			this.invalidStringToken(n, "Invalid escape sequence in template string");
		}
		default:
			if (t >= 48 && t <= 55) {
				var r = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0], i = parseInt(r, 8);
				return i > 255 && (r = r.slice(0, -1), i = parseInt(r, 8)), this.pos += r.length - 1, t = this.input.charCodeAt(this.pos), (r !== "0" || t === 56 || t === 57) && (this.strict || e) && this.invalidStringToken(this.pos - 1 - r.length, e ? "Octal literal in template string" : "Octal literal in strict mode"), String.fromCharCode(i);
			}
			return ae(t) ? (this.options.locations && (this.lineStart = this.pos, ++this.curLine), "") : String.fromCharCode(t);
	}
}, B.readHexChar = function(e) {
	var t = this.pos, n = this.readInt(16, e);
	return n === null && this.invalidStringToken(t, "Bad character escape sequence"), n;
}, B.readWord1 = function() {
	this.containsEsc = !1;
	for (var e = "", t = !0, n = this.pos, r = this.options.ecmaVersion >= 6; this.pos < this.input.length;) {
		var i = this.fullCharCodeAtPos();
		if (b(i, r)) this.pos += i <= 65535 ? 1 : 2;
		else if (i === 92) {
			this.containsEsc = !0, e += this.input.slice(n, this.pos);
			var a = this.pos;
			this.input.charCodeAt(++this.pos) !== 117 && this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"), ++this.pos;
			var o = this.readCodePoint();
			(t ? y : b)(o, r) || this.invalidStringToken(a, "Invalid Unicode escape"), e += he(o), n = this.pos;
		} else break;
		t = !1;
	}
	return e + this.input.slice(n, this.pos);
}, B.readWord = function() {
	var e = this.readWord1(), t = E.name;
	return this.keywords.test(e) && (t = re[e]), this.finishToken(t, e);
};
var $t = "8.17.0";
k.acorn = {
	Parser: k,
	version: $t,
	defaultOptions: be,
	Position: _e,
	SourceLocation: ve,
	getLineInfo: ye,
	Node: ot,
	TokenType: x,
	tokTypes: E,
	keywordTypes: re,
	TokContext: P,
	tokContexts: F,
	isIdentifierChar: b,
	isIdentifierStart: y,
	Token: Yt,
	isNewLine: ae,
	lineBreak: D,
	lineBreakG: ie,
	nonASCIIwhitespace: se
};
function en(e, t) {
	return k.parse(e, t);
}
function tn(e, t, n) {
	return k.parseExpressionAt(e, t, n);
}
function nn(e, t) {
	return k.tokenizer(e, t);
}
//#endregion
//#region node_modules/acorn-typescript/lib/index.mjs
function rn(e, t) {
	for (var n = 0; n < t.length; n++) {
		var r = t[n];
		r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, typeof (i = function(e, t) {
			if (typeof e != "object" || !e) return e;
			var n = e[Symbol.toPrimitive];
			if (n !== void 0) {
				var r = n.call(e, "string");
				if (typeof r != "object") return r;
				throw TypeError("@@toPrimitive must return a primitive value.");
			}
			return String(e);
		}(r.key)) == "symbol" ? i : String(i), r);
	}
	var i;
}
function an() {
	return an = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, an.apply(this, arguments);
}
function on(e, t) {
	e.prototype = Object.create(t.prototype), e.prototype.constructor = e, sn(e, t);
}
function sn(e, t) {
	return sn = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e, t) {
		return e.__proto__ = t, e;
	}, sn(e, t);
}
function cn(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function ln(e, t) {
	var n = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n) return (n = n.call(e)).next.bind(n);
	if (Array.isArray(e) || (n = function(e, t) {
		if (e) {
			if (typeof e == "string") return cn(e, t);
			var n = Object.prototype.toString.call(e).slice(8, -1);
			return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? cn(e, t) : void 0;
		}
	}(e)) || t && e && typeof e.length == "number") {
		n && (e = n);
		var r = 0;
		return function() {
			return r >= e.length ? { done: !0 } : {
				done: !1,
				value: e[r++]
			};
		};
	}
	throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var V = !0;
function H(e, t) {
	return t === void 0 && (t = {}), new x("name", t);
}
var un = /* @__PURE__ */ new WeakMap();
function dn(e) {
	var t = un.get(e.Parser.acorn || e);
	if (!t) {
		var n = {
			assert: H(0, { startsExpr: V }),
			asserts: H(0, { startsExpr: V }),
			global: H(0, { startsExpr: V }),
			keyof: H(0, { startsExpr: V }),
			readonly: H(0, { startsExpr: V }),
			unique: H(0, { startsExpr: V }),
			abstract: H(0, { startsExpr: V }),
			declare: H(0, { startsExpr: V }),
			enum: H(0, { startsExpr: V }),
			module: H(0, { startsExpr: V }),
			namespace: H(0, { startsExpr: V }),
			interface: H(0, { startsExpr: V }),
			type: H(0, { startsExpr: V })
		}, r = {
			at: new x("@"),
			jsxName: new x("jsxName"),
			jsxText: new x("jsxText", { beforeExpr: !0 }),
			jsxTagStart: new x("jsxTagStart", { startsExpr: !0 }),
			jsxTagEnd: new x("jsxTagEnd")
		}, i = {
			tc_oTag: new P("<tag", !1, !1),
			tc_cTag: new P("</tag", !1, !1),
			tc_expr: new P("<tag>...</tag>", !0, !0)
		}, a = RegExp("^(?:" + Object.keys(n).join("|") + ")$");
		r.jsxTagStart.updateContext = function() {
			this.context.push(i.tc_expr), this.context.push(i.tc_oTag), this.exprAllowed = !1;
		}, r.jsxTagEnd.updateContext = function(e) {
			var t = this.context.pop();
			t === i.tc_oTag && e === E.slash || t === i.tc_cTag ? (this.context.pop(), this.exprAllowed = this.curContext() === i.tc_expr) : this.exprAllowed = !0;
		}, t = {
			tokTypes: an({}, n, r),
			tokContexts: an({}, i),
			keywordsRegExp: a,
			tokenIsLiteralPropertyName: function(e) {
				return [
					E.name,
					E.string,
					E.num
				].concat(Object.values(re), Object.values(n)).includes(e);
			},
			tokenIsKeywordOrIdentifier: function(e) {
				return [E.name].concat(Object.values(re), Object.values(n)).includes(e);
			},
			tokenIsIdentifier: function(e) {
				return [].concat(Object.values(n), [E.name]).includes(e);
			},
			tokenIsTSDeclarationStart: function(e) {
				return [
					n.abstract,
					n.declare,
					n.enum,
					n.module,
					n.namespace,
					n.interface,
					n.type
				].includes(e);
			},
			tokenIsTSTypeOperator: function(e) {
				return [
					n.keyof,
					n.readonly,
					n.unique
				].includes(e);
			},
			tokenIsTemplate: function(e) {
				return e === E.invalidTemplate;
			}
		};
	}
	return t;
}
var fn = 1024, pn = RegExp("(?=(" + (/* @__PURE__ */ RegExp("(?:[^\\S\\n\\r\\u2028\\u2029]|\\/\\/.*|\\/\\*.*?\\*\\/)*", "y")).source + "))\\1(?=[\\n\\r\\u2028\\u2029]|\\/\\*(?!.*?\\*\\/)|$)", "y"), mn = function() {
	this.shorthandAssign = void 0, this.trailingComma = void 0, this.parenthesizedAssign = void 0, this.parenthesizedBind = void 0, this.doubleProto = void 0, this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
function hn(e, t) {
	var n = t.key.name, r = e[n], i = "true";
	return t.type !== "MethodDefinition" || t.kind !== "get" && t.kind !== "set" || (i = (t.static ? "s" : "i") + t.kind), r === "iget" && i === "iset" || r === "iset" && i === "iget" || r === "sget" && i === "sset" || r === "sset" && i === "sget" ? (e[n] = "true", !1) : !!r || (e[n] = i, !1);
}
function gn(e, t) {
	var n = e.key;
	return !e.computed && (n.type === "Identifier" && n.name === t || n.type === "Literal" && n.value === t);
}
var U = {
	AbstractMethodHasImplementation: function(e) {
		return "Method '" + e.methodName + "' cannot have an implementation because it is marked abstract.";
	},
	AbstractPropertyHasInitializer: function(e) {
		return "Property '" + e.propertyName + "' cannot have an initializer because it is marked abstract.";
	},
	AccesorCannotDeclareThisParameter: "'get' and 'set' accessors cannot declare 'this' parameters.",
	AccesorCannotHaveTypeParameters: "An accessor cannot have type parameters.",
	CannotFindName: function(e) {
		return "Cannot find name '" + e.name + "'.";
	},
	ClassMethodHasDeclare: "Class methods cannot have the 'declare' modifier.",
	ClassMethodHasReadonly: "Class methods cannot have the 'readonly' modifier.",
	ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference: "A 'const' initializer in an ambient context must be a string or numeric literal or literal enum reference.",
	ConstructorHasTypeParameters: "Type parameters cannot appear on a constructor declaration.",
	DeclareAccessor: function(e) {
		return "'declare' is not allowed in " + e.kind + "ters.";
	},
	DeclareClassFieldHasInitializer: "Initializers are not allowed in ambient contexts.",
	DeclareFunctionHasImplementation: "An implementation cannot be declared in ambient contexts.",
	DuplicateAccessibilityModifier: function() {
		return "Accessibility modifier already seen.";
	},
	DuplicateModifier: function(e) {
		return "Duplicate modifier: '" + e.modifier + "'.";
	},
	EmptyHeritageClauseType: function(e) {
		return "'" + e.token + "' list cannot be empty.";
	},
	EmptyTypeArguments: "Type argument list cannot be empty.",
	EmptyTypeParameters: "Type parameter list cannot be empty.",
	ExpectedAmbientAfterExportDeclare: "'export declare' must be followed by an ambient declaration.",
	ImportAliasHasImportType: "An import alias can not use 'import type'.",
	IncompatibleModifiers: function(e) {
		var t = e.modifiers;
		return "'" + t[0] + "' modifier cannot be used with '" + t[1] + "' modifier.";
	},
	IndexSignatureHasAbstract: "Index signatures cannot have the 'abstract' modifier.",
	IndexSignatureHasAccessibility: function(e) {
		return "Index signatures cannot have an accessibility modifier ('" + e.modifier + "').";
	},
	IndexSignatureHasDeclare: "Index signatures cannot have the 'declare' modifier.",
	IndexSignatureHasOverride: "'override' modifier cannot appear on an index signature.",
	IndexSignatureHasStatic: "Index signatures cannot have the 'static' modifier.",
	InitializerNotAllowedInAmbientContext: "Initializers are not allowed in ambient contexts.",
	InvalidModifierOnTypeMember: function(e) {
		return "'" + e.modifier + "' modifier cannot appear on a type member.";
	},
	InvalidModifierOnTypeParameter: function(e) {
		return "'" + e.modifier + "' modifier cannot appear on a type parameter.";
	},
	InvalidModifierOnTypeParameterPositions: function(e) {
		return "'" + e.modifier + "' modifier can only appear on a type parameter of a class, interface or type alias.";
	},
	InvalidModifiersOrder: function(e) {
		var t = e.orderedModifiers;
		return "'" + t[0] + "' modifier must precede '" + t[1] + "' modifier.";
	},
	InvalidPropertyAccessAfterInstantiationExpression: "Invalid property access after an instantiation expression. You can either wrap the instantiation expression in parentheses, or delete the type arguments.",
	InvalidTupleMemberLabel: "Tuple members must be labeled with a simple identifier.",
	MissingInterfaceName: "'interface' declarations must be followed by an identifier.",
	MixedLabeledAndUnlabeledElements: "Tuple members must all have names or all not have names.",
	NonAbstractClassHasAbstractMethod: "Abstract methods can only appear within an abstract class.",
	NonClassMethodPropertyHasAbstractModifer: "'abstract' modifier can only appear on a class, method, or property declaration.",
	OptionalTypeBeforeRequired: "A required element cannot follow an optional element.",
	OverrideNotInSubClass: "This member cannot have an 'override' modifier because its containing class does not extend another class.",
	PatternIsOptional: "A binding pattern parameter cannot be optional in an implementation signature.",
	PrivateElementHasAbstract: "Private elements cannot have the 'abstract' modifier.",
	PrivateElementHasAccessibility: function(e) {
		return "Private elements cannot have an accessibility modifier ('" + e.modifier + "').";
	},
	PrivateMethodsHasAccessibility: function(e) {
		return "Private methods cannot have an accessibility modifier ('" + e.modifier + "').";
	},
	ReadonlyForMethodSignature: "'readonly' modifier can only appear on a property declaration or index signature.",
	ReservedArrowTypeParam: "This syntax is reserved in files with the .mts or .cts extension. Add a trailing comma, as in `<T,>() => ...`.",
	ReservedTypeAssertion: "This syntax is reserved in files with the .mts or .cts extension. Use an `as` expression instead.",
	SetAccesorCannotHaveOptionalParameter: "A 'set' accessor cannot have an optional parameter.",
	SetAccesorCannotHaveRestParameter: "A 'set' accessor cannot have rest parameter.",
	SetAccesorCannotHaveReturnType: "A 'set' accessor cannot have a return type annotation.",
	SingleTypeParameterWithoutTrailingComma: function(e) {
		var t = e.typeParameterName;
		return "Single type parameter " + t + " should have a trailing comma. Example usage: <" + t + ",>.";
	},
	StaticBlockCannotHaveModifier: "Static class blocks cannot have any modifier.",
	TypeAnnotationAfterAssign: "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`.",
	TypeImportCannotSpecifyDefaultAndNamed: "A type-only import can specify a default import or named bindings, but not both.",
	TypeModifierIsUsedInTypeExports: "The 'type' modifier cannot be used on a named export when 'export type' is used on its export statement.",
	TypeModifierIsUsedInTypeImports: "The 'type' modifier cannot be used on a named import when 'import type' is used on its import statement.",
	UnexpectedParameterModifier: "A parameter property is only allowed in a constructor implementation.",
	UnexpectedReadonly: "'readonly' type modifier is only permitted on array and tuple literal types.",
	GenericsEndWithComma: "Trailing comma is not allowed at the end of generics.",
	UnexpectedTypeAnnotation: "Did not expect a type annotation here.",
	UnexpectedTypeCastInParameter: "Unexpected type cast in parameter position.",
	UnsupportedImportTypeArgument: "Argument in a type import must be a string literal.",
	UnsupportedParameterPropertyKind: "A parameter property may not be declared using a binding pattern.",
	UnsupportedSignatureParameterKind: function(e) {
		return "Name in a signature must be an Identifier, ObjectPattern or ArrayPattern, instead got " + e.type + ".";
	},
	LetInLexicalBinding: "'let' is not allowed to be used as a name in 'let' or 'const' declarations."
}, _n = {
	quot: "\"",
	amp: "&",
	apos: "'",
	lt: "<",
	gt: ">",
	nbsp: "\xA0",
	iexcl: "¡",
	cent: "¢",
	pound: "£",
	curren: "¤",
	yen: "¥",
	brvbar: "¦",
	sect: "§",
	uml: "¨",
	copy: "©",
	ordf: "ª",
	laquo: "«",
	not: "¬",
	shy: "­",
	reg: "®",
	macr: "¯",
	deg: "°",
	plusmn: "±",
	sup2: "²",
	sup3: "³",
	acute: "´",
	micro: "µ",
	para: "¶",
	middot: "·",
	cedil: "¸",
	sup1: "¹",
	ordm: "º",
	raquo: "»",
	frac14: "¼",
	frac12: "½",
	frac34: "¾",
	iquest: "¿",
	Agrave: "À",
	Aacute: "Á",
	Acirc: "Â",
	Atilde: "Ã",
	Auml: "Ä",
	Aring: "Å",
	AElig: "Æ",
	Ccedil: "Ç",
	Egrave: "È",
	Eacute: "É",
	Ecirc: "Ê",
	Euml: "Ë",
	Igrave: "Ì",
	Iacute: "Í",
	Icirc: "Î",
	Iuml: "Ï",
	ETH: "Ð",
	Ntilde: "Ñ",
	Ograve: "Ò",
	Oacute: "Ó",
	Ocirc: "Ô",
	Otilde: "Õ",
	Ouml: "Ö",
	times: "×",
	Oslash: "Ø",
	Ugrave: "Ù",
	Uacute: "Ú",
	Ucirc: "Û",
	Uuml: "Ü",
	Yacute: "Ý",
	THORN: "Þ",
	szlig: "ß",
	agrave: "à",
	aacute: "á",
	acirc: "â",
	atilde: "ã",
	auml: "ä",
	aring: "å",
	aelig: "æ",
	ccedil: "ç",
	egrave: "è",
	eacute: "é",
	ecirc: "ê",
	euml: "ë",
	igrave: "ì",
	iacute: "í",
	icirc: "î",
	iuml: "ï",
	eth: "ð",
	ntilde: "ñ",
	ograve: "ò",
	oacute: "ó",
	ocirc: "ô",
	otilde: "õ",
	ouml: "ö",
	divide: "÷",
	oslash: "ø",
	ugrave: "ù",
	uacute: "ú",
	ucirc: "û",
	uuml: "ü",
	yacute: "ý",
	thorn: "þ",
	yuml: "ÿ",
	OElig: "Œ",
	oelig: "œ",
	Scaron: "Š",
	scaron: "š",
	Yuml: "Ÿ",
	fnof: "ƒ",
	circ: "ˆ",
	tilde: "˜",
	Alpha: "Α",
	Beta: "Β",
	Gamma: "Γ",
	Delta: "Δ",
	Epsilon: "Ε",
	Zeta: "Ζ",
	Eta: "Η",
	Theta: "Θ",
	Iota: "Ι",
	Kappa: "Κ",
	Lambda: "Λ",
	Mu: "Μ",
	Nu: "Ν",
	Xi: "Ξ",
	Omicron: "Ο",
	Pi: "Π",
	Rho: "Ρ",
	Sigma: "Σ",
	Tau: "Τ",
	Upsilon: "Υ",
	Phi: "Φ",
	Chi: "Χ",
	Psi: "Ψ",
	Omega: "Ω",
	alpha: "α",
	beta: "β",
	gamma: "γ",
	delta: "δ",
	epsilon: "ε",
	zeta: "ζ",
	eta: "η",
	theta: "θ",
	iota: "ι",
	kappa: "κ",
	lambda: "λ",
	mu: "μ",
	nu: "ν",
	xi: "ξ",
	omicron: "ο",
	pi: "π",
	rho: "ρ",
	sigmaf: "ς",
	sigma: "σ",
	tau: "τ",
	upsilon: "υ",
	phi: "φ",
	chi: "χ",
	psi: "ψ",
	omega: "ω",
	thetasym: "ϑ",
	upsih: "ϒ",
	piv: "ϖ",
	ensp: " ",
	emsp: " ",
	thinsp: " ",
	zwnj: "‌",
	zwj: "‍",
	lrm: "‎",
	rlm: "‏",
	ndash: "–",
	mdash: "—",
	lsquo: "‘",
	rsquo: "’",
	sbquo: "‚",
	ldquo: "“",
	rdquo: "”",
	bdquo: "„",
	dagger: "†",
	Dagger: "‡",
	bull: "•",
	hellip: "…",
	permil: "‰",
	prime: "′",
	Prime: "″",
	lsaquo: "‹",
	rsaquo: "›",
	oline: "‾",
	frasl: "⁄",
	euro: "€",
	image: "ℑ",
	weierp: "℘",
	real: "ℜ",
	trade: "™",
	alefsym: "ℵ",
	larr: "←",
	uarr: "↑",
	rarr: "→",
	darr: "↓",
	harr: "↔",
	crarr: "↵",
	lArr: "⇐",
	uArr: "⇑",
	rArr: "⇒",
	dArr: "⇓",
	hArr: "⇔",
	forall: "∀",
	part: "∂",
	exist: "∃",
	empty: "∅",
	nabla: "∇",
	isin: "∈",
	notin: "∉",
	ni: "∋",
	prod: "∏",
	sum: "∑",
	minus: "−",
	lowast: "∗",
	radic: "√",
	prop: "∝",
	infin: "∞",
	ang: "∠",
	and: "∧",
	or: "∨",
	cap: "∩",
	cup: "∪",
	int: "∫",
	there4: "∴",
	sim: "∼",
	cong: "≅",
	asymp: "≈",
	ne: "≠",
	equiv: "≡",
	le: "≤",
	ge: "≥",
	sub: "⊂",
	sup: "⊃",
	nsub: "⊄",
	sube: "⊆",
	supe: "⊇",
	oplus: "⊕",
	otimes: "⊗",
	perp: "⊥",
	sdot: "⋅",
	lceil: "⌈",
	rceil: "⌉",
	lfloor: "⌊",
	rfloor: "⌋",
	lang: "〈",
	rang: "〉",
	loz: "◊",
	spades: "♠",
	clubs: "♣",
	hearts: "♥",
	diams: "♦"
}, vn = /^[\da-fA-F]+$/, yn = /^\d+$/;
function bn(e) {
	return e && (e.type === "JSXIdentifier" ? e.name : e.type === "JSXNamespacedName" ? e.namespace.name + ":" + e.name.name : e.type === "JSXMemberExpression" ? bn(e.object) + "." + bn(e.property) : void 0);
}
var xn = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
function Sn(e) {
	if (!e) throw Error("Assert fail");
}
function Cn(e) {
	return e === "accessor";
}
function wn(e) {
	return e === "in" || e === "out";
}
function Tn(e, t) {
	return 2 | (e ? 4 : 0) | (t ? 8 : 0);
}
function En(e) {
	if (e.type !== "MemberExpression") return !1;
	var t = e.property;
	return (!e.computed || !(t.type !== "TemplateLiteral" || t.expressions.length > 0)) && Dn(e.object);
}
function Dn(e) {
	return e.type === "Identifier" || e.type === "MemberExpression" && !e.computed && Dn(e.object);
}
function On(e) {
	return e === "private" || e === "public" || e === "protected";
}
function kn(e) {
	var t = e || {}, n = t.dts, r = n !== void 0 && n, i = t.allowSatisfies, a = i !== void 0 && i;
	return function(t) {
		var n = t.acorn || u, i = dn(n), o = n.tokTypes, s = n.keywordTypes, c = n.isIdentifierStart, l = n.lineBreak, d = n.isNewLine, f = n.tokContexts, p = n.isIdentifierChar, m = i.tokTypes, h = i.tokContexts, g = i.keywordsRegExp, _ = i.tokenIsLiteralPropertyName, ee = i.tokenIsTemplate, te = i.tokenIsTSDeclarationStart, v = i.tokenIsIdentifier, ne = i.tokenIsKeywordOrIdentifier, y = i.tokenIsTSTypeOperator;
		function b(e, t, n) {
			n === void 0 && (n = e.length);
			for (var r = t; r < n; r++) {
				var i = e.charCodeAt(r);
				if (d(i)) return r < n - 1 && i === 13 && e.charCodeAt(r + 1) === 10 ? r + 2 : r + 1;
			}
			return -1;
		}
		return t = function(e, t, n) {
			var r = n.tokTypes, i = t.tokTypes;
			/*#__PURE__*/ return function(e) {
				function t() {
					return e.apply(this, arguments) || this;
				}
				on(t, e);
				var n = t.prototype;
				return n.takeDecorators = function(e) {
					var t = this.decoratorStack[this.decoratorStack.length - 1];
					t.length && (e.decorators = t, this.resetStartLocationFromNode(e, t[0]), this.decoratorStack[this.decoratorStack.length - 1] = []);
				}, n.parseDecorators = function(e) {
					for (var t = this.decoratorStack[this.decoratorStack.length - 1]; this.match(i.at);) {
						var n = this.parseDecorator();
						t.push(n);
					}
					this.match(r._export) ? e || this.unexpected() : this.canHaveLeadingDecorator() || this.raise(this.start, "Leading decorators must be attached to a class declaration.");
				}, n.parseDecorator = function() {
					var e = this.startNode();
					this.next(), this.decoratorStack.push([]);
					var t, n = this.start, i = this.startLoc;
					if (this.match(r.parenL)) {
						var a = this.start, o = this.startLoc;
						if (this.next(), t = this.parseExpression(), this.expect(r.parenR), this.options.preserveParens) {
							var s = this.startNodeAt(a, o);
							s.expression = t, t = this.finishNode(s, "ParenthesizedExpression");
						}
					} else for (t = this.parseIdent(!1); this.eat(r.dot);) {
						var c = this.startNodeAt(n, i);
						c.object = t, c.property = this.parseIdent(!0), c.computed = !1, t = this.finishNode(c, "MemberExpression");
					}
					return e.expression = this.parseMaybeDecoratorArguments(t), this.decoratorStack.pop(), this.finishNode(e, "Decorator");
				}, n.parseMaybeDecoratorArguments = function(e) {
					if (this.eat(r.parenL)) {
						var t = this.startNodeAtNode(e);
						return t.callee = e, t.arguments = this.parseExprList(r.parenR, !1), this.finishNode(t, "CallExpression");
					}
					return e;
				}, t;
			}(e);
		}(t, i, n), t = function(e, t, n, r) {
			var i = e.tokTypes, a = t.tokTypes, o = e.isNewLine, s = e.isIdentifierChar, c = Object.assign({
				allowNamespaces: !0,
				allowNamespacedObjects: !0
			}, r || {});
			/*#__PURE__*/ return function(e) {
				function t() {
					return e.apply(this, arguments) || this;
				}
				on(t, e);
				var n = t.prototype;
				return n.jsx_readToken = function() {
					for (var e = "", t = this.pos;;) {
						this.pos >= this.input.length && this.raise(this.start, "Unterminated JSX contents");
						var n = this.input.charCodeAt(this.pos);
						switch (n) {
							case 60:
							case 123: return this.pos === this.start ? n === 60 && this.exprAllowed ? (++this.pos, this.finishToken(a.jsxTagStart)) : this.getTokenFromCode(n) : (e += this.input.slice(t, this.pos), this.finishToken(a.jsxText, e));
							case 38:
								e += this.input.slice(t, this.pos), e += this.jsx_readEntity(), t = this.pos;
								break;
							case 62:
							case 125: this.raise(this.pos, "Unexpected token `" + this.input[this.pos] + "`. Did you mean `" + (n === 62 ? "&gt;" : "&rbrace;") + "` or `{\"" + this.input[this.pos] + "\"}`?");
							default: o(n) ? (e += this.input.slice(t, this.pos), e += this.jsx_readNewLine(!0), t = this.pos) : ++this.pos;
						}
					}
				}, n.jsx_readNewLine = function(e) {
					var t, n = this.input.charCodeAt(this.pos);
					return ++this.pos, n === 13 && this.input.charCodeAt(this.pos) === 10 ? (++this.pos, t = e ? "\n" : "\r\n") : t = String.fromCharCode(n), this.options.locations && (++this.curLine, this.lineStart = this.pos), t;
				}, n.jsx_readString = function(e) {
					for (var t = "", n = ++this.pos;;) {
						this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
						var r = this.input.charCodeAt(this.pos);
						if (r === e) break;
						r === 38 ? (t += this.input.slice(n, this.pos), t += this.jsx_readEntity(), n = this.pos) : o(r) ? (t += this.input.slice(n, this.pos), t += this.jsx_readNewLine(!1), n = this.pos) : ++this.pos;
					}
					return t += this.input.slice(n, this.pos++), this.finishToken(i.string, t);
				}, n.jsx_readEntity = function() {
					var e, t = "", n = 0, r = this.input[this.pos];
					r !== "&" && this.raise(this.pos, "Entity must start with an ampersand");
					for (var i = ++this.pos; this.pos < this.input.length && n++ < 10;) {
						if ((r = this.input[this.pos++]) === ";") {
							t[0] === "#" ? t[1] === "x" ? (t = t.substr(2), vn.test(t) && (e = String.fromCharCode(parseInt(t, 16)))) : (t = t.substr(1), yn.test(t) && (e = String.fromCharCode(parseInt(t, 10)))) : e = _n[t];
							break;
						}
						t += r;
					}
					return e || (this.pos = i, "&");
				}, n.jsx_readWord = function() {
					var e, t = this.pos;
					do
						e = this.input.charCodeAt(++this.pos);
					while (s(e) || e === 45);
					return this.finishToken(a.jsxName, this.input.slice(t, this.pos));
				}, n.jsx_parseIdentifier = function() {
					var e = this.startNode();
					return this.type === a.jsxName ? e.name = this.value : this.type.keyword ? e.name = this.type.keyword : this.unexpected(), this.next(), this.finishNode(e, "JSXIdentifier");
				}, n.jsx_parseNamespacedName = function() {
					var e = this.start, t = this.startLoc, n = this.jsx_parseIdentifier();
					if (!c.allowNamespaces || !this.eat(i.colon)) return n;
					var r = this.startNodeAt(e, t);
					return r.namespace = n, r.name = this.jsx_parseIdentifier(), this.finishNode(r, "JSXNamespacedName");
				}, n.jsx_parseElementName = function() {
					if (this.type === a.jsxTagEnd) return "";
					var e = this.start, t = this.startLoc, n = this.jsx_parseNamespacedName();
					for (this.type !== i.dot || n.type !== "JSXNamespacedName" || c.allowNamespacedObjects || this.unexpected(); this.eat(i.dot);) {
						var r = this.startNodeAt(e, t);
						r.object = n, r.property = this.jsx_parseIdentifier(), n = this.finishNode(r, "JSXMemberExpression");
					}
					return n;
				}, n.jsx_parseAttributeValue = function() {
					switch (this.type) {
						case i.braceL:
							var e = this.jsx_parseExpressionContainer();
							return e.expression.type === "JSXEmptyExpression" && this.raise(e.start, "JSX attributes must only be assigned a non-empty expression"), e;
						case a.jsxTagStart:
						case i.string: return this.parseExprAtom();
						default: this.raise(this.start, "JSX value should be either an expression or a quoted JSX text");
					}
				}, n.jsx_parseEmptyExpression = function() {
					var e = this.startNodeAt(this.lastTokEnd, this.lastTokEndLoc);
					return this.finishNodeAt(e, "JSXEmptyExpression", this.start, this.startLoc);
				}, n.jsx_parseExpressionContainer = function() {
					var e = this.startNode();
					return this.next(), e.expression = this.type === i.braceR ? this.jsx_parseEmptyExpression() : this.parseExpression(), this.expect(i.braceR), this.finishNode(e, "JSXExpressionContainer");
				}, n.jsx_parseAttribute = function() {
					var e = this.startNode();
					return this.eat(i.braceL) ? (this.expect(i.ellipsis), e.argument = this.parseMaybeAssign(), this.expect(i.braceR), this.finishNode(e, "JSXSpreadAttribute")) : (e.name = this.jsx_parseNamespacedName(), e.value = this.eat(i.eq) ? this.jsx_parseAttributeValue() : null, this.finishNode(e, "JSXAttribute"));
				}, n.jsx_parseOpeningElementAt = function(e, t) {
					var n = this.startNodeAt(e, t);
					n.attributes = [];
					var r = this.jsx_parseElementName();
					for (r && (n.name = r); this.type !== i.slash && this.type !== a.jsxTagEnd;) n.attributes.push(this.jsx_parseAttribute());
					return n.selfClosing = this.eat(i.slash), this.expect(a.jsxTagEnd), this.finishNode(n, r ? "JSXOpeningElement" : "JSXOpeningFragment");
				}, n.jsx_parseClosingElementAt = function(e, t) {
					var n = this.startNodeAt(e, t), r = this.jsx_parseElementName();
					return r && (n.name = r), this.expect(a.jsxTagEnd), this.finishNode(n, r ? "JSXClosingElement" : "JSXClosingFragment");
				}, n.jsx_parseElementAt = function(e, t) {
					var n = this.startNodeAt(e, t), r = [], o = this.jsx_parseOpeningElementAt(e, t), s = null;
					if (!o.selfClosing) {
						t: for (;;) switch (this.type) {
							case a.jsxTagStart:
								if (e = this.start, t = this.startLoc, this.next(), this.eat(i.slash)) {
									s = this.jsx_parseClosingElementAt(e, t);
									break t;
								}
								r.push(this.jsx_parseElementAt(e, t));
								break;
							case a.jsxText:
								r.push(this.parseExprAtom());
								break;
							case i.braceL:
								r.push(this.jsx_parseExpressionContainer());
								break;
							default: this.unexpected();
						}
						bn(s.name) !== bn(o.name) && this.raise(s.start, "Expected corresponding JSX closing tag for <" + bn(o.name) + ">");
					}
					var c = o.name ? "Element" : "Fragment";
					return n["opening" + c] = o, n["closing" + c] = s, n.children = r, this.type === i.relational && this.value === "<" && this.raise(this.start, "Adjacent JSX elements must be wrapped in an enclosing tag"), this.finishNode(n, "JSX" + c);
				}, n.jsx_parseText = function() {
					var e = this.parseLiteral(this.value);
					return e.type = "JSXText", e;
				}, n.jsx_parseElement = function() {
					var e = this.start, t = this.startLoc;
					return this.next(), this.jsx_parseElementAt(e, t);
				}, t;
			}(n);
		}(n, i, t, e?.jsx), t = function(e, t, n) {
			var r = t.tokTypes, i = n.tokTypes;
			/*#__PURE__*/ return function(e) {
				function t() {
					return e.apply(this, arguments) || this;
				}
				on(t, e);
				var n = t.prototype;
				return n.parseMaybeImportAttributes = function(e) {
					if (this.type === i._with || this.type === r.assert) {
						this.next();
						var t = this.parseImportAttributes();
						t && (e.attributes = t);
					}
				}, n.parseImportAttributes = function() {
					this.expect(i.braceL);
					var e = this.parseWithEntries();
					return this.expect(i.braceR), e;
				}, n.parseWithEntries = function() {
					var e = [], t = /* @__PURE__ */ new Set();
					do {
						if (this.type === i.braceR) break;
						var n, r = this.startNode();
						n = this.type === i.string ? this.parseLiteral(this.value) : this.parseIdent(!0), this.next(), r.key = n, t.has(r.key.name) && this.raise(this.pos, "Duplicated key in attributes"), t.add(r.key.name), this.type !== i.string && this.raise(this.pos, "Only string is supported as an attribute value"), r.value = this.parseLiteral(this.value), e.push(this.finishNode(r, "ImportAttribute"));
					} while (this.eat(i.comma));
					return e;
				}, t;
			}(e);
		}(t, i, n), /* @__PURE__ */ function(e) {
			function t(t, n, r) {
				var i;
				return (i = e.call(this, t, n, r) || this).preValue = null, i.preToken = null, i.isLookahead = !1, i.isAmbientContext = !1, i.inAbstractClass = !1, i.inType = !1, i.inDisallowConditionalTypesContext = !1, i.maybeInArrowParameters = !1, i.shouldParseArrowReturnType = void 0, i.shouldParseAsyncArrowReturnType = void 0, i.decoratorStack = [[]], i.importsStack = [[]], i.importOrExportOuterKind = void 0, i.tsParseConstModifier = i.tsParseModifiers.bind(function(e) {
					if (e === void 0) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
					return e;
				}(i), {
					allowedModifiers: ["const"],
					disallowedModifiers: ["in", "out"],
					errorTemplate: U.InvalidModifierOnTypeParameterPositions
				}), i;
			}
			on(t, e);
			var u, x, S, C = t.prototype;
			return C.getTokenFromCodeInType = function(t) {
				return t === 62 || t === 60 ? this.finishOp(o.relational, 1) : e.prototype.getTokenFromCode.call(this, t);
			}, C.readToken = function(t) {
				if (!this.inType) {
					var n = this.curContext();
					if (n === h.tc_expr) return this.jsx_readToken();
					if (n === h.tc_oTag || n === h.tc_cTag) {
						if (c(t)) return this.jsx_readWord();
						if (t == 62) return ++this.pos, this.finishToken(m.jsxTagEnd);
						if ((t === 34 || t === 39) && n == h.tc_oTag) return this.jsx_readString(t);
					}
					if (t === 60 && this.exprAllowed && this.input.charCodeAt(this.pos + 1) !== 33) return ++this.pos, this.finishToken(m.jsxTagStart);
				}
				return e.prototype.readToken.call(this, t);
			}, C.getTokenFromCode = function(t) {
				return this.inType ? this.getTokenFromCodeInType(t) : t === 64 ? (++this.pos, this.finishToken(m.at)) : e.prototype.getTokenFromCode.call(this, t);
			}, C.isAbstractClass = function() {
				return this.ts_isContextual(m.abstract) && this.lookahead().type === o._class;
			}, C.finishNode = function(t, n) {
				return t.type !== "" && t.end !== 0 ? t : e.prototype.finishNode.call(this, t, n);
			}, C.tryParse = function(e, t) {
				t === void 0 && (t = this.cloneCurLookaheadState());
				var n = { node: null };
				try {
					return {
						node: e(function(e) {
							throw e === void 0 && (e = null), n.node = e, n;
						}),
						error: null,
						thrown: !1,
						aborted: !1,
						failState: null
					};
				} catch (e) {
					var r = this.getCurLookaheadState();
					if (this.setLookaheadState(t), e instanceof SyntaxError) return {
						node: null,
						error: e,
						thrown: !0,
						aborted: !1,
						failState: r
					};
					if (e === n) return {
						node: n.node,
						error: null,
						thrown: !1,
						aborted: !0,
						failState: r
					};
					throw e;
				}
			}, C.setOptionalParametersError = function(e, t) {
				e.optionalParametersLoc = t?.loc ?? this.startLoc;
			}, C.reScan_lt_gt = function() {
				this.type === o.relational && (--this.pos, this.readToken_lt_gt(this.fullCharCodeAtPos()));
			}, C.reScan_lt = function() {
				var e = this.type;
				return e === o.bitShift ? (this.pos -= 2, this.finishOp(o.relational, 1), o.relational) : e;
			}, C.resetEndLocation = function(e, t) {
				t === void 0 && (t = this.lastTokEndLoc), e.end = t.column, e.loc.end = t, this.options.ranges && (e.range[1] = t.column);
			}, C.startNodeAtNode = function(t) {
				return e.prototype.startNodeAt.call(this, t.start, t.loc.start);
			}, C.nextTokenStart = function() {
				return this.nextTokenStartSince(this.pos);
			}, C.tsHasSomeModifiers = function(e, t) {
				return t.some(function(t) {
					return On(t) ? e.accessibility === t : !!e[t];
				});
			}, C.tsIsStartOfStaticBlocks = function() {
				return this.isContextual("static") && this.lookaheadCharCode() === 123;
			}, C.tsCheckForInvalidTypeCasts = function(e) {
				var t = this;
				e.forEach(function(e) {
					e?.type === "TSTypeCastExpression" && t.raise(e.typeAnnotation.start, U.UnexpectedTypeAnnotation);
				});
			}, C.atPossibleAsyncArrow = function(e) {
				return e.type === "Identifier" && e.name === "async" && this.lastTokEndLoc.column === e.end && !this.canInsertSemicolon() && e.end - e.start == 5 && e.start === this.potentialArrowAt;
			}, C.tsIsIdentifier = function() {
				return v(this.type);
			}, C.tsTryParseTypeOrTypePredicateAnnotation = function() {
				return this.match(o.colon) ? this.tsParseTypeOrTypePredicateAnnotation(o.colon) : void 0;
			}, C.tsTryParseGenericAsyncArrowFunction = function(t, n, r) {
				var i = this;
				if (this.tsMatchLeftRelational()) {
					var a = this.maybeInArrowParameters;
					this.maybeInArrowParameters = !0;
					var s = this.tsTryParseAndCatch(function() {
						var r = i.startNodeAt(t, n);
						return r.typeParameters = i.tsParseTypeParameters(), e.prototype.parseFunctionParams.call(i, r), r.returnType = i.tsTryParseTypeOrTypePredicateAnnotation(), i.expect(o.arrow), r;
					});
					if (this.maybeInArrowParameters = a, s) return e.prototype.parseArrowExpression.call(this, s, null, !0, r);
				}
			}, C.tsParseTypeArgumentsInExpression = function() {
				if (this.reScan_lt() === o.relational) return this.tsParseTypeArguments();
			}, C.tsInNoContext = function(e) {
				var t = this.context;
				this.context = [t[0]];
				try {
					return e();
				} finally {
					this.context = t;
				}
			}, C.tsTryParseTypeAnnotation = function() {
				return this.match(o.colon) ? this.tsParseTypeAnnotation() : void 0;
			}, C.isUnparsedContextual = function(e, t) {
				var n = e + t.length;
				if (this.input.slice(e, n) === t) {
					var r = this.input.charCodeAt(n);
					return !(p(r) || (64512 & r) == 55296);
				}
				return !1;
			}, C.isAbstractConstructorSignature = function() {
				return this.ts_isContextual(m.abstract) && this.lookahead().type === o._new;
			}, C.nextTokenStartSince = function(e) {
				return xn.lastIndex = e, xn.test(this.input) ? xn.lastIndex : e;
			}, C.lookaheadCharCode = function() {
				return this.input.charCodeAt(this.nextTokenStart());
			}, C.compareLookaheadState = function(e, t) {
				for (var n = 0, r = Object.keys(e); n < r.length; n++) {
					var i = r[n];
					if (e[i] !== t[i]) return !1;
				}
				return !0;
			}, C.createLookaheadState = function() {
				this.value = null, this.context = [this.curContext()];
			}, C.getCurLookaheadState = function() {
				return {
					endLoc: this.endLoc,
					lastTokEnd: this.lastTokEnd,
					lastTokStart: this.lastTokStart,
					lastTokStartLoc: this.lastTokStartLoc,
					pos: this.pos,
					value: this.value,
					type: this.type,
					start: this.start,
					end: this.end,
					context: this.context,
					startLoc: this.startLoc,
					lastTokEndLoc: this.lastTokEndLoc,
					curLine: this.curLine,
					lineStart: this.lineStart,
					curPosition: this.curPosition,
					containsEsc: this.containsEsc
				};
			}, C.cloneCurLookaheadState = function() {
				return {
					pos: this.pos,
					value: this.value,
					type: this.type,
					start: this.start,
					end: this.end,
					context: this.context && this.context.slice(),
					startLoc: this.startLoc,
					lastTokEndLoc: this.lastTokEndLoc,
					endLoc: this.endLoc,
					lastTokEnd: this.lastTokEnd,
					lastTokStart: this.lastTokStart,
					lastTokStartLoc: this.lastTokStartLoc,
					curLine: this.curLine,
					lineStart: this.lineStart,
					curPosition: this.curPosition,
					containsEsc: this.containsEsc
				};
			}, C.setLookaheadState = function(e) {
				this.pos = e.pos, this.value = e.value, this.endLoc = e.endLoc, this.lastTokEnd = e.lastTokEnd, this.lastTokStart = e.lastTokStart, this.lastTokStartLoc = e.lastTokStartLoc, this.type = e.type, this.start = e.start, this.end = e.end, this.context = e.context, this.startLoc = e.startLoc, this.lastTokEndLoc = e.lastTokEndLoc, this.curLine = e.curLine, this.lineStart = e.lineStart, this.curPosition = e.curPosition, this.containsEsc = e.containsEsc;
			}, C.tsLookAhead = function(e) {
				var t = this.getCurLookaheadState(), n = e();
				return this.setLookaheadState(t), n;
			}, C.lookahead = function(e) {
				var t = this.getCurLookaheadState();
				if (this.createLookaheadState(), this.isLookahead = !0, e !== void 0) for (var n = 0; n < e; n++) this.nextToken();
				else this.nextToken();
				this.isLookahead = !1;
				var r = this.getCurLookaheadState();
				return this.setLookaheadState(t), r;
			}, C.readWord = function() {
				var e = this.readWord1(), t = o.name;
				return this.keywords.test(e) ? t = s[e] : new RegExp(g).test(e) && (t = m[e]), this.finishToken(t, e);
			}, C.skipBlockComment = function() {
				var e;
				this.isLookahead || (e = this.options.onComment && this.curPosition());
				var t = this.pos, n = this.input.indexOf("*/", this.pos += 2);
				if (n === -1 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = n + 2, this.options.locations) for (var r, i = t; (r = b(this.input, i, this.pos)) > -1;) ++this.curLine, i = this.lineStart = r;
				this.isLookahead || this.options.onComment && this.options.onComment(!0, this.input.slice(t + 2, n), t, this.pos, e, this.curPosition());
			}, C.skipLineComment = function(e) {
				var t, n = this.pos;
				this.isLookahead || (t = this.options.onComment && this.curPosition());
				for (var r = this.input.charCodeAt(this.pos += e); this.pos < this.input.length && !d(r);) r = this.input.charCodeAt(++this.pos);
				this.isLookahead || this.options.onComment && this.options.onComment(!1, this.input.slice(n + e, this.pos), n, this.pos, t, this.curPosition());
			}, C.finishToken = function(e, t) {
				this.preValue = this.value, this.preToken = this.type, this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
				var n = this.type;
				this.type = e, this.value = t, this.isLookahead || this.updateContext(n);
			}, C.resetStartLocation = function(e, t, n) {
				e.start = t, e.loc.start = n, this.options.ranges && (e.range[0] = t);
			}, C.isLineTerminator = function() {
				return this.eat(o.semi) || e.prototype.canInsertSemicolon.call(this);
			}, C.hasFollowingLineBreak = function() {
				return pn.lastIndex = this.end, pn.test(this.input);
			}, C.addExtra = function(e, t, n, r) {
				if (r === void 0 && (r = !0), e) {
					var i = e.extra = e.extra || {};
					r ? i[t] = n : Object.defineProperty(i, t, {
						enumerable: r,
						value: n
					});
				}
			}, C.isLiteralPropertyName = function() {
				return _(this.type);
			}, C.hasPrecedingLineBreak = function() {
				return l.test(this.input.slice(this.lastTokEndLoc.index, this.start));
			}, C.createIdentifier = function(e, t) {
				return e.name = t, this.finishNode(e, "Identifier");
			}, C.resetStartLocationFromNode = function(e, t) {
				this.resetStartLocation(e, t.start, t.loc.start);
			}, C.isThisParam = function(e) {
				return e.type === "Identifier" && e.name === "this";
			}, C.isLookaheadContextual = function(e) {
				var t = this.nextTokenStart();
				return this.isUnparsedContextual(t, e);
			}, C.ts_type_isContextual = function(e, t) {
				return e === t && !this.containsEsc;
			}, C.ts_isContextual = function(e) {
				return this.type === e && !this.containsEsc;
			}, C.ts_isContextualWithState = function(e, t) {
				return e.type === t && !e.containsEsc;
			}, C.isContextualWithState = function(e, t) {
				return t.type === o.name && t.value === e && !t.containsEsc;
			}, C.tsIsStartOfMappedType = function() {
				return this.next(), this.eat(o.plusMin) ? this.ts_isContextual(m.readonly) : (this.ts_isContextual(m.readonly) && this.next(), !!this.match(o.bracketL) && (this.next(), !!this.tsIsIdentifier() && (this.next(), this.match(o._in))));
			}, C.tsInDisallowConditionalTypesContext = function(e) {
				var t = this.inDisallowConditionalTypesContext;
				this.inDisallowConditionalTypesContext = !0;
				try {
					return e();
				} finally {
					this.inDisallowConditionalTypesContext = t;
				}
			}, C.tsTryParseType = function() {
				return this.tsEatThenParseType(o.colon);
			}, C.match = function(e) {
				return this.type === e;
			}, C.matchJsx = function(e) {
				return this.type === i.tokTypes[e];
			}, C.ts_eatWithState = function(e, t, n) {
				if (e === n.type) {
					for (var r = 0; r < t; r++) this.next();
					return !0;
				}
				return !1;
			}, C.ts_eatContextualWithState = function(e, t, n) {
				if (g.test(e)) {
					if (this.ts_isContextualWithState(n, m[e])) {
						for (var r = 0; r < t; r++) this.next();
						return !0;
					}
					return !1;
				}
				if (!this.isContextualWithState(e, n)) return !1;
				for (var i = 0; i < t; i++) this.next();
				return !0;
			}, C.canHaveLeadingDecorator = function() {
				return this.match(o._class);
			}, C.eatContextual = function(t) {
				return g.test(t) ? !!this.ts_isContextual(m[t]) && (this.next(), !0) : e.prototype.eatContextual.call(this, t);
			}, C.tsIsExternalModuleReference = function() {
				return this.isContextual("require") && this.lookaheadCharCode() === 40;
			}, C.tsParseExternalModuleReference = function() {
				var e = this.startNode();
				return this.expectContextual("require"), this.expect(o.parenL), this.match(o.string) || this.unexpected(), e.expression = this.parseExprAtom(), this.expect(o.parenR), this.finishNode(e, "TSExternalModuleReference");
			}, C.tsParseEntityName = function(e) {
				e === void 0 && (e = !0);
				for (var t = this.parseIdent(e); this.eat(o.dot);) {
					var n = this.startNodeAtNode(t);
					n.left = t, n.right = this.parseIdent(e), t = this.finishNode(n, "TSQualifiedName");
				}
				return t;
			}, C.tsParseEnumMember = function() {
				var e = this.startNode();
				return e.id = this.match(o.string) ? this.parseLiteral(this.value) : this.parseIdent(!0), this.eat(o.eq) && (e.initializer = this.parseMaybeAssign()), this.finishNode(e, "TSEnumMember");
			}, C.tsParseEnumDeclaration = function(e, t) {
				return t === void 0 && (t = {}), t.const && (e.const = !0), t.declare && (e.declare = !0), this.expectContextual("enum"), e.id = this.parseIdent(), this.checkLValSimple(e.id), this.expect(o.braceL), e.members = this.tsParseDelimitedList("EnumMembers", this.tsParseEnumMember.bind(this)), this.expect(o.braceR), this.finishNode(e, "TSEnumDeclaration");
			}, C.tsParseModuleBlock = function() {
				var t = this.startNode();
				for (e.prototype.enterScope.call(this, 512), this.expect(o.braceL), t.body = []; this.type !== o.braceR;) {
					var n = this.parseStatement(null, !0);
					t.body.push(n);
				}
				return this.next(), e.prototype.exitScope.call(this), this.finishNode(t, "TSModuleBlock");
			}, C.tsParseAmbientExternalModuleDeclaration = function(t) {
				return this.ts_isContextual(m.global) ? (t.global = !0, t.id = this.parseIdent()) : this.match(o.string) ? t.id = this.parseLiteral(this.value) : this.unexpected(), this.match(o.braceL) ? (e.prototype.enterScope.call(this, fn), t.body = this.tsParseModuleBlock(), e.prototype.exitScope.call(this)) : e.prototype.semicolon.call(this), this.finishNode(t, "TSModuleDeclaration");
			}, C.tsTryParseDeclare = function(e) {
				var t = this;
				if (!this.isLineTerminator()) {
					var n, r = this.type;
					return this.isContextual("let") && (r = o._var, n = "let"), this.tsInAmbientContext(function() {
						if (r === o._function) return e.declare = !0, t.parseFunctionStatement(e, !1, !0);
						if (r === o._class) return e.declare = !0, t.parseClass(e, !0);
						if (r === m.enum) return t.tsParseEnumDeclaration(e, { declare: !0 });
						if (r === m.global) return t.tsParseAmbientExternalModuleDeclaration(e);
						if (r === o._const || r === o._var) return t.match(o._const) && t.isLookaheadContextual("enum") ? (t.expect(o._const), t.tsParseEnumDeclaration(e, {
							const: !0,
							declare: !0
						})) : (e.declare = !0, t.parseVarStatement(e, n || t.value, !0));
						if (r === m.interface) {
							var i = t.tsParseInterfaceDeclaration(e, { declare: !0 });
							if (i) return i;
						}
						return v(r) ? t.tsParseDeclaration(e, t.value, !0) : void 0;
					});
				}
			}, C.tsIsListTerminator = function(e) {
				switch (e) {
					case "EnumMembers":
					case "TypeMembers": return this.match(o.braceR);
					case "HeritageClauseElement": return this.match(o.braceL);
					case "TupleElementTypes": return this.match(o.bracketR);
					case "TypeParametersOrArguments": return this.tsMatchRightRelational();
				}
			}, C.tsParseDelimitedListWorker = function(e, t, n, r) {
				for (var i = [], a = -1; !this.tsIsListTerminator(e);) {
					a = -1;
					var s = t();
					if (s == null) return;
					if (i.push(s), !this.eat(o.comma)) {
						if (this.tsIsListTerminator(e)) break;
						n && this.expect(o.comma);
						return;
					}
					a = this.lastTokStart;
				}
				return r && (r.value = a), i;
			}, C.tsParseDelimitedList = function(e, t, n) {
				return function(e) {
					if (e == null) throw Error("Unexpected " + e + " value.");
					return e;
				}(this.tsParseDelimitedListWorker(e, t, !0, n));
			}, C.tsParseBracketedList = function(e, t, n, r, i) {
				r || this.expect(n ? o.bracketL : o.relational);
				var a = this.tsParseDelimitedList(e, t, i);
				return this.expect(n ? o.bracketR : o.relational), a;
			}, C.tsParseTypeParameterName = function() {
				return this.parseIdent().name;
			}, C.tsEatThenParseType = function(e) {
				return this.match(e) ? this.tsNextThenParseType() : void 0;
			}, C.tsExpectThenParseType = function(e) {
				var t = this;
				return this.tsDoThenParseType(function() {
					return t.expect(e);
				});
			}, C.tsNextThenParseType = function() {
				var e = this;
				return this.tsDoThenParseType(function() {
					return e.next();
				});
			}, C.tsDoThenParseType = function(e) {
				var t = this;
				return this.tsInType(function() {
					return e(), t.tsParseType();
				});
			}, C.tsSkipParameterStart = function() {
				if (v(this.type) || this.match(o._this)) return this.next(), !0;
				if (this.match(o.braceL)) try {
					return this.parseObj(!0), !0;
				} catch {
					return !1;
				}
				if (this.match(o.bracketL)) {
					this.next();
					try {
						return this.parseBindingList(o.bracketR, !0, !0), !0;
					} catch {
						return !1;
					}
				}
				return !1;
			}, C.tsIsUnambiguouslyStartOfFunctionType = function() {
				return this.next(), !!(this.match(o.parenR) || this.match(o.ellipsis) || this.tsSkipParameterStart() && (this.match(o.colon) || this.match(o.comma) || this.match(o.question) || this.match(o.eq) || this.match(o.parenR) && (this.next(), this.match(o.arrow))));
			}, C.tsIsStartOfFunctionType = function() {
				return !!this.tsMatchLeftRelational() || this.match(o.parenL) && this.tsLookAhead(this.tsIsUnambiguouslyStartOfFunctionType.bind(this));
			}, C.tsInAllowConditionalTypesContext = function(e) {
				var t = this.inDisallowConditionalTypesContext;
				this.inDisallowConditionalTypesContext = !1;
				try {
					return e();
				} finally {
					this.inDisallowConditionalTypesContext = t;
				}
			}, C.tsParseBindingListForSignature = function() {
				var t = this;
				return e.prototype.parseBindingList.call(this, o.parenR, !0, !0).map(function(e) {
					return e.type !== "Identifier" && e.type !== "RestElement" && e.type !== "ObjectPattern" && e.type !== "ArrayPattern" && t.raise(e.start, U.UnsupportedSignatureParameterKind(e.type)), e;
				});
			}, C.tsParseTypePredicateAsserts = function() {
				if (this.type !== m.asserts) return !1;
				var e = this.containsEsc;
				return this.next(), !(!v(this.type) && !this.match(o._this) || (e && this.raise(this.lastTokStart, "Escape sequence in keyword asserts"), 0));
			}, C.tsParseThisTypeNode = function() {
				var e = this.startNode();
				return this.next(), this.finishNode(e, "TSThisType");
			}, C.tsParseTypeAnnotation = function(e, t) {
				var n = this;
				return e === void 0 && (e = !0), t === void 0 && (t = this.startNode()), this.tsInType(function() {
					e && n.expect(o.colon), t.typeAnnotation = n.tsParseType();
				}), this.finishNode(t, "TSTypeAnnotation");
			}, C.tsParseThisTypePredicate = function(e) {
				this.next();
				var t = this.startNodeAtNode(e);
				return t.parameterName = e, t.typeAnnotation = this.tsParseTypeAnnotation(!1), t.asserts = !1, this.finishNode(t, "TSTypePredicate");
			}, C.tsParseThisTypeOrThisTypePredicate = function() {
				var e = this.tsParseThisTypeNode();
				return this.isContextual("is") && !this.hasPrecedingLineBreak() ? this.tsParseThisTypePredicate(e) : e;
			}, C.tsParseTypePredicatePrefix = function() {
				var e = this.parseIdent();
				if (this.isContextual("is") && !this.hasPrecedingLineBreak()) return this.next(), e;
			}, C.tsParseTypeOrTypePredicateAnnotation = function(e) {
				var t = this;
				return this.tsInType(function() {
					var n = t.startNode();
					t.expect(e);
					var r = t.startNode(), i = !!t.tsTryParse(t.tsParseTypePredicateAsserts.bind(t));
					if (i && t.match(o._this)) {
						var a = t.tsParseThisTypeOrThisTypePredicate();
						return a.type === "TSThisType" ? (r.parameterName = a, r.asserts = !0, r.typeAnnotation = null, a = t.finishNode(r, "TSTypePredicate")) : (t.resetStartLocationFromNode(a, r), a.asserts = !0), n.typeAnnotation = a, t.finishNode(n, "TSTypeAnnotation");
					}
					var s = t.tsIsIdentifier() && t.tsTryParse(t.tsParseTypePredicatePrefix.bind(t));
					if (!s) return i ? (r.parameterName = t.parseIdent(), r.asserts = i, r.typeAnnotation = null, n.typeAnnotation = t.finishNode(r, "TSTypePredicate"), t.finishNode(n, "TSTypeAnnotation")) : t.tsParseTypeAnnotation(!1, n);
					var c = t.tsParseTypeAnnotation(!1);
					return r.parameterName = s, r.typeAnnotation = c, r.asserts = i, n.typeAnnotation = t.finishNode(r, "TSTypePredicate"), t.finishNode(n, "TSTypeAnnotation");
				});
			}, C.tsFillSignature = function(e, t) {
				var n = e === o.arrow;
				t.typeParameters = this.tsTryParseTypeParameters(), this.expect(o.parenL), t.parameters = this.tsParseBindingListForSignature(), (n || this.match(e)) && (t.typeAnnotation = this.tsParseTypeOrTypePredicateAnnotation(e));
			}, C.tsTryNextParseConstantContext = function() {
				if (this.lookahead().type !== o._const) return null;
				this.next();
				var e = this.tsParseTypeReference();
				return e.typeParameters && this.raise(e.typeName.start, U.CannotFindName({ name: "const" })), e;
			}, C.tsParseFunctionOrConstructorType = function(e, t) {
				var n = this, r = this.startNode();
				return e === "TSConstructorType" && (r.abstract = !!t, t && this.next(), this.next()), this.tsInAllowConditionalTypesContext(function() {
					return n.tsFillSignature(o.arrow, r);
				}), this.finishNode(r, e);
			}, C.tsParseUnionOrIntersectionType = function(e, t, n) {
				var r = this.startNode(), i = this.eat(n), a = [];
				do
					a.push(t());
				while (this.eat(n));
				return a.length !== 1 || i ? (r.types = a, this.finishNode(r, e)) : a[0];
			}, C.tsCheckTypeAnnotationForReadOnly = function(e) {
				switch (e.typeAnnotation.type) {
					case "TSTupleType":
					case "TSArrayType": return;
					default: this.raise(e.start, U.UnexpectedReadonly);
				}
			}, C.tsParseTypeOperator = function() {
				var e = this.startNode(), t = this.value;
				return this.next(), e.operator = t, e.typeAnnotation = this.tsParseTypeOperatorOrHigher(), t === "readonly" && this.tsCheckTypeAnnotationForReadOnly(e), this.finishNode(e, "TSTypeOperator");
			}, C.tsParseConstraintForInferType = function() {
				var e = this;
				if (this.eat(o._extends)) {
					var t = this.tsInDisallowConditionalTypesContext(function() {
						return e.tsParseType();
					});
					if (this.inDisallowConditionalTypesContext || !this.match(o.question)) return t;
				}
			}, C.tsParseInferType = function() {
				var e = this, t = this.startNode();
				this.expectContextual("infer");
				var n = this.startNode();
				return n.name = this.tsParseTypeParameterName(), n.constraint = this.tsTryParse(function() {
					return e.tsParseConstraintForInferType();
				}), t.typeParameter = this.finishNode(n, "TSTypeParameter"), this.finishNode(t, "TSInferType");
			}, C.tsParseLiteralTypeNode = function() {
				var e = this, t = this.startNode();
				return t.literal = function() {
					switch (e.type) {
						case o.num:
						case o.string:
						case o._true:
						case o._false: return e.parseExprAtom();
						default: e.unexpected();
					}
				}(), this.finishNode(t, "TSLiteralType");
			}, C.tsParseImportType = function() {
				var e = this.startNode();
				return this.expect(o._import), this.expect(o.parenL), this.match(o.string) || this.raise(this.start, U.UnsupportedImportTypeArgument), e.argument = this.parseExprAtom(), this.expect(o.parenR), this.eat(o.dot) && (e.qualifier = this.tsParseEntityName()), this.tsMatchLeftRelational() && (e.typeParameters = this.tsParseTypeArguments()), this.finishNode(e, "TSImportType");
			}, C.tsParseTypeQuery = function() {
				var e = this.startNode();
				return this.expect(o._typeof), e.exprName = this.match(o._import) ? this.tsParseImportType() : this.tsParseEntityName(), !this.hasPrecedingLineBreak() && this.tsMatchLeftRelational() && (e.typeParameters = this.tsParseTypeArguments()), this.finishNode(e, "TSTypeQuery");
			}, C.tsParseMappedTypeParameter = function() {
				var e = this.startNode();
				return e.name = this.tsParseTypeParameterName(), e.constraint = this.tsExpectThenParseType(o._in), this.finishNode(e, "TSTypeParameter");
			}, C.tsParseMappedType = function() {
				var e = this.startNode();
				return this.expect(o.braceL), this.match(o.plusMin) ? (e.readonly = this.value, this.next(), this.expectContextual("readonly")) : this.eatContextual("readonly") && (e.readonly = !0), this.expect(o.bracketL), e.typeParameter = this.tsParseMappedTypeParameter(), e.nameType = this.eatContextual("as") ? this.tsParseType() : null, this.expect(o.bracketR), this.match(o.plusMin) ? (e.optional = this.value, this.next(), this.expect(o.question)) : this.eat(o.question) && (e.optional = !0), e.typeAnnotation = this.tsTryParseType(), this.semicolon(), this.expect(o.braceR), this.finishNode(e, "TSMappedType");
			}, C.tsParseTypeLiteral = function() {
				var e = this.startNode();
				return e.members = this.tsParseObjectTypeMembers(), this.finishNode(e, "TSTypeLiteral");
			}, C.tsParseTupleElementType = function() {
				var e = this.startLoc, t = this.start, n = this.eat(o.ellipsis), r = this.tsParseType(), i = this.eat(o.question);
				if (this.eat(o.colon)) {
					var a = this.startNodeAtNode(r);
					a.optional = i, r.type !== "TSTypeReference" || r.typeParameters || r.typeName.type !== "Identifier" ? (this.raise(r.start, U.InvalidTupleMemberLabel), a.label = r) : a.label = r.typeName, a.elementType = this.tsParseType(), r = this.finishNode(a, "TSNamedTupleMember");
				} else if (i) {
					var s = this.startNodeAtNode(r);
					s.typeAnnotation = r, r = this.finishNode(s, "TSOptionalType");
				}
				if (n) {
					var c = this.startNodeAt(t, e);
					c.typeAnnotation = r, r = this.finishNode(c, "TSRestType");
				}
				return r;
			}, C.tsParseTupleType = function() {
				var e = this, t = this.startNode();
				t.elementTypes = this.tsParseBracketedList("TupleElementTypes", this.tsParseTupleElementType.bind(this), !0, !1);
				var n = !1, r = null;
				return t.elementTypes.forEach(function(t) {
					var i = t.type;
					!n || i === "TSRestType" || i === "TSOptionalType" || i === "TSNamedTupleMember" && t.optional || e.raise(t.start, U.OptionalTypeBeforeRequired), n ||= i === "TSNamedTupleMember" && t.optional || i === "TSOptionalType";
					var a = i;
					i === "TSRestType" && (a = (t = t.typeAnnotation).type);
					var o = a === "TSNamedTupleMember";
					r ??= o, r !== o && e.raise(t.start, U.MixedLabeledAndUnlabeledElements);
				}), this.finishNode(t, "TSTupleType");
			}, C.tsParseTemplateLiteralType = function() {
				var e = this.startNode();
				return e.literal = this.parseTemplate({ isTagged: !1 }), this.finishNode(e, "TSLiteralType");
			}, C.tsParseTypeReference = function() {
				var e = this.startNode();
				return e.typeName = this.tsParseEntityName(), !this.hasPrecedingLineBreak() && this.tsMatchLeftRelational() && (e.typeParameters = this.tsParseTypeArguments()), this.finishNode(e, "TSTypeReference");
			}, C.tsMatchLeftRelational = function() {
				return this.match(o.relational) && this.value === "<";
			}, C.tsMatchRightRelational = function() {
				return this.match(o.relational) && this.value === ">";
			}, C.tsParseParenthesizedType = function() {
				var e = this.startNode();
				return this.expect(o.parenL), e.typeAnnotation = this.tsParseType(), this.expect(o.parenR), this.finishNode(e, "TSParenthesizedType");
			}, C.tsParseNonArrayType = function() {
				switch (this.type) {
					case o.string:
					case o.num:
					case o._true:
					case o._false: return this.tsParseLiteralTypeNode();
					case o.plusMin:
						if (this.value === "-") {
							var e = this.startNode();
							return this.lookahead().type !== o.num && this.unexpected(), e.literal = this.parseMaybeUnary(), this.finishNode(e, "TSLiteralType");
						}
						break;
					case o._this: return this.tsParseThisTypeOrThisTypePredicate();
					case o._typeof: return this.tsParseTypeQuery();
					case o._import: return this.tsParseImportType();
					case o.braceL: return this.tsLookAhead(this.tsIsStartOfMappedType.bind(this)) ? this.tsParseMappedType() : this.tsParseTypeLiteral();
					case o.bracketL: return this.tsParseTupleType();
					case o.parenL: return this.tsParseParenthesizedType();
					case o.backQuote:
					case o.dollarBraceL: return this.tsParseTemplateLiteralType();
					default:
						var t = this.type;
						if (v(t) || t === o._void || t === o._null) {
							var n = t === o._void ? "TSVoidKeyword" : t === o._null ? "TSNullKeyword" : function(e) {
								switch (e) {
									case "any": return "TSAnyKeyword";
									case "boolean": return "TSBooleanKeyword";
									case "bigint": return "TSBigIntKeyword";
									case "never": return "TSNeverKeyword";
									case "number": return "TSNumberKeyword";
									case "object": return "TSObjectKeyword";
									case "string": return "TSStringKeyword";
									case "symbol": return "TSSymbolKeyword";
									case "undefined": return "TSUndefinedKeyword";
									case "unknown": return "TSUnknownKeyword";
									default: return;
								}
							}(this.value);
							if (n !== void 0 && this.lookaheadCharCode() !== 46) {
								var r = this.startNode();
								return this.next(), this.finishNode(r, n);
							}
							return this.tsParseTypeReference();
						}
				}
				this.unexpected();
			}, C.tsParseArrayTypeOrHigher = function() {
				for (var e = this.tsParseNonArrayType(); !this.hasPrecedingLineBreak() && this.eat(o.bracketL);) if (this.match(o.bracketR)) {
					var t = this.startNodeAtNode(e);
					t.elementType = e, this.expect(o.bracketR), e = this.finishNode(t, "TSArrayType");
				} else {
					var n = this.startNodeAtNode(e);
					n.objectType = e, n.indexType = this.tsParseType(), this.expect(o.bracketR), e = this.finishNode(n, "TSIndexedAccessType");
				}
				return e;
			}, C.tsParseTypeOperatorOrHigher = function() {
				var e = this;
				return y(this.type) && !this.containsEsc ? this.tsParseTypeOperator() : this.isContextual("infer") ? this.tsParseInferType() : this.tsInAllowConditionalTypesContext(function() {
					return e.tsParseArrayTypeOrHigher();
				});
			}, C.tsParseIntersectionTypeOrHigher = function() {
				return this.tsParseUnionOrIntersectionType("TSIntersectionType", this.tsParseTypeOperatorOrHigher.bind(this), o.bitwiseAND);
			}, C.tsParseUnionTypeOrHigher = function() {
				return this.tsParseUnionOrIntersectionType("TSUnionType", this.tsParseIntersectionTypeOrHigher.bind(this), o.bitwiseOR);
			}, C.tsParseNonConditionalType = function() {
				return this.tsIsStartOfFunctionType() ? this.tsParseFunctionOrConstructorType("TSFunctionType") : this.match(o._new) ? this.tsParseFunctionOrConstructorType("TSConstructorType") : this.isAbstractConstructorSignature() ? this.tsParseFunctionOrConstructorType("TSConstructorType", !0) : this.tsParseUnionTypeOrHigher();
			}, C.tsParseType = function() {
				var e = this;
				Sn(this.inType);
				var t = this.tsParseNonConditionalType();
				if (this.inDisallowConditionalTypesContext || this.hasPrecedingLineBreak() || !this.eat(o._extends)) return t;
				var n = this.startNodeAtNode(t);
				return n.checkType = t, n.extendsType = this.tsInDisallowConditionalTypesContext(function() {
					return e.tsParseNonConditionalType();
				}), this.expect(o.question), n.trueType = this.tsInAllowConditionalTypesContext(function() {
					return e.tsParseType();
				}), this.expect(o.colon), n.falseType = this.tsInAllowConditionalTypesContext(function() {
					return e.tsParseType();
				}), this.finishNode(n, "TSConditionalType");
			}, C.tsIsUnambiguouslyIndexSignature = function() {
				return this.next(), !!v(this.type) && (this.next(), this.match(o.colon));
			}, C.tsInType = function(e) {
				var t = this.inType;
				this.inType = !0;
				try {
					return e();
				} finally {
					this.inType = t;
				}
			}, C.tsTryParseIndexSignature = function(e) {
				if (this.match(o.bracketL) && this.tsLookAhead(this.tsIsUnambiguouslyIndexSignature.bind(this))) {
					this.expect(o.bracketL);
					var t = this.parseIdent();
					t.typeAnnotation = this.tsParseTypeAnnotation(), this.resetEndLocation(t), this.expect(o.bracketR), e.parameters = [t];
					var n = this.tsTryParseTypeAnnotation();
					return n && (e.typeAnnotation = n), this.tsParseTypeMemberSemicolon(), this.finishNode(e, "TSIndexSignature");
				}
			}, C.tsParseNoneModifiers = function(e) {
				this.tsParseModifiers({
					modified: e,
					allowedModifiers: [],
					disallowedModifiers: ["in", "out"],
					errorTemplate: U.InvalidModifierOnTypeParameterPositions
				});
			}, C.tsParseTypeParameter = function(e) {
				e === void 0 && (e = this.tsParseNoneModifiers.bind(this));
				var t = this.startNode();
				return e(t), t.name = this.tsParseTypeParameterName(), t.constraint = this.tsEatThenParseType(o._extends), t.default = this.tsEatThenParseType(o.eq), this.finishNode(t, "TSTypeParameter");
			}, C.tsParseTypeParameters = function(e) {
				var t = this.startNode();
				this.tsMatchLeftRelational() || this.matchJsx("jsxTagStart") ? this.next() : this.unexpected();
				var n = { value: -1 };
				return t.params = this.tsParseBracketedList("TypeParametersOrArguments", this.tsParseTypeParameter.bind(this, e), !1, !0, n), t.params.length === 0 && this.raise(this.start, U.EmptyTypeParameters), n.value !== -1 && this.addExtra(t, "trailingComma", n.value), this.finishNode(t, "TSTypeParameterDeclaration");
			}, C.tsTryParseTypeParameters = function(e) {
				if (this.tsMatchLeftRelational()) return this.tsParseTypeParameters(e);
			}, C.tsTryParse = function(e) {
				var t = this.getCurLookaheadState(), n = e();
				return n !== void 0 && !1 !== n ? n : void this.setLookaheadState(t);
			}, C.tsTokenCanFollowModifier = function() {
				return (this.match(o.bracketL) || this.match(o.braceL) || this.match(o.star) || this.match(o.ellipsis) || this.match(o.privateId) || this.isLiteralPropertyName()) && !this.hasPrecedingLineBreak();
			}, C.tsNextTokenCanFollowModifier = function() {
				return this.next(!0), this.tsTokenCanFollowModifier();
			}, C.tsParseModifier = function(e, t) {
				if (v(this.type) || this.type === o._in) {
					var n = this.value;
					if (e.indexOf(n) !== -1 && !this.containsEsc) {
						if (t && this.tsIsStartOfStaticBlocks()) return;
						if (this.tsTryParse(this.tsNextTokenCanFollowModifier.bind(this))) return n;
					}
				}
			}, C.tsParseModifiersByMap = function(e) {
				for (var t = e.modified, n = e.map, r = 0, i = Object.keys(n); r < i.length; r++) {
					var a = i[r];
					t[a] = n[a];
				}
			}, C.tsParseModifiers = function(e) {
				for (var t = this, n = e.modified, r = e.allowedModifiers, i = e.disallowedModifiers, a = e.stopOnStartOfClassStaticBlock, o = e.errorTemplate, s = o === void 0 ? U.InvalidModifierOnTypeMember : o, c = {}, l = function(e, r, i, a) {
					r === i && n[a] && t.raise(e.column, U.InvalidModifiersOrder({ orderedModifiers: [i, a] }));
				}, u = function(e, r, i, a) {
					(n[i] && r === a || n[a] && r === i) && t.raise(e.column, U.IncompatibleModifiers({ modifiers: [i, a] }));
				};;) {
					var d = this.startLoc, f = this.tsParseModifier(r.concat(i ?? []), a);
					if (!f) break;
					On(f) ? n.accessibility ? this.raise(this.start, U.DuplicateAccessibilityModifier()) : (l(d, f, f, "override"), l(d, f, f, "static"), l(d, f, f, "readonly"), l(d, f, f, "accessor"), c.accessibility = f, n.accessibility = f) : wn(f) ? n[f] ? this.raise(this.start, U.DuplicateModifier({ modifier: f })) : (l(d, f, "in", "out"), c[f] = f, n[f] = !0) : Cn(f) ? n[f] ? this.raise(this.start, U.DuplicateModifier({ modifier: f })) : (u(d, f, "accessor", "readonly"), u(d, f, "accessor", "static"), u(d, f, "accessor", "override"), c[f] = f, n[f] = !0) : Object.hasOwnProperty.call(n, f) ? this.raise(this.start, U.DuplicateModifier({ modifier: f })) : (l(d, f, "static", "readonly"), l(d, f, "static", "override"), l(d, f, "override", "readonly"), l(d, f, "abstract", "override"), u(d, f, "declare", "override"), u(d, f, "static", "abstract"), c[f] = f, n[f] = !0), i != null && i.includes(f) && this.raise(this.start, s);
				}
				return c;
			}, C.tsParseInOutModifiers = function(e) {
				this.tsParseModifiers({
					modified: e,
					allowedModifiers: ["in", "out"],
					disallowedModifiers: [
						"public",
						"private",
						"protected",
						"readonly",
						"declare",
						"abstract",
						"override"
					],
					errorTemplate: U.InvalidModifierOnTypeParameter
				});
			}, C.tsParseTypeArguments = function() {
				var e = this, t = this.startNode();
				return t.params = this.tsInType(function() {
					return e.tsInNoContext(function() {
						return e.expect(o.relational), e.tsParseDelimitedList("TypeParametersOrArguments", e.tsParseType.bind(e));
					});
				}), t.params.length === 0 && this.raise(this.start, U.EmptyTypeArguments), this.exprAllowed = !1, this.expect(o.relational), this.finishNode(t, "TSTypeParameterInstantiation");
			}, C.tsParseHeritageClause = function(e) {
				var t = this, n = this.start, r = this.tsParseDelimitedList("HeritageClauseElement", function() {
					var e = t.startNode();
					return e.expression = t.tsParseEntityName(), t.tsMatchLeftRelational() && (e.typeParameters = t.tsParseTypeArguments()), t.finishNode(e, "TSExpressionWithTypeArguments");
				});
				return r.length || this.raise(n, U.EmptyHeritageClauseType({ token: e })), r;
			}, C.tsParseTypeMemberSemicolon = function() {
				this.eat(o.comma) || this.isLineTerminator() || this.expect(o.semi);
			}, C.tsTryParseAndCatch = function(e) {
				var t = this.tryParse(function(t) {
					return e() || t();
				});
				if (!t.aborted && t.node) return t.error && this.setLookaheadState(t.failState), t.node;
			}, C.tsParseSignatureMember = function(e, t) {
				return this.tsFillSignature(o.colon, t), this.tsParseTypeMemberSemicolon(), this.finishNode(t, e);
			}, C.tsParsePropertyOrMethodSignature = function(e, t) {
				this.eat(o.question) && (e.optional = !0);
				var n = e;
				if (this.match(o.parenL) || this.tsMatchLeftRelational()) {
					t && this.raise(e.start, U.ReadonlyForMethodSignature);
					var r = n;
					r.kind && this.tsMatchLeftRelational() && this.raise(this.start, U.AccesorCannotHaveTypeParameters), this.tsFillSignature(o.colon, r), this.tsParseTypeMemberSemicolon();
					var i = "parameters", a = "typeAnnotation";
					if (r.kind === "get") r[i].length > 0 && (this.raise(this.start, "A 'get' accesor must not have any formal parameters."), this.isThisParam(r[i][0]) && this.raise(this.start, U.AccesorCannotDeclareThisParameter));
					else if (r.kind === "set") {
						if (r[i].length !== 1) this.raise(this.start, "A 'get' accesor must not have any formal parameters.");
						else {
							var s = r[i][0];
							this.isThisParam(s) && this.raise(this.start, U.AccesorCannotDeclareThisParameter), s.type === "Identifier" && s.optional && this.raise(this.start, U.SetAccesorCannotHaveOptionalParameter), s.type === "RestElement" && this.raise(this.start, U.SetAccesorCannotHaveRestParameter);
						}
						r[a] && this.raise(r[a].start, U.SetAccesorCannotHaveReturnType);
					} else r.kind = "method";
					return this.finishNode(r, "TSMethodSignature");
				}
				var c = n;
				t && (c.readonly = !0);
				var l = this.tsTryParseTypeAnnotation();
				return l && (c.typeAnnotation = l), this.tsParseTypeMemberSemicolon(), this.finishNode(c, "TSPropertySignature");
			}, C.tsParseTypeMember = function() {
				var e = this.startNode();
				if (this.match(o.parenL) || this.tsMatchLeftRelational()) return this.tsParseSignatureMember("TSCallSignatureDeclaration", e);
				if (this.match(o._new)) {
					var t = this.startNode();
					return this.next(), this.match(o.parenL) || this.tsMatchLeftRelational() ? this.tsParseSignatureMember("TSConstructSignatureDeclaration", e) : (e.key = this.createIdentifier(t, "new"), this.tsParsePropertyOrMethodSignature(e, !1));
				}
				return this.tsParseModifiers({
					modified: e,
					allowedModifiers: ["readonly"],
					disallowedModifiers: [
						"declare",
						"abstract",
						"private",
						"protected",
						"public",
						"static",
						"override"
					]
				}), this.tsTryParseIndexSignature(e) || (this.parsePropertyName(e), e.computed || e.key.type !== "Identifier" || e.key.name !== "get" && e.key.name !== "set" || !this.tsTokenCanFollowModifier() || (e.kind = e.key.name, this.parsePropertyName(e)), this.tsParsePropertyOrMethodSignature(e, !!e.readonly));
			}, C.tsParseList = function(e, t) {
				for (var n = []; !this.tsIsListTerminator(e);) n.push(t());
				return n;
			}, C.tsParseObjectTypeMembers = function() {
				this.expect(o.braceL);
				var e = this.tsParseList("TypeMembers", this.tsParseTypeMember.bind(this));
				return this.expect(o.braceR), e;
			}, C.tsParseInterfaceDeclaration = function(e, t) {
				if (t === void 0 && (t = {}), this.hasFollowingLineBreak()) return null;
				this.expectContextual("interface"), t.declare && (e.declare = !0), v(this.type) ? (e.id = this.parseIdent(), this.checkLValSimple(e.id, 7)) : (e.id = null, this.raise(this.start, U.MissingInterfaceName)), e.typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutModifiers.bind(this)), this.eat(o._extends) && (e.extends = this.tsParseHeritageClause("extends"));
				var n = this.startNode();
				return n.body = this.tsInType(this.tsParseObjectTypeMembers.bind(this)), e.body = this.finishNode(n, "TSInterfaceBody"), this.finishNode(e, "TSInterfaceDeclaration");
			}, C.tsParseAbstractDeclaration = function(e) {
				if (this.match(o._class)) return e.abstract = !0, this.parseClass(e, !0);
				if (this.ts_isContextual(m.interface)) {
					if (!this.hasFollowingLineBreak()) return e.abstract = !0, this.tsParseInterfaceDeclaration(e);
				} else this.unexpected(e.start);
			}, C.tsIsDeclarationStart = function() {
				return te(this.type);
			}, C.tsParseExpressionStatement = function(t, n) {
				switch (n.name) {
					case "declare":
						var r = this.tsTryParseDeclare(t);
						if (r) return r.declare = !0, r;
						break;
					case "global":
						if (this.match(o.braceL)) {
							e.prototype.enterScope.call(this, fn);
							var i = t;
							return i.global = !0, i.id = n, i.body = this.tsParseModuleBlock(), e.prototype.exitScope.call(this), this.finishNode(i, "TSModuleDeclaration");
						}
						break;
					default: return this.tsParseDeclaration(t, n.name, !1);
				}
			}, C.tsParseModuleReference = function() {
				return this.tsIsExternalModuleReference() ? this.tsParseExternalModuleReference() : this.tsParseEntityName(!1);
			}, C.tsIsExportDefaultSpecifier = function() {
				var e = this.type, t = this.isAsyncFunction(), n = this.isLet();
				if (v(e)) {
					if (t && !this.containsEsc || n) return !1;
					if ((e === m.type || e === m.interface) && !this.containsEsc) {
						var r = this.lookahead();
						if (v(r.type) && !this.isContextualWithState("from", r) || r.type === o.braceL) return !1;
					}
				} else if (!this.match(o._default)) return !1;
				var i = this.nextTokenStart(), a = this.isUnparsedContextual(i, "from");
				if (this.input.charCodeAt(i) === 44 || v(this.type) && a) return !0;
				if (this.match(o._default) && a) {
					var s = this.input.charCodeAt(this.nextTokenStartSince(i + 4));
					return s === 34 || s === 39;
				}
				return !1;
			}, C.tsInAmbientContext = function(e) {
				var t = this.isAmbientContext;
				this.isAmbientContext = !0;
				try {
					return e();
				} finally {
					this.isAmbientContext = t;
				}
			}, C.tsCheckLineTerminator = function(e) {
				return e ? !this.hasFollowingLineBreak() && (this.next(), !0) : !this.isLineTerminator();
			}, C.tsParseModuleOrNamespaceDeclaration = function(t, n) {
				if (n === void 0 && (n = !1), t.id = this.parseIdent(), n || this.checkLValSimple(t.id, 8), this.eat(o.dot)) {
					var r = this.startNode();
					this.tsParseModuleOrNamespaceDeclaration(r, !0), t.body = r;
				} else e.prototype.enterScope.call(this, fn), t.body = this.tsParseModuleBlock(), e.prototype.exitScope.call(this);
				return this.finishNode(t, "TSModuleDeclaration");
			}, C.checkLValSimple = function(t, n, r) {
				return n === void 0 && (n = 0), e.prototype.checkLValSimple.call(this, t, n, r);
			}, C.tsParseTypeAliasDeclaration = function(e) {
				var t = this;
				return e.id = this.parseIdent(), this.checkLValSimple(e.id, 6), e.typeAnnotation = this.tsInType(function() {
					if (e.typeParameters = t.tsTryParseTypeParameters(t.tsParseInOutModifiers.bind(t)), t.expect(o.eq), t.ts_isContextual(m.interface) && t.lookahead().type !== o.dot) {
						var n = t.startNode();
						return t.next(), t.finishNode(n, "TSIntrinsicKeyword");
					}
					return t.tsParseType();
				}), this.semicolon(), this.finishNode(e, "TSTypeAliasDeclaration");
			}, C.tsParseDeclaration = function(e, t, n) {
				switch (t) {
					case "abstract":
						if (this.tsCheckLineTerminator(n) && (this.match(o._class) || v(this.type))) return this.tsParseAbstractDeclaration(e);
						break;
					case "module":
						if (this.tsCheckLineTerminator(n)) {
							if (this.match(o.string)) return this.tsParseAmbientExternalModuleDeclaration(e);
							if (v(this.type)) return this.tsParseModuleOrNamespaceDeclaration(e);
						}
						break;
					case "namespace":
						if (this.tsCheckLineTerminator(n) && v(this.type)) return this.tsParseModuleOrNamespaceDeclaration(e);
						break;
					case "type": if (this.tsCheckLineTerminator(n) && v(this.type)) return this.tsParseTypeAliasDeclaration(e);
				}
			}, C.tsTryParseExportDeclaration = function() {
				return this.tsParseDeclaration(this.startNode(), this.value, !0);
			}, C.tsParseImportEqualsDeclaration = function(t, n) {
				t.isExport = n || !1, t.id = this.parseIdent(), this.checkLValSimple(t.id, 2), e.prototype.expect.call(this, o.eq);
				var r = this.tsParseModuleReference();
				return t.importKind === "type" && r.type !== "TSExternalModuleReference" && this.raise(r.start, U.ImportAliasHasImportType), t.moduleReference = r, e.prototype.semicolon.call(this), this.finishNode(t, "TSImportEqualsDeclaration");
			}, C.isExportDefaultSpecifier = function() {
				if (this.tsIsDeclarationStart()) return !1;
				var e = this.type;
				if (v(e)) {
					if (this.isContextual("async") || this.isContextual("let")) return !1;
					if ((e === m.type || e === m.interface) && !this.containsEsc) {
						var t = this.lookahead();
						if (v(t.type) && !this.isContextualWithState("from", t) || t.type === o.braceL) return !1;
					}
				} else if (!this.match(o._default)) return !1;
				var n = this.nextTokenStart(), r = this.isUnparsedContextual(n, "from");
				if (this.input.charCodeAt(n) === 44 || v(this.type) && r) return !0;
				if (this.match(o._default) && r) {
					var i = this.input.charCodeAt(this.nextTokenStartSince(n + 4));
					return i === 34 || i === 39;
				}
				return !1;
			}, C.parseTemplate = function(e) {
				var t = (e === void 0 ? {} : e).isTagged, n = t !== void 0 && t, r = this.startNode();
				this.next(), r.expressions = [];
				var i = this.parseTemplateElement({ isTagged: n });
				for (r.quasis = [i]; !i.tail;) this.type === o.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(o.dollarBraceL), r.expressions.push(this.inType ? this.tsParseType() : this.parseExpression()), this.expect(o.braceR), r.quasis.push(i = this.parseTemplateElement({ isTagged: n }));
				return this.next(), this.finishNode(r, "TemplateLiteral");
			}, C.parseFunction = function(e, t, n, r, i) {
				this.initFunction(e), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !r) && (this.type === o.star && 2 & t && this.unexpected(), e.generator = this.eat(o.star)), this.options.ecmaVersion >= 8 && (e.async = !!r), 1 & t && (e.id = 4 & t && this.type !== o.name ? null : this.parseIdent());
				var a = this.yieldPos, s = this.awaitPos, c = this.awaitIdentPos, l = this.maybeInArrowParameters;
				this.maybeInArrowParameters = !1, this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(Tn(e.async, e.generator)), 1 & t || (e.id = this.type === o.name ? this.parseIdent() : null), this.parseFunctionParams(e);
				var u = 1 & t;
				return this.parseFunctionBody(e, n, !1, i, { isFunctionDeclaration: u }), this.yieldPos = a, this.awaitPos = s, this.awaitIdentPos = c, 1 & t && e.id && !(2 & t) && this.checkLValSimple(e.id, e.body ? this.strict || e.generator || e.async ? this.treatFunctionsAsVar ? 1 : 2 : 3 : 0), this.maybeInArrowParameters = l, this.finishNode(e, u ? "FunctionDeclaration" : "FunctionExpression");
			}, C.parseFunctionBody = function(t, n, r, i, a) {
				n === void 0 && (n = !1), r === void 0 && (r = !1), i === void 0 && (i = !1), this.match(o.colon) && (t.returnType = this.tsParseTypeOrTypePredicateAnnotation(o.colon));
				var s = a != null && a.isFunctionDeclaration ? "TSDeclareFunction" : a != null && a.isClassMethod ? "TSDeclareMethod" : void 0;
				return s && !this.match(o.braceL) && this.isLineTerminator() ? this.finishNode(t, s) : s === "TSDeclareFunction" && this.isAmbientContext && (this.raise(t.start, U.DeclareFunctionHasImplementation), t.declare) ? (e.prototype.parseFunctionBody.call(this, t, n, r, !1), this.finishNode(t, s)) : (e.prototype.parseFunctionBody.call(this, t, n, r, i), t);
			}, C.parseNew = function() {
				var e;
				this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
				var t = this.startNode(), n = this.parseIdent(!0);
				if (this.options.ecmaVersion >= 6 && this.eat(o.dot)) {
					t.meta = n;
					var r = this.containsEsc;
					return t.property = this.parseIdent(!0), t.property.name !== "target" && this.raiseRecoverable(t.property.start, "The only valid meta property for new is 'new.target'"), r && this.raiseRecoverable(t.start, "'new.target' must not contain escaped characters"), this.allowNewDotTarget || this.raiseRecoverable(t.start, "'new.target' can only be used in functions and class static block"), this.finishNode(t, "MetaProperty");
				}
				var i = this.start, a = this.startLoc, s = this.type === o._import;
				t.callee = this.parseSubscripts(this.parseExprAtom(), i, a, !0, !1), s && t.callee.type === "ImportExpression" && this.raise(i, "Cannot use new with import()");
				var c = t.callee;
				return c.type !== "TSInstantiationExpression" || (e = c.extra) != null && e.parenthesized || (t.typeParameters = c.typeParameters, t.callee = c.expression), t.arguments = this.eat(o.parenL) ? this.parseExprList(o.parenR, this.options.ecmaVersion >= 8, !1) : [], this.finishNode(t, "NewExpression");
			}, C.parseExprOp = function(t, n, r, i, s) {
				var c;
				if (o._in.binop > i && !this.hasPrecedingLineBreak() && (this.isContextual("as") && (c = "TSAsExpression"), a && this.isContextual("satisfies") && (c = "TSSatisfiesExpression"), c)) {
					var l = this.startNodeAt(n, r);
					return l.expression = t, l.typeAnnotation = this.tsTryNextParseConstantContext() || this.tsNextThenParseType(), this.finishNode(l, c), this.reScan_lt_gt(), this.parseExprOp(l, n, r, i, s);
				}
				return e.prototype.parseExprOp.call(this, t, n, r, i, s);
			}, C.parseImportSpecifiers = function() {
				var e = [], t = !0;
				if (i.tokenIsIdentifier(this.type) && (e.push(this.parseImportDefaultSpecifier()), !this.eat(o.comma))) return e;
				if (this.type === o.star) return e.push(this.parseImportNamespaceSpecifier()), e;
				for (this.expect(o.braceL); !this.eat(o.braceR);) {
					if (t) t = !1;
					else if (this.expect(o.comma), this.afterTrailingComma(o.braceR)) break;
					e.push(this.parseImportSpecifier());
				}
				return e;
			}, C.parseImport = function(e) {
				var t = this.lookahead();
				if (e.importKind = "value", this.importOrExportOuterKind = "value", v(t.type) || this.match(o.star) || this.match(o.braceL)) {
					var n = this.lookahead(2);
					if (n.type !== o.comma && !this.isContextualWithState("from", n) && n.type !== o.eq && this.ts_eatContextualWithState("type", 1, t) && (this.importOrExportOuterKind = "type", e.importKind = "type", t = this.lookahead(), n = this.lookahead(2)), v(t.type) && n.type === o.eq) {
						this.next();
						var r = this.tsParseImportEqualsDeclaration(e);
						return this.importOrExportOuterKind = "value", r;
					}
				}
				return this.next(), this.type === o.string ? (e.specifiers = [], e.source = this.parseExprAtom()) : (e.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), e.source = this.type === o.string ? this.parseExprAtom() : this.unexpected()), this.parseMaybeImportAttributes(e), this.semicolon(), this.finishNode(e, "ImportDeclaration"), this.importOrExportOuterKind = "value", e.importKind === "type" && e.specifiers.length > 1 && e.specifiers[0].type === "ImportDefaultSpecifier" && this.raise(e.start, U.TypeImportCannotSpecifyDefaultAndNamed), e;
			}, C.parseExportDefaultDeclaration = function() {
				if (this.isAbstractClass()) {
					var t = this.startNode();
					return this.next(), t.abstract = !0, this.parseClass(t, !0);
				}
				if (this.match(m.interface)) {
					var n = this.tsParseInterfaceDeclaration(this.startNode());
					if (n) return n;
				}
				return e.prototype.parseExportDefaultDeclaration.call(this);
			}, C.parseExportAllDeclaration = function(e, t) {
				return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (e.exported = this.parseModuleExportName(), this.checkExport(t, e.exported, this.lastTokStart)) : e.exported = null), this.expectContextual("from"), this.type !== o.string && this.unexpected(), e.source = this.parseExprAtom(), this.parseMaybeImportAttributes(e), this.semicolon(), this.finishNode(e, "ExportAllDeclaration");
			}, C.parseDynamicImport = function(e) {
				if (this.next(), e.source = this.parseMaybeAssign(), this.eat(o.comma) && (e.arguments = [this.parseExpression()]), !this.eat(o.parenR)) {
					var t = this.start;
					this.eat(o.comma) && this.eat(o.parenR) ? this.raiseRecoverable(t, "Trailing comma is not allowed in import()") : this.unexpected(t);
				}
				return this.finishNode(e, "ImportExpression");
			}, C.parseExport = function(e, t) {
				var n = this.lookahead();
				if (this.ts_eatWithState(o._import, 2, n)) {
					this.ts_isContextual(m.type) && this.lookaheadCharCode() !== 61 ? (e.importKind = "type", this.importOrExportOuterKind = "type", this.next()) : (e.importKind = "value", this.importOrExportOuterKind = "value");
					var r = this.tsParseImportEqualsDeclaration(e, !0);
					return this.importOrExportOuterKind = void 0, r;
				}
				if (this.ts_eatWithState(o.eq, 2, n)) {
					var i = e;
					return i.expression = this.parseExpression(), this.semicolon(), this.importOrExportOuterKind = void 0, this.finishNode(i, "TSExportAssignment");
				}
				if (this.ts_eatContextualWithState("as", 2, n)) {
					var a = e;
					return this.expectContextual("namespace"), a.id = this.parseIdent(), this.semicolon(), this.importOrExportOuterKind = void 0, this.finishNode(a, "TSNamespaceExportDeclaration");
				}
				if (this.ts_isContextualWithState(n, m.type) && this.lookahead(2).type === o.braceL ? (this.next(), this.importOrExportOuterKind = "type", e.exportKind = "type") : (this.importOrExportOuterKind = "value", e.exportKind = "value"), this.next(), this.eat(o.star)) return this.parseExportAllDeclaration(e, t);
				if (this.eat(o._default)) return this.checkExport(t, "default", this.lastTokStart), e.declaration = this.parseExportDefaultDeclaration(), this.finishNode(e, "ExportDefaultDeclaration");
				if (this.shouldParseExportStatement()) e.declaration = this.parseExportDeclaration(e), e.declaration.type === "VariableDeclaration" ? this.checkVariableExport(t, e.declaration.declarations) : this.checkExport(t, e.declaration.id, e.declaration.id.start), e.specifiers = [], e.source = null;
				else {
					if (e.declaration = null, e.specifiers = this.parseExportSpecifiers(t), this.eatContextual("from")) this.type !== o.string && this.unexpected(), e.source = this.parseExprAtom(), this.parseMaybeImportAttributes(e);
					else {
						for (var s, c = ln(e.specifiers); !(s = c()).done;) {
							var l = s.value;
							this.checkUnreserved(l.local), this.checkLocalExport(l.local), l.local.type === "Literal" && this.raise(l.local.start, "A string literal cannot be used as an exported binding without `from`.");
						}
						e.source = null;
					}
					this.semicolon();
				}
				return this.finishNode(e, "ExportNamedDeclaration");
			}, C.checkExport = function(e, t, n) {
				e && (typeof t != "string" && (t = t.type === "Identifier" ? t.name : t.value), e[t] = !0);
			}, C.parseMaybeDefault = function(t, n, r) {
				var i = e.prototype.parseMaybeDefault.call(this, t, n, r);
				return i.type === "AssignmentPattern" && i.typeAnnotation && i.right.start < i.typeAnnotation.start && this.raise(i.typeAnnotation.start, U.TypeAnnotationAfterAssign), i;
			}, C.typeCastToParameter = function(e) {
				return e.expression.typeAnnotation = e.typeAnnotation, this.resetEndLocation(e.expression, e.typeAnnotation.end), e.expression;
			}, C.toAssignableList = function(t, n) {
				for (var r = 0; r < t.length; r++) {
					var i = t[r];
					i?.type === "TSTypeCastExpression" && (t[r] = this.typeCastToParameter(i));
				}
				return e.prototype.toAssignableList.call(this, t, n);
			}, C.reportReservedArrowTypeParam = function(e) {}, C.parseExprAtom = function(t, n, r) {
				if (this.type === m.jsxText) return this.jsx_parseText();
				if (this.type === m.jsxTagStart) return this.jsx_parseElement();
				if (this.type === m.at) return this.parseDecorators(), this.parseExprAtom();
				if (v(this.type)) {
					var i = this.potentialArrowAt === this.start, a = this.start, s = this.startLoc, c = this.containsEsc, l = this.parseIdent(!1);
					if (this.options.ecmaVersion >= 8 && !c && l.name === "async" && !this.canInsertSemicolon() && this.eat(o._function)) return this.overrideContext(f.f_expr), this.parseFunction(this.startNodeAt(a, s), 0, !1, !0, n);
					if (i && !this.canInsertSemicolon()) {
						if (this.eat(o.arrow)) return this.parseArrowExpression(this.startNodeAt(a, s), [l], !1, n);
						if (this.options.ecmaVersion >= 8 && l.name === "async" && this.type === o.name && !c && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) return l = this.parseIdent(!1), !this.canInsertSemicolon() && this.eat(o.arrow) || this.unexpected(), this.parseArrowExpression(this.startNodeAt(a, s), [l], !0, n);
					}
					return l;
				}
				return e.prototype.parseExprAtom.call(this, t, n, r);
			}, C.parseExprAtomDefault = function() {
				if (v(this.type)) {
					var e = this.potentialArrowAt === this.start, t = this.containsEsc, n = this.parseIdent();
					if (!t && n.name === "async" && !this.canInsertSemicolon()) {
						var r = this.type;
						if (r === o._function) return this.next(), this.parseFunction(this.startNodeAtNode(n), void 0, !0, !0);
						if (v(r)) {
							if (this.lookaheadCharCode() === 61) {
								var i = this.parseIdent(!1);
								return !this.canInsertSemicolon() && this.eat(o.arrow) || this.unexpected(), this.parseArrowExpression(this.startNodeAtNode(n), [i], !0);
							}
							return n;
						}
					}
					return e && this.match(o.arrow) && !this.canInsertSemicolon() ? (this.next(), this.parseArrowExpression(this.startNodeAtNode(n), [n], !1)) : n;
				}
				this.unexpected();
			}, C.parseIdentNode = function() {
				var t = this.startNode();
				return ne(this.type) ? (t.name = this.value, t) : e.prototype.parseIdentNode.call(this);
			}, C.parseVarStatement = function(t, n, r) {
				r === void 0 && (r = !1);
				var i = this.isAmbientContext;
				this.next(), e.prototype.parseVar.call(this, t, !1, n, r || i), this.semicolon();
				var a = this.finishNode(t, "VariableDeclaration");
				if (!i) return a;
				for (var o, s = ln(a.declarations); !(o = s()).done;) {
					var c = o.value, l = c.init;
					l && (n !== "const" || c.id.typeAnnotation ? this.raise(l.start, U.InitializerNotAllowedInAmbientContext) : l.type !== "StringLiteral" && l.type !== "BooleanLiteral" && l.type !== "NumericLiteral" && l.type !== "BigIntLiteral" && (l.type !== "TemplateLiteral" || l.expressions.length > 0) && !En(l) && this.raise(l.start, U.ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference));
				}
				return a;
			}, C.parseStatement = function(t, n, r) {
				if (this.match(m.at) && this.parseDecorators(!0), this.match(o._const) && this.isLookaheadContextual("enum")) {
					var i = this.startNode();
					return this.expect(o._const), this.tsParseEnumDeclaration(i, { const: !0 });
				}
				if (this.ts_isContextual(m.enum)) return this.tsParseEnumDeclaration(this.startNode());
				if (this.ts_isContextual(m.interface)) {
					var a = this.tsParseInterfaceDeclaration(this.startNode());
					if (a) return a;
				}
				return e.prototype.parseStatement.call(this, t, n, r);
			}, C.parseAccessModifier = function() {
				return this.tsParseModifier([
					"public",
					"protected",
					"private"
				]);
			}, C.parsePostMemberNameModifiers = function(e) {
				this.eat(o.question) && (e.optional = !0), e.readonly && this.match(o.parenL) && this.raise(e.start, U.ClassMethodHasReadonly), e.declare && this.match(o.parenL) && this.raise(e.start, U.ClassMethodHasDeclare);
			}, C.parseExpressionStatement = function(t, n) {
				return (n.type === "Identifier" ? this.tsParseExpressionStatement(t, n) : void 0) || e.prototype.parseExpressionStatement.call(this, t, n);
			}, C.shouldParseExportStatement = function() {
				return !!this.tsIsDeclarationStart() || !!this.match(m.at) || e.prototype.shouldParseExportStatement.call(this);
			}, C.parseConditional = function(e, t, n, r, i) {
				if (this.eat(o.question)) {
					var a = this.startNodeAt(t, n);
					return a.test = e, a.consequent = this.parseMaybeAssign(), this.expect(o.colon), a.alternate = this.parseMaybeAssign(r), this.finishNode(a, "ConditionalExpression");
				}
				return e;
			}, C.parseMaybeConditional = function(e, t) {
				var n = this, r = this.start, i = this.startLoc, a = this.parseExprOps(e, t);
				if (this.checkExpressionErrors(t)) return a;
				if (!this.maybeInArrowParameters || !this.match(o.question)) return this.parseConditional(a, r, i, e, t);
				var s = this.tryParse(function() {
					return n.parseConditional(a, r, i, e, t);
				});
				return s.node ? (s.error && this.setLookaheadState(s.failState), s.node) : (s.error && this.setOptionalParametersError(t, s.error), a);
			}, C.parseParenItem = function(t) {
				var n = this.start, r = this.startLoc;
				if (t = e.prototype.parseParenItem.call(this, t), this.eat(o.question) && (t.optional = !0, this.resetEndLocation(t)), this.match(o.colon)) {
					var i = this.startNodeAt(n, r);
					return i.expression = t, i.typeAnnotation = this.tsParseTypeAnnotation(), this.finishNode(i, "TSTypeCastExpression");
				}
				return t;
			}, C.parseExportDeclaration = function(e) {
				var t = this;
				if (!this.isAmbientContext && this.ts_isContextual(m.declare)) return this.tsInAmbientContext(function() {
					return t.parseExportDeclaration(e);
				});
				var n = this.start, r = this.startLoc, i = this.eatContextual("declare");
				!i || !this.ts_isContextual(m.declare) && this.shouldParseExportStatement() || this.raise(this.start, U.ExpectedAmbientAfterExportDeclare);
				var a = v(this.type) && this.tsTryParseExportDeclaration() || this.parseStatement(null);
				return a ? ((a.type === "TSInterfaceDeclaration" || a.type === "TSTypeAliasDeclaration" || i) && (e.exportKind = "type"), i && (this.resetStartLocation(a, n, r), a.declare = !0), a) : null;
			}, C.parseClassId = function(t, n) {
				if (n || !this.isContextual("implements")) {
					e.prototype.parseClassId.call(this, t, n);
					var r = this.tsTryParseTypeParameters(this.tsParseInOutModifiers.bind(this));
					r && (t.typeParameters = r);
				}
			}, C.parseClassPropertyAnnotation = function(e) {
				e.optional || (this.value === "!" && this.eat(o.prefix) ? e.definite = !0 : this.eat(o.question) && (e.optional = !0));
				var t = this.tsTryParseTypeAnnotation();
				t && (e.typeAnnotation = t);
			}, C.parseClassField = function(t) {
				if (t.key.type === "PrivateIdentifier") t.abstract && this.raise(t.start, U.PrivateElementHasAbstract), t.accessibility && this.raise(t.start, U.PrivateElementHasAccessibility({ modifier: t.accessibility })), this.parseClassPropertyAnnotation(t);
				else if (this.parseClassPropertyAnnotation(t), this.isAmbientContext && (!t.readonly || t.typeAnnotation) && this.match(o.eq) && this.raise(this.start, U.DeclareClassFieldHasInitializer), t.abstract && this.match(o.eq)) {
					var n = t.key;
					this.raise(this.start, U.AbstractPropertyHasInitializer({ propertyName: n.type !== "Identifier" || t.computed ? "[" + this.input.slice(n.start, n.end) + "]" : n.name }));
				}
				return e.prototype.parseClassField.call(this, t);
			}, C.parseClassMethod = function(e, t, n, r) {
				var i = e.kind === "constructor", a = e.key.type === "PrivateIdentifier", o = this.tsTryParseTypeParameters();
				a ? (o && (e.typeParameters = o), e.accessibility && this.raise(e.start, U.PrivateMethodsHasAccessibility({ modifier: e.accessibility }))) : o && i && this.raise(o.start, U.ConstructorHasTypeParameters);
				var s = e.declare, c = e.kind;
				!(s !== void 0 && s) || c !== "get" && c !== "set" || this.raise(e.start, U.DeclareAccessor({ kind: c })), o && (e.typeParameters = o);
				var l = e.key;
				e.kind === "constructor" ? (t && this.raise(l.start, "Constructor can't be a generator"), n && this.raise(l.start, "Constructor can't be an async method")) : e.static && gn(e, "prototype") && this.raise(l.start, "Classes may not have a static property named prototype");
				var u = e.value = this.parseMethod(t, n, r, !0, e);
				return e.kind === "get" && u.params.length !== 0 && this.raiseRecoverable(u.start, "getter should have no params"), e.kind === "set" && u.params.length !== 1 && this.raiseRecoverable(u.start, "setter should have exactly one param"), e.kind === "set" && u.params[0].type === "RestElement" && this.raiseRecoverable(u.params[0].start, "Setter cannot use rest params"), this.finishNode(e, "MethodDefinition");
			}, C.isClassMethod = function() {
				return this.match(o.relational);
			}, C.parseClassElement = function(t) {
				var n = this;
				if (this.eat(o.semi)) return null;
				var r, i = this.options.ecmaVersion, a = this.startNode(), s = "", c = !1, l = !1, u = "method", d = [
					"declare",
					"private",
					"public",
					"protected",
					"accessor",
					"override",
					"abstract",
					"readonly",
					"static"
				];
				r = !!this.tsParseModifiers({
					modified: a,
					allowedModifiers: d,
					disallowedModifiers: ["in", "out"],
					stopOnStartOfClassStaticBlock: !0,
					errorTemplate: U.InvalidModifierOnTypeParameterPositions
				}).static;
				var f = function() {
					if (!n.tsIsStartOfStaticBlocks()) {
						var f = n.tsTryParseIndexSignature(a);
						if (f) return a.abstract && n.raise(a.start, U.IndexSignatureHasAbstract), a.accessibility && n.raise(a.start, U.IndexSignatureHasAccessibility({ modifier: a.accessibility })), a.declare && n.raise(a.start, U.IndexSignatureHasDeclare), a.override && n.raise(a.start, U.IndexSignatureHasOverride), f;
						if (!n.inAbstractClass && a.abstract && n.raise(a.start, U.NonAbstractClassHasAbstractMethod), a.override && t && n.raise(a.start, U.OverrideNotInSubClass), a.static = r, r && (n.isClassElementNameStart() || n.type === o.star || (s = "static")), !s && i >= 8 && n.eatContextual("async") && (!n.isClassElementNameStart() && n.type !== o.star || n.canInsertSemicolon() ? s = "async" : l = !0), !s && (i >= 9 || !l) && n.eat(o.star) && (c = !0), !s && !l && !c) {
							var p = n.value;
							(n.eatContextual("get") || n.eatContextual("set")) && (n.isClassElementNameStart() ? u = p : s = p);
						}
						if (s ? (a.computed = !1, a.key = n.startNodeAt(n.lastTokStart, n.lastTokStartLoc), a.key.name = s, n.finishNode(a.key, "Identifier")) : n.parseClassElementName(a), n.parsePostMemberNameModifiers(a), n.isClassMethod() || i < 13 || n.type === o.parenL || u !== "method" || c || l) {
							var m = !a.static && gn(a, "constructor"), h = m && t;
							m && u !== "method" && n.raise(a.key.start, "Constructor can't have get/set modifier"), a.kind = m ? "constructor" : u, n.parseClassMethod(a, c, l, h);
						} else n.parseClassField(a);
						return a;
					}
					if (n.next(), n.next(), n.tsHasSomeModifiers(a, d) && n.raise(n.start, U.StaticBlockCannotHaveModifier), i >= 13) return e.prototype.parseClassStaticBlock.call(n, a), a;
				};
				return a.declare ? this.tsInAmbientContext(f) : f(), a;
			}, C.isClassElementNameStart = function() {
				return !!this.tsIsIdentifier() || e.prototype.isClassElementNameStart.call(this);
			}, C.parseClassSuper = function(t) {
				e.prototype.parseClassSuper.call(this, t), t.superClass && (this.tsMatchLeftRelational() || this.match(o.bitShift)) && (t.superTypeParameters = this.tsParseTypeArgumentsInExpression()), this.eatContextual("implements") && (t.implements = this.tsParseHeritageClause("implements"));
			}, C.parseFunctionParams = function(t) {
				var n = this.tsTryParseTypeParameters();
				n && (t.typeParameters = n), e.prototype.parseFunctionParams.call(this, t);
			}, C.parseVarId = function(t, n) {
				e.prototype.parseVarId.call(this, t, n), t.id.type === "Identifier" && !this.hasPrecedingLineBreak() && this.value === "!" && this.eat(o.prefix) && (t.definite = !0);
				var r = this.tsTryParseTypeAnnotation();
				r && (t.id.typeAnnotation = r, this.resetEndLocation(t.id));
			}, C.parseArrowExpression = function(e, t, n, r) {
				this.match(o.colon) && (e.returnType = this.tsParseTypeAnnotation());
				var i = this.yieldPos, a = this.awaitPos, s = this.awaitIdentPos;
				this.enterScope(16 | Tn(n, !1)), this.initFunction(e);
				var c = this.maybeInArrowParameters;
				return this.options.ecmaVersion >= 8 && (e.async = !!n), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.maybeInArrowParameters = !0, e.params = this.toAssignableList(t, !0), this.maybeInArrowParameters = !1, this.parseFunctionBody(e, !0, !1, r), this.yieldPos = i, this.awaitPos = a, this.awaitIdentPos = s, this.maybeInArrowParameters = c, this.finishNode(e, "ArrowFunctionExpression");
			}, C.parseMaybeAssignOrigin = function(e, t, n) {
				if (this.isContextual("yield")) {
					if (this.inGenerator) return this.parseYield(e);
					this.exprAllowed = !1;
				}
				var r = !1, i = -1, a = -1, s = -1;
				t ? (i = t.parenthesizedAssign, a = t.trailingComma, s = t.doubleProto, t.parenthesizedAssign = t.trailingComma = -1) : (t = new mn(), r = !0);
				var c = this.start, l = this.startLoc;
				(this.type === o.parenL || v(this.type)) && (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = e === "await");
				var u = this.parseMaybeConditional(e, t);
				if (n && (u = n.call(this, u, c, l)), this.type.isAssign) {
					var d = this.startNodeAt(c, l);
					return d.operator = this.value, this.type === o.eq && (u = this.toAssignable(u, !0, t)), r || (t.parenthesizedAssign = t.trailingComma = t.doubleProto = -1), t.shorthandAssign >= u.start && (t.shorthandAssign = -1), this.type === o.eq ? this.checkLValPattern(u) : this.checkLValSimple(u), d.left = u, this.next(), d.right = this.parseMaybeAssign(e), s > -1 && (t.doubleProto = s), this.finishNode(d, "AssignmentExpression");
				}
				return r && this.checkExpressionErrors(t, !0), i > -1 && (t.parenthesizedAssign = i), a > -1 && (t.trailingComma = a), u;
			}, C.parseMaybeAssign = function(e, t, n) {
				var r, a, o, s, c, l, u, d, f, p = this;
				if (this.matchJsx("jsxTagStart") || this.tsMatchLeftRelational()) {
					if (l = this.cloneCurLookaheadState(), !(u = this.tryParse(function() {
						return p.parseMaybeAssignOrigin(e, t, n);
					}, l)).error) return u.node;
					var m = this.context, h = m[m.length - 1];
					h === i.tokContexts.tc_oTag && m[m.length - 2] === i.tokContexts.tc_expr ? (m.pop(), m.pop()) : h !== i.tokContexts.tc_oTag && h !== i.tokContexts.tc_expr || m.pop();
				}
				if (!((r = u) != null && r.error || this.tsMatchLeftRelational())) return this.parseMaybeAssignOrigin(e, t, n);
				l && !this.compareLookaheadState(l, this.getCurLookaheadState()) || (l = this.cloneCurLookaheadState());
				var g = this.tryParse(function(r) {
					var i;
					f = p.tsParseTypeParameters();
					var a = p.parseMaybeAssignOrigin(e, t, n);
					return (a.type !== "ArrowFunctionExpression" || (i = a.extra) != null && i.parenthesized) && r(), f?.params.length !== 0 && p.resetStartLocationFromNode(a, f), a.typeParameters = f, a;
				}, l);
				if (!g.error && !g.aborted) return f && this.reportReservedArrowTypeParam(f), g.node;
				if (!u && (Sn(!0), !(d = this.tryParse(function() {
					return p.parseMaybeAssignOrigin(e, t, n);
				}, l)).error)) return d.node;
				if ((a = u) != null && a.node) return this.setLookaheadState(u.failState), u.node;
				if (g.node) return this.setLookaheadState(g.failState), f && this.reportReservedArrowTypeParam(f), g.node;
				if ((o = d) != null && o.node) return this.setLookaheadState(d.failState), d.node;
				throw (s = u) != null && s.thrown ? u.error : g.thrown ? g.error : (c = d) != null && c.thrown ? d.error : u?.error || g.error || d?.error;
			}, C.parseAssignableListItem = function(e) {
				for (var t = []; this.match(m.at);) t.push(this.parseDecorator());
				var n, r = this.start, i = this.startLoc, a = !1, o = !1;
				if (e !== void 0) {
					var s = {};
					this.tsParseModifiers({
						modified: s,
						allowedModifiers: [
							"public",
							"private",
							"protected",
							"override",
							"readonly"
						]
					}), n = s.accessibility, o = s.override, a = s.readonly, !1 === e && (n || a || o) && this.raise(i.start, U.UnexpectedParameterModifier);
				}
				var c = this.parseMaybeDefault(r, i);
				this.parseBindingListItem(c);
				var l = this.parseMaybeDefault(c.start, c.loc, c);
				if (t.length && (l.decorators = t), n || a || o) {
					var u = this.startNodeAt(r, i);
					return n && (u.accessibility = n), a && (u.readonly = a), o && (u.override = o), l.type !== "Identifier" && l.type !== "AssignmentPattern" && this.raise(u.start, U.UnsupportedParameterPropertyKind), u.parameter = l, this.finishNode(u, "TSParameterProperty");
				}
				return l;
			}, C.checkLValInnerPattern = function(t, n, r) {
				n === void 0 && (n = 0), t.type === "TSParameterProperty" ? this.checkLValInnerPattern(t.parameter, n, r) : e.prototype.checkLValInnerPattern.call(this, t, n, r);
			}, C.parseBindingListItem = function(e) {
				this.eat(o.question) && (e.type === "Identifier" || this.isAmbientContext || this.inType || this.raise(e.start, U.PatternIsOptional), e.optional = !0);
				var t = this.tsTryParseTypeAnnotation();
				return t && (e.typeAnnotation = t), this.resetEndLocation(e), e;
			}, C.isAssignable = function(e, t) {
				var n = this;
				switch (e.type) {
					case "TSTypeCastExpression": return this.isAssignable(e.expression, t);
					case "TSParameterProperty":
					case "Identifier":
					case "ObjectPattern":
					case "ArrayPattern":
					case "AssignmentPattern":
					case "RestElement": return !0;
					case "ObjectExpression":
						var r = e.properties.length - 1;
						return e.properties.every(function(e, t) {
							return e.type !== "ObjectMethod" && (t === r || e.type !== "SpreadElement") && n.isAssignable(e);
						});
					case "Property":
					case "ObjectProperty": return this.isAssignable(e.value);
					case "SpreadElement": return this.isAssignable(e.argument);
					case "ArrayExpression": return e.elements.every(function(e) {
						return e === null || n.isAssignable(e);
					});
					case "AssignmentExpression": return e.operator === "=";
					case "ParenthesizedExpression": return this.isAssignable(e.expression);
					case "MemberExpression":
					case "OptionalMemberExpression": return !t;
					default: return !1;
				}
			}, C.toAssignable = function(t, n, r) {
				switch (n === void 0 && (n = !1), r === void 0 && (r = new mn()), t.type) {
					case "ParenthesizedExpression": return this.toAssignableParenthesizedExpression(t, n, r);
					case "TSAsExpression":
					case "TSSatisfiesExpression":
					case "TSNonNullExpression":
					case "TSTypeAssertion": return n || this.raise(t.start, U.UnexpectedTypeCastInParameter), this.toAssignable(t.expression, n, r);
					case "MemberExpression": break;
					case "AssignmentExpression": return n || t.left.type !== "TSTypeCastExpression" || (t.left = this.typeCastToParameter(t.left)), e.prototype.toAssignable.call(this, t, n, r);
					case "TSTypeCastExpression": return this.typeCastToParameter(t);
					default: return e.prototype.toAssignable.call(this, t, n, r);
				}
				return t;
			}, C.toAssignableParenthesizedExpression = function(t, n, r) {
				switch (t.expression.type) {
					case "TSAsExpression":
					case "TSSatisfiesExpression":
					case "TSNonNullExpression":
					case "TSTypeAssertion":
					case "ParenthesizedExpression": return this.toAssignable(t.expression, n, r);
					default: return e.prototype.toAssignable.call(this, t, n, r);
				}
			}, C.curPosition = function() {
				if (this.options.locations) {
					var t = e.prototype.curPosition.call(this);
					return Object.defineProperty(t, "offset", { get: function() {
						return function(e) {
							var t = new n.Position(this.line, this.column + e);
							return t.index = this.index + e, t;
						};
					} }), t.index = this.pos, t;
				}
			}, C.parseBindingAtom = function() {
				return this.type === o._this ? this.parseIdent(!0) : e.prototype.parseBindingAtom.call(this);
			}, C.shouldParseArrow = function(e) {
				var t, n = this;
				if (t = this.match(o.colon) ? e.every(function(e) {
					return n.isAssignable(e, !0);
				}) : !this.canInsertSemicolon()) {
					if (this.match(o.colon)) {
						var r = this.tryParse(function(e) {
							var t = n.tsParseTypeOrTypePredicateAnnotation(o.colon);
							return !n.canInsertSemicolon() && n.match(o.arrow) || e(), t;
						});
						if (r.aborted) return this.shouldParseArrowReturnType = void 0, !1;
						r.thrown || (r.error && this.setLookaheadState(r.failState), this.shouldParseArrowReturnType = r.node);
					}
					return !!this.match(o.arrow) || (this.shouldParseArrowReturnType = void 0, !1);
				}
				return this.shouldParseArrowReturnType = void 0, t;
			}, C.parseParenArrowList = function(e, t, n, r) {
				var i = this.startNodeAt(e, t);
				return i.returnType = this.shouldParseArrowReturnType, this.shouldParseArrowReturnType = void 0, this.parseArrowExpression(i, n, !1, r);
			}, C.parseParenAndDistinguishExpression = function(e, t) {
				var n, r = this.start, i = this.startLoc, a = this.options.ecmaVersion >= 8;
				if (this.options.ecmaVersion >= 6) {
					var s = this.maybeInArrowParameters;
					this.maybeInArrowParameters = !0, this.next();
					var c, l = this.start, u = this.startLoc, d = [], f = !0, p = !1, m = new mn(), h = this.yieldPos, g = this.awaitPos;
					for (this.yieldPos = 0, this.awaitPos = 0; this.type !== o.parenR;) {
						if (f ? f = !1 : this.expect(o.comma), a && this.afterTrailingComma(o.parenR, !0)) {
							p = !0;
							break;
						}
						if (this.type === o.ellipsis) {
							c = this.start, d.push(this.parseParenItem(this.parseRestBinding())), this.type === o.comma && this.raise(this.start, "Comma is not permitted after the rest element");
							break;
						}
						d.push(this.parseMaybeAssign(t, m, this.parseParenItem));
					}
					var _ = this.lastTokEnd, ee = this.lastTokEndLoc;
					if (this.expect(o.parenR), this.maybeInArrowParameters = s, e && this.shouldParseArrow(d) && this.eat(o.arrow)) return this.checkPatternErrors(m, !1), this.checkYieldAwaitInDefaultParams(), this.yieldPos = h, this.awaitPos = g, this.parseParenArrowList(r, i, d, t);
					d.length && !p || this.unexpected(this.lastTokStart), c && this.unexpected(c), this.checkExpressionErrors(m, !0), this.yieldPos = h || this.yieldPos, this.awaitPos = g || this.awaitPos, d.length > 1 ? ((n = this.startNodeAt(l, u)).expressions = d, this.finishNodeAt(n, "SequenceExpression", _, ee)) : n = d[0];
				} else n = this.parseParenExpression();
				if (this.options.preserveParens) {
					var te = this.startNodeAt(r, i);
					return te.expression = n, this.finishNode(te, "ParenthesizedExpression");
				}
				return n;
			}, C.parseTaggedTemplateExpression = function(e, t, n, r) {
				var i = this.startNodeAt(t, n);
				return i.tag = e, i.quasi = this.parseTemplate({ isTagged: !0 }), r && this.raise(t, "Tagged Template Literals are not allowed in optionalChain."), this.finishNode(i, "TaggedTemplateExpression");
			}, C.shouldParseAsyncArrow = function() {
				var e = this;
				if (!this.match(o.colon)) return !this.canInsertSemicolon() && this.eat(o.arrow);
				var t = this.tryParse(function(t) {
					var n = e.tsParseTypeOrTypePredicateAnnotation(o.colon);
					return !e.canInsertSemicolon() && e.match(o.arrow) || t(), n;
				});
				return t.aborted ? (this.shouldParseAsyncArrowReturnType = void 0, !1) : t.thrown ? void 0 : (t.error && this.setLookaheadState(t.failState), this.shouldParseAsyncArrowReturnType = t.node, !this.canInsertSemicolon() && this.eat(o.arrow));
			}, C.parseSubscriptAsyncArrow = function(e, t, n, r) {
				var i = this.startNodeAt(e, t);
				return i.returnType = this.shouldParseAsyncArrowReturnType, this.shouldParseAsyncArrowReturnType = void 0, this.parseArrowExpression(i, n, !0, r);
			}, C.parseExprList = function(e, t, n, r) {
				for (var i = [], a = !0; !this.eat(e);) {
					if (a) a = !1;
					else if (this.expect(o.comma), t && this.afterTrailingComma(e)) break;
					var s = void 0;
					n && this.type === o.comma ? s = null : this.type === o.ellipsis ? (s = this.parseSpread(r), r && this.type === o.comma && r.trailingComma < 0 && (r.trailingComma = this.start)) : s = this.parseMaybeAssign(!1, r, this.parseParenItem), i.push(s);
				}
				return i;
			}, C.parseSubscript = function(e, t, n, r, i, a, s) {
				var c = this, l = a;
				if (!this.hasPrecedingLineBreak() && this.value === "!" && this.match(o.prefix)) {
					this.exprAllowed = !1, this.next();
					var u = this.startNodeAt(t, n);
					return u.expression = e, e = this.finishNode(u, "TSNonNullExpression");
				}
				var d = !1;
				if (this.match(o.questionDot) && this.lookaheadCharCode() === 60) {
					if (r) return e;
					e.optional = !0, l = d = !0, this.next();
				}
				if (this.tsMatchLeftRelational() || this.match(o.bitShift)) {
					var f, p = this.tsTryParseAndCatch(function() {
						if (!r && c.atPossibleAsyncArrow(e)) {
							var i = c.tsTryParseGenericAsyncArrowFunction(t, n, s);
							if (i) return e = i;
						}
						var a = c.tsParseTypeArgumentsInExpression();
						if (!a) return e;
						if (d && !c.match(o.parenL)) return f = c.curPosition(), e;
						if (ee(c.type) || c.type === o.backQuote) {
							var u = c.parseTaggedTemplateExpression(e, t, n, l);
							return u.typeParameters = a, u;
						}
						if (!r && c.eat(o.parenL)) {
							var p = new mn(), m = c.startNodeAt(t, n);
							return m.callee = e, m.arguments = c.parseExprList(o.parenR, c.options.ecmaVersion >= 8, !1, p), c.tsCheckForInvalidTypeCasts(m.arguments), m.typeParameters = a, l && (m.optional = d), c.checkExpressionErrors(p, !0), e = c.finishNode(m, "CallExpression");
						}
						var h = c.type;
						if (!(c.tsMatchRightRelational() || h === o.bitShift || h !== o.parenL && (g = h, g.startsExpr) && !c.hasPrecedingLineBreak())) {
							var g, _ = c.startNodeAt(t, n);
							return _.expression = e, _.typeParameters = a, c.finishNode(_, "TSInstantiationExpression");
						}
					});
					if (f && this.unexpected(f), p) return p.type === "TSInstantiationExpression" && (this.match(o.dot) || this.match(o.questionDot) && this.lookaheadCharCode() !== 40) && this.raise(this.start, U.InvalidPropertyAccessAfterInstantiationExpression), e = p;
				}
				var m = this.options.ecmaVersion >= 11, h = m && this.eat(o.questionDot);
				r && h && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
				var g = this.eat(o.bracketL);
				if (g || h && this.type !== o.parenL && this.type !== o.backQuote || this.eat(o.dot)) {
					var _ = this.startNodeAt(t, n);
					_.object = e, g ? (_.property = this.parseExpression(), this.expect(o.bracketR)) : _.property = this.type === o.privateId && e.type !== "Super" ? this.parsePrivateIdent() : this.parseIdent(this.options.allowReserved !== "never"), _.computed = !!g, m && (_.optional = h), e = this.finishNode(_, "MemberExpression");
				} else if (!r && this.eat(o.parenL)) {
					var te = this.maybeInArrowParameters;
					this.maybeInArrowParameters = !0;
					var v = new mn(), ne = this.yieldPos, y = this.awaitPos, b = this.awaitIdentPos;
					this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
					var x = this.parseExprList(o.parenR, this.options.ecmaVersion >= 8, !1, v);
					if (i && !h && this.shouldParseAsyncArrow()) this.checkPatternErrors(v, !1), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = ne, this.awaitPos = y, this.awaitIdentPos = b, e = this.parseSubscriptAsyncArrow(t, n, x, s);
					else {
						this.checkExpressionErrors(v, !0), this.yieldPos = ne || this.yieldPos, this.awaitPos = y || this.awaitPos, this.awaitIdentPos = b || this.awaitIdentPos;
						var S = this.startNodeAt(t, n);
						S.callee = e, S.arguments = x, m && (S.optional = h), e = this.finishNode(S, "CallExpression");
					}
					this.maybeInArrowParameters = te;
				} else if (this.type === o.backQuote) {
					(h || l) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
					var C = this.startNodeAt(t, n);
					C.tag = e, C.quasi = this.parseTemplate({ isTagged: !0 }), e = this.finishNode(C, "TaggedTemplateExpression");
				}
				return e;
			}, C.parseGetterSetter = function(e) {
				e.kind = e.key.name, this.parsePropertyName(e), e.value = this.parseMethod(!1);
				var t = e.kind === "get" ? 0 : 1, n = e.value.params[0], r = n && this.isThisParam(n);
				e.value.params.length === (t = r ? t + 1 : t) ? e.kind === "set" && e.value.params[0].type === "RestElement" && this.raiseRecoverable(e.value.params[0].start, "Setter cannot use rest params") : this.raiseRecoverable(e.value.start, e.kind === "get" ? "getter should have no params" : "setter should have exactly one param");
			}, C.parseProperty = function(t, n) {
				if (!t) {
					var r = [];
					if (this.match(m.at)) for (; this.match(m.at);) r.push(this.parseDecorator());
					var i = e.prototype.parseProperty.call(this, t, n);
					return i.type === "SpreadElement" && r.length && this.raise(i.start, "Decorators can't be used with SpreadElement"), r.length && (i.decorators = r, r = []), i;
				}
				return e.prototype.parseProperty.call(this, t, n);
			}, C.parseCatchClauseParam = function() {
				var e = this.parseBindingAtom(), t = e.type === "Identifier";
				this.enterScope(t ? 32 : 0), this.checkLValPattern(e, t ? 4 : 2);
				var n = this.tsTryParseTypeAnnotation();
				return n && (e.typeAnnotation = n, this.resetEndLocation(e)), this.expect(o.parenR), e;
			}, C.parseClass = function(e, t) {
				var n = this.inAbstractClass;
				this.inAbstractClass = !!e.abstract;
				try {
					this.next(), this.takeDecorators(e);
					var r = this.strict;
					this.strict = !0, this.parseClassId(e, t), this.parseClassSuper(e);
					var i = this.enterClassBody(), a = this.startNode(), s = !1;
					a.body = [];
					var c = [];
					for (this.expect(o.braceL); this.type !== o.braceR;) if (this.match(m.at)) c.push(this.parseDecorator());
					else {
						var l = this.parseClassElement(e.superClass !== null);
						c.length && (l.decorators = c, this.resetStartLocationFromNode(l, c[0]), c = []), l && (a.body.push(l), l.type === "MethodDefinition" && l.kind === "constructor" && l.value.type === "FunctionExpression" ? (s && this.raiseRecoverable(l.start, "Duplicate constructor in the same class"), s = !0, l.decorators && l.decorators.length > 0 && this.raise(l.start, "Decorators can't be used with a constructor. Did you mean '@dec class { ... }'?")) : l.key && l.key.type === "PrivateIdentifier" && hn(i, l) && this.raiseRecoverable(l.key.start, "Identifier '#" + l.key.name + "' has already been declared"));
					}
					return this.strict = r, this.next(), c.length && this.raise(this.start, "Decorators must be attached to a class element."), e.body = this.finishNode(a, "ClassBody"), this.exitClassBody(), this.finishNode(e, t ? "ClassDeclaration" : "ClassExpression");
				} finally {
					this.inAbstractClass = n;
				}
			}, C.parseClassFunctionParams = function() {
				var e = this.tsTryParseTypeParameters(this.tsParseConstModifier), t = this.parseBindingList(o.parenR, !1, this.options.ecmaVersion >= 8, !0);
				return e && (t.typeParameters = e), t;
			}, C.parseMethod = function(e, t, n, r, i) {
				var a = this.startNode(), s = this.yieldPos, c = this.awaitPos, l = this.awaitIdentPos;
				if (this.initFunction(a), this.options.ecmaVersion >= 6 && (a.generator = e), this.options.ecmaVersion >= 8 && (a.async = !!t), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(64 | Tn(t, a.generator) | (n ? 128 : 0)), this.expect(o.parenL), a.params = this.parseClassFunctionParams(), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(a, !1, !0, !1, { isClassMethod: r }), this.yieldPos = s, this.awaitPos = c, this.awaitIdentPos = l, i && i.abstract && a.body) {
					var u = i.key;
					this.raise(i.start, U.AbstractMethodHasImplementation({ methodName: u.type !== "Identifier" || i.computed ? "[" + this.input.slice(u.start, u.end) + "]" : u.name }));
				}
				return this.finishNode(a, "FunctionExpression");
			}, t.parse = function(e, t) {
				if (!1 === t.locations) throw Error("You have to enable options.locations while using acorn-typescript");
				t.locations = !0;
				var n = new this(t, e);
				return r && (n.isAmbientContext = !0), n.parse();
			}, t.parseExpressionAt = function(e, t, n) {
				if (!1 === n.locations) throw Error("You have to enable options.locations while using acorn-typescript");
				n.locations = !0;
				var i = new this(n, e, t);
				return r && (i.isAmbientContext = !0), i.nextToken(), i.parseExpression();
			}, C.parseImportSpecifier = function() {
				if (this.ts_isContextual(m.type)) {
					var t = this.startNode();
					return t.imported = this.parseModuleExportName(), this.parseTypeOnlyImportExportSpecifier(t, !0, this.importOrExportOuterKind === "type"), this.finishNode(t, "ImportSpecifier");
				}
				var n = e.prototype.parseImportSpecifier.call(this);
				return n.importKind = "value", n;
			}, C.parseExportSpecifier = function(t) {
				var n = this.ts_isContextual(m.type);
				if (!this.match(o.string) && n) {
					var r = this.startNode();
					return r.local = this.parseModuleExportName(), this.parseTypeOnlyImportExportSpecifier(r, !1, this.importOrExportOuterKind === "type"), this.finishNode(r, "ExportSpecifier"), this.checkExport(t, r.exported, r.exported.start), r;
				}
				var i = e.prototype.parseExportSpecifier.call(this, t);
				return i.exportKind = "value", i;
			}, C.parseTypeOnlyImportExportSpecifier = function(t, n, r) {
				var i, a = n ? "imported" : "local", o = n ? "local" : "exported", s = t[a], c = !1, l = !0, u = s.start;
				if (this.isContextual("as")) {
					var d = this.parseIdent();
					if (this.isContextual("as")) {
						var f = this.parseIdent();
						ne(this.type) ? (c = !0, s = d, i = n ? this.parseIdent() : this.parseModuleExportName(), l = !1) : (i = f, l = !1);
					} else ne(this.type) ? (l = !1, i = n ? this.parseIdent() : this.parseModuleExportName()) : (c = !0, s = d);
				} else ne(this.type) && (c = !0, n ? (s = e.prototype.parseIdent.call(this, !0), this.isContextual("as") || this.checkUnreserved(s)) : s = this.parseModuleExportName());
				c && r && this.raise(u, n ? U.TypeModifierIsUsedInTypeImports : U.TypeModifierIsUsedInTypeExports), t[a] = s, t[o] = i, t[n ? "importKind" : "exportKind"] = c ? "type" : "value", l && this.eatContextual("as") && (t[o] = n ? this.parseIdent() : this.parseModuleExportName()), t[o] || (t[o] = this.copyNode(t[a])), n && this.checkLValSimple(t[o], 2);
			}, C.raiseCommonCheck = function(t, n, r) {
				return n === "Comma is not permitted after the rest element" ? this.isAmbientContext && this.match(o.comma) && this.lookaheadCharCode() === 41 ? void this.next() : e.prototype.raise.call(this, t, n) : r ? e.prototype.raiseRecoverable.call(this, t, n) : e.prototype.raise.call(this, t, n);
			}, C.raiseRecoverable = function(e, t) {
				return this.raiseCommonCheck(e, t, !0);
			}, C.raise = function(e, t) {
				return this.raiseCommonCheck(e, t, !0);
			}, C.updateContext = function(t) {
				var n = this.type;
				if (n == o.braceL) {
					var r = this.curContext();
					r == h.tc_oTag ? this.context.push(f.b_expr) : r == h.tc_expr ? this.context.push(f.b_tmpl) : e.prototype.updateContext.call(this, t), this.exprAllowed = !0;
				} else {
					if (n !== o.slash || t !== m.jsxTagStart) return e.prototype.updateContext.call(this, t);
					this.context.length -= 2, this.context.push(h.tc_cTag), this.exprAllowed = !1;
				}
			}, C.jsx_parseOpeningElementAt = function(e, t) {
				var n = this, r = this.startNodeAt(e, t), i = this.jsx_parseElementName();
				if (i && (r.name = i), this.match(o.relational) || this.match(o.bitShift)) {
					var a = this.tsTryParseAndCatch(function() {
						return n.tsParseTypeArgumentsInExpression();
					});
					a && (r.typeParameters = a);
				}
				for (r.attributes = []; this.type !== o.slash && this.type !== m.jsxTagEnd;) r.attributes.push(this.jsx_parseAttribute());
				return r.selfClosing = this.eat(o.slash), this.expect(m.jsxTagEnd), this.finishNode(r, i ? "JSXOpeningElement" : "JSXOpeningFragment");
			}, C.enterScope = function(t) {
				t === fn && this.importsStack.push([]), e.prototype.enterScope.call(this, t);
				var n = e.prototype.currentScope.call(this);
				n.types = [], n.enums = [], n.constEnums = [], n.classes = [], n.exportOnlyBindings = [];
			}, C.exitScope = function() {
				e.prototype.currentScope.call(this).flags === fn && this.importsStack.pop(), e.prototype.exitScope.call(this);
			}, C.hasImport = function(e, t) {
				var n = this.importsStack.length;
				if (this.importsStack[n - 1].indexOf(e) > -1) return !0;
				if (!t && n > 1) {
					for (var r = 0; r < n - 1; r++) if (this.importsStack[r].indexOf(e) > -1) return !0;
				}
				return !1;
			}, C.maybeExportDefined = function(e, t) {
				this.inModule && 1 & e.flags && this.undefinedExports.delete(t);
			}, C.isRedeclaredInScope = function(t, n, r) {
				return !!(0 & r) && (2 & r ? t.lexical.indexOf(n) > -1 || t.functions.indexOf(n) > -1 || t.var.indexOf(n) > -1 : 3 & r ? t.lexical.indexOf(n) > -1 || !e.prototype.treatFunctionsAsVarInScope.call(this, t) && t.var.indexOf(n) > -1 : t.lexical.indexOf(n) > -1 && !(32 & t.flags && t.lexical[0] === n) || !this.treatFunctionsAsVarInScope(t) && t.functions.indexOf(n) > -1);
			}, C.checkRedeclarationInScope = function(e, t, n, r) {
				this.isRedeclaredInScope(e, t, n) && this.raise(r, "Identifier '" + t + "' has already been declared.");
			}, C.declareName = function(t, n, r) {
				if (4096 & n) return this.hasImport(t, !0) && this.raise(r, "Identifier '" + t + "' has already been declared."), void this.importsStack[this.importsStack.length - 1].push(t);
				var i = this.currentScope();
				if (1024 & n) return this.maybeExportDefined(i, t), void i.exportOnlyBindings.push(t);
				e.prototype.declareName.call(this, t, n, r), 0 & n && (0 & n || (this.checkRedeclarationInScope(i, t, n, r), this.maybeExportDefined(i, t)), i.types.push(t)), 256 & n && i.enums.push(t), 512 & n && i.constEnums.push(t), 128 & n && i.classes.push(t);
			}, C.checkLocalExport = function(t) {
				var n = t.name;
				if (!this.hasImport(n)) {
					for (var r = this.scopeStack.length - 1; r >= 0; r--) {
						var i = this.scopeStack[r];
						if (i.types.indexOf(n) > -1 || i.exportOnlyBindings.indexOf(n) > -1) return;
					}
					e.prototype.checkLocalExport.call(this, t);
				}
			}, u = t, S = [{
				key: "acornTypeScript",
				get: function() {
					return i;
				}
			}], (x = [{
				key: "acornTypeScript",
				get: function() {
					return i;
				}
			}]) && rn(u.prototype, x), S && rn(u, S), Object.defineProperty(u, "prototype", { writable: !1 }), t;
		}(t);
	};
}
//#endregion
//#region src/utilities/index.ts
var An = [
	{
		idPrefix: "dpuse-app",
		typeId: "app",
		publishedTo: void 0,
		uploadGroupName: void 0
	},
	{
		idPrefix: "dpuse-api",
		typeId: "api",
		publishedTo: void 0,
		uploadGroupName: void 0
	},
	{
		idPrefix: "dpuse-connector",
		typeId: "connector",
		publishedTo: "dpuse",
		uploadGroupName: "connectors"
	},
	{
		idPrefix: "dpuse-context",
		typeId: "context",
		publishedTo: "dpuse",
		uploadGroupName: "contexts"
	},
	{
		idPrefix: "dpuse-development",
		typeId: "development",
		publishedTo: "npm",
		uploadGroupName: void 0
	},
	{
		idPrefix: "dpuse-engine",
		typeId: "engine",
		publishedTo: "dpuse",
		uploadGroupName: "engine"
	},
	{
		idPrefix: "dpuse-kb",
		typeId: "kb",
		publishedTo: void 0,
		uploadGroupName: void 0
	},
	{
		idPrefix: "dpuse-presenter",
		typeId: "presenter",
		publishedTo: "dpuse",
		uploadGroupName: "presenters"
	},
	{
		idPrefix: "dpuse-cookbook",
		typeId: "cookbook",
		publishedTo: "dpuse",
		uploadGroupName: "cookbooks"
	},
	{
		idPrefix: "dpuse-resources",
		typeId: "resources",
		publishedTo: void 0,
		uploadGroupName: void 0
	},
	{
		idPrefix: "dpuse-shared",
		typeId: "shared",
		publishedTo: "npm",
		uploadGroupName: void 0
	},
	{
		idPrefix: "dpuse-tool",
		typeId: "tool",
		publishedTo: "npm",
		uploadGroupName: "tools"
	}
], jn = r(i);
async function Mn(e, r) {
	e !== void 0 && q(`${e} - clear(${r})`);
	let i;
	try {
		i = await t.readdir(r, { withFileTypes: !0 });
	} catch (e) {
		if (e.code === "ENOENT") return;
		throw e;
	}
	await Promise.all(i.map(async (e) => {
		let i = n.join(r, e.name);
		try {
			await t.rm(i, {
				recursive: !0,
				force: !0
			});
		} catch (e) {
			if (e.code !== "ENOENT") throw e;
		}
	}));
}
async function Nn(e, n) {
	return t.readdir(e, n);
}
async function Pn(e, n, r = [], i) {
	e !== void 0 && q(`${e} - exec(${n} ${r.join(" ")})`);
	let { stdout: a, stderr: o } = await jn(n, r);
	i === void 0 ? a.trim() && console.log(a.trim()) : await t.writeFile(i, a.trim(), "utf8"), o.trim() && console.error(o.trim());
}
async function Fn(e, t, n = [], r = !1, i = !1) {
	return q(`${e} - spawn(${t} ${n.join(" ")})`), new Promise((e, o) => {
		a(t, n, {
			shell: i,
			stdio: "inherit"
		}).on("close", (n) => {
			n === 0 || r ? e() : o(/* @__PURE__ */ Error(`${t} exited with code ${String(n ?? "unknown")}`));
		});
	});
}
async function In(e, n, r = [], i, o = !1) {
	return q(`${e} - spawn(${n} ${r.join(" ")}) > ${i}`), new Promise((e, s) => {
		let c = a(n, r, {
			shell: !1,
			stdio: [
				"inherit",
				"pipe",
				"inherit"
			]
		}), l = "";
		c.stdout.on("data", (e) => {
			l += String(e);
		}), c.on("close", (r) => {
			r === 0 || o ? (async () => {
				try {
					await t.writeFile(i, l, "utf8"), e();
				} catch (e) {
					s(e instanceof Error ? e : Error(String(e)));
				}
			})() : s(/* @__PURE__ */ Error(`${n} exited with code ${String(r ?? "unknown")}`));
		});
	});
}
async function W(e) {
	return JSON.parse(await t.readFile(e, "utf8"));
}
async function Ln(e) {
	return await t.readFile(e, "utf8");
}
async function Rn(e) {
	try {
		await t.unlink(e);
	} catch (e) {
		if (e.code !== "ENOENT") throw e;
	}
}
async function zn(e, n) {
	await t.writeFile(e, JSON.stringify(n, void 0, 4), "utf8");
}
async function Bn(e, n) {
	await t.writeFile(e, n, "utf8");
}
function G(e) {
	let t = "─".repeat(Math.max(e.length + 60, 60));
	console.info(`\n[36m${t}`), console.info(`▶️  ${e}`), console.info(`${t}[0m`);
}
function K(e) {
	console.info(`\n✅  ${e}\n`);
}
function q(e) {
	console.info(`\n${e}\n`);
}
function Vn(e) {
	let t = An.find((t) => e.startsWith(t.idPrefix));
	if (!t) throw Error(`Failed to locate module type configuration for identifier '${e}'.`);
	return t;
}
async function Hn(e) {
	return await t.stat(e);
}
function Un(e) {
	let t = k.extend(kn()).parse(e, {
		ecmaVersion: "latest",
		sourceType: "module",
		locations: !0
	}), n = [];
	return Wn(t, (e) => {
		if (e.type !== "MethodDefinition") return;
		let t = e, r = t.key;
		if (r.type !== "Identifier") return;
		let i = r.name;
		i && i !== "constructor" && t.accessibility !== "private" && n.push(i);
	}), n;
}
function Wn(e, t) {
	t(e);
	for (let [n, r] of Object.entries(e)) {
		if ([
			"loc",
			"range",
			"start",
			"end",
			"comments"
		].includes(n)) continue;
		let e = r;
		if (Array.isArray(e)) for (let n of e) {
			let e = n;
			e && typeof e.type == "string" && Wn(e, t);
		}
		else e && typeof e == "object" && typeof e.type == "string" && Wn(e, t);
	}
}
function Gn(e, t, n, r) {
	let i = e.indexOf(n), a = e.indexOf(r);
	if (i === -1 || a === -1) throw Error(`Markers ${n}-${r} not found in content.`);
	return `${e.slice(0, Math.max(0, i + n.length))}\n${t}\n${e.slice(Math.max(0, a))}`;
}
//#endregion
//#region src/actions/auditDependencies.ts
async function Kn() {
	try {
		G("Audit Dependencies"), await Fn("1️⃣  Check using 'npm audit'", "npm", ["audit"]), K("Dependencies audited.");
	} catch (e) {
		console.error("❌  Error auditing dependencies.", e), process.exit(1);
	}
}
//#endregion
//#region src/actions/checkConfigFiles.ts
async function qn() {
	try {
		G("Check configuration files.");
		let e = Vn((await W("config.json")).id), t = n.dirname(o(import.meta.url));
		await Jn(t, "../", ".editorconfig"), await Jn(t, "../", ".gitattributes"), await Jn(t, "../", e.publishedTo === "npm" ? ".gitignore_published" : ".gitignore_unpublished"), await Jn(t, "../", ".markdownlint.json"), await Jn(t, "../", "LICENSE"), K("Configuration files checked..");
	} catch (e) {
		console.error("❌  Error checking configuration files.", e), process.exit(1);
	}
}
async function Jn(e, t, r) {
	let i = await Ln(n.resolve(e, `${t}${r}`)), a = n.resolve(process.cwd(), r.split("_", 1)[0] ?? r), o;
	try {
		o = await Ln(a);
	} catch (e) {
		if (e.code !== "ENOENT") throw e;
	}
	if (o === i) {
		console.info(`ℹ️  File '${r.split("_", 1)[0] ?? r}' is the same`);
		return;
	}
	console.info(`⚠️  File '${r.split("_", 1)[0] ?? r}' is NOT the same.`);
}
//#endregion
//#region src/actions/checkDependencies.ts
async function Yn() {
	try {
		G("Check Dependencies"), await Fn("1️⃣  Check using 'npm outdated'", "npm", ["outdated"], !0), await Fn("2️⃣  Check using 'npm-check-updates'", "npm-check-updates", [
			"-i",
			"--dep",
			"dev,prod,peer,optional"
		]), K("Dependencies checked.");
	} catch (e) {
		console.error("❌  Error checking dependencies.", e), process.exit(1);
	}
}
//#endregion
//#region src/actions/documentBundleSizes.ts
var Xn = r(c), Zn = r(s), Qn = "<!-- BUNDLE_START -->", $n = "<!-- BUNDLE_END -->", er = "&nbsp;&nbsp;&nbsp;&nbsp;", tr = 20;
async function nr() {
	try {
		G("Document Bundle Sizes"), q("1️⃣  Read bundle analysis report");
		let e = await W("./bundle-analysis-reports/rollup-visualiser/index.json");
		q("2️⃣  Insert table into 'README.md'");
		let t = await rr(e);
		await Bn("README.md", Gn(await Ln("./README.md"), `\n${t}\n`, Qn, $n)), K("Bundle sizes documented.");
	} catch (e) {
		console.error("❌  Error documenting bundle sizes.", e), process.exit(1);
	}
}
async function rr(e) {
	let t = ar(e), n = [...t.values()].reduce((e, t) => e + t.sizes.rendered, 0), r = await ir();
	r.sort((e, t) => t[1].rendered - e[1].rendered);
	let i = ["| Module | Composition |", "| ------ | ----------- |"];
	for (let [e, a] of r) {
		i.push(`| ${e} | ${fr(a.rendered)} · gz ${fr(a.gzip)} · br ${fr(a.brotli)} |`);
		let r = [...t.entries()].sort((e, t) => t[1].sizes.rendered - e[1].sizes.rendered);
		for (let [e, { sizes: t, files: a }] of r) {
			let r = n > 0 ? t.rendered / n * 100 : 0;
			i.push(`| ${er}${e} | ${or(r)} |`);
			let o = [...a.entries()].sort((e, t) => t[1].rendered - e[1].rendered);
			for (let [e, t] of o) {
				let r = n > 0 ? t.rendered / n * 100 : 0;
				i.push(`| ${er}${er}${e} | ${or(r)} |`);
			}
		}
	}
	return i.join("\n");
}
async function ir() {
	let e = (await t.readdir("./dist")).filter((e) => e.endsWith(".js") && !e.endsWith(".map"));
	return Promise.all(e.map(async (e) => {
		let n = await t.readFile(`./dist/${e}`), [r, i] = await Promise.all([Xn(n), Zn(n)]);
		return [e, {
			rendered: n.length,
			gzip: r.length,
			brotli: i.length
		}];
	}));
}
function ar(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of Object.values(e.nodeMetas)) {
		let r = sr(n.id), i = cr(n.id);
		for (let a of Object.values(n.moduleParts)) {
			let n = e.nodeParts[a];
			if (!n) continue;
			let o = lr(n), s = t.get(r) ?? {
				sizes: ur(),
				files: /* @__PURE__ */ new Map()
			};
			dr(s.sizes, o), dr(s.files.get(i) ?? (() => {
				let e = ur();
				return s.files.set(i, e), e;
			})(), o), t.set(r, s);
		}
	}
	return t;
}
function or(e) {
	let t = Math.round(e / 100 * tr);
	return `\`${"█".repeat(t)}${"░".repeat(tr - t)}\` ${e.toFixed(1)}%`;
}
function sr(e) {
	let t = e.startsWith("/") ? e.slice(1) : e;
	if (t.startsWith("\0")) return "(runtime)";
	if (t.startsWith("node_modules/")) {
		let e = t.slice(13);
		if (e.startsWith("@")) {
			let t = e.split("/");
			return `${t[0]}/${t[1]}`;
		}
		return e.split("/")[0] ?? e;
	}
	return t.startsWith("rust/") || t.startsWith("__vite-plugin-wasm") ? "wasm" : "src";
}
function cr(e) {
	let t = e.startsWith("/") ? e.slice(1) : e;
	if (t.startsWith("\0")) return t.slice(1);
	if (t.startsWith("node_modules/")) {
		let e = t.slice(13);
		return (e.startsWith("@") ? e.split("/").slice(2) : e.split("/").slice(1)).join("/") || (e.split("/").at(-1) ?? e);
	}
	return t.split("/").at(-1) ?? t;
}
function lr(e) {
	return {
		rendered: e.renderedLength,
		gzip: e.gzipLength,
		brotli: e.brotliLength
	};
}
function ur() {
	return {
		rendered: 0,
		gzip: 0,
		brotli: 0
	};
}
function dr(e, t) {
	e.rendered += t.rendered, e.gzip += t.gzip, e.brotli += t.brotli;
}
function fr(e) {
	return e < 1024 ? `${e} B` : `${(e / 1024).toFixed(1)} kB`;
}
//#endregion
//#region src/actions/documentDependencies.ts
var pr = "<!-- DEPENDENCY_LICENSES_START -->", mr = "<!-- DEPENDENCY_LICENSES_END -->", hr = "<!-- DEPENDENCY_TREE_START -->", gr = "<!-- DEPENDENCY_TREE_END -->";
async function _r(e = "MIT") {
	try {
		G("Document Dependencies"), await Mn("1️⃣  Clear downloaded licenses", "licenses/downloads"), await Pn("2️⃣  Identify production licenses", "license-checker-rseidelsohn", [
			"--production",
			"--json",
			"--files",
			"licenses/downloads",
			"--relativeModulePath",
			"--relativeLicensePath",
			"--onlyAllow",
			e,
			"--excludePackages",
			(await W("package.json")).name ?? "",
			"--out",
			"licenses/licenses.json"
		]), await In("3️⃣  Identify transitive dependencies", "npm", [
			"ls",
			"--all",
			"--json",
			"--omit=dev"
		], "licenses/licenseTree.json"), await vr("4️⃣ "), K("Dependencies documented.");
	} catch (e) {
		console.error("❌  Error documenting dependencies.", e), process.exit(1);
	}
}
async function vr(e) {
	q(`${e} Insert licenses into 'README.md'`);
	let [t, n] = await Promise.all([W("licenses/licenses.json"), W("licenses/licenseTree.json")]), r = /* @__PURE__ */ new Map();
	for (let [e, n] of Object.entries(t)) r.set(e, yr(e, n));
	await Promise.all(r.values().map(async (e) => {
		let t = await br(e.name, e.installedVersion);
		e.latestVersion = t.latestVersion, e.latestPublishedDate = t.latestPublishedDate, e.publishedDate = t.publishedDate;
	}));
	let i = "|Name|Version|License(s)|Document|\n|-|:-:|-|-|\n";
	for (let e of r.values()) i += xr(e);
	let a = [];
	n.dependencies != null && Sr(n.dependencies, r, a, 0), await Bn("README.md", Gn(Gn(await Ln("./README.md"), i, pr, mr), a.join("\n"), hr, gr));
}
function yr(e, t) {
	let n = e.lastIndexOf("@"), r = n > 0 ? e.slice(0, n) : e, i = n > 0 ? e.slice(n + 1) : "";
	return {
		name: r,
		repository: t.repository ?? `https://www.npmjs.com/package/${r}`,
		licenseTypes: t.licenses,
		installedVersion: i,
		author: t.publisher ?? "",
		latestVersion: "",
		latestPublishedDate: "",
		publishedDate: "",
		...t.licenseFile != null && { licenseFileLink: t.licenseFile }
	};
}
async function br(e, t) {
	try {
		let n = await fetch(`https://registry.npmjs.org/${encodeURIComponent(e)}`);
		if (n.ok) {
			let e = await n.json(), r = new Map(Object.entries(e["dist-tags"] ?? {})), i = new Map(Object.entries(e.time ?? {})), a = r.get("latest") ?? "", o = i.get(t) ?? "";
			return {
				latestVersion: a,
				latestPublishedDate: a === t ? "" : i.get(a) ?? "",
				publishedDate: o
			};
		}
	} catch {}
	return {
		latestVersion: "",
		latestPublishedDate: "",
		publishedDate: ""
	};
}
function xr(e) {
	let t = e.licenseFileLink == null || e.licenseFileLink === "" ? "⚠️  No license file" : `[LICENSE](licenses/${e.licenseFileLink})`;
	return `|[${e.name}](${e.repository})|${e.installedVersion}|${e.licenseTypes}|${t}|\n`;
}
function Sr(e, t, n, r) {
	let i = "  ".repeat(r);
	for (let [a, o] of Object.entries(e)) {
		let e = o.version ?? "", s = t.get(`${a}@${e}`), c = s == null ? a : `[${a}](${s.repository})`, l = Cr(s);
		n.push(`${i}- **${c}** ${e}${l}`), o.dependencies != null && Sr(o.dependencies, t, n, r + 1);
	}
}
function Cr(e) {
	if (e == null) return "";
	let t = e.publishedDate ? wr(e.publishedDate.split("T", 1)[0]) : "";
	if (!(e.latestVersion !== "" && e.latestVersion !== e.installedVersion)) return t === "" ? "" : ` — ${t}`;
	let n = e.latestPublishedDate ? wr(e.latestPublishedDate.split("T", 1)[0]) : "", r = n === "" ? `**latest**: ${e.latestVersion} ❗` : `**latest**: ${e.latestVersion} — ${n} ❗`;
	return t === "" ? ` — → ${r}` : ` — ${t} → ${r}`;
}
function wr(e) {
	if (e == null || e === "") return "n/a";
	let t = e.split("T", 1)[0];
	if (t == null || t === "") return "n/a";
	let n = new Date(t), r = /* @__PURE__ */ new Date(), i = (r.getFullYear() - n.getFullYear()) * 12 + (r.getMonth() - n.getMonth());
	return r.getDate() < n.getDate() && --i, i === 0 ? `this month: ${t}` : i === 1 ? `1 month ago: ${t}` : i <= 6 ? `${String(i)} months ago: ${t}` : `${String(i)} months ago: ${t} ⚠️ `;
}
//#endregion
//#region node_modules/@dpuse/dpuse-shared/dist/componentConfig.schema-B7kVKqVP.js
var Tr, Er = {
	lang: void 0,
	message: void 0,
	abortEarly: void 0,
	abortPipeEarly: void 0
};
/* @__NO_SIDE_EFFECTS__ */
function Dr(e) {
	return !e && !Tr ? Er : {
		lang: e?.lang ?? Tr?.lang,
		message: e?.message,
		abortEarly: e?.abortEarly ?? Tr?.abortEarly,
		abortPipeEarly: e?.abortPipeEarly ?? Tr?.abortPipeEarly
	};
}
var Or;
/* @__NO_SIDE_EFFECTS__ */
function kr(e) {
	return Or?.get(e);
}
var Ar;
/* @__NO_SIDE_EFFECTS__ */
function jr(e) {
	return Ar?.get(e);
}
var Mr;
/* @__NO_SIDE_EFFECTS__ */
function Nr(e, t) {
	return Mr?.get(e)?.get(t);
}
/* @__NO_SIDE_EFFECTS__ */
function Pr(e) {
	let t = typeof e;
	return t === "string" ? `"${e}"` : t === "number" || t === "bigint" || t === "boolean" ? `${e}` : t === "object" || t === "function" ? (e && Object.getPrototypeOf(e)?.constructor?.name) ?? "null" : t;
}
function J(e, t, n, r, i) {
	let a = i && "input" in i ? i.input : n.value, o = i?.expected ?? e.expects ?? null, s = i?.received ?? /* @__PURE__ */ Pr(a), c = {
		kind: e.kind,
		type: e.type,
		input: a,
		expected: o,
		received: s,
		message: `Invalid ${t}: ${o ? `Expected ${o} but r` : "R"}eceived ${s}`,
		requirement: e.requirement,
		path: i?.path,
		issues: i?.issues,
		lang: r.lang,
		abortEarly: r.abortEarly,
		abortPipeEarly: r.abortPipeEarly
	}, l = e.kind === "schema", u = i?.message ?? e.message ?? /* @__PURE__ */ Nr(e.reference, c.lang) ?? (l ? /* @__PURE__ */ jr(c.lang) : null) ?? r.message ?? /* @__PURE__ */ kr(c.lang);
	u !== void 0 && (c.message = typeof u == "function" ? u(c) : u), l && (n.typed = !1), n.issues ? n.issues.push(c) : n.issues = [c];
}
var Fr = /* @__PURE__ */ new WeakMap();
/* @__NO_SIDE_EFFECTS__ */
function Y(e) {
	let t = Fr.get(e);
	return t || (t = {
		version: 1,
		vendor: "valibot",
		validate(t) {
			return e["~run"]({ value: t }, /* @__PURE__ */ Dr());
		}
	}, Fr.set(e, t)), t;
}
/* @__NO_SIDE_EFFECTS__ */
function Ir(e, t) {
	return Object.prototype.hasOwnProperty.call(e, t) && t !== "__proto__" && t !== "prototype" && t !== "constructor";
}
/* @__NO_SIDE_EFFECTS__ */
function Lr(e, t) {
	let n = [...new Set(e)];
	return n.length > 1 ? `(${n.join(` ${t} `)})` : n[0] ?? "never";
}
/* @__NO_SIDE_EFFECTS__ */
function Rr(e, t, n) {
	return typeof e.fallback == "function" ? e.fallback(t, n) : e.fallback;
}
/* @__NO_SIDE_EFFECTS__ */
function zr(e, t, n) {
	return typeof e.default == "function" ? e.default(t, n) : e.default;
}
/* @__NO_SIDE_EFFECTS__ */
function Br(e, t) {
	return {
		kind: "schema",
		type: "array",
		reference: Br,
		expects: "Array",
		async: !1,
		item: e,
		message: t,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			let n = e.value;
			if (Array.isArray(n)) {
				e.typed = !0, e.value = [];
				for (let r = 0; r < n.length; r++) {
					let i = n[r], a = this.item["~run"]({ value: i }, t);
					if (a.issues) {
						let o = {
							type: "array",
							origin: "value",
							input: n,
							key: r,
							value: i
						};
						for (let t of a.issues) t.path ? t.path.unshift(o) : t.path = [o], e.issues?.push(t);
						if (e.issues ||= a.issues, t.abortEarly) {
							e.typed = !1;
							break;
						}
					}
					a.typed || (e.typed = !1), e.value.push(a.value);
				}
			} else J(this, "type", e, t);
			return e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Vr(e) {
	return {
		kind: "schema",
		type: "boolean",
		reference: Vr,
		expects: "boolean",
		async: !1,
		message: e,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			return typeof e.value == "boolean" ? e.typed = !0 : J(this, "type", e, t), e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Hr(e, t) {
	return {
		kind: "schema",
		type: "literal",
		reference: Hr,
		expects: /* @__PURE__ */ Pr(e),
		async: !1,
		literal: e,
		message: t,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			return e.value === this.literal ? e.typed = !0 : J(this, "type", e, t), e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function X(e, t) {
	return {
		kind: "schema",
		type: "nullable",
		reference: X,
		expects: `(${e.expects} | null)`,
		async: !1,
		wrapped: e,
		default: t,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			return e.value === null && (this.default !== void 0 && (e.value = /* @__PURE__ */ zr(this, e, t)), e.value === null) ? (e.typed = !0, e) : this.wrapped["~run"](e, t);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Ur(e) {
	return {
		kind: "schema",
		type: "number",
		reference: Ur,
		expects: "number",
		async: !1,
		message: e,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			return typeof e.value == "number" && !isNaN(e.value) ? e.typed = !0 : J(this, "type", e, t), e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Z(e, t) {
	return {
		kind: "schema",
		type: "object",
		reference: Z,
		expects: "Object",
		async: !1,
		entries: e,
		message: t,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			let n = e.value;
			if (n && typeof n == "object") {
				e.typed = !0, e.value = {};
				for (let r in this.entries) {
					let i = this.entries[r];
					if (r in n || (i.type === "exact_optional" || i.type === "optional" || i.type === "nullish") && i.default !== void 0) {
						let a = r in n ? n[r] : /* @__PURE__ */ zr(i), o = i["~run"]({ value: a }, t);
						if (o.issues) {
							let i = {
								type: "object",
								origin: "value",
								input: n,
								key: r,
								value: a
							};
							for (let t of o.issues) t.path ? t.path.unshift(i) : t.path = [i], e.issues?.push(t);
							if (e.issues ||= o.issues, t.abortEarly) {
								e.typed = !1;
								break;
							}
						}
						o.typed || (e.typed = !1), e.value[r] = o.value;
					} else if (i.fallback !== void 0) e.value[r] = /* @__PURE__ */ Rr(i);
					else if (i.type !== "exact_optional" && i.type !== "optional" && i.type !== "nullish" && (J(this, "key", e, t, {
						input: void 0,
						expected: `"${r}"`,
						path: [{
							type: "object",
							origin: "key",
							input: n,
							key: r,
							value: n[r]
						}]
					}), t.abortEarly)) break;
				}
			} else J(this, "type", e, t);
			return e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Q(e, t) {
	return {
		kind: "schema",
		type: "optional",
		reference: Q,
		expects: `(${e.expects} | undefined)`,
		async: !1,
		wrapped: e,
		default: t,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			return e.value === void 0 && (this.default !== void 0 && (e.value = /* @__PURE__ */ zr(this, e, t)), e.value === void 0) ? (e.typed = !0, e) : this.wrapped["~run"](e, t);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Wr(e, t, n) {
	return {
		kind: "schema",
		type: "record",
		reference: Wr,
		expects: "Object",
		async: !1,
		key: e,
		value: t,
		message: n,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			let n = e.value;
			if (n && typeof n == "object") {
				e.typed = !0, e.value = {};
				for (let r in n) if (/* @__PURE__ */ Ir(n, r)) {
					let i = n[r], a = this.key["~run"]({ value: r }, t);
					if (a.issues) {
						let o = {
							type: "object",
							origin: "key",
							input: n,
							key: r,
							value: i
						};
						for (let t of a.issues) t.path = [o], e.issues?.push(t);
						if (e.issues ||= a.issues, t.abortEarly) {
							e.typed = !1;
							break;
						}
					}
					let o = this.value["~run"]({ value: i }, t);
					if (o.issues) {
						let a = {
							type: "object",
							origin: "value",
							input: n,
							key: r,
							value: i
						};
						for (let t of o.issues) t.path ? t.path.unshift(a) : t.path = [a], e.issues?.push(t);
						if (e.issues ||= o.issues, t.abortEarly) {
							e.typed = !1;
							break;
						}
					}
					(!a.typed || !o.typed) && (e.typed = !1), a.typed && (e.value[a.value] = o.value);
				}
			} else J(this, "type", e, t);
			return e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function $(e) {
	return {
		kind: "schema",
		type: "string",
		reference: $,
		expects: "string",
		async: !1,
		message: e,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			return typeof e.value == "string" ? e.typed = !0 : J(this, "type", e, t), e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Gr(e) {
	let t;
	if (e) for (let n of e) if (t) for (let e of n.issues) t.push(e);
	else t = n.issues;
	return t;
}
/* @__NO_SIDE_EFFECTS__ */
function Kr(e, t) {
	return {
		kind: "schema",
		type: "union",
		reference: Kr,
		expects: /* @__PURE__ */ Lr(e.map((e) => e.expects), "|"),
		async: !1,
		options: e,
		message: t,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			let n, r, i;
			for (let a of this.options) {
				let o = a["~run"]({ value: e.value }, t);
				if (o.typed) if (o.issues) r ? r.push(o) : r = [o];
				else {
					n = o;
					break;
				}
				else i ? i.push(o) : i = [o];
			}
			if (n) return n;
			if (r) {
				if (r.length === 1) return r[0];
				J(this, "type", e, t, { issues: /* @__PURE__ */ Gr(r) }), e.typed = !0;
			} else if (i?.length === 1) return i[0];
			else J(this, "type", e, t, { issues: /* @__PURE__ */ Gr(i) });
			return e;
		}
	};
}
var qr = (e) => /* @__PURE__ */ Kr(e.map((e) => /* @__PURE__ */ Hr(e))), Jr = /* @__PURE__ */ Z({
	en: /* @__PURE__ */ $(),
	es: /* @__PURE__ */ $()
}), Yr = /* @__PURE__ */ Z({
	en: /* @__PURE__ */ Q(/* @__PURE__ */ Br(/* @__PURE__ */ $())),
	es: /* @__PURE__ */ Q(/* @__PURE__ */ Br(/* @__PURE__ */ $()))
}), Xr = /* @__PURE__ */ Z({
	en: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
	es: /* @__PURE__ */ Q(/* @__PURE__ */ $())
});
qr([
	"app",
	"connector",
	"connectorConnection",
	"context",
	"contextModelGroup",
	"contextModel",
	"contextModelDimensionGroup",
	"contextModelDimension",
	"contextModelDimensionHierarchy",
	"contextModelEntityGroup",
	"contextModelEntity",
	"contextModelEntityDataItem",
	"contextModelEntityEvent",
	"contextModelEntityPrimaryMeasure",
	"contextModelSecondaryMeasureGroup",
	"contextModelSecondaryMeasure",
	"dataView",
	"dimension",
	"engine",
	"eventQuery",
	"presenter",
	"presenterPresentation",
	"tool"
]);
var Zr = qr([
	"amber",
	"green",
	"red",
	"other"
]), Qr = qr([
	"alpha",
	"beta",
	"generalAvailability",
	"notApplicable",
	"preAlpha",
	"proposed",
	"releaseCandidate",
	"unavailable",
	"underReview"
]), $r = /* @__PURE__ */ Z({
	color: Zr,
	label: /* @__PURE__ */ $()
}), ei = /* @__PURE__ */ Z({
	id: /* @__PURE__ */ $(),
	label: Xr,
	description: Yr,
	icon: /* @__PURE__ */ X(/* @__PURE__ */ $()),
	iconDark: /* @__PURE__ */ X(/* @__PURE__ */ $()),
	iconNeutral: /* @__PURE__ */ X(/* @__PURE__ */ $()),
	order: /* @__PURE__ */ Ur(),
	path: /* @__PURE__ */ $()
}), ti = {
	id: /* @__PURE__ */ $(),
	label: Xr,
	description: Yr,
	firstCreatedAt: /* @__PURE__ */ X(/* @__PURE__ */ Ur()),
	icon: /* @__PURE__ */ X(/* @__PURE__ */ $()),
	iconDark: /* @__PURE__ */ X(/* @__PURE__ */ $()),
	iconNeutral: /* @__PURE__ */ X(/* @__PURE__ */ $()),
	lastUpdatedAt: /* @__PURE__ */ X(/* @__PURE__ */ Ur()),
	status: /* @__PURE__ */ X($r),
	statusId: /* @__PURE__ */ X(Qr)
};
({ ...ti }), qr([
	"app",
	"engine",
	"connector",
	"context",
	"presenter",
	"tool"
]);
//#endregion
//#region node_modules/@dpuse/dpuse-shared/dist/moduleConfig.schema-Cvc9QRvr.js
var ni = {
	...ti,
	version: /* @__PURE__ */ $()
};
({ ...ni });
//#endregion
//#region node_modules/@dpuse/dpuse-shared/dist/dpuse-shared-componentModuleConnector.es.js
var ri = qr([
	"abortOperation",
	"auditObjectContent",
	"createObject",
	"describeConnection",
	"dropObject",
	"findObject",
	"getReadableStream",
	"getRecord",
	"listNodes",
	"previewObject",
	"removeRecords",
	"retrieveChunks",
	"retrieveRecords",
	"upsertRecords"
]), ii = qr([
	"application",
	"curatedDataset",
	"database",
	"fileStore"
]), ai = /* @__PURE__ */ Z({ label: Jr }), oi = /* @__PURE__ */ Z({
	authMethodId: qr([
		"apiKey",
		"disabled",
		"oAuth2",
		"none"
	]),
	activeConnectionCount: /* @__PURE__ */ Q(/* @__PURE__ */ Ur()),
	canDescribe: /* @__PURE__ */ Q(/* @__PURE__ */ Vr()),
	id: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
	label: /* @__PURE__ */ Q(Jr),
	maxConnectionCount: /* @__PURE__ */ X(/* @__PURE__ */ Ur()),
	params: /* @__PURE__ */ Q(/* @__PURE__ */ Br(/* @__PURE__ */ Wr(/* @__PURE__ */ $(), /* @__PURE__ */ $())))
}), si = /* @__PURE__ */ Z({
	typeId: /* @__PURE__ */ Hr("connector"),
	...ni,
	actionNames: /* @__PURE__ */ Br(ri),
	category: /* @__PURE__ */ X(ai),
	categoryId: ii,
	implementations: /* @__PURE__ */ Wr(/* @__PURE__ */ $(), oi),
	vendorAccountURL: /* @__PURE__ */ X(/* @__PURE__ */ $()),
	vendorDocumentationURL: /* @__PURE__ */ X(/* @__PURE__ */ $()),
	vendorHomeURL: /* @__PURE__ */ X(/* @__PURE__ */ $())
}), ci = {
	abortOperation: "Abort Operation",
	auditObjectContent: "Audit Object Content",
	createObject: "Create Object",
	describeConnection: "Describe Connection",
	dropObject: "Drop Object",
	findObject: "Find Object",
	getReadableStream: "Get Readable Stream",
	getRecord: "Get Record",
	listNodes: "List Nodes",
	previewObject: "Preview Object",
	removeRecords: "Remove Records",
	retrieveChunks: "Retrieve Chunks",
	retrieveRecords: "Retrieve Records",
	upsertRecords: "Upsert Records"
};
function li(e) {
	let t = new Set(e), n = "| Name | Supported |\n";
	n += "| ---- | :-------: |\n";
	for (let e of Object.keys(ci)) n += `| ${ci[e]} | ${t.has(e) ? "✓" : ""} |\n`;
	return n;
}
//#endregion
//#region src/actions/documentOperations.ts
var ui = "<!-- CONNECTOR_OPERATIONS_START -->", di = "<!-- CONNECTOR_OPERATIONS_END -->";
async function fi() {
	try {
		G("Document Operations"), q("1️⃣  Insert operations table into 'README.md'");
		let e = li((await W("config.json")).operations ?? []);
		await Bn("README.md", Gn(await Ln("./README.md"), e, ui, di)), K("Operations documented.");
	} catch (e) {
		console.error("❌  Error documenting operations.", e), process.exit(1);
	}
}
//#endregion
//#region src/actions/formatCode.ts
async function pi() {
	try {
		G("Format Code"), await Fn("1️⃣  Format", "prettier", [
			"--write",
			"*.json",
			"*.md",
			"*.ts",
			...["app", "src"].filter((t) => e(t)).map((e) => `${e}/**`)
		]), K("Code formatted.");
	} catch (e) {
		console.error("❌  Error formatting code.", e), process.exit(1);
	}
}
//#endregion
//#region src/actions/lintCode.ts
async function mi() {
	try {
		G("Lint Code"), await Fn("1️⃣  Lint", "eslint", ["."]), K("Code linted.");
	} catch (e) {
		console.error("❌  Error linting code.", e), process.exit(1);
	}
}
//#endregion
//#region src/utilities/cloudflare.ts
async function hi() {
	let e = await W("config.json"), t = {
		body: JSON.stringify(e),
		headers: { "Content-Type": "application/json" },
		method: "PUT"
	}, n = await fetch(`https://api.dpuse.app/configs/${e.id}`, t);
	if (!n.ok) throw Error(await n.text());
}
async function gi(e, t) {
	async function n(e, t, r) {
		for (let i of r) {
			let r = `${e}/${i}`, a = `${t}/${i}`;
			(await Hn(r)).isDirectory() ? await n(r, a, await Nn(r)) : (console.info(`⚙️ Uploading '${e}/${i}'...`), await Pn(void 0, "wrangler", [
				"r2",
				"object",
				"put",
				`dpuse-sample-data-eu/${t}/${i}`,
				`--file=${e}/${i}`,
				"--jurisdiction=eu",
				"--remote"
			]));
		}
	}
	let r = await Nn(`${e}/${t}/`);
	await n(`${e}/${t}`, t, r);
}
async function _i(e) {
	let t = e.id, n = {
		body: JSON.stringify(e),
		headers: { "Content-Type": "application/json" },
		method: "PUT"
	}, r = await fetch(`https://api.dpuse.app/configs/${t}`, n);
	if (!r.ok) throw Error(await r.text());
}
async function vi(e, t) {
	let n = `v${e.version ?? "unknown"}`;
	async function r(e, r = "") {
		let i = await Nn(e, { withFileTypes: !0 });
		for (let a of i) {
			if (a.isDirectory()) continue;
			let i = `${e}/${a.name}`, o = r ? `${r}/${a.name}` : a.name, s = `${t}_${n}/${o}`.replaceAll("\\", "/"), c = a.name.endsWith(".css") ? "text/css" : "application/octet-stream", l = a.name.endsWith(".js") ? "application/javascript" : c;
			console.info(`⚙️ Uploading '${o}' → '${s}'...`), await Pn(void 0, "wrangler", [
				"r2",
				"object",
				"put",
				s,
				`--file=${i}`,
				"--content-type",
				l,
				"--jurisdiction=eu",
				"--remote"
			]);
		}
	}
	await r("dist");
}
//#endregion
//#region node_modules/valibot/dist/index.mjs
var yi, bi = {
	lang: void 0,
	message: void 0,
	abortEarly: void 0,
	abortPipeEarly: void 0
};
/* @__NO_SIDE_EFFECTS__ */
function xi(e) {
	return !e && !yi ? bi : {
		lang: e?.lang ?? yi?.lang,
		message: e?.message,
		abortEarly: e?.abortEarly ?? yi?.abortEarly,
		abortPipeEarly: e?.abortPipeEarly ?? yi?.abortPipeEarly
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Si(e, t, n) {
	let r = e["~run"]({ value: t }, /* @__PURE__ */ xi(n));
	return {
		typed: r.typed,
		success: !r.issues,
		output: r.value,
		issues: r.issues
	};
}
//#endregion
//#region node_modules/@dpuse/dpuse-shared/dist/dpuse-shared-componentModuleContext.es.js
var Ci = /* @__PURE__ */ Z({
	typeId: /* @__PURE__ */ Hr("contextModelGroup"),
	...ti,
	modelRefs: /* @__PURE__ */ Br(ei),
	order: /* @__PURE__ */ Ur()
}), wi = qr(["listContextFocuses"]), Ti = /* @__PURE__ */ Z({
	typeId: /* @__PURE__ */ Hr("context"),
	...ni,
	actionNames: /* @__PURE__ */ Br(wi),
	models: /* @__PURE__ */ Br(Ci)
}), Ei = qr([
	"list",
	"render",
	"setColorMode"
]), Di = /* @__PURE__ */ Z({
	typeId: /* @__PURE__ */ Hr("presenter"),
	...ni,
	actionNames: /* @__PURE__ */ Br(Ei),
	presentations: /* @__PURE__ */ Br(ei)
}), Oi = /* @__PURE__ */ new Set([
	"createObject",
	"dropObject",
	"removeRecords",
	"upsertRecords"
]), ki = /* @__PURE__ */ new Set([
	"auditObjectContent",
	"findObjectFolderPath",
	"getReadableStream",
	"getRecord",
	"listNodes",
	"previewObject",
	"retrieveChunks",
	"retrieveRecords"
]);
async function Ai() {
	try {
		G("Build Project"), await Fn("1️⃣  Bundle project", "vite", ["build"]), K("Project built.");
	} catch (e) {
		console.error("❌  Error building project.", e), process.exit(1);
	}
}
async function ji() {
	try {
		G("Release Project");
		let e = await W("package.json"), t = await W("config.json");
		await Vi("1️⃣ ", e);
		let n = Vn(t.id);
		switch (n.typeId) {
			case "connector":
				t = await Ni("2️⃣ ", e);
				break;
			case "context":
				t = await Pi("2️⃣ ", e);
				break;
			case "presenter":
				t = await Fi("2️⃣ ", e);
				break;
			default: t = await Mi("2️⃣ ", e);
		}
		if (await Fn("3️⃣  Bundle project", "vite", ["build"]), await Pn("4️⃣  Stage changes", "git", ["add", "."]), await Pn("5️⃣  Commit changes", "git", [
			"commit",
			"-m",
			`v${e.version ?? "unknown"}`
		]), await Pn("6️⃣  Push changes", "git", [
			"push",
			"origin",
			"main:main"
		]), n.typeId === "app") q("7️⃣  Register module"), await hi();
		else if (n.typeId === "engine") q("7️⃣  Register module"), await vi(e, `dpuse-engine-eu/${n.uploadGroupName ?? "unknown"}`), await _i(t);
		else if (n.uploadGroupName === void 0) q("7️⃣  Registration NOT required.");
		else {
			q("7️⃣  Register module");
			let r = t.id.split("-").slice(2).join("-");
			await vi(e, `dpuse-engine-eu/${n.uploadGroupName}/${r}`), await _i(t);
		}
		if (n.publishedTo === "npm") {
			let e = ".npmrc";
			try {
				await Bn(e, `registry=https://registry.npmjs.org/\n//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN ?? ""}`), await Fn("8️⃣  Publish to npm", "npm", [
					"publish",
					"--access",
					"public"
				]);
			} finally {
				await Rn(e);
			}
		} else q(`8️⃣  Publishing NOT required for package with type identifier of '${n.typeId}'.`);
		K(`Project version '${e.version ?? "unknown"}' released.`);
	} catch (e) {
		console.error("❌  Error releasing project.", e), process.exit(1);
	}
}
async function Mi(e, t) {
	q(`${e} Build project configuration`);
	let n = await W("config.json");
	return t.name != null && (n.id = t.name.replace("@dpuse/", "")), t.version != null && (n.version = t.version), await zn("config.json", n), n;
}
async function Ni(e, t) {
	q(`${e} Build connector project configuration`);
	let [n, r] = await Promise.all([W("config.json"), Ln("src/index.ts")]), i = /* @__PURE__ */ Si(si, n);
	if (!i.success) throw console.error("❌  Configuration is invalid:"), console.table(i.issues), Error("Configuration is invalid.");
	let a = Un(r);
	return await Li(t, n, a, Ii(a));
}
async function Pi(e, t) {
	q(`${e} Build context project configuration`);
	let [n, r] = await Promise.all([W("config.json"), Ln("src/index.ts")]), i = /* @__PURE__ */ Si(Ti, n);
	if (!i.success) throw console.error("❌  Configuration is invalid:"), console.table(i.issues), Error("Configuration is invalid.");
	return await Li(t, n, Un(r));
}
async function Fi(e, t) {
	q(`${e} Build presenter project configuration`);
	let [n, r] = await Promise.all([W("config.json"), Ln("src/index.ts")]), i = /* @__PURE__ */ Si(Di, n);
	if (!i.success) throw console.error("❌  Configuration is invalid:"), console.table(i.issues), Error("Configuration is invalid.");
	return await Li(t, n, Un(r));
}
function Ii(e) {
	let t = !1, n = !1;
	for (let r of e) ki.has(r) && (t = !0), Oi.has(r) && (n = !0);
	return t && n ? "bidirectional" : t ? "source" : n ? "destination" : "unknown";
}
async function Li(e, t, n, r) {
	return n.length > 0 ? (console.info(`ℹ️  Implements ${String(n.length)} operations:`), console.table(n)) : console.warn("⚠️   Implements no operations."), r === "unknown" ? console.warn("⚠️   No usage identified.") : console.info(`ℹ️  Supports '${r ?? "unknown"}' usage.`), e.name != null && (t.id = e.name.replace("@dpuse/", "").replace("@dpuse/", "")), e.version != null && (t.version = e.version), t.operations = n, t.usageId = r ?? "unknown", await zn("config.json", t), t;
}
async function Ri() {
	try {
		G("Publish Project");
		let e = await W("package.json"), t = await W("config.json"), n = Vn(t.id);
		if (n.typeId === "app") q("1️⃣  Register module"), await hi();
		else if (n.typeId === "engine") q("1️⃣  Register module"), await vi(e, `dpuse-engine-eu/${n.uploadGroupName ?? "unknown"}`), await _i(t);
		else if (n.uploadGroupName === void 0) q("1️⃣  Publishing NOT required.");
		else {
			q("1️⃣  Register module");
			let r = t.id.split("-").slice(2).join("-");
			await vi(e, `dpuse-engine-eu/${n.uploadGroupName}/${r}`), await _i(t);
		}
		K(`Project version '${e.version ?? "unknown"}' published.`);
	} catch (e) {
		console.error("❌  Error publishing project.", e), process.exit(1);
	}
}
async function zi() {
	try {
		G("Synchronise Project with GitHub");
		let e = await W("package.json"), t = await W("config.json");
		switch (await Vi("1️⃣ ", e), Vn(t.id).typeId) {
			case "connector":
				await Ni("2️⃣ ", e);
				break;
			case "context":
				await Pi("2️⃣ ", e);
				break;
			case "presenter":
				await Fi("2️⃣ ", e);
				break;
			default: await Mi("2️⃣ ", e);
		}
		await Pn("3️⃣  Stage changes", "git", ["add", "."]), await Pn("4️⃣  Commit changes", "git", [
			"commit",
			"-m",
			`v${e.version ?? "unknown"}`
		]), await Pn("5️⃣  Push changes", "git", [
			"push",
			"origin",
			"main:main"
		]), K(`Project version '${e.version ?? "unknown"}' synchronised with GitHub.`);
	} catch (e) {
		console.error("❌  Error synchronising project with GitHub.", e), process.exit(1);
	}
}
function Bi() {
	try {
		G("Test Project"), console.error("\n❌  No tests implemented.\n");
	} catch (e) {
		console.error("❌  Error testing project.", e), process.exit(1);
	}
}
async function Vi(e, t, n = "./") {
	if (q(`${e} Bump project version`), t.version == null) t.version = "0.0.001", console.warn(`⚠️  Project version initialised to '${t.version}'.`);
	else {
		let e = t.version, n = t.version.split(".");
		t.version = `${n[0] ?? "unknown"}.${n[1] ?? "unknown"}.${String(Number(n[2]) + 1)}`, console.info(`Project version bumped from '${e}' to '${t.version}'.`);
	}
	await zn(`${n}package.json`, t);
}
//#endregion
export { Kn as auditDependencies, Ai as buildProject, qn as checkConfigFiles, Yn as checkDependencies, nr as documentBundleSizes, _r as documentDependencies, fi as documentOperations, pi as formatCode, mi as lintCode, Ri as publishProject, ji as releaseProject, zi as syncProjectWithGitHub, Bi as testProject, gi as uploadDirectoryToR2 };

//# sourceMappingURL=dpuse-development.es.js.map
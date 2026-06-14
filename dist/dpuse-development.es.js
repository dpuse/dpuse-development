import { existsSync as e, promises as t } from "node:fs";
import n from "node:path";
import { promisify as r } from "node:util";
import { exec as i, spawn as a } from "node:child_process";
import { URL as o, fileURLToPath as s } from "node:url";
//#region \0rolldown/runtime.js
var c = Object.defineProperty, l = (e, t) => {
	let n = {};
	for (var r in e) c(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || c(n, Symbol.toStringTag, { value: "Module" }), n;
}, u, d = {
	lang: void 0,
	message: void 0,
	abortEarly: void 0,
	abortPipeEarly: void 0
};
/* @__NO_SIDE_EFFECTS__ */
function f(e) {
	return !e && !u ? d : {
		lang: e?.lang ?? u?.lang,
		message: e?.message,
		abortEarly: e?.abortEarly ?? u?.abortEarly,
		abortPipeEarly: e?.abortPipeEarly ?? u?.abortPipeEarly
	};
}
/* @__NO_SIDE_EFFECTS__ */
function p(e, t, n) {
	let r = e["~run"]({ value: t }, /* @__PURE__ */ f(n));
	return {
		typed: r.typed,
		success: !r.issues,
		output: r.value,
		issues: r.issues
	};
}
//#endregion
//#region node_modules/@dpuse/dpuse-shared/dist/componentConfig.schema-CkdR7msf.js
var m, h = {
	lang: void 0,
	message: void 0,
	abortEarly: void 0,
	abortPipeEarly: void 0
};
/* @__NO_SIDE_EFFECTS__ */
function g(e) {
	return !e && !m ? h : {
		lang: e?.lang ?? m?.lang,
		message: e?.message,
		abortEarly: e?.abortEarly ?? m?.abortEarly,
		abortPipeEarly: e?.abortPipeEarly ?? m?.abortPipeEarly
	};
}
var ee;
/* @__NO_SIDE_EFFECTS__ */
function _(e) {
	return ee?.get(e);
}
var v;
/* @__NO_SIDE_EFFECTS__ */
function te(e) {
	return v?.get(e);
}
var ne;
/* @__NO_SIDE_EFFECTS__ */
function re(e, t) {
	return ne?.get(e)?.get(t);
}
/* @__NO_SIDE_EFFECTS__ */
function ie(e) {
	let t = typeof e;
	return t === "string" ? `"${e}"` : t === "number" || t === "bigint" || t === "boolean" ? `${e}` : t === "object" || t === "function" ? (e && Object.getPrototypeOf(e)?.constructor?.name) ?? "null" : t;
}
function y(e, t, n, r, i) {
	let a = i && "input" in i ? i.input : n.value, o = i?.expected ?? e.expects ?? null, s = i?.received ?? /* @__PURE__ */ ie(a), c = {
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
	}, l = e.kind === "schema", u = i?.message ?? e.message ?? /* @__PURE__ */ re(e.reference, c.lang) ?? (l ? /* @__PURE__ */ te(c.lang) : null) ?? r.message ?? /* @__PURE__ */ _(c.lang);
	u !== void 0 && (c.message = typeof u == "function" ? u(c) : u), l && (n.typed = !1), n.issues ? n.issues.push(c) : n.issues = [c];
}
var ae = /* @__PURE__ */ new WeakMap();
/* @__NO_SIDE_EFFECTS__ */
function b(e) {
	let t = ae.get(e);
	return t || (t = {
		version: 1,
		vendor: "valibot",
		validate(t) {
			return e["~run"]({ value: t }, /* @__PURE__ */ g());
		}
	}, ae.set(e, t)), t;
}
/* @__NO_SIDE_EFFECTS__ */
function oe(e, t) {
	return Object.prototype.hasOwnProperty.call(e, t) && t !== "__proto__" && t !== "prototype" && t !== "constructor";
}
/* @__NO_SIDE_EFFECTS__ */
function se(e, t) {
	let n = [...new Set(e)];
	return n.length > 1 ? `(${n.join(` ${t} `)})` : n[0] ?? "never";
}
/* @__NO_SIDE_EFFECTS__ */
function ce(e, t, n) {
	return typeof e.fallback == "function" ? e.fallback(t, n) : e.fallback;
}
/* @__NO_SIDE_EFFECTS__ */
function le(e, t, n) {
	return typeof e.default == "function" ? e.default(t, n) : e.default;
}
/* @__NO_SIDE_EFFECTS__ */
function ue(e, t) {
	return {
		kind: "schema",
		type: "array",
		reference: ue,
		expects: "Array",
		async: !1,
		item: e,
		message: t,
		get "~standard"() {
			return /* @__PURE__ */ b(this);
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
			} else y(this, "type", e, t);
			return e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function de(e) {
	return {
		kind: "schema",
		type: "boolean",
		reference: de,
		expects: "boolean",
		async: !1,
		message: e,
		get "~standard"() {
			return /* @__PURE__ */ b(this);
		},
		"~run"(e, t) {
			return typeof e.value == "boolean" ? e.typed = !0 : y(this, "type", e, t), e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function fe(e, t) {
	return {
		kind: "schema",
		type: "literal",
		reference: fe,
		expects: /* @__PURE__ */ ie(e),
		async: !1,
		literal: e,
		message: t,
		get "~standard"() {
			return /* @__PURE__ */ b(this);
		},
		"~run"(e, t) {
			return e.value === this.literal ? e.typed = !0 : y(this, "type", e, t), e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function x(e, t) {
	return {
		kind: "schema",
		type: "nullable",
		reference: x,
		expects: `(${e.expects} | null)`,
		async: !1,
		wrapped: e,
		default: t,
		get "~standard"() {
			return /* @__PURE__ */ b(this);
		},
		"~run"(e, t) {
			return e.value === null && (this.default !== void 0 && (e.value = /* @__PURE__ */ le(this, e, t)), e.value === null) ? (e.typed = !0, e) : this.wrapped["~run"](e, t);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function pe(e) {
	return {
		kind: "schema",
		type: "number",
		reference: pe,
		expects: "number",
		async: !1,
		message: e,
		get "~standard"() {
			return /* @__PURE__ */ b(this);
		},
		"~run"(e, t) {
			return typeof e.value == "number" && !isNaN(e.value) ? e.typed = !0 : y(this, "type", e, t), e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function S(e, t) {
	return {
		kind: "schema",
		type: "object",
		reference: S,
		expects: "Object",
		async: !1,
		entries: e,
		message: t,
		get "~standard"() {
			return /* @__PURE__ */ b(this);
		},
		"~run"(e, t) {
			let n = e.value;
			if (n && typeof n == "object") {
				e.typed = !0, e.value = {};
				for (let r in this.entries) {
					let i = this.entries[r];
					if (r in n || (i.type === "exact_optional" || i.type === "optional" || i.type === "nullish") && i.default !== void 0) {
						let a = r in n ? n[r] : /* @__PURE__ */ le(i), o = i["~run"]({ value: a }, t);
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
					} else if (i.fallback !== void 0) e.value[r] = /* @__PURE__ */ ce(i);
					else if (i.type !== "exact_optional" && i.type !== "optional" && i.type !== "nullish" && (y(this, "key", e, t, {
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
			} else y(this, "type", e, t);
			return e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function me(e, t) {
	return {
		kind: "schema",
		type: "optional",
		reference: me,
		expects: `(${e.expects} | undefined)`,
		async: !1,
		wrapped: e,
		default: t,
		get "~standard"() {
			return /* @__PURE__ */ b(this);
		},
		"~run"(e, t) {
			return e.value === void 0 && (this.default !== void 0 && (e.value = /* @__PURE__ */ le(this, e, t)), e.value === void 0) ? (e.typed = !0, e) : this.wrapped["~run"](e, t);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function he(e, t, n) {
	return {
		kind: "schema",
		type: "record",
		reference: he,
		expects: "Object",
		async: !1,
		key: e,
		value: t,
		message: n,
		get "~standard"() {
			return /* @__PURE__ */ b(this);
		},
		"~run"(e, t) {
			let n = e.value;
			if (n && typeof n == "object") {
				e.typed = !0, e.value = {};
				for (let r in n) if (/* @__PURE__ */ oe(n, r)) {
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
			} else y(this, "type", e, t);
			return e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function C(e) {
	return {
		kind: "schema",
		type: "string",
		reference: C,
		expects: "string",
		async: !1,
		message: e,
		get "~standard"() {
			return /* @__PURE__ */ b(this);
		},
		"~run"(e, t) {
			return typeof e.value == "string" ? e.typed = !0 : y(this, "type", e, t), e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function ge(e) {
	let t;
	if (e) for (let n of e) if (t) for (let e of n.issues) t.push(e);
	else t = n.issues;
	return t;
}
/* @__NO_SIDE_EFFECTS__ */
function _e(e, t) {
	return {
		kind: "schema",
		type: "union",
		reference: _e,
		expects: /* @__PURE__ */ se(e.map((e) => e.expects), "|"),
		async: !1,
		options: e,
		message: t,
		get "~standard"() {
			return /* @__PURE__ */ b(this);
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
				y(this, "type", e, t, { issues: /* @__PURE__ */ ge(r) }), e.typed = !0;
			} else if (i?.length === 1) return i[0];
			else y(this, "type", e, t, { issues: /* @__PURE__ */ ge(i) });
			return e;
		}
	};
}
var w = (e) => /* @__PURE__ */ _e(e.map((e) => /* @__PURE__ */ fe(e))), ve = /* @__PURE__ */ S({
	en: /* @__PURE__ */ C(),
	es: /* @__PURE__ */ C()
}), ye = /* @__PURE__ */ S({
	en: /* @__PURE__ */ me(/* @__PURE__ */ C()),
	es: /* @__PURE__ */ me(/* @__PURE__ */ C())
});
w([
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
var be = w([
	"amber",
	"green",
	"red",
	"other"
]), xe = w([
	"alpha",
	"beta",
	"generalAvailability",
	"notApplicable",
	"preAlpha",
	"proposed",
	"releaseCandidate",
	"unavailable",
	"underReview"
]), Se = /* @__PURE__ */ S({
	color: be,
	label: /* @__PURE__ */ C()
}), Ce = /* @__PURE__ */ S({
	id: /* @__PURE__ */ C(),
	label: ye,
	description: ye,
	icon: /* @__PURE__ */ x(/* @__PURE__ */ C()),
	iconDark: /* @__PURE__ */ x(/* @__PURE__ */ C()),
	iconNeutral: /* @__PURE__ */ x(/* @__PURE__ */ C()),
	order: /* @__PURE__ */ pe(),
	path: /* @__PURE__ */ C()
}), we = {
	id: /* @__PURE__ */ C(),
	label: ye,
	description: ye,
	firstCreatedAt: /* @__PURE__ */ x(/* @__PURE__ */ pe()),
	icon: /* @__PURE__ */ x(/* @__PURE__ */ C()),
	iconDark: /* @__PURE__ */ x(/* @__PURE__ */ C()),
	iconNeutral: /* @__PURE__ */ x(/* @__PURE__ */ C()),
	lastUpdatedAt: /* @__PURE__ */ x(/* @__PURE__ */ pe()),
	status: /* @__PURE__ */ x(Se),
	statusId: /* @__PURE__ */ x(xe)
};
({ ...we }), w([
	"app",
	"engine",
	"connector",
	"context",
	"presenter",
	"tool"
]);
//#endregion
//#region node_modules/@dpuse/dpuse-shared/dist/moduleConfig.schema-CE_hg8Nj.js
var Te = {
	...we,
	version: /* @__PURE__ */ C()
};
({ ...Te });
//#endregion
//#region node_modules/@dpuse/dpuse-shared/dist/dpuse-shared-componentModuleConnector.es.js
var Ee = w([
	"application",
	"curatedDataset",
	"database",
	"fileStore"
]), De = /* @__PURE__ */ S({ label: ve }), Oe = /* @__PURE__ */ S({
	authMethodId: w([
		"apiKey",
		"disabled",
		"oAuth2",
		"none"
	]),
	activeConnectionCount: /* @__PURE__ */ me(/* @__PURE__ */ pe()),
	canDescribe: /* @__PURE__ */ me(/* @__PURE__ */ de()),
	id: /* @__PURE__ */ me(/* @__PURE__ */ C()),
	label: /* @__PURE__ */ me(ve),
	maxConnectionCount: /* @__PURE__ */ x(/* @__PURE__ */ pe()),
	params: /* @__PURE__ */ me(/* @__PURE__ */ ue(/* @__PURE__ */ he(/* @__PURE__ */ C(), /* @__PURE__ */ C())))
}), ke = w([
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
]), Ae = w([
	"bidirectional",
	"destination",
	"source",
	"unknown"
]), je = /* @__PURE__ */ S({
	...Te,
	typeId: /* @__PURE__ */ fe("connector"),
	category: /* @__PURE__ */ x(De),
	categoryId: Ee,
	implementations: /* @__PURE__ */ he(/* @__PURE__ */ C(), Oe),
	operations: /* @__PURE__ */ ue(ke),
	usageId: Ae,
	vendorAccountURL: /* @__PURE__ */ x(/* @__PURE__ */ C()),
	vendorDocumentationURL: /* @__PURE__ */ x(/* @__PURE__ */ C()),
	vendorHomeURL: /* @__PURE__ */ x(/* @__PURE__ */ C())
}), Me = /* @__PURE__ */ S({
	...we,
	typeId: /* @__PURE__ */ fe("contextModelGroup"),
	modelRefs: /* @__PURE__ */ ue(Ce),
	order: /* @__PURE__ */ pe()
}), Ne = w(["listContextFocuses"]), Pe = /* @__PURE__ */ S({
	...Te,
	typeId: /* @__PURE__ */ fe("context"),
	models: /* @__PURE__ */ ue(Me),
	operations: /* @__PURE__ */ ue(Ne)
}), Fe = w([
	"list",
	"render",
	"setColorMode"
]), Ie = /* @__PURE__ */ S({
	...Te,
	typeId: /* @__PURE__ */ fe("presenter"),
	presentations: /* @__PURE__ */ ue(Ce),
	operations: /* @__PURE__ */ ue(Fe)
}), Le = /* @__PURE__ */ l({
	Node: () => $t,
	Parser: () => P,
	Position: () => ut,
	SourceLocation: () => dt,
	TokContext: () => z,
	Token: () => Un,
	TokenType: () => E,
	defaultOptions: () => pt,
	getLineInfo: () => ft,
	isIdentifierChar: () => Ye,
	isIdentifierStart: () => T,
	isNewLine: () => Qe,
	keywordTypes: () => Xe,
	lineBreak: () => M,
	lineBreakG: () => Ze,
	nonASCIIwhitespace: () => et,
	parse: () => Jn,
	parseExpressionAt: () => Yn,
	tokContexts: () => B,
	tokTypes: () => j,
	tokenizer: () => Xn,
	version: () => qn
}), Re = [
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
], ze = [
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
], Be = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-᫝᫠-᫫ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･", Ve = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-࢏ࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚ౜ౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽ೜-ೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-Ƛ꟱-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ", He = {
	3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
	5: "class enum extends super const export import",
	6: "enum",
	strict: "implements interface let package private protected public static yield",
	strictBind: "eval arguments"
}, Ue = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this", We = {
	5: Ue,
	"5module": Ue + " export import",
	6: Ue + " const class extends export import super"
}, Ge = /^in(stanceof)?$/, Ke = RegExp("[" + Ve + "]"), qe = RegExp("[" + Ve + Be + "]");
function Je(e, t) {
	for (var n = 65536, r = 0; r < t.length; r += 2) {
		if (n += t[r], n > e) return !1;
		if (n += t[r + 1], n >= e) return !0;
	}
	return !1;
}
function T(e, t) {
	return e < 65 ? e === 36 : e < 91 ? !0 : e < 97 ? e === 95 : e < 123 ? !0 : e <= 65535 ? e >= 170 && Ke.test(String.fromCharCode(e)) : t === !1 ? !1 : Je(e, ze);
}
function Ye(e, t) {
	return e < 48 ? e === 36 : e < 58 ? !0 : e < 65 ? !1 : e < 91 ? !0 : e < 97 ? e === 95 : e < 123 ? !0 : e <= 65535 ? e >= 170 && qe.test(String.fromCharCode(e)) : t === !1 ? !1 : Je(e, ze) || Je(e, Re);
}
var E = function(e, t) {
	t === void 0 && (t = {}), this.label = e, this.keyword = t.keyword, this.beforeExpr = !!t.beforeExpr, this.startsExpr = !!t.startsExpr, this.isLoop = !!t.isLoop, this.isAssign = !!t.isAssign, this.prefix = !!t.prefix, this.postfix = !!t.postfix, this.binop = t.binop || null, this.updateContext = null;
};
function D(e, t) {
	return new E(e, {
		beforeExpr: !0,
		binop: t
	});
}
var O = { beforeExpr: !0 }, k = { startsExpr: !0 }, Xe = {};
function A(e, t) {
	return t === void 0 && (t = {}), t.keyword = e, Xe[e] = new E(e, t);
}
var j = {
	num: new E("num", k),
	regexp: new E("regexp", k),
	string: new E("string", k),
	name: new E("name", k),
	privateId: new E("privateId", k),
	eof: new E("eof"),
	bracketL: new E("[", {
		beforeExpr: !0,
		startsExpr: !0
	}),
	bracketR: new E("]"),
	braceL: new E("{", {
		beforeExpr: !0,
		startsExpr: !0
	}),
	braceR: new E("}"),
	parenL: new E("(", {
		beforeExpr: !0,
		startsExpr: !0
	}),
	parenR: new E(")"),
	comma: new E(",", O),
	semi: new E(";", O),
	colon: new E(":", O),
	dot: new E("."),
	question: new E("?", O),
	questionDot: new E("?."),
	arrow: new E("=>", O),
	template: new E("template"),
	invalidTemplate: new E("invalidTemplate"),
	ellipsis: new E("...", O),
	backQuote: new E("`", k),
	dollarBraceL: new E("${", {
		beforeExpr: !0,
		startsExpr: !0
	}),
	eq: new E("=", {
		beforeExpr: !0,
		isAssign: !0
	}),
	assign: new E("_=", {
		beforeExpr: !0,
		isAssign: !0
	}),
	incDec: new E("++/--", {
		prefix: !0,
		postfix: !0,
		startsExpr: !0
	}),
	prefix: new E("!/~", {
		beforeExpr: !0,
		prefix: !0,
		startsExpr: !0
	}),
	logicalOR: D("||", 1),
	logicalAND: D("&&", 2),
	bitwiseOR: D("|", 3),
	bitwiseXOR: D("^", 4),
	bitwiseAND: D("&", 5),
	equality: D("==/!=/===/!==", 6),
	relational: D("</>/<=/>=", 7),
	bitShift: D("<</>>/>>>", 8),
	plusMin: new E("+/-", {
		beforeExpr: !0,
		binop: 9,
		prefix: !0,
		startsExpr: !0
	}),
	modulo: D("%", 10),
	star: D("*", 10),
	slash: D("/", 10),
	starstar: new E("**", { beforeExpr: !0 }),
	coalesce: D("??", 1),
	_break: A("break"),
	_case: A("case", O),
	_catch: A("catch"),
	_continue: A("continue"),
	_debugger: A("debugger"),
	_default: A("default", O),
	_do: A("do", {
		isLoop: !0,
		beforeExpr: !0
	}),
	_else: A("else", O),
	_finally: A("finally"),
	_for: A("for", { isLoop: !0 }),
	_function: A("function", k),
	_if: A("if"),
	_return: A("return", O),
	_switch: A("switch"),
	_throw: A("throw", O),
	_try: A("try"),
	_var: A("var"),
	_const: A("const"),
	_while: A("while", { isLoop: !0 }),
	_with: A("with"),
	_new: A("new", {
		beforeExpr: !0,
		startsExpr: !0
	}),
	_this: A("this", k),
	_super: A("super", k),
	_class: A("class", k),
	_extends: A("extends", O),
	_export: A("export"),
	_import: A("import", k),
	_null: A("null", k),
	_true: A("true", k),
	_false: A("false", k),
	_in: A("in", {
		beforeExpr: !0,
		binop: 7
	}),
	_instanceof: A("instanceof", {
		beforeExpr: !0,
		binop: 7
	}),
	_typeof: A("typeof", {
		beforeExpr: !0,
		prefix: !0,
		startsExpr: !0
	}),
	_void: A("void", {
		beforeExpr: !0,
		prefix: !0,
		startsExpr: !0
	}),
	_delete: A("delete", {
		beforeExpr: !0,
		prefix: !0,
		startsExpr: !0
	})
}, M = /\r\n?|\n|\u2028|\u2029/, Ze = new RegExp(M.source, "g");
function Qe(e) {
	return e === 10 || e === 13 || e === 8232 || e === 8233;
}
function $e(e, t, n) {
	n === void 0 && (n = e.length);
	for (var r = t; r < n; r++) {
		var i = e.charCodeAt(r);
		if (Qe(i)) return r < n - 1 && i === 13 && e.charCodeAt(r + 1) === 10 ? r + 2 : r + 1;
	}
	return -1;
}
var et = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/, N = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g, tt = Object.prototype, nt = tt.hasOwnProperty, rt = tt.toString, it = Object.hasOwn || (function(e, t) {
	return nt.call(e, t);
}), at = Array.isArray || (function(e) {
	return rt.call(e) === "[object Array]";
}), ot = Object.create(null);
function st(e) {
	return ot[e] || (ot[e] = RegExp("^(?:" + e.replace(/ /g, "|") + ")$"));
}
function ct(e) {
	return e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode((e >> 10) + 55296, (e & 1023) + 56320));
}
var lt = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/, ut = function(e, t) {
	this.line = e, this.column = t;
};
ut.prototype.offset = function(e) {
	return new ut(this.line, this.column + e);
};
var dt = function(e, t, n) {
	this.start = t, this.end = n, e.sourceFile !== null && (this.source = e.sourceFile);
};
function ft(e, t) {
	for (var n = 1, r = 0;;) {
		var i = $e(e, r, t);
		if (i < 0) return new ut(n, t - r);
		++n, r = i;
	}
}
var pt = {
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
}, mt = !1;
function ht(e) {
	var t = {};
	for (var n in pt) t[n] = e && it(e, n) ? e[n] : pt[n];
	if (t.ecmaVersion === "latest" ? t.ecmaVersion = 1e8 : t.ecmaVersion == null ? (!mt && typeof console == "object" && console.warn && (mt = !0, console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.")), t.ecmaVersion = 11) : t.ecmaVersion >= 2015 && (t.ecmaVersion -= 2009), t.allowReserved ??= t.ecmaVersion < 5, (!e || e.allowHashBang == null) && (t.allowHashBang = t.ecmaVersion >= 14), at(t.onToken)) {
		var r = t.onToken;
		t.onToken = function(e) {
			return r.push(e);
		};
	}
	if (at(t.onComment) && (t.onComment = gt(t, t.onComment)), t.sourceType === "commonjs" && t.allowAwaitOutsideFunction) throw Error("Cannot use allowAwaitOutsideFunction with sourceType: commonjs");
	return t;
}
function gt(e, t) {
	return function(n, r, i, a, o, s) {
		var c = {
			type: n ? "Block" : "Line",
			value: r,
			start: i,
			end: a
		};
		e.locations && (c.loc = new dt(this, o, s)), e.ranges && (c.range = [i, a]), t.push(c);
	};
}
var _t = 1, vt = 2, yt = 4, bt = 8, xt = 16, St = 32, Ct = 64, wt = 128, Tt = 256, Et = 512, Dt = 1024, Ot = _t | vt | Tt;
function kt(e, t) {
	return vt | (e ? yt : 0) | (t ? bt : 0);
}
var At = 0, jt = 1, Mt = 2, Nt = 3, Pt = 4, Ft = 5, P = function(e, t, n) {
	this.options = e = ht(e), this.sourceFile = e.sourceFile, this.keywords = st(We[e.ecmaVersion >= 6 ? 6 : e.sourceType === "module" ? "5module" : 5]);
	var r = "";
	e.allowReserved !== !0 && (r = He[e.ecmaVersion >= 6 ? 6 : e.ecmaVersion === 5 ? 5 : 3], e.sourceType === "module" && (r += " await")), this.reservedWords = st(r);
	var i = (r ? r + " " : "") + He.strict;
	this.reservedWordsStrict = st(i), this.reservedWordsStrictBind = st(i + " " + He.strictBind), this.input = String(t), this.containsEsc = !1, n ? (this.pos = n, this.lineStart = this.input.lastIndexOf("\n", n - 1) + 1, this.curLine = this.input.slice(0, this.lineStart).split(M).length) : (this.pos = this.lineStart = 0, this.curLine = 1), this.type = j.eof, this.value = null, this.start = this.end = this.pos, this.startLoc = this.endLoc = this.curPosition(), this.lastTokEndLoc = this.lastTokStartLoc = null, this.lastTokStart = this.lastTokEnd = this.pos, this.context = this.initialContext(), this.exprAllowed = !0, this.inModule = e.sourceType === "module", this.strict = this.inModule || e.strict === !0 || this.strictDirective(this.pos), this.potentialArrowAt = -1, this.potentialArrowInForAwait = !1, this.yieldPos = this.awaitPos = this.awaitIdentPos = 0, this.labels = [], this.undefinedExports = Object.create(null), this.pos === 0 && e.allowHashBang && this.input.slice(0, 2) === "#!" && this.skipLineComment(2), this.scopeStack = [], this.enterScope(this.options.sourceType === "commonjs" ? vt : _t), this.regexpState = null, this.privateNameStack = [];
}, F = {
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
P.prototype.parse = function() {
	var e = this, t = this.options.program || this.startNode();
	return this.nextToken(), this.catchStackOverflow(function() {
		return e.parseTopLevel(t);
	});
}, F.inFunction.get = function() {
	return (this.currentVarScope().flags & vt) > 0;
}, F.inGenerator.get = function() {
	return (this.currentVarScope().flags & bt) > 0;
}, F.inAsync.get = function() {
	return (this.currentVarScope().flags & yt) > 0;
}, F.canAwait.get = function() {
	for (var e = this.scopeStack.length - 1; e >= 0; e--) {
		var t = this.scopeStack[e].flags;
		if (t & (Tt | Et)) return !1;
		if (t & vt) return (t & yt) > 0;
	}
	return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
}, F.allowReturn.get = function() {
	return !!(this.inFunction || this.options.allowReturnOutsideFunction && this.currentVarScope().flags & _t);
}, F.allowSuper.get = function() {
	return (this.currentThisScope().flags & Ct) > 0 || this.options.allowSuperOutsideMethod;
}, F.allowDirectSuper.get = function() {
	return (this.currentThisScope().flags & wt) > 0;
}, F.treatFunctionsAsVar.get = function() {
	return this.treatFunctionsAsVarInScope(this.currentScope());
}, F.allowNewDotTarget.get = function() {
	for (var e = this.scopeStack.length - 1; e >= 0; e--) {
		var t = this.scopeStack[e].flags;
		if (t & (Tt | Et) || t & vt && !(t & xt)) return !0;
	}
	return !1;
}, F.allowUsing.get = function() {
	var e = this.currentScope().flags;
	return !(e & Dt || !this.inModule && e & _t);
}, F.inClassStaticBlock.get = function() {
	return (this.currentVarScope().flags & Tt) > 0;
}, P.extend = function() {
	for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
	for (var n = this, r = 0; r < e.length; r++) n = e[r](n);
	return n;
}, P.parse = function(e, t) {
	return new this(t, e).parse();
}, P.parseExpressionAt = function(e, t, n) {
	var r = new this(n, e, t);
	return r.nextToken(), r.parseExpression();
}, P.tokenizer = function(e, t) {
	return new this(t, e);
}, Object.defineProperties(P.prototype, F);
var I = P.prototype, It = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
I.strictDirective = function(e) {
	if (this.options.ecmaVersion < 5) return !1;
	for (;;) {
		N.lastIndex = e, e += N.exec(this.input)[0].length;
		var t = It.exec(this.input.slice(e));
		if (!t) return !1;
		if ((t[1] || t[2]) === "use strict") {
			N.lastIndex = e + t[0].length;
			var n = N.exec(this.input), r = n.index + n[0].length, i = this.input.charAt(r);
			return i === ";" || i === "}" || M.test(n[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(i) || i === "!" && this.input.charAt(r + 1) === "=");
		}
		e += t[0].length, N.lastIndex = e, e += N.exec(this.input)[0].length, this.input[e] === ";" && e++;
	}
}, I.eat = function(e) {
	return this.type === e ? (this.next(), !0) : !1;
}, I.isContextual = function(e) {
	return this.type === j.name && this.value === e && !this.containsEsc;
}, I.eatContextual = function(e) {
	return this.isContextual(e) ? (this.next(), !0) : !1;
}, I.catchStackOverflow = function(e) {
	try {
		return e();
	} catch (e) {
		if (e instanceof Error && (/\bstack\b.*\b(exceeded|overflow)\b/i.test(e.message) || /\btoo much recursion\b/i.test(e.message))) this.raise(this.start, "Not enough stack space to parse input");
		else throw e;
	}
}, I.expectContextual = function(e) {
	this.eatContextual(e) || this.unexpected();
}, I.canInsertSemicolon = function() {
	return this.type === j.eof || this.type === j.braceR || M.test(this.input.slice(this.lastTokEnd, this.start));
}, I.insertSemicolon = function() {
	if (this.canInsertSemicolon()) return this.options.onInsertedSemicolon && this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc), !0;
}, I.semicolon = function() {
	!this.eat(j.semi) && !this.insertSemicolon() && this.unexpected();
}, I.afterTrailingComma = function(e, t) {
	if (this.type === e) return this.options.onTrailingComma && this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc), t || this.next(), !0;
}, I.expect = function(e) {
	this.eat(e) || this.unexpected();
}, I.unexpected = function(e) {
	this.raise(e ?? this.start, "Unexpected token");
};
var Lt = function() {
	this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
I.checkPatternErrors = function(e, t) {
	if (e) {
		e.trailingComma > -1 && this.raiseRecoverable(e.trailingComma, "Comma is not permitted after the rest element");
		var n = t ? e.parenthesizedAssign : e.parenthesizedBind;
		n > -1 && this.raiseRecoverable(n, t ? "Assigning to rvalue" : "Parenthesized pattern");
	}
}, I.checkExpressionErrors = function(e, t) {
	if (!e) return !1;
	var n = e.shorthandAssign, r = e.doubleProto;
	if (!t) return n >= 0 || r >= 0;
	n >= 0 && this.raise(n, "Shorthand property assignments are valid only in destructuring patterns"), r >= 0 && this.raiseRecoverable(r, "Redefinition of __proto__ property");
}, I.checkYieldAwaitInDefaultParams = function() {
	this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos) && this.raise(this.yieldPos, "Yield expression cannot be a default value"), this.awaitPos && this.raise(this.awaitPos, "Await expression cannot be a default value");
}, I.isSimpleAssignTarget = function(e) {
	return e.type === "ParenthesizedExpression" ? this.isSimpleAssignTarget(e.expression) : e.type === "Identifier" || e.type === "MemberExpression";
};
var L = P.prototype;
L.parseTopLevel = function(e) {
	var t = Object.create(null);
	for (e.body ||= []; this.type !== j.eof;) {
		var n = this.parseStatement(null, !0, t);
		e.body.push(n);
	}
	if (this.inModule) for (var r = 0, i = Object.keys(this.undefinedExports); r < i.length; r += 1) {
		var a = i[r];
		this.raiseRecoverable(this.undefinedExports[a].start, "Export '" + a + "' is not defined");
	}
	return this.adaptDirectivePrologue(e.body), this.next(), e.sourceType = this.options.sourceType === "commonjs" ? "script" : this.options.sourceType, this.finishNode(e, "Program");
};
var Rt = { kind: "loop" }, zt = { kind: "switch" };
L.isLet = function(e) {
	if (this.options.ecmaVersion < 6 || !this.isContextual("let")) return !1;
	N.lastIndex = this.pos;
	var t = N.exec(this.input), n = this.pos + t[0].length, r = this.fullCharCodeAt(n);
	if (r === 91 || r === 92) return !0;
	if (e) return !1;
	if (r === 123) return !0;
	if (T(r)) {
		var i = n;
		do
			n += r <= 65535 ? 1 : 2;
		while (Ye(r = this.fullCharCodeAt(n)));
		if (r === 92) return !0;
		var a = this.input.slice(i, n);
		if (!Ge.test(a)) return !0;
	}
	return !1;
}, L.isAsyncFunction = function() {
	if (this.options.ecmaVersion < 8 || !this.isContextual("async")) return !1;
	N.lastIndex = this.pos;
	var e = N.exec(this.input), t = this.pos + e[0].length, n;
	return !M.test(this.input.slice(this.pos, t)) && this.input.slice(t, t + 8) === "function" && (t + 8 === this.input.length || !(Ye(n = this.fullCharCodeAt(t + 8)) || n === 92));
}, L.isUsingKeyword = function(e, t) {
	if (this.options.ecmaVersion < 17 || !this.isContextual(e ? "await" : "using")) return !1;
	N.lastIndex = this.pos;
	var n = N.exec(this.input), r = this.pos + n[0].length;
	if (M.test(this.input.slice(this.pos, r))) return !1;
	if (e) {
		var i = r + 5, a;
		if (this.input.slice(r, i) !== "using" || i === this.input.length || Ye(a = this.fullCharCodeAt(i)) || a === 92) return !1;
		N.lastIndex = i;
		var o = N.exec(this.input);
		if (r = i + o[0].length, o && M.test(this.input.slice(i, r))) return !1;
	}
	var s = this.fullCharCodeAt(r);
	if (!T(s) && s !== 92) return !1;
	var c = r;
	do
		r += s <= 65535 ? 1 : 2;
	while (Ye(s = this.fullCharCodeAt(r)));
	if (s === 92) return !0;
	var l = this.input.slice(c, r);
	if (Ge.test(l)) return !1;
	if (t && !e && l === "of") {
		N.lastIndex = r;
		var u = N.exec(this.input);
		if (r += u[0].length, this.input.charCodeAt(r) !== 61 || (s = this.input.charCodeAt(r + 1)) === 61 || s === 62) return !1;
	}
	return !0;
}, L.isAwaitUsing = function(e) {
	return this.isUsingKeyword(!0, e);
}, L.isUsing = function(e) {
	return this.isUsingKeyword(!1, e);
}, L.parseStatement = function(e, t, n) {
	var r = this.type, i = this.startNode(), a;
	switch (this.isLet(e) && (r = j._var, a = "let"), r) {
		case j._break:
		case j._continue: return this.parseBreakContinueStatement(i, r.keyword);
		case j._debugger: return this.parseDebuggerStatement(i);
		case j._do: return this.parseDoStatement(i);
		case j._for: return this.parseForStatement(i);
		case j._function: return e && (this.strict || e !== "if" && e !== "label") && this.options.ecmaVersion >= 6 && this.unexpected(), this.parseFunctionStatement(i, !1, !e);
		case j._class: return e && this.unexpected(), this.parseClass(i, !0);
		case j._if: return this.parseIfStatement(i);
		case j._return: return this.parseReturnStatement(i);
		case j._switch: return this.parseSwitchStatement(i);
		case j._throw: return this.parseThrowStatement(i);
		case j._try: return this.parseTryStatement(i);
		case j._const:
		case j._var: return a ||= this.value, e && a !== "var" && this.unexpected(), this.parseVarStatement(i, a);
		case j._while: return this.parseWhileStatement(i);
		case j._with: return this.parseWithStatement(i);
		case j.braceL: return this.parseBlock(!0, i);
		case j.semi: return this.parseEmptyStatement(i);
		case j._export:
		case j._import:
			if (this.options.ecmaVersion > 10 && r === j._import) {
				N.lastIndex = this.pos;
				var o = N.exec(this.input), s = this.pos + o[0].length, c = this.input.charCodeAt(s);
				if (c === 40 || c === 46) return this.parseExpressionStatement(i, this.parseExpression());
			}
			return this.options.allowImportExportEverywhere || (t || this.raise(this.start, "'import' and 'export' may only appear at the top level"), this.inModule || this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'")), r === j._import ? this.parseImport(i) : this.parseExport(i, n);
		default:
			if (this.isAsyncFunction()) return e && this.unexpected(), this.next(), this.parseFunctionStatement(i, !0, !e);
			var l = this.isAwaitUsing(!1) ? "await using" : this.isUsing(!1) ? "using" : null;
			if (l) return this.allowUsing || this.raise(this.start, "Using declaration cannot appear in the top level when source type is `script` or in the bare case statement"), e && this.raise(this.start, "Using declaration is not allowed in single-statement positions"), l === "await using" && (this.canAwait || this.raise(this.start, "Await using cannot appear outside of async function"), this.next()), this.next(), this.parseVar(i, !1, l), this.semicolon(), this.finishNode(i, "VariableDeclaration");
			var u = this.value, d = this.parseExpression();
			return r === j.name && d.type === "Identifier" && this.eat(j.colon) ? this.parseLabeledStatement(i, u, d, e) : this.parseExpressionStatement(i, d);
	}
}, L.parseBreakContinueStatement = function(e, t) {
	var n = t === "break";
	this.next(), this.eat(j.semi) || this.insertSemicolon() ? e.label = null : this.type === j.name ? (e.label = this.parseIdent(), this.semicolon()) : this.unexpected();
	for (var r = 0; r < this.labels.length; ++r) {
		var i = this.labels[r];
		if ((e.label == null || i.name === e.label.name) && (i.kind != null && (n || i.kind === "loop") || e.label && n)) break;
	}
	return r === this.labels.length && this.raise(e.start, "Unsyntactic " + t), this.finishNode(e, n ? "BreakStatement" : "ContinueStatement");
}, L.parseDebuggerStatement = function(e) {
	return this.next(), this.semicolon(), this.finishNode(e, "DebuggerStatement");
}, L.parseDoStatement = function(e) {
	return this.next(), this.labels.push(Rt), e.body = this.parseStatement("do"), this.labels.pop(), this.expect(j._while), e.test = this.parseParenExpression(), this.options.ecmaVersion >= 6 ? this.eat(j.semi) : this.semicolon(), this.finishNode(e, "DoWhileStatement");
}, L.parseForStatement = function(e) {
	this.next();
	var t = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
	if (this.labels.push(Rt), this.enterScope(0), this.expect(j.parenL), this.type === j.semi) return t > -1 && this.unexpected(t), this.parseFor(e, null);
	var n = this.isLet();
	if (this.type === j._var || this.type === j._const || n) {
		var r = this.startNode(), i = n ? "let" : this.value;
		return this.next(), this.parseVar(r, !0, i), this.finishNode(r, "VariableDeclaration"), this.parseForAfterInit(e, r, t);
	}
	var a = this.isContextual("let"), o = !1, s = this.isUsing(!0) ? "using" : this.isAwaitUsing(!0) ? "await using" : null;
	if (s) {
		var c = this.startNode();
		return this.next(), s === "await using" && (this.canAwait || this.raise(this.start, "Await using cannot appear outside of async function"), this.next()), this.parseVar(c, !0, s), this.finishNode(c, "VariableDeclaration"), this.parseForAfterInit(e, c, t);
	}
	var l = this.containsEsc, u = new Lt(), d = this.start, f = t > -1 ? this.parseExprSubscripts(u, "await") : this.parseExpression(!0, u);
	return this.type === j._in || (o = this.options.ecmaVersion >= 6 && this.isContextual("of")) ? (t > -1 ? (this.type === j._in && this.unexpected(t), e.await = !0) : o && this.options.ecmaVersion >= 8 && (f.start === d && !l && f.type === "Identifier" && f.name === "async" ? this.unexpected() : this.options.ecmaVersion >= 9 && (e.await = !1)), a && o && this.raise(f.start, "The left-hand side of a for-of loop may not start with 'let'."), this.toAssignable(f, !1, u), this.checkLValPattern(f), this.parseForIn(e, f)) : (this.checkExpressionErrors(u, !0), t > -1 && this.unexpected(t), this.parseFor(e, f));
}, L.parseForAfterInit = function(e, t, n) {
	return (this.type === j._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && t.declarations.length === 1 ? (this.type === j._in ? ((t.kind === "using" || t.kind === "await using") && !t.declarations[0].init && this.raise(this.start, "Using declaration is not allowed in for-in loops"), this.options.ecmaVersion >= 9 && n > -1 && this.unexpected(n)) : this.options.ecmaVersion >= 9 && (e.await = n > -1), this.parseForIn(e, t)) : (n > -1 && this.unexpected(n), this.parseFor(e, t));
}, L.parseFunctionStatement = function(e, t, n) {
	return this.next(), this.parseFunction(e, Vt | (n ? 0 : Ht), !1, t);
}, L.parseIfStatement = function(e) {
	return this.next(), e.test = this.parseParenExpression(), e.consequent = this.parseStatement("if"), e.alternate = this.eat(j._else) ? this.parseStatement("if") : null, this.finishNode(e, "IfStatement");
}, L.parseReturnStatement = function(e) {
	return this.allowReturn || this.raise(this.start, "'return' outside of function"), this.next(), this.eat(j.semi) || this.insertSemicolon() ? e.argument = null : (e.argument = this.parseExpression(), this.semicolon()), this.finishNode(e, "ReturnStatement");
}, L.parseSwitchStatement = function(e) {
	this.next(), e.discriminant = this.parseParenExpression(), e.cases = [], this.expect(j.braceL), this.labels.push(zt), this.enterScope(Dt);
	for (var t, n = !1; this.type !== j.braceR;) if (this.type === j._case || this.type === j._default) {
		var r = this.type === j._case;
		t && this.finishNode(t, "SwitchCase"), e.cases.push(t = this.startNode()), t.consequent = [], this.next(), r ? t.test = this.parseExpression() : (n && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"), n = !0, t.test = null), this.expect(j.colon);
	} else t || this.unexpected(), t.consequent.push(this.parseStatement(null));
	return this.exitScope(), t && this.finishNode(t, "SwitchCase"), this.next(), this.labels.pop(), this.finishNode(e, "SwitchStatement");
}, L.parseThrowStatement = function(e) {
	return this.next(), M.test(this.input.slice(this.lastTokEnd, this.start)) && this.raise(this.lastTokEnd, "Illegal newline after throw"), e.argument = this.parseExpression(), this.semicolon(), this.finishNode(e, "ThrowStatement");
};
var Bt = [];
L.parseCatchClauseParam = function() {
	var e = this.parseBindingAtom(), t = e.type === "Identifier";
	return this.enterScope(t ? St : 0), this.checkLValPattern(e, t ? Pt : Mt), this.expect(j.parenR), e;
}, L.parseTryStatement = function(e) {
	if (this.next(), e.block = this.parseBlock(), e.handler = null, this.type === j._catch) {
		var t = this.startNode();
		this.next(), this.eat(j.parenL) ? t.param = this.parseCatchClauseParam() : (this.options.ecmaVersion < 10 && this.unexpected(), t.param = null, this.enterScope(0)), t.body = this.parseBlock(!1), this.exitScope(), e.handler = this.finishNode(t, "CatchClause");
	}
	return e.finalizer = this.eat(j._finally) ? this.parseBlock() : null, !e.handler && !e.finalizer && this.raise(e.start, "Missing catch or finally clause"), this.finishNode(e, "TryStatement");
}, L.parseVarStatement = function(e, t, n) {
	return this.next(), this.parseVar(e, !1, t, n), this.semicolon(), this.finishNode(e, "VariableDeclaration");
}, L.parseWhileStatement = function(e) {
	return this.next(), e.test = this.parseParenExpression(), this.labels.push(Rt), e.body = this.parseStatement("while"), this.labels.pop(), this.finishNode(e, "WhileStatement");
}, L.parseWithStatement = function(e) {
	return this.strict && this.raise(this.start, "'with' in strict mode"), this.next(), e.object = this.parseParenExpression(), e.body = this.parseStatement("with"), this.finishNode(e, "WithStatement");
}, L.parseEmptyStatement = function(e) {
	return this.next(), this.finishNode(e, "EmptyStatement");
}, L.parseLabeledStatement = function(e, t, n, r) {
	for (var i = 0, a = this.labels; i < a.length; i += 1) a[i].name === t && this.raise(n.start, "Label '" + t + "' is already declared");
	for (var o = this.type.isLoop ? "loop" : this.type === j._switch ? "switch" : null, s = this.labels.length - 1; s >= 0; s--) {
		var c = this.labels[s];
		if (c.statementStart === e.start) c.statementStart = this.start, c.kind = o;
		else break;
	}
	return this.labels.push({
		name: t,
		kind: o,
		statementStart: this.start
	}), e.body = this.parseStatement(r ? r.indexOf("label") === -1 ? r + "label" : r : "label"), this.labels.pop(), e.label = n, this.finishNode(e, "LabeledStatement");
}, L.parseExpressionStatement = function(e, t) {
	return e.expression = t, this.semicolon(), this.finishNode(e, "ExpressionStatement");
}, L.parseBlock = function(e, t, n) {
	for (e === void 0 && (e = !0), t === void 0 && (t = this.startNode()), t.body = [], this.expect(j.braceL), e && this.enterScope(0); this.type !== j.braceR;) {
		var r = this.parseStatement(null);
		t.body.push(r);
	}
	return n && (this.strict = !1), this.next(), e && this.exitScope(), this.finishNode(t, "BlockStatement");
}, L.parseFor = function(e, t) {
	return e.init = t, this.expect(j.semi), e.test = this.type === j.semi ? null : this.parseExpression(), this.expect(j.semi), e.update = this.type === j.parenR ? null : this.parseExpression(), this.expect(j.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, "ForStatement");
}, L.parseForIn = function(e, t) {
	var n = this.type === j._in;
	return this.next(), t.type === "VariableDeclaration" && t.declarations[0].init != null && (!n || this.options.ecmaVersion < 8 || this.strict || t.kind !== "var" || t.declarations[0].id.type !== "Identifier") && this.raise(t.start, (n ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"), e.left = t, e.right = n ? this.parseExpression() : this.parseMaybeAssign(), this.expect(j.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, n ? "ForInStatement" : "ForOfStatement");
}, L.parseVar = function(e, t, n, r) {
	for (e.declarations = [], e.kind = n;;) {
		var i = this.startNode();
		if (this.parseVarId(i, n), this.eat(j.eq) ? i.init = this.parseMaybeAssign(t) : !r && n === "const" && !(this.type === j._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) ? this.unexpected() : !r && (n === "using" || n === "await using") && this.options.ecmaVersion >= 17 && this.type !== j._in && !this.isContextual("of") ? this.raise(this.lastTokEnd, "Missing initializer in " + n + " declaration") : !r && i.id.type !== "Identifier" && !(t && (this.type === j._in || this.isContextual("of"))) ? this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value") : i.init = null, e.declarations.push(this.finishNode(i, "VariableDeclarator")), !this.eat(j.comma)) break;
	}
	return e;
}, L.parseVarId = function(e, t) {
	e.id = t === "using" || t === "await using" ? this.parseIdent() : this.parseBindingAtom(), this.checkLValPattern(e.id, t === "var" ? jt : Mt, !1);
};
var Vt = 1, Ht = 2, Ut = 4;
L.parseFunction = function(e, t, n, r, i) {
	this.initFunction(e), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !r) && (this.type === j.star && t & Ht && this.unexpected(), e.generator = this.eat(j.star)), this.options.ecmaVersion >= 8 && (e.async = !!r), t & Vt && (e.id = t & Ut && this.type !== j.name ? null : this.parseIdent(), e.id && !(t & Ht) && this.checkLValSimple(e.id, this.strict || e.generator || e.async ? this.treatFunctionsAsVar ? jt : Mt : Nt));
	var a = this.yieldPos, o = this.awaitPos, s = this.awaitIdentPos;
	return this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(kt(e.async, e.generator)), t & Vt || (e.id = this.type === j.name ? this.parseIdent() : null), this.parseFunctionParams(e), this.parseFunctionBody(e, n, !1, i), this.yieldPos = a, this.awaitPos = o, this.awaitIdentPos = s, this.finishNode(e, t & Vt ? "FunctionDeclaration" : "FunctionExpression");
}, L.parseFunctionParams = function(e) {
	this.expect(j.parenL), e.params = this.parseBindingList(j.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams();
}, L.parseClass = function(e, t) {
	this.next();
	var n = this.strict;
	this.strict = !0, this.parseClassId(e, t), this.parseClassSuper(e);
	var r = this.enterClassBody(), i = this.startNode(), a = !1;
	for (i.body = [], this.expect(j.braceL); this.type !== j.braceR;) {
		var o = this.parseClassElement(e.superClass !== null);
		o && (i.body.push(o), o.type === "MethodDefinition" && o.kind === "constructor" ? (a && this.raiseRecoverable(o.start, "Duplicate constructor in the same class"), a = !0) : o.key && o.key.type === "PrivateIdentifier" && Wt(r, o) && this.raiseRecoverable(o.key.start, "Identifier '#" + o.key.name + "' has already been declared"));
	}
	return this.strict = n, this.next(), e.body = this.finishNode(i, "ClassBody"), this.exitClassBody(), this.finishNode(e, t ? "ClassDeclaration" : "ClassExpression");
}, L.parseClassElement = function(e) {
	if (this.eat(j.semi)) return null;
	var t = this.options.ecmaVersion, n = this.startNode(), r = "", i = !1, a = !1, o = "method", s = !1;
	if (this.eatContextual("static")) {
		if (t >= 13 && this.eat(j.braceL)) return this.parseClassStaticBlock(n), n;
		this.isClassElementNameStart() || this.type === j.star ? s = !0 : r = "static";
	}
	if (n.static = s, !r && t >= 8 && this.eatContextual("async") && ((this.isClassElementNameStart() || this.type === j.star) && !this.canInsertSemicolon() ? a = !0 : r = "async"), !r && (t >= 9 || !a) && this.eat(j.star) && (i = !0), !r && !a && !i) {
		var c = this.value;
		(this.eatContextual("get") || this.eatContextual("set")) && (this.isClassElementNameStart() ? o = c : r = c);
	}
	if (r ? (n.computed = !1, n.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc), n.key.name = r, this.finishNode(n.key, "Identifier")) : this.parseClassElementName(n), t < 13 || this.type === j.parenL || o !== "method" || i || a) {
		var l = !n.static && Gt(n, "constructor"), u = l && e;
		l && o !== "method" && this.raise(n.key.start, "Constructor can't have get/set modifier"), n.kind = l ? "constructor" : o, this.parseClassMethod(n, i, a, u);
	} else this.parseClassField(n);
	return n;
}, L.isClassElementNameStart = function() {
	return this.type === j.name || this.type === j.privateId || this.type === j.num || this.type === j.string || this.type === j.bracketL || this.type.keyword;
}, L.parseClassElementName = function(e) {
	this.type === j.privateId ? (this.value === "constructor" && this.raise(this.start, "Classes can't have an element named '#constructor'"), e.computed = !1, e.key = this.parsePrivateIdent()) : this.parsePropertyName(e);
}, L.parseClassMethod = function(e, t, n, r) {
	var i = e.key;
	e.kind === "constructor" ? (t && this.raise(i.start, "Constructor can't be a generator"), n && this.raise(i.start, "Constructor can't be an async method")) : e.static && Gt(e, "prototype") && this.raise(i.start, "Classes may not have a static property named prototype");
	var a = e.value = this.parseMethod(t, n, r);
	return e.kind === "get" && a.params.length !== 0 && this.raiseRecoverable(a.start, "getter should have no params"), e.kind === "set" && a.params.length !== 1 && this.raiseRecoverable(a.start, "setter should have exactly one param"), e.kind === "set" && a.params[0].type === "RestElement" && this.raiseRecoverable(a.params[0].start, "Setter cannot use rest params"), this.finishNode(e, "MethodDefinition");
}, L.parseClassField = function(e) {
	return Gt(e, "constructor") ? this.raise(e.key.start, "Classes can't have a field named 'constructor'") : e.static && Gt(e, "prototype") && this.raise(e.key.start, "Classes can't have a static field named 'prototype'"), this.eat(j.eq) ? (this.enterScope(Et | Ct), e.value = this.parseMaybeAssign(), this.exitScope()) : e.value = null, this.semicolon(), this.finishNode(e, "PropertyDefinition");
}, L.parseClassStaticBlock = function(e) {
	e.body = [];
	var t = this.labels;
	for (this.labels = [], this.enterScope(Tt | Ct); this.type !== j.braceR;) {
		var n = this.parseStatement(null);
		e.body.push(n);
	}
	return this.next(), this.exitScope(), this.labels = t, this.finishNode(e, "StaticBlock");
}, L.parseClassId = function(e, t) {
	this.type === j.name ? (e.id = this.parseIdent(), t && this.checkLValSimple(e.id, Mt, !1)) : (t === !0 && this.unexpected(), e.id = null);
}, L.parseClassSuper = function(e) {
	e.superClass = this.eat(j._extends) ? this.parseExprSubscripts(null, !1) : null;
}, L.enterClassBody = function() {
	var e = {
		declared: Object.create(null),
		used: []
	};
	return this.privateNameStack.push(e), e.declared;
}, L.exitClassBody = function() {
	var e = this.privateNameStack.pop(), t = e.declared, n = e.used;
	if (this.options.checkPrivateFields) for (var r = this.privateNameStack.length, i = r === 0 ? null : this.privateNameStack[r - 1], a = 0; a < n.length; ++a) {
		var o = n[a];
		it(t, o.name) || (i ? i.used.push(o) : this.raiseRecoverable(o.start, "Private field '#" + o.name + "' must be declared in an enclosing class"));
	}
};
function Wt(e, t) {
	var n = t.key.name, r = e[n], i = "true";
	return t.type === "MethodDefinition" && (t.kind === "get" || t.kind === "set") && (i = (t.static ? "s" : "i") + t.kind), r === "iget" && i === "iset" || r === "iset" && i === "iget" || r === "sget" && i === "sset" || r === "sset" && i === "sget" ? (e[n] = "true", !1) : r ? !0 : (e[n] = i, !1);
}
function Gt(e, t) {
	var n = e.computed, r = e.key;
	return !n && (r.type === "Identifier" && r.name === t || r.type === "Literal" && r.value === t);
}
L.parseExportAllDeclaration = function(e, t) {
	return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (e.exported = this.parseModuleExportName(), this.checkExport(t, e.exported, this.lastTokStart)) : e.exported = null), this.expectContextual("from"), this.type !== j.string && this.unexpected(), e.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (e.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(e, "ExportAllDeclaration");
}, L.parseExport = function(e, t) {
	if (this.next(), this.eat(j.star)) return this.parseExportAllDeclaration(e, t);
	if (this.eat(j._default)) return this.checkExport(t, "default", this.lastTokStart), e.declaration = this.parseExportDefaultDeclaration(), this.finishNode(e, "ExportDefaultDeclaration");
	if (this.shouldParseExportStatement()) e.declaration = this.parseExportDeclaration(e), e.declaration.type === "VariableDeclaration" ? this.checkVariableExport(t, e.declaration.declarations) : this.checkExport(t, e.declaration.id, e.declaration.id.start), e.specifiers = [], e.source = null, this.options.ecmaVersion >= 16 && (e.attributes = []);
	else {
		if (e.declaration = null, e.specifiers = this.parseExportSpecifiers(t), this.eatContextual("from")) this.type !== j.string && this.unexpected(), e.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (e.attributes = this.parseWithClause());
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
}, L.parseExportDeclaration = function(e) {
	return this.parseStatement(null);
}, L.parseExportDefaultDeclaration = function() {
	var e;
	if (this.type === j._function || (e = this.isAsyncFunction())) {
		var t = this.startNode();
		return this.next(), e && this.next(), this.parseFunction(t, Vt | Ut, !1, e);
	} else if (this.type === j._class) {
		var n = this.startNode();
		return this.parseClass(n, "nullableID");
	} else {
		var r = this.parseMaybeAssign();
		return this.semicolon(), r;
	}
}, L.checkExport = function(e, t, n) {
	e && (typeof t != "string" && (t = t.type === "Identifier" ? t.name : t.value), it(e, t) && this.raiseRecoverable(n, "Duplicate export '" + t + "'"), e[t] = !0);
}, L.checkPatternExport = function(e, t) {
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
}, L.checkVariableExport = function(e, t) {
	if (e) for (var n = 0, r = t; n < r.length; n += 1) {
		var i = r[n];
		this.checkPatternExport(e, i.id);
	}
}, L.shouldParseExportStatement = function() {
	return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
}, L.parseExportSpecifier = function(e) {
	var t = this.startNode();
	return t.local = this.parseModuleExportName(), t.exported = this.eatContextual("as") ? this.parseModuleExportName() : t.local, this.checkExport(e, t.exported, t.exported.start), this.finishNode(t, "ExportSpecifier");
}, L.parseExportSpecifiers = function(e) {
	var t = [], n = !0;
	for (this.expect(j.braceL); !this.eat(j.braceR);) {
		if (n) n = !1;
		else if (this.expect(j.comma), this.afterTrailingComma(j.braceR)) break;
		t.push(this.parseExportSpecifier(e));
	}
	return t;
}, L.parseImport = function(e) {
	return this.next(), this.type === j.string ? (e.specifiers = Bt, e.source = this.parseExprAtom()) : (e.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), e.source = this.type === j.string ? this.parseExprAtom() : this.unexpected()), this.options.ecmaVersion >= 16 && (e.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(e, "ImportDeclaration");
}, L.parseImportSpecifier = function() {
	var e = this.startNode();
	return e.imported = this.parseModuleExportName(), this.eatContextual("as") ? e.local = this.parseIdent() : (this.checkUnreserved(e.imported), e.local = e.imported), this.checkLValSimple(e.local, Mt), this.finishNode(e, "ImportSpecifier");
}, L.parseImportDefaultSpecifier = function() {
	var e = this.startNode();
	return e.local = this.parseIdent(), this.checkLValSimple(e.local, Mt), this.finishNode(e, "ImportDefaultSpecifier");
}, L.parseImportNamespaceSpecifier = function() {
	var e = this.startNode();
	return this.next(), this.expectContextual("as"), e.local = this.parseIdent(), this.checkLValSimple(e.local, Mt), this.finishNode(e, "ImportNamespaceSpecifier");
}, L.parseImportSpecifiers = function() {
	var e = [], t = !0;
	if (this.type === j.name && (e.push(this.parseImportDefaultSpecifier()), !this.eat(j.comma))) return e;
	if (this.type === j.star) return e.push(this.parseImportNamespaceSpecifier()), e;
	for (this.expect(j.braceL); !this.eat(j.braceR);) {
		if (t) t = !1;
		else if (this.expect(j.comma), this.afterTrailingComma(j.braceR)) break;
		e.push(this.parseImportSpecifier());
	}
	return e;
}, L.parseWithClause = function() {
	var e = [];
	if (!this.eat(j._with)) return e;
	this.expect(j.braceL);
	for (var t = {}, n = !0; !this.eat(j.braceR);) {
		if (n) n = !1;
		else if (this.expect(j.comma), this.afterTrailingComma(j.braceR)) break;
		var r = this.parseImportAttribute(), i = r.key.type === "Identifier" ? r.key.name : r.key.value;
		it(t, i) && this.raiseRecoverable(r.key.start, "Duplicate attribute key '" + i + "'"), t[i] = !0, e.push(r);
	}
	return e;
}, L.parseImportAttribute = function() {
	var e = this.startNode();
	return e.key = this.type === j.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never"), this.expect(j.colon), this.type !== j.string && this.unexpected(), e.value = this.parseExprAtom(), this.finishNode(e, "ImportAttribute");
}, L.parseModuleExportName = function() {
	if (this.options.ecmaVersion >= 13 && this.type === j.string) {
		var e = this.parseLiteral(this.value);
		return lt.test(e.value) && this.raise(e.start, "An export name cannot include a lone surrogate."), e;
	}
	return this.parseIdent(!0);
}, L.adaptDirectivePrologue = function(e) {
	for (var t = 0; t < e.length && this.isDirectiveCandidate(e[t]); ++t) e[t].directive = e[t].expression.raw.slice(1, -1);
}, L.isDirectiveCandidate = function(e) {
	return this.options.ecmaVersion >= 5 && e.type === "ExpressionStatement" && e.expression.type === "Literal" && typeof e.expression.value == "string" && (this.input[e.start] === "\"" || this.input[e.start] === "'");
};
var R = P.prototype;
R.toAssignable = function(e, t, n) {
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
}, R.toAssignableList = function(e, t) {
	for (var n = e.length, r = 0; r < n; r++) {
		var i = e[r];
		i && this.toAssignable(i, t);
	}
	if (n) {
		var a = e[n - 1];
		this.options.ecmaVersion === 6 && t && a && a.type === "RestElement" && a.argument.type !== "Identifier" && this.unexpected(a.argument.start);
	}
	return e;
}, R.parseSpread = function(e) {
	var t = this.startNode();
	return this.next(), t.argument = this.parseMaybeAssign(!1, e), this.finishNode(t, "SpreadElement");
}, R.parseRestBinding = function() {
	var e = this.startNode();
	return this.next(), this.options.ecmaVersion === 6 && this.type !== j.name && this.unexpected(), e.argument = this.parseBindingAtom(), this.finishNode(e, "RestElement");
}, R.parseBindingAtom = function() {
	if (this.options.ecmaVersion >= 6) switch (this.type) {
		case j.bracketL:
			var e = this.startNode();
			return this.next(), e.elements = this.parseBindingList(j.bracketR, !0, !0), this.finishNode(e, "ArrayPattern");
		case j.braceL: return this.parseObj(!0);
	}
	return this.parseIdent();
}, R.parseBindingList = function(e, t, n, r) {
	for (var i = [], a = !0; !this.eat(e);) if (a ? a = !1 : this.expect(j.comma), t && this.type === j.comma) i.push(null);
	else if (n && this.afterTrailingComma(e)) break;
	else if (this.type === j.ellipsis) {
		var o = this.parseRestBinding();
		this.parseBindingListItem(o), i.push(o), this.type === j.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.expect(e);
		break;
	} else i.push(this.parseAssignableListItem(r));
	return i;
}, R.parseAssignableListItem = function(e) {
	var t = this.parseMaybeDefault(this.start, this.startLoc);
	return this.parseBindingListItem(t), t;
}, R.parseBindingListItem = function(e) {
	return e;
}, R.parseMaybeDefault = function(e, t, n) {
	if (n ||= this.parseBindingAtom(), this.options.ecmaVersion < 6 || !this.eat(j.eq)) return n;
	var r = this.startNodeAt(e, t);
	return r.left = n, r.right = this.parseMaybeAssign(), this.finishNode(r, "AssignmentPattern");
}, R.checkLValSimple = function(e, t, n) {
	t === void 0 && (t = At);
	var r = t !== At;
	switch (e.type) {
		case "Identifier":
			this.strict && this.reservedWordsStrictBind.test(e.name) && this.raiseRecoverable(e.start, (r ? "Binding " : "Assigning to ") + e.name + " in strict mode"), r && (t === Mt && e.name === "let" && this.raiseRecoverable(e.start, "let is disallowed as a lexically bound name"), n && (it(n, e.name) && this.raiseRecoverable(e.start, "Argument name clash"), n[e.name] = !0), t !== Ft && this.declareName(e.name, t, e.start));
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
}, R.checkLValPattern = function(e, t, n) {
	switch (t === void 0 && (t = At), e.type) {
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
}, R.checkLValInnerPattern = function(e, t, n) {
	switch (t === void 0 && (t = At), e.type) {
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
var z = function(e, t, n, r, i) {
	this.token = e, this.isExpr = !!t, this.preserveSpace = !!n, this.override = r, this.generator = !!i;
}, B = {
	b_stat: new z("{", !1),
	b_expr: new z("{", !0),
	b_tmpl: new z("${", !1),
	p_stat: new z("(", !1),
	p_expr: new z("(", !0),
	q_tmpl: new z("`", !0, !0, function(e) {
		return e.tryReadTemplateToken();
	}),
	f_stat: new z("function", !1),
	f_expr: new z("function", !0),
	f_expr_gen: new z("function", !0, !1, null, !0),
	f_gen: new z("function", !1, !1, null, !0)
}, Kt = P.prototype;
Kt.initialContext = function() {
	return [B.b_stat];
}, Kt.curContext = function() {
	return this.context[this.context.length - 1];
}, Kt.braceIsBlock = function(e) {
	var t = this.curContext();
	return t === B.f_expr || t === B.f_stat ? !0 : e === j.colon && (t === B.b_stat || t === B.b_expr) ? !t.isExpr : e === j._return || e === j.name && this.exprAllowed ? M.test(this.input.slice(this.lastTokEnd, this.start)) : e === j._else || e === j.semi || e === j.eof || e === j.parenR || e === j.arrow ? !0 : e === j.braceL ? t === B.b_stat : e === j._var || e === j._const || e === j.name ? !1 : !this.exprAllowed;
}, Kt.inGeneratorContext = function() {
	for (var e = this.context.length - 1; e >= 1; e--) {
		var t = this.context[e];
		if (t.token === "function") return t.generator;
	}
	return !1;
}, Kt.updateContext = function(e) {
	var t, n = this.type;
	n.keyword && e === j.dot ? this.exprAllowed = !1 : (t = n.updateContext) ? t.call(this, e) : this.exprAllowed = n.beforeExpr;
}, Kt.overrideContext = function(e) {
	this.curContext() !== e && (this.context[this.context.length - 1] = e);
}, j.parenR.updateContext = j.braceR.updateContext = function() {
	if (this.context.length === 1) {
		this.exprAllowed = !0;
		return;
	}
	var e = this.context.pop();
	e === B.b_stat && this.curContext().token === "function" && (e = this.context.pop()), this.exprAllowed = !e.isExpr;
}, j.braceL.updateContext = function(e) {
	this.context.push(this.braceIsBlock(e) ? B.b_stat : B.b_expr), this.exprAllowed = !0;
}, j.dollarBraceL.updateContext = function() {
	this.context.push(B.b_tmpl), this.exprAllowed = !0;
}, j.parenL.updateContext = function(e) {
	var t = e === j._if || e === j._for || e === j._with || e === j._while;
	this.context.push(t ? B.p_stat : B.p_expr), this.exprAllowed = !0;
}, j.incDec.updateContext = function() {}, j._function.updateContext = j._class.updateContext = function(e) {
	e.beforeExpr && e !== j._else && !(e === j.semi && this.curContext() !== B.p_stat) && !(e === j._return && M.test(this.input.slice(this.lastTokEnd, this.start))) && !((e === j.colon || e === j.braceL) && this.curContext() === B.b_stat) ? this.context.push(B.f_expr) : this.context.push(B.f_stat), this.exprAllowed = !1;
}, j.colon.updateContext = function() {
	this.curContext().token === "function" && this.context.pop(), this.exprAllowed = !0;
}, j.backQuote.updateContext = function() {
	this.curContext() === B.q_tmpl ? this.context.pop() : this.context.push(B.q_tmpl), this.exprAllowed = !1;
}, j.star.updateContext = function(e) {
	if (e === j._function) {
		var t = this.context.length - 1;
		this.context[t] === B.f_expr ? this.context[t] = B.f_expr_gen : this.context[t] = B.f_gen;
	}
	this.exprAllowed = !0;
}, j.name.updateContext = function(e) {
	var t = !1;
	this.options.ecmaVersion >= 6 && e !== j.dot && (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) && (t = !0), this.exprAllowed = t;
};
var V = P.prototype;
V.checkPropClash = function(e, t, n) {
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
}, V.parseExpression = function(e, t) {
	var n = this;
	return this.catchStackOverflow(function() {
		var r = n.start, i = n.startLoc, a = n.parseMaybeAssign(e, t);
		if (n.type === j.comma) {
			var o = n.startNodeAt(r, i);
			for (o.expressions = [a]; n.eat(j.comma);) o.expressions.push(n.parseMaybeAssign(e, t));
			return n.finishNode(o, "SequenceExpression");
		}
		return a;
	});
}, V.parseMaybeAssign = function(e, t, n) {
	if (this.isContextual("yield")) {
		if (this.inGenerator) return this.parseYield(e);
		this.exprAllowed = !1;
	}
	var r = !1, i = -1, a = -1, o = -1;
	t ? (i = t.parenthesizedAssign, a = t.trailingComma, o = t.doubleProto, t.parenthesizedAssign = t.trailingComma = -1) : (t = new Lt(), r = !0);
	var s = this.start, c = this.startLoc;
	(this.type === j.parenL || this.type === j.name) && (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = e === "await");
	var l = this.parseMaybeConditional(e, t);
	if (n && (l = n.call(this, l, s, c)), this.type.isAssign) {
		var u = this.startNodeAt(s, c);
		return u.operator = this.value, this.type === j.eq && (l = this.toAssignable(l, !1, t)), r || (t.parenthesizedAssign = t.trailingComma = t.doubleProto = -1), t.shorthandAssign >= l.start && (t.shorthandAssign = -1), this.type === j.eq ? this.checkLValPattern(l) : this.checkLValSimple(l), u.left = l, this.next(), u.right = this.parseMaybeAssign(e), o > -1 && (t.doubleProto = o), this.finishNode(u, "AssignmentExpression");
	} else r && this.checkExpressionErrors(t, !0);
	return i > -1 && (t.parenthesizedAssign = i), a > -1 && (t.trailingComma = a), l;
}, V.parseMaybeConditional = function(e, t) {
	var n = this.start, r = this.startLoc, i = this.parseExprOps(e, t);
	if (this.checkExpressionErrors(t)) return i;
	if (!(i.type === "ArrowFunctionExpression" && i.start === n) && this.eat(j.question)) {
		var a = this.startNodeAt(n, r);
		return a.test = i, a.consequent = this.parseMaybeAssign(), this.expect(j.colon), a.alternate = this.parseMaybeAssign(e), this.finishNode(a, "ConditionalExpression");
	}
	return i;
}, V.parseExprOps = function(e, t) {
	var n = this.start, r = this.startLoc, i = this.parseMaybeUnary(t, !1, !1, e);
	return this.checkExpressionErrors(t) || i.start === n && i.type === "ArrowFunctionExpression" ? i : this.parseExprOp(i, n, r, -1, e);
}, V.parseExprOp = function(e, t, n, r, i) {
	var a = this.type.binop;
	if (a != null && (!i || this.type !== j._in) && a > r) {
		var o = this.type === j.logicalOR || this.type === j.logicalAND, s = this.type === j.coalesce;
		s && (a = j.logicalAND.binop);
		var c = this.value;
		this.next();
		var l = this.start, u = this.startLoc, d = this.parseExprOp(this.parseMaybeUnary(null, !1, !1, i), l, u, a, i), f = this.buildBinary(t, n, e, d, c, o || s);
		return (o && this.type === j.coalesce || s && (this.type === j.logicalOR || this.type === j.logicalAND)) && this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses"), this.parseExprOp(f, t, n, r, i);
	}
	return e;
}, V.buildBinary = function(e, t, n, r, i, a) {
	r.type === "PrivateIdentifier" && this.raise(r.start, "Private identifier can only be left side of binary expression");
	var o = this.startNodeAt(e, t);
	return o.left = n, o.operator = i, o.right = r, this.finishNode(o, a ? "LogicalExpression" : "BinaryExpression");
}, V.parseMaybeUnary = function(e, t, n, r) {
	var i = this.start, a = this.startLoc, o;
	if (this.isContextual("await") && this.canAwait) o = this.parseAwait(r), t = !0;
	else if (this.type.prefix) {
		var s = this.startNode(), c = this.type === j.incDec;
		s.operator = this.value, s.prefix = !0, this.next(), s.argument = this.parseMaybeUnary(null, !0, c, r), this.checkExpressionErrors(e, !0), c ? this.checkLValSimple(s.argument) : this.strict && s.operator === "delete" && qt(s.argument) ? this.raiseRecoverable(s.start, "Deleting local variable in strict mode") : s.operator === "delete" && Jt(s.argument) ? this.raiseRecoverable(s.start, "Private fields can not be deleted") : t = !0, o = this.finishNode(s, c ? "UpdateExpression" : "UnaryExpression");
	} else if (!t && this.type === j.privateId) (r || this.privateNameStack.length === 0) && this.options.checkPrivateFields && this.unexpected(), o = this.parsePrivateIdent(), this.type !== j._in && this.unexpected();
	else {
		if (o = this.parseExprSubscripts(e, r), this.checkExpressionErrors(e)) return o;
		for (; this.type.postfix && !this.canInsertSemicolon();) {
			var l = this.startNodeAt(i, a);
			l.operator = this.value, l.prefix = !1, l.argument = o, this.checkLValSimple(o), this.next(), o = this.finishNode(l, "UpdateExpression");
		}
	}
	if (!n && this.eat(j.starstar)) if (t) this.unexpected(this.lastTokStart);
	else return this.buildBinary(i, a, o, this.parseMaybeUnary(null, !1, !1, r), "**", !1);
	else return o;
};
function qt(e) {
	return e.type === "Identifier" || e.type === "ParenthesizedExpression" && qt(e.expression);
}
function Jt(e) {
	return e.type === "MemberExpression" && e.property.type === "PrivateIdentifier" || e.type === "ChainExpression" && Jt(e.expression) || e.type === "ParenthesizedExpression" && Jt(e.expression);
}
V.parseExprSubscripts = function(e, t) {
	var n = this.start, r = this.startLoc, i = this.parseExprAtom(e, t);
	if (i.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")") return i;
	var a = this.parseSubscripts(i, n, r, !1, t);
	return e && a.type === "MemberExpression" && (e.parenthesizedAssign >= a.start && (e.parenthesizedAssign = -1), e.parenthesizedBind >= a.start && (e.parenthesizedBind = -1), e.trailingComma >= a.start && (e.trailingComma = -1)), a;
}, V.parseSubscripts = function(e, t, n, r, i) {
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
}, V.shouldParseAsyncArrow = function() {
	return !this.canInsertSemicolon() && this.eat(j.arrow);
}, V.parseSubscriptAsyncArrow = function(e, t, n, r) {
	return this.parseArrowExpression(this.startNodeAt(e, t), n, !0, r);
}, V.parseSubscript = function(e, t, n, r, i, a, o) {
	var s = this.options.ecmaVersion >= 11, c = s && this.eat(j.questionDot);
	r && c && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
	var l = this.eat(j.bracketL);
	if (l || c && this.type !== j.parenL && this.type !== j.backQuote || this.eat(j.dot)) {
		var u = this.startNodeAt(t, n);
		u.object = e, l ? (u.property = this.parseExpression(), this.expect(j.bracketR)) : this.type === j.privateId && e.type !== "Super" ? u.property = this.parsePrivateIdent() : u.property = this.parseIdent(this.options.allowReserved !== "never"), u.computed = !!l, s && (u.optional = c), e = this.finishNode(u, "MemberExpression");
	} else if (!r && this.eat(j.parenL)) {
		var d = new Lt(), f = this.yieldPos, p = this.awaitPos, m = this.awaitIdentPos;
		this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
		var h = this.parseExprList(j.parenR, this.options.ecmaVersion >= 8, !1, d);
		if (i && !c && this.shouldParseAsyncArrow()) return this.checkPatternErrors(d, !1), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = f, this.awaitPos = p, this.awaitIdentPos = m, this.parseSubscriptAsyncArrow(t, n, h, o);
		this.checkExpressionErrors(d, !0), this.yieldPos = f || this.yieldPos, this.awaitPos = p || this.awaitPos, this.awaitIdentPos = m || this.awaitIdentPos;
		var g = this.startNodeAt(t, n);
		g.callee = e, g.arguments = h, s && (g.optional = c), e = this.finishNode(g, "CallExpression");
	} else if (this.type === j.backQuote) {
		(c || a) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
		var ee = this.startNodeAt(t, n);
		ee.tag = e, ee.quasi = this.parseTemplate({ isTagged: !0 }), e = this.finishNode(ee, "TaggedTemplateExpression");
	}
	return e;
}, V.parseExprAtom = function(e, t, n) {
	this.type === j.slash && this.readRegexp();
	var r, i = this.potentialArrowAt === this.start;
	switch (this.type) {
		case j._super: return this.allowSuper || this.raise(this.start, "'super' keyword outside a method"), r = this.startNode(), this.next(), this.type === j.parenL && !this.allowDirectSuper && this.raise(r.start, "super() call outside constructor of a subclass"), this.type !== j.dot && this.type !== j.bracketL && this.type !== j.parenL && this.unexpected(), this.finishNode(r, "Super");
		case j._this: return r = this.startNode(), this.next(), this.finishNode(r, "ThisExpression");
		case j.name:
			var a = this.start, o = this.startLoc, s = this.containsEsc, c = this.parseIdent(!1);
			if (this.options.ecmaVersion >= 8 && !s && c.name === "async" && !this.canInsertSemicolon() && this.eat(j._function)) return this.overrideContext(B.f_expr), this.parseFunction(this.startNodeAt(a, o), 0, !1, !0, t);
			if (i && !this.canInsertSemicolon()) {
				if (this.eat(j.arrow)) return this.parseArrowExpression(this.startNodeAt(a, o), [c], !1, t);
				if (this.options.ecmaVersion >= 8 && c.name === "async" && this.type === j.name && !s && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) return c = this.parseIdent(!1), (this.canInsertSemicolon() || !this.eat(j.arrow)) && this.unexpected(), this.parseArrowExpression(this.startNodeAt(a, o), [c], !0, t);
			}
			return c;
		case j.regexp:
			var l = this.value;
			return r = this.parseLiteral(l.value), r.regex = {
				pattern: l.pattern,
				flags: l.flags
			}, r;
		case j.num:
		case j.string: return this.parseLiteral(this.value);
		case j._null:
		case j._true:
		case j._false: return r = this.startNode(), r.value = this.type === j._null ? null : this.type === j._true, r.raw = this.type.keyword, this.next(), this.finishNode(r, "Literal");
		case j.parenL:
			var u = this.start, d = this.parseParenAndDistinguishExpression(i, t);
			return e && (e.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(d) && (e.parenthesizedAssign = u), e.parenthesizedBind < 0 && (e.parenthesizedBind = u)), d;
		case j.bracketL: return r = this.startNode(), this.next(), r.elements = this.parseExprList(j.bracketR, !0, !0, e), this.finishNode(r, "ArrayExpression");
		case j.braceL: return this.overrideContext(B.b_expr), this.parseObj(!1, e);
		case j._function: return r = this.startNode(), this.next(), this.parseFunction(r, 0);
		case j._class: return this.parseClass(this.startNode(), !1);
		case j._new: return this.parseNew();
		case j.backQuote: return this.parseTemplate();
		case j._import: return this.options.ecmaVersion >= 11 ? this.parseExprImport(n) : this.unexpected();
		default: return this.parseExprAtomDefault();
	}
}, V.parseExprAtomDefault = function() {
	this.unexpected();
}, V.parseExprImport = function(e) {
	var t = this.startNode();
	if (this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword import"), this.next(), this.type === j.parenL && !e) return this.parseDynamicImport(t);
	if (this.type === j.dot) {
		var n = this.startNodeAt(t.start, t.loc && t.loc.start);
		return n.name = "import", t.meta = this.finishNode(n, "Identifier"), this.parseImportMeta(t);
	} else this.unexpected();
}, V.parseDynamicImport = function(e) {
	if (this.next(), e.source = this.parseMaybeAssign(), this.options.ecmaVersion >= 16) this.eat(j.parenR) ? e.options = null : (this.expect(j.comma), this.afterTrailingComma(j.parenR) ? e.options = null : (e.options = this.parseMaybeAssign(), this.eat(j.parenR) || (this.expect(j.comma), this.afterTrailingComma(j.parenR) || this.unexpected())));
	else if (!this.eat(j.parenR)) {
		var t = this.start;
		this.eat(j.comma) && this.eat(j.parenR) ? this.raiseRecoverable(t, "Trailing comma is not allowed in import()") : this.unexpected(t);
	}
	return this.finishNode(e, "ImportExpression");
}, V.parseImportMeta = function(e) {
	this.next();
	var t = this.containsEsc;
	return e.property = this.parseIdent(!0), e.property.name !== "meta" && this.raiseRecoverable(e.property.start, "The only valid meta property for import is 'import.meta'"), t && this.raiseRecoverable(e.start, "'import.meta' must not contain escaped characters"), this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere && this.raiseRecoverable(e.start, "Cannot use 'import.meta' outside a module"), this.finishNode(e, "MetaProperty");
}, V.parseLiteral = function(e) {
	var t = this.startNode();
	return t.value = e, t.raw = this.input.slice(this.start, this.end), t.raw.charCodeAt(t.raw.length - 1) === 110 && (t.bigint = t.value == null ? t.raw.slice(0, -1).replace(/_/g, "") : t.value.toString()), this.next(), this.finishNode(t, "Literal");
}, V.parseParenExpression = function() {
	this.expect(j.parenL);
	var e = this.parseExpression();
	return this.expect(j.parenR), e;
}, V.shouldParseArrow = function(e) {
	return !this.canInsertSemicolon();
}, V.parseParenAndDistinguishExpression = function(e, t) {
	var n = this.start, r = this.startLoc, i, a = this.options.ecmaVersion >= 8;
	if (this.options.ecmaVersion >= 6) {
		this.next();
		var o = this.start, s = this.startLoc, c = [], l = !0, u = !1, d = new Lt(), f = this.yieldPos, p = this.awaitPos, m;
		for (this.yieldPos = 0, this.awaitPos = 0; this.type !== j.parenR;) if (l ? l = !1 : this.expect(j.comma), a && this.afterTrailingComma(j.parenR, !0)) {
			u = !0;
			break;
		} else if (this.type === j.ellipsis) {
			m = this.start, c.push(this.parseParenItem(this.parseRestBinding())), this.type === j.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
			break;
		} else c.push(this.parseMaybeAssign(!1, d, this.parseParenItem));
		var h = this.lastTokEnd, g = this.lastTokEndLoc;
		if (this.expect(j.parenR), e && this.shouldParseArrow(c) && this.eat(j.arrow)) return this.checkPatternErrors(d, !1), this.checkYieldAwaitInDefaultParams(), this.yieldPos = f, this.awaitPos = p, this.parseParenArrowList(n, r, c, t);
		(!c.length || u) && this.unexpected(this.lastTokStart), m && this.unexpected(m), this.checkExpressionErrors(d, !0), this.yieldPos = f || this.yieldPos, this.awaitPos = p || this.awaitPos, c.length > 1 ? (i = this.startNodeAt(o, s), i.expressions = c, this.finishNodeAt(i, "SequenceExpression", h, g)) : i = c[0];
	} else i = this.parseParenExpression();
	if (this.options.preserveParens) {
		var ee = this.startNodeAt(n, r);
		return ee.expression = i, this.finishNode(ee, "ParenthesizedExpression");
	} else return i;
}, V.parseParenItem = function(e) {
	return e;
}, V.parseParenArrowList = function(e, t, n, r) {
	return this.parseArrowExpression(this.startNodeAt(e, t), n, !1, r);
};
var Yt = [];
V.parseNew = function() {
	this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
	var e = this.startNode();
	if (this.next(), this.options.ecmaVersion >= 6 && this.type === j.dot) {
		var t = this.startNodeAt(e.start, e.loc && e.loc.start);
		t.name = "new", e.meta = this.finishNode(t, "Identifier"), this.next();
		var n = this.containsEsc;
		return e.property = this.parseIdent(!0), e.property.name !== "target" && this.raiseRecoverable(e.property.start, "The only valid meta property for new is 'new.target'"), n && this.raiseRecoverable(e.start, "'new.target' must not contain escaped characters"), this.allowNewDotTarget || this.raiseRecoverable(e.start, "'new.target' can only be used in functions and class static block"), this.finishNode(e, "MetaProperty");
	}
	var r = this.start, i = this.startLoc;
	return e.callee = this.parseSubscripts(this.parseExprAtom(null, !1, !0), r, i, !0, !1), e.callee.type === "Super" && this.raiseRecoverable(r, "Invalid use of 'super'"), this.eat(j.parenL) ? e.arguments = this.parseExprList(j.parenR, this.options.ecmaVersion >= 8, !1) : e.arguments = Yt, this.finishNode(e, "NewExpression");
}, V.parseTemplateElement = function(e) {
	var t = e.isTagged, n = this.startNode();
	return this.type === j.invalidTemplate ? (t || this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal"), n.value = {
		raw: this.value.replace(/\r\n?/g, "\n"),
		cooked: null
	}) : n.value = {
		raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
		cooked: this.value
	}, this.next(), n.tail = this.type === j.backQuote, this.finishNode(n, "TemplateElement");
}, V.parseTemplate = function(e) {
	e === void 0 && (e = {});
	var t = e.isTagged;
	t === void 0 && (t = !1);
	var n = this.startNode();
	this.next(), n.expressions = [];
	var r = this.parseTemplateElement({ isTagged: t });
	for (n.quasis = [r]; !r.tail;) this.type === j.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(j.dollarBraceL), n.expressions.push(this.parseExpression()), this.expect(j.braceR), n.quasis.push(r = this.parseTemplateElement({ isTagged: t }));
	return this.next(), this.finishNode(n, "TemplateLiteral");
}, V.isAsyncProp = function(e) {
	return !e.computed && e.key.type === "Identifier" && e.key.name === "async" && (this.type === j.name || this.type === j.num || this.type === j.string || this.type === j.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === j.star) && !M.test(this.input.slice(this.lastTokEnd, this.start));
}, V.parseObj = function(e, t) {
	var n = this.startNode(), r = !0, i = {};
	for (n.properties = [], this.next(); !this.eat(j.braceR);) {
		if (r) r = !1;
		else if (this.expect(j.comma), this.options.ecmaVersion >= 5 && this.afterTrailingComma(j.braceR)) break;
		var a = this.parseProperty(e, t);
		e || this.checkPropClash(a, i, t), n.properties.push(a);
	}
	return this.finishNode(n, e ? "ObjectPattern" : "ObjectExpression");
}, V.parseProperty = function(e, t) {
	var n = this.startNode(), r, i, a, o;
	if (this.options.ecmaVersion >= 9 && this.eat(j.ellipsis)) return e ? (n.argument = this.parseIdent(!1), this.type === j.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.finishNode(n, "RestElement")) : (n.argument = this.parseMaybeAssign(!1, t), this.type === j.comma && t && t.trailingComma < 0 && (t.trailingComma = this.start), this.finishNode(n, "SpreadElement"));
	this.options.ecmaVersion >= 6 && (n.method = !1, n.shorthand = !1, (e || t) && (a = this.start, o = this.startLoc), e || (r = this.eat(j.star)));
	var s = this.containsEsc;
	return this.parsePropertyName(n), !e && !s && this.options.ecmaVersion >= 8 && !r && this.isAsyncProp(n) ? (i = !0, r = this.options.ecmaVersion >= 9 && this.eat(j.star), this.parsePropertyName(n)) : i = !1, this.parsePropertyValue(n, e, r, i, a, o, t, s), this.finishNode(n, "Property");
}, V.parseGetterSetter = function(e) {
	var t = e.key.name;
	this.parsePropertyName(e), e.value = this.parseMethod(!1), e.kind = t;
	var n = e.kind === "get" ? 0 : 1;
	if (e.value.params.length !== n) {
		var r = e.value.start;
		e.kind === "get" ? this.raiseRecoverable(r, "getter should have no params") : this.raiseRecoverable(r, "setter should have exactly one param");
	} else e.kind === "set" && e.value.params[0].type === "RestElement" && this.raiseRecoverable(e.value.params[0].start, "Setter cannot use rest params");
}, V.parsePropertyValue = function(e, t, n, r, i, a, o, s) {
	(n || r) && this.type === j.colon && this.unexpected(), this.eat(j.colon) ? (e.value = t ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(!1, o), e.kind = "init") : this.options.ecmaVersion >= 6 && this.type === j.parenL ? (t && this.unexpected(), e.method = !0, e.value = this.parseMethod(n, r), e.kind = "init") : !t && !s && this.options.ecmaVersion >= 5 && !e.computed && e.key.type === "Identifier" && (e.key.name === "get" || e.key.name === "set") && this.type !== j.comma && this.type !== j.braceR && this.type !== j.eq ? ((n || r) && this.unexpected(), this.parseGetterSetter(e)) : this.options.ecmaVersion >= 6 && !e.computed && e.key.type === "Identifier" ? ((n || r) && this.unexpected(), this.checkUnreserved(e.key), e.key.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = i), t ? e.value = this.parseMaybeDefault(i, a, this.copyNode(e.key)) : this.type === j.eq && o ? (o.shorthandAssign < 0 && (o.shorthandAssign = this.start), e.value = this.parseMaybeDefault(i, a, this.copyNode(e.key))) : e.value = this.copyNode(e.key), e.kind = "init", e.shorthand = !0) : this.unexpected();
}, V.parsePropertyName = function(e) {
	if (this.options.ecmaVersion >= 6) {
		if (this.eat(j.bracketL)) return e.computed = !0, e.key = this.parseMaybeAssign(), this.expect(j.bracketR), e.key;
		e.computed = !1;
	}
	return e.key = this.type === j.num || this.type === j.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
}, V.initFunction = function(e) {
	e.id = null, this.options.ecmaVersion >= 6 && (e.generator = e.expression = !1), this.options.ecmaVersion >= 8 && (e.async = !1);
}, V.parseMethod = function(e, t, n) {
	var r = this.startNode(), i = this.yieldPos, a = this.awaitPos, o = this.awaitIdentPos;
	return this.initFunction(r), this.options.ecmaVersion >= 6 && (r.generator = e), this.options.ecmaVersion >= 8 && (r.async = !!t), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(kt(t, r.generator) | Ct | (n ? wt : 0)), this.expect(j.parenL), r.params = this.parseBindingList(j.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(r, !1, !0, !1), this.yieldPos = i, this.awaitPos = a, this.awaitIdentPos = o, this.finishNode(r, "FunctionExpression");
}, V.parseArrowExpression = function(e, t, n, r) {
	var i = this.yieldPos, a = this.awaitPos, o = this.awaitIdentPos;
	return this.enterScope(kt(n, !1) | xt), this.initFunction(e), this.options.ecmaVersion >= 8 && (e.async = !!n), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, e.params = this.toAssignableList(t, !0), this.parseFunctionBody(e, !0, !1, r), this.yieldPos = i, this.awaitPos = a, this.awaitIdentPos = o, this.finishNode(e, "ArrowFunctionExpression");
}, V.parseFunctionBody = function(e, t, n, r) {
	var i = t && this.type !== j.braceL, a = this.strict, o = !1;
	if (i) e.body = this.parseMaybeAssign(r), e.expression = !0, this.checkParams(e, !1);
	else {
		var s = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(e.params);
		(!a || s) && (o = this.strictDirective(this.end), o && s && this.raiseRecoverable(e.start, "Illegal 'use strict' directive in function with non-simple parameter list"));
		var c = this.labels;
		this.labels = [], o && (this.strict = !0), this.checkParams(e, !a && !o && !t && !n && this.isSimpleParamList(e.params)), this.strict && e.id && this.checkLValSimple(e.id, Ft), e.body = this.parseBlock(!1, void 0, o && !a), e.expression = !1, this.adaptDirectivePrologue(e.body.body), this.labels = c;
	}
	this.exitScope();
}, V.isSimpleParamList = function(e) {
	for (var t = 0, n = e; t < n.length; t += 1) if (n[t].type !== "Identifier") return !1;
	return !0;
}, V.checkParams = function(e, t) {
	for (var n = Object.create(null), r = 0, i = e.params; r < i.length; r += 1) {
		var a = i[r];
		this.checkLValInnerPattern(a, jt, t ? null : n);
	}
}, V.parseExprList = function(e, t, n, r) {
	for (var i = [], a = !0; !this.eat(e);) {
		if (a) a = !1;
		else if (this.expect(j.comma), t && this.afterTrailingComma(e)) break;
		var o = void 0;
		n && this.type === j.comma ? o = null : this.type === j.ellipsis ? (o = this.parseSpread(r), r && this.type === j.comma && r.trailingComma < 0 && (r.trailingComma = this.start)) : o = this.parseMaybeAssign(!1, r), i.push(o);
	}
	return i;
}, V.checkUnreserved = function(e) {
	var t = e.start, n = e.end, r = e.name;
	this.inGenerator && r === "yield" && this.raiseRecoverable(t, "Cannot use 'yield' as identifier inside a generator"), this.inAsync && r === "await" && this.raiseRecoverable(t, "Cannot use 'await' as identifier inside an async function"), !(this.currentThisScope().flags & Ot) && r === "arguments" && this.raiseRecoverable(t, "Cannot use 'arguments' in class field initializer"), this.inClassStaticBlock && (r === "arguments" || r === "await") && this.raise(t, "Cannot use " + r + " in class static initialization block"), this.keywords.test(r) && this.raise(t, "Unexpected keyword '" + r + "'"), !(this.options.ecmaVersion < 6 && this.input.slice(t, n).indexOf("\\") !== -1) && (this.strict ? this.reservedWordsStrict : this.reservedWords).test(r) && (!this.inAsync && r === "await" && this.raiseRecoverable(t, "Cannot use keyword 'await' outside an async function"), this.raiseRecoverable(t, "The keyword '" + r + "' is reserved"));
}, V.parseIdent = function(e) {
	var t = this.parseIdentNode();
	return this.next(!!e), this.finishNode(t, "Identifier"), e || (this.checkUnreserved(t), t.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = t.start)), t;
}, V.parseIdentNode = function() {
	var e = this.startNode();
	return this.type === j.name ? e.name = this.value : this.type.keyword ? (e.name = this.type.keyword, (e.name === "class" || e.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46) && this.context.pop(), this.type = j.name) : this.unexpected(), e;
}, V.parsePrivateIdent = function() {
	var e = this.startNode();
	return this.type === j.privateId ? e.name = this.value : this.unexpected(), this.next(), this.finishNode(e, "PrivateIdentifier"), this.options.checkPrivateFields && (this.privateNameStack.length === 0 ? this.raise(e.start, "Private field '#" + e.name + "' must be declared in an enclosing class") : this.privateNameStack[this.privateNameStack.length - 1].used.push(e)), e;
}, V.parseYield = function(e) {
	this.yieldPos ||= this.start;
	var t = this.startNode();
	return this.next(), this.type === j.semi || this.canInsertSemicolon() || this.type !== j.star && !this.type.startsExpr ? (t.delegate = !1, t.argument = null) : (t.delegate = this.eat(j.star), t.argument = this.parseMaybeAssign(e)), this.finishNode(t, "YieldExpression");
}, V.parseAwait = function(e) {
	this.awaitPos ||= this.start;
	var t = this.startNode();
	return this.next(), t.argument = this.parseMaybeUnary(null, !0, !1, e), this.finishNode(t, "AwaitExpression");
};
var Xt = P.prototype;
Xt.raise = function(e, t) {
	var n = ft(this.input, e);
	t += " (" + n.line + ":" + n.column + ")", this.sourceFile && (t += " in " + this.sourceFile);
	var r = SyntaxError(t);
	throw r.pos = e, r.loc = n, r.raisedAt = this.pos, r;
}, Xt.raiseRecoverable = Xt.raise, Xt.curPosition = function() {
	if (this.options.locations) return new ut(this.curLine, this.pos - this.lineStart);
};
var Zt = P.prototype, Qt = function(e) {
	this.flags = e, this.var = [], this.lexical = [], this.functions = [];
};
Zt.enterScope = function(e) {
	this.scopeStack.push(new Qt(e));
}, Zt.exitScope = function() {
	this.scopeStack.pop();
}, Zt.treatFunctionsAsVarInScope = function(e) {
	return e.flags & vt || !this.inModule && e.flags & _t;
}, Zt.declareName = function(e, t, n) {
	var r = !1;
	if (t === Mt) {
		var i = this.currentScope();
		r = i.lexical.indexOf(e) > -1 || i.functions.indexOf(e) > -1 || i.var.indexOf(e) > -1, i.lexical.push(e), this.inModule && i.flags & _t && delete this.undefinedExports[e];
	} else if (t === Pt) this.currentScope().lexical.push(e);
	else if (t === Nt) {
		var a = this.currentScope();
		r = this.treatFunctionsAsVar ? a.lexical.indexOf(e) > -1 : a.lexical.indexOf(e) > -1 || a.var.indexOf(e) > -1, a.functions.push(e);
	} else for (var o = this.scopeStack.length - 1; o >= 0; --o) {
		var s = this.scopeStack[o];
		if (s.lexical.indexOf(e) > -1 && !(s.flags & St && s.lexical[0] === e) || !this.treatFunctionsAsVarInScope(s) && s.functions.indexOf(e) > -1) {
			r = !0;
			break;
		}
		if (s.var.push(e), this.inModule && s.flags & _t && delete this.undefinedExports[e], s.flags & Ot) break;
	}
	r && this.raiseRecoverable(n, "Identifier '" + e + "' has already been declared");
}, Zt.checkLocalExport = function(e) {
	this.scopeStack[0].lexical.indexOf(e.name) === -1 && this.scopeStack[0].var.indexOf(e.name) === -1 && (this.undefinedExports[e.name] = e);
}, Zt.currentScope = function() {
	return this.scopeStack[this.scopeStack.length - 1];
}, Zt.currentVarScope = function() {
	for (var e = this.scopeStack.length - 1;; e--) {
		var t = this.scopeStack[e];
		if (t.flags & (Ot | Et | Tt)) return t;
	}
}, Zt.currentThisScope = function() {
	for (var e = this.scopeStack.length - 1;; e--) {
		var t = this.scopeStack[e];
		if (t.flags & (Ot | Et | Tt) && !(t.flags & xt)) return t;
	}
};
var $t = function(e, t, n) {
	this.type = "", this.start = t, this.end = 0, e.options.locations && (this.loc = new dt(e, n)), e.options.directSourceFile && (this.sourceFile = e.options.directSourceFile), e.options.ranges && (this.range = [t, 0]);
}, en = P.prototype;
en.startNode = function() {
	return new $t(this, this.start, this.startLoc);
}, en.startNodeAt = function(e, t) {
	return new $t(this, e, t);
};
function tn(e, t, n, r) {
	return e.type = t, e.end = n, this.options.locations && (e.loc.end = r), this.options.ranges && (e.range[1] = n), e;
}
en.finishNode = function(e, t) {
	return tn.call(this, e, t, this.lastTokEnd, this.lastTokEndLoc);
}, en.finishNodeAt = function(e, t, n, r) {
	return tn.call(this, e, t, n, r);
}, en.copyNode = function(e) {
	var t = new $t(this, e.start, this.startLoc);
	for (var n in e) t[n] = e[n];
	return t;
};
var nn = "Berf Beria_Erfe Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sidetic Sidt Sunu Sunuwar Tai_Yo Tayo Todhri Todr Tolong_Siki Tols Tulu_Tigalari Tutg Unknown Zzzz", rn = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS", an = rn + " Extended_Pictographic", on = an, sn = on + " EBase EComp EMod EPres ExtPict", cn = sn, ln = {
	9: rn,
	10: an,
	11: on,
	12: sn,
	13: cn,
	14: cn
}, un = {
	9: "",
	10: "",
	11: "",
	12: "",
	13: "",
	14: "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji"
}, dn = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu", fn = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb", pn = fn + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd", mn = pn + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho", hn = mn + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi", gn = hn + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith", _n = {
	9: fn,
	10: pn,
	11: mn,
	12: hn,
	13: gn,
	14: gn + " " + nn
}, vn = {};
function yn(e) {
	var t = vn[e] = {
		binary: st(ln[e] + " " + dn),
		binaryOfStrings: st(un[e]),
		nonBinary: {
			General_Category: st(dn),
			Script: st(_n[e])
		}
	};
	t.nonBinary.Script_Extensions = t.nonBinary.Script, t.nonBinary.gc = t.nonBinary.General_Category, t.nonBinary.sc = t.nonBinary.Script, t.nonBinary.scx = t.nonBinary.Script_Extensions;
}
for (var bn = 0, xn = [
	9,
	10,
	11,
	12,
	13,
	14
]; bn < xn.length; bn += 1) {
	var Sn = xn[bn];
	yn(Sn);
}
var H = P.prototype, Cn = function(e, t) {
	this.parent = e, this.base = t || this;
};
Cn.prototype.separatedFrom = function(e) {
	for (var t = this; t; t = t.parent) for (var n = e; n; n = n.parent) if (t.base === n.base && t !== n) return !0;
	return !1;
}, Cn.prototype.sibling = function() {
	return new Cn(this.parent, this.base);
};
var U = function(e) {
	this.parser = e, this.validFlags = "gim" + (e.options.ecmaVersion >= 6 ? "uy" : "") + (e.options.ecmaVersion >= 9 ? "s" : "") + (e.options.ecmaVersion >= 13 ? "d" : "") + (e.options.ecmaVersion >= 15 ? "v" : ""), this.unicodeProperties = vn[e.options.ecmaVersion >= 14 ? 14 : e.options.ecmaVersion], this.source = "", this.flags = "", this.start = 0, this.switchU = !1, this.switchV = !1, this.switchN = !1, this.pos = 0, this.lastIntValue = 0, this.lastStringValue = "", this.lastAssertionIsQuantifiable = !1, this.numCapturingParens = 0, this.maxBackReference = 0, this.groupNames = Object.create(null), this.backReferenceNames = [], this.branchID = null;
};
U.prototype.reset = function(e, t, n) {
	var r = n.indexOf("v") !== -1, i = n.indexOf("u") !== -1;
	this.start = e | 0, this.source = t + "", this.flags = n, r && this.parser.options.ecmaVersion >= 15 ? (this.switchU = !0, this.switchV = !0, this.switchN = !0) : (this.switchU = i && this.parser.options.ecmaVersion >= 6, this.switchV = !1, this.switchN = i && this.parser.options.ecmaVersion >= 9);
}, U.prototype.raise = function(e) {
	this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + e);
}, U.prototype.at = function(e, t) {
	t === void 0 && (t = !1);
	var n = this.source, r = n.length;
	if (e >= r) return -1;
	var i = n.charCodeAt(e);
	if (!(t || this.switchU) || i <= 55295 || i >= 57344 || e + 1 >= r) return i;
	var a = n.charCodeAt(e + 1);
	return a >= 56320 && a <= 57343 ? (i << 10) + a - 56613888 : i;
}, U.prototype.nextIndex = function(e, t) {
	t === void 0 && (t = !1);
	var n = this.source, r = n.length;
	if (e >= r) return r;
	var i = n.charCodeAt(e), a;
	return !(t || this.switchU) || i <= 55295 || i >= 57344 || e + 1 >= r || (a = n.charCodeAt(e + 1)) < 56320 || a > 57343 ? e + 1 : e + 2;
}, U.prototype.current = function(e) {
	return e === void 0 && (e = !1), this.at(this.pos, e);
}, U.prototype.lookahead = function(e) {
	return e === void 0 && (e = !1), this.at(this.nextIndex(this.pos, e), e);
}, U.prototype.advance = function(e) {
	e === void 0 && (e = !1), this.pos = this.nextIndex(this.pos, e);
}, U.prototype.eat = function(e, t) {
	return t === void 0 && (t = !1), this.current(t) === e ? (this.advance(t), !0) : !1;
}, U.prototype.eatChars = function(e, t) {
	t === void 0 && (t = !1);
	for (var n = this.pos, r = 0, i = e; r < i.length; r += 1) {
		var a = i[r], o = this.at(n, t);
		if (o === -1 || o !== a) return !1;
		n = this.nextIndex(n, t);
	}
	return this.pos = n, !0;
}, H.validateRegExpFlags = function(e) {
	for (var t = e.validFlags, n = e.flags, r = !1, i = !1, a = 0; a < n.length; a++) {
		var o = n.charAt(a);
		t.indexOf(o) === -1 && this.raise(e.start, "Invalid regular expression flag"), n.indexOf(o, a + 1) > -1 && this.raise(e.start, "Duplicate regular expression flag"), o === "u" && (r = !0), o === "v" && (i = !0);
	}
	this.options.ecmaVersion >= 15 && r && i && this.raise(e.start, "Invalid regular expression flag");
};
function wn(e) {
	for (var t in e) return !0;
	return !1;
}
H.validateRegExpPattern = function(e) {
	this.regexp_pattern(e), !e.switchN && this.options.ecmaVersion >= 9 && wn(e.groupNames) && (e.switchN = !0, this.regexp_pattern(e));
}, H.regexp_pattern = function(e) {
	e.pos = 0, e.lastIntValue = 0, e.lastStringValue = "", e.lastAssertionIsQuantifiable = !1, e.numCapturingParens = 0, e.maxBackReference = 0, e.groupNames = Object.create(null), e.backReferenceNames.length = 0, e.branchID = null, this.regexp_disjunction(e), e.pos !== e.source.length && (e.eat(41) && e.raise("Unmatched ')'"), (e.eat(93) || e.eat(125)) && e.raise("Lone quantifier brackets")), e.maxBackReference > e.numCapturingParens && e.raise("Invalid escape");
	for (var t = 0, n = e.backReferenceNames; t < n.length; t += 1) {
		var r = n[t];
		e.groupNames[r] || e.raise("Invalid named capture referenced");
	}
}, H.regexp_disjunction = function(e) {
	var t = this.options.ecmaVersion >= 16;
	for (t && (e.branchID = new Cn(e.branchID, null)), this.regexp_alternative(e); e.eat(124);) t && (e.branchID = e.branchID.sibling()), this.regexp_alternative(e);
	t && (e.branchID = e.branchID.parent), this.regexp_eatQuantifier(e, !0) && e.raise("Nothing to repeat"), e.eat(123) && e.raise("Lone quantifier brackets");
}, H.regexp_alternative = function(e) {
	for (; e.pos < e.source.length && this.regexp_eatTerm(e););
}, H.regexp_eatTerm = function(e) {
	return this.regexp_eatAssertion(e) ? (e.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(e) && e.switchU && e.raise("Invalid quantifier"), !0) : (e.switchU ? this.regexp_eatAtom(e) : this.regexp_eatExtendedAtom(e)) ? (this.regexp_eatQuantifier(e), !0) : !1;
}, H.regexp_eatAssertion = function(e) {
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
}, H.regexp_eatQuantifier = function(e, t) {
	return t === void 0 && (t = !1), this.regexp_eatQuantifierPrefix(e, t) ? (e.eat(63), !0) : !1;
}, H.regexp_eatQuantifierPrefix = function(e, t) {
	return e.eat(42) || e.eat(43) || e.eat(63) || this.regexp_eatBracedQuantifier(e, t);
}, H.regexp_eatBracedQuantifier = function(e, t) {
	var n = e.pos;
	if (e.eat(123)) {
		var r = 0, i = -1;
		if (this.regexp_eatDecimalDigits(e) && (r = e.lastIntValue, e.eat(44) && this.regexp_eatDecimalDigits(e) && (i = e.lastIntValue), e.eat(125))) return i !== -1 && i < r && !t && e.raise("numbers out of order in {} quantifier"), !0;
		e.switchU && !t && e.raise("Incomplete quantifier"), e.pos = n;
	}
	return !1;
}, H.regexp_eatAtom = function(e) {
	return this.regexp_eatPatternCharacters(e) || e.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e);
}, H.regexp_eatReverseSolidusAtomEscape = function(e) {
	var t = e.pos;
	if (e.eat(92)) {
		if (this.regexp_eatAtomEscape(e)) return !0;
		e.pos = t;
	}
	return !1;
}, H.regexp_eatUncapturingGroup = function(e) {
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
}, H.regexp_eatCapturingGroup = function(e) {
	if (e.eat(40)) {
		if (this.options.ecmaVersion >= 9 ? this.regexp_groupSpecifier(e) : e.current() === 63 && e.raise("Invalid group"), this.regexp_disjunction(e), e.eat(41)) return e.numCapturingParens += 1, !0;
		e.raise("Unterminated group");
	}
	return !1;
}, H.regexp_eatModifiers = function(e) {
	for (var t = "", n = 0; (n = e.current()) !== -1 && Tn(n);) t += ct(n), e.advance();
	return t;
};
function Tn(e) {
	return e === 105 || e === 109 || e === 115;
}
H.regexp_eatExtendedAtom = function(e) {
	return e.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e) || this.regexp_eatInvalidBracedQuantifier(e) || this.regexp_eatExtendedPatternCharacter(e);
}, H.regexp_eatInvalidBracedQuantifier = function(e) {
	return this.regexp_eatBracedQuantifier(e, !0) && e.raise("Nothing to repeat"), !1;
}, H.regexp_eatSyntaxCharacter = function(e) {
	var t = e.current();
	return En(t) ? (e.lastIntValue = t, e.advance(), !0) : !1;
};
function En(e) {
	return e === 36 || e >= 40 && e <= 43 || e === 46 || e === 63 || e >= 91 && e <= 94 || e >= 123 && e <= 125;
}
H.regexp_eatPatternCharacters = function(e) {
	for (var t = e.pos, n = 0; (n = e.current()) !== -1 && !En(n);) e.advance();
	return e.pos !== t;
}, H.regexp_eatExtendedPatternCharacter = function(e) {
	var t = e.current();
	return t !== -1 && t !== 36 && !(t >= 40 && t <= 43) && t !== 46 && t !== 63 && t !== 91 && t !== 94 && t !== 124 ? (e.advance(), !0) : !1;
}, H.regexp_groupSpecifier = function(e) {
	if (e.eat(63)) {
		this.regexp_eatGroupName(e) || e.raise("Invalid group");
		var t = this.options.ecmaVersion >= 16, n = e.groupNames[e.lastStringValue];
		if (n) if (t) for (var r = 0, i = n; r < i.length; r += 1) i[r].separatedFrom(e.branchID) || e.raise("Duplicate capture group name");
		else e.raise("Duplicate capture group name");
		t ? (n || (e.groupNames[e.lastStringValue] = [])).push(e.branchID) : e.groupNames[e.lastStringValue] = !0;
	}
}, H.regexp_eatGroupName = function(e) {
	if (e.lastStringValue = "", e.eat(60)) {
		if (this.regexp_eatRegExpIdentifierName(e) && e.eat(62)) return !0;
		e.raise("Invalid capture group name");
	}
	return !1;
}, H.regexp_eatRegExpIdentifierName = function(e) {
	if (e.lastStringValue = "", this.regexp_eatRegExpIdentifierStart(e)) {
		for (e.lastStringValue += ct(e.lastIntValue); this.regexp_eatRegExpIdentifierPart(e);) e.lastStringValue += ct(e.lastIntValue);
		return !0;
	}
	return !1;
}, H.regexp_eatRegExpIdentifierStart = function(e) {
	var t = e.pos, n = this.options.ecmaVersion >= 11, r = e.current(n);
	return e.advance(n), r === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e, n) && (r = e.lastIntValue), Dn(r) ? (e.lastIntValue = r, !0) : (e.pos = t, !1);
};
function Dn(e) {
	return T(e, !0) || e === 36 || e === 95;
}
H.regexp_eatRegExpIdentifierPart = function(e) {
	var t = e.pos, n = this.options.ecmaVersion >= 11, r = e.current(n);
	return e.advance(n), r === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e, n) && (r = e.lastIntValue), On(r) ? (e.lastIntValue = r, !0) : (e.pos = t, !1);
};
function On(e) {
	return Ye(e, !0) || e === 36 || e === 95 || e === 8204 || e === 8205;
}
H.regexp_eatAtomEscape = function(e) {
	return this.regexp_eatBackReference(e) || this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e) || e.switchN && this.regexp_eatKGroupName(e) ? !0 : (e.switchU && (e.current() === 99 && e.raise("Invalid unicode escape"), e.raise("Invalid escape")), !1);
}, H.regexp_eatBackReference = function(e) {
	var t = e.pos;
	if (this.regexp_eatDecimalEscape(e)) {
		var n = e.lastIntValue;
		if (e.switchU) return n > e.maxBackReference && (e.maxBackReference = n), !0;
		if (n <= e.numCapturingParens) return !0;
		e.pos = t;
	}
	return !1;
}, H.regexp_eatKGroupName = function(e) {
	if (e.eat(107)) {
		if (this.regexp_eatGroupName(e)) return e.backReferenceNames.push(e.lastStringValue), !0;
		e.raise("Invalid named reference");
	}
	return !1;
}, H.regexp_eatCharacterEscape = function(e) {
	return this.regexp_eatControlEscape(e) || this.regexp_eatCControlLetter(e) || this.regexp_eatZero(e) || this.regexp_eatHexEscapeSequence(e) || this.regexp_eatRegExpUnicodeEscapeSequence(e, !1) || !e.switchU && this.regexp_eatLegacyOctalEscapeSequence(e) || this.regexp_eatIdentityEscape(e);
}, H.regexp_eatCControlLetter = function(e) {
	var t = e.pos;
	if (e.eat(99)) {
		if (this.regexp_eatControlLetter(e)) return !0;
		e.pos = t;
	}
	return !1;
}, H.regexp_eatZero = function(e) {
	return e.current() === 48 && !zn(e.lookahead()) ? (e.lastIntValue = 0, e.advance(), !0) : !1;
}, H.regexp_eatControlEscape = function(e) {
	var t = e.current();
	return t === 116 ? (e.lastIntValue = 9, e.advance(), !0) : t === 110 ? (e.lastIntValue = 10, e.advance(), !0) : t === 118 ? (e.lastIntValue = 11, e.advance(), !0) : t === 102 ? (e.lastIntValue = 12, e.advance(), !0) : t === 114 ? (e.lastIntValue = 13, e.advance(), !0) : !1;
}, H.regexp_eatControlLetter = function(e) {
	var t = e.current();
	return kn(t) ? (e.lastIntValue = t % 32, e.advance(), !0) : !1;
};
function kn(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122;
}
H.regexp_eatRegExpUnicodeEscapeSequence = function(e, t) {
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
		if (r && e.eat(123) && this.regexp_eatHexDigits(e) && e.eat(125) && An(e.lastIntValue)) return !0;
		r && e.raise("Invalid unicode escape"), e.pos = n;
	}
	return !1;
};
function An(e) {
	return e >= 0 && e <= 1114111;
}
H.regexp_eatIdentityEscape = function(e) {
	if (e.switchU) return this.regexp_eatSyntaxCharacter(e) ? !0 : e.eat(47) ? (e.lastIntValue = 47, !0) : !1;
	var t = e.current();
	return t !== 99 && (!e.switchN || t !== 107) ? (e.lastIntValue = t, e.advance(), !0) : !1;
}, H.regexp_eatDecimalEscape = function(e) {
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
var jn = 0, Mn = 1, W = 2;
H.regexp_eatCharacterClassEscape = function(e) {
	var t = e.current();
	if (Nn(t)) return e.lastIntValue = -1, e.advance(), Mn;
	var n = !1;
	if (e.switchU && this.options.ecmaVersion >= 9 && ((n = t === 80) || t === 112)) {
		e.lastIntValue = -1, e.advance();
		var r;
		if (e.eat(123) && (r = this.regexp_eatUnicodePropertyValueExpression(e)) && e.eat(125)) return n && r === W && e.raise("Invalid property name"), r;
		e.raise("Invalid property name");
	}
	return jn;
};
function Nn(e) {
	return e === 100 || e === 68 || e === 115 || e === 83 || e === 119 || e === 87;
}
H.regexp_eatUnicodePropertyValueExpression = function(e) {
	var t = e.pos;
	if (this.regexp_eatUnicodePropertyName(e) && e.eat(61)) {
		var n = e.lastStringValue;
		if (this.regexp_eatUnicodePropertyValue(e)) {
			var r = e.lastStringValue;
			return this.regexp_validateUnicodePropertyNameAndValue(e, n, r), Mn;
		}
	}
	if (e.pos = t, this.regexp_eatLoneUnicodePropertyNameOrValue(e)) {
		var i = e.lastStringValue;
		return this.regexp_validateUnicodePropertyNameOrValue(e, i);
	}
	return jn;
}, H.regexp_validateUnicodePropertyNameAndValue = function(e, t, n) {
	it(e.unicodeProperties.nonBinary, t) || e.raise("Invalid property name"), e.unicodeProperties.nonBinary[t].test(n) || e.raise("Invalid property value");
}, H.regexp_validateUnicodePropertyNameOrValue = function(e, t) {
	if (e.unicodeProperties.binary.test(t)) return Mn;
	if (e.switchV && e.unicodeProperties.binaryOfStrings.test(t)) return W;
	e.raise("Invalid property name");
}, H.regexp_eatUnicodePropertyName = function(e) {
	var t = 0;
	for (e.lastStringValue = ""; Pn(t = e.current());) e.lastStringValue += ct(t), e.advance();
	return e.lastStringValue !== "";
};
function Pn(e) {
	return kn(e) || e === 95;
}
H.regexp_eatUnicodePropertyValue = function(e) {
	var t = 0;
	for (e.lastStringValue = ""; Fn(t = e.current());) e.lastStringValue += ct(t), e.advance();
	return e.lastStringValue !== "";
};
function Fn(e) {
	return Pn(e) || zn(e);
}
H.regexp_eatLoneUnicodePropertyNameOrValue = function(e) {
	return this.regexp_eatUnicodePropertyValue(e);
}, H.regexp_eatCharacterClass = function(e) {
	if (e.eat(91)) {
		var t = e.eat(94), n = this.regexp_classContents(e);
		return e.eat(93) || e.raise("Unterminated character class"), t && n === W && e.raise("Negated character class may contain strings"), !0;
	}
	return !1;
}, H.regexp_classContents = function(e) {
	return e.current() === 93 ? Mn : e.switchV ? this.regexp_classSetExpression(e) : (this.regexp_nonEmptyClassRanges(e), Mn);
}, H.regexp_nonEmptyClassRanges = function(e) {
	for (; this.regexp_eatClassAtom(e);) {
		var t = e.lastIntValue;
		if (e.eat(45) && this.regexp_eatClassAtom(e)) {
			var n = e.lastIntValue;
			e.switchU && (t === -1 || n === -1) && e.raise("Invalid character class"), t !== -1 && n !== -1 && t > n && e.raise("Range out of order in character class");
		}
	}
}, H.regexp_eatClassAtom = function(e) {
	var t = e.pos;
	if (e.eat(92)) {
		if (this.regexp_eatClassEscape(e)) return !0;
		if (e.switchU) {
			var n = e.current();
			(n === 99 || Hn(n)) && e.raise("Invalid class escape"), e.raise("Invalid escape");
		}
		e.pos = t;
	}
	var r = e.current();
	return r === 93 ? !1 : (e.lastIntValue = r, e.advance(), !0);
}, H.regexp_eatClassEscape = function(e) {
	var t = e.pos;
	if (e.eat(98)) return e.lastIntValue = 8, !0;
	if (e.switchU && e.eat(45)) return e.lastIntValue = 45, !0;
	if (!e.switchU && e.eat(99)) {
		if (this.regexp_eatClassControlLetter(e)) return !0;
		e.pos = t;
	}
	return this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e);
}, H.regexp_classSetExpression = function(e) {
	var t = Mn, n;
	if (!this.regexp_eatClassSetRange(e)) if (n = this.regexp_eatClassSetOperand(e)) {
		n === W && (t = W);
		for (var r = e.pos; e.eatChars([38, 38]);) {
			if (e.current() !== 38 && (n = this.regexp_eatClassSetOperand(e))) {
				n !== W && (t = Mn);
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
		n === W && (t = W);
	}
}, H.regexp_eatClassSetRange = function(e) {
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
}, H.regexp_eatClassSetOperand = function(e) {
	return this.regexp_eatClassSetCharacter(e) ? Mn : this.regexp_eatClassStringDisjunction(e) || this.regexp_eatNestedClass(e);
}, H.regexp_eatNestedClass = function(e) {
	var t = e.pos;
	if (e.eat(91)) {
		var n = e.eat(94), r = this.regexp_classContents(e);
		if (e.eat(93)) return n && r === W && e.raise("Negated character class may contain strings"), r;
		e.pos = t;
	}
	if (e.eat(92)) {
		var i = this.regexp_eatCharacterClassEscape(e);
		if (i) return i;
		e.pos = t;
	}
	return null;
}, H.regexp_eatClassStringDisjunction = function(e) {
	var t = e.pos;
	if (e.eatChars([92, 113])) {
		if (e.eat(123)) {
			var n = this.regexp_classStringDisjunctionContents(e);
			if (e.eat(125)) return n;
		} else e.raise("Invalid escape");
		e.pos = t;
	}
	return null;
}, H.regexp_classStringDisjunctionContents = function(e) {
	for (var t = this.regexp_classString(e); e.eat(124);) this.regexp_classString(e) === W && (t = W);
	return t;
}, H.regexp_classString = function(e) {
	for (var t = 0; this.regexp_eatClassSetCharacter(e);) t++;
	return t === 1 ? Mn : W;
}, H.regexp_eatClassSetCharacter = function(e) {
	var t = e.pos;
	if (e.eat(92)) return this.regexp_eatCharacterEscape(e) || this.regexp_eatClassSetReservedPunctuator(e) ? !0 : e.eat(98) ? (e.lastIntValue = 8, !0) : (e.pos = t, !1);
	var n = e.current();
	return n < 0 || n === e.lookahead() && In(n) || Ln(n) ? !1 : (e.advance(), e.lastIntValue = n, !0);
};
function In(e) {
	return e === 33 || e >= 35 && e <= 38 || e >= 42 && e <= 44 || e === 46 || e >= 58 && e <= 64 || e === 94 || e === 96 || e === 126;
}
function Ln(e) {
	return e === 40 || e === 41 || e === 45 || e === 47 || e >= 91 && e <= 93 || e >= 123 && e <= 125;
}
H.regexp_eatClassSetReservedPunctuator = function(e) {
	var t = e.current();
	return Rn(t) ? (e.lastIntValue = t, e.advance(), !0) : !1;
};
function Rn(e) {
	return e === 33 || e === 35 || e === 37 || e === 38 || e === 44 || e === 45 || e >= 58 && e <= 62 || e === 64 || e === 96 || e === 126;
}
H.regexp_eatClassControlLetter = function(e) {
	var t = e.current();
	return zn(t) || t === 95 ? (e.lastIntValue = t % 32, e.advance(), !0) : !1;
}, H.regexp_eatHexEscapeSequence = function(e) {
	var t = e.pos;
	if (e.eat(120)) {
		if (this.regexp_eatFixedHexDigits(e, 2)) return !0;
		e.switchU && e.raise("Invalid escape"), e.pos = t;
	}
	return !1;
}, H.regexp_eatDecimalDigits = function(e) {
	var t = e.pos, n = 0;
	for (e.lastIntValue = 0; zn(n = e.current());) e.lastIntValue = 10 * e.lastIntValue + (n - 48), e.advance();
	return e.pos !== t;
};
function zn(e) {
	return e >= 48 && e <= 57;
}
H.regexp_eatHexDigits = function(e) {
	var t = e.pos, n = 0;
	for (e.lastIntValue = 0; Bn(n = e.current());) e.lastIntValue = 16 * e.lastIntValue + Vn(n), e.advance();
	return e.pos !== t;
};
function Bn(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
}
function Vn(e) {
	return e >= 65 && e <= 70 ? 10 + (e - 65) : e >= 97 && e <= 102 ? 10 + (e - 97) : e - 48;
}
H.regexp_eatLegacyOctalEscapeSequence = function(e) {
	if (this.regexp_eatOctalDigit(e)) {
		var t = e.lastIntValue;
		if (this.regexp_eatOctalDigit(e)) {
			var n = e.lastIntValue;
			t <= 3 && this.regexp_eatOctalDigit(e) ? e.lastIntValue = t * 64 + n * 8 + e.lastIntValue : e.lastIntValue = t * 8 + n;
		} else e.lastIntValue = t;
		return !0;
	}
	return !1;
}, H.regexp_eatOctalDigit = function(e) {
	var t = e.current();
	return Hn(t) ? (e.lastIntValue = t - 48, e.advance(), !0) : (e.lastIntValue = 0, !1);
};
function Hn(e) {
	return e >= 48 && e <= 55;
}
H.regexp_eatFixedHexDigits = function(e, t) {
	var n = e.pos;
	e.lastIntValue = 0;
	for (var r = 0; r < t; ++r) {
		var i = e.current();
		if (!Bn(i)) return e.pos = n, !1;
		e.lastIntValue = 16 * e.lastIntValue + Vn(i), e.advance();
	}
	return !0;
};
var Un = function(e) {
	this.type = e.type, this.value = e.value, this.start = e.start, this.end = e.end, e.options.locations && (this.loc = new dt(e, e.startLoc, e.endLoc)), e.options.ranges && (this.range = [e.start, e.end]);
}, G = P.prototype;
G.next = function(e) {
	!e && this.type.keyword && this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword), this.options.onToken && this.options.onToken(new Un(this)), this.lastTokEnd = this.end, this.lastTokStart = this.start, this.lastTokEndLoc = this.endLoc, this.lastTokStartLoc = this.startLoc, this.nextToken();
}, G.getToken = function() {
	return this.next(), new Un(this);
}, typeof Symbol < "u" && (G[Symbol.iterator] = function() {
	var e = this;
	return { next: function() {
		var t = e.getToken();
		return {
			done: t.type === j.eof,
			value: t
		};
	} };
}), G.nextToken = function() {
	var e = this.curContext();
	if ((!e || !e.preserveSpace) && this.skipSpace(), this.start = this.pos, this.options.locations && (this.startLoc = this.curPosition()), this.pos >= this.input.length) return this.finishToken(j.eof);
	if (e.override) return e.override(this);
	this.readToken(this.fullCharCodeAtPos());
}, G.readToken = function(e) {
	return T(e, this.options.ecmaVersion >= 6) || e === 92 ? this.readWord() : this.getTokenFromCode(e);
}, G.fullCharCodeAt = function(e) {
	var t = this.input.charCodeAt(e);
	if (t <= 55295 || t >= 56320) return t;
	var n = this.input.charCodeAt(e + 1);
	return n <= 56319 || n >= 57344 ? t : (t << 10) + n - 56613888;
}, G.fullCharCodeAtPos = function() {
	return this.fullCharCodeAt(this.pos);
}, G.skipBlockComment = function() {
	var e = this.options.onComment && this.curPosition(), t = this.pos, n = this.input.indexOf("*/", this.pos += 2);
	if (n === -1 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = n + 2, this.options.locations) for (var r = void 0, i = t; (r = $e(this.input, i, this.pos)) > -1;) ++this.curLine, i = this.lineStart = r;
	this.options.onComment && this.options.onComment(!0, this.input.slice(t + 2, n), t, this.pos, e, this.curPosition());
}, G.skipLineComment = function(e) {
	for (var t = this.pos, n = this.options.onComment && this.curPosition(), r = this.input.charCodeAt(this.pos += e); this.pos < this.input.length && !Qe(r);) r = this.input.charCodeAt(++this.pos);
	this.options.onComment && this.options.onComment(!1, this.input.slice(t + e, this.pos), t, this.pos, n, this.curPosition());
}, G.skipSpace = function() {
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
			default: if (e > 8 && e < 14 || e >= 5760 && et.test(String.fromCharCode(e))) ++this.pos;
			else break loop;
		}
	}
}, G.finishToken = function(e, t) {
	this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
	var n = this.type;
	this.type = e, this.value = t, this.updateContext(n);
}, G.readToken_dot = function() {
	var e = this.input.charCodeAt(this.pos + 1);
	if (e >= 48 && e <= 57) return this.readNumber(!0);
	var t = this.input.charCodeAt(this.pos + 2);
	return this.options.ecmaVersion >= 6 && e === 46 && t === 46 ? (this.pos += 3, this.finishToken(j.ellipsis)) : (++this.pos, this.finishToken(j.dot));
}, G.readToken_slash = function() {
	var e = this.input.charCodeAt(this.pos + 1);
	return this.exprAllowed ? (++this.pos, this.readRegexp()) : e === 61 ? this.finishOp(j.assign, 2) : this.finishOp(j.slash, 1);
}, G.readToken_mult_modulo_exp = function(e) {
	var t = this.input.charCodeAt(this.pos + 1), n = 1, r = e === 42 ? j.star : j.modulo;
	return this.options.ecmaVersion >= 7 && e === 42 && t === 42 && (++n, r = j.starstar, t = this.input.charCodeAt(this.pos + 2)), t === 61 ? this.finishOp(j.assign, n + 1) : this.finishOp(r, n);
}, G.readToken_pipe_amp = function(e) {
	var t = this.input.charCodeAt(this.pos + 1);
	return t === e ? this.options.ecmaVersion >= 12 && this.input.charCodeAt(this.pos + 2) === 61 ? this.finishOp(j.assign, 3) : this.finishOp(e === 124 ? j.logicalOR : j.logicalAND, 2) : t === 61 ? this.finishOp(j.assign, 2) : this.finishOp(e === 124 ? j.bitwiseOR : j.bitwiseAND, 1);
}, G.readToken_caret = function() {
	return this.input.charCodeAt(this.pos + 1) === 61 ? this.finishOp(j.assign, 2) : this.finishOp(j.bitwiseXOR, 1);
}, G.readToken_plus_min = function(e) {
	var t = this.input.charCodeAt(this.pos + 1);
	return t === e ? t === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || M.test(this.input.slice(this.lastTokEnd, this.pos))) ? (this.skipLineComment(3), this.skipSpace(), this.nextToken()) : this.finishOp(j.incDec, 2) : t === 61 ? this.finishOp(j.assign, 2) : this.finishOp(j.plusMin, 1);
}, G.readToken_lt_gt = function(e) {
	var t = this.input.charCodeAt(this.pos + 1), n = 1;
	return t === e ? (n = e === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2, this.input.charCodeAt(this.pos + n) === 61 ? this.finishOp(j.assign, n + 1) : this.finishOp(j.bitShift, n)) : t === 33 && e === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45 ? (this.skipLineComment(4), this.skipSpace(), this.nextToken()) : (t === 61 && (n = 2), this.finishOp(j.relational, n));
}, G.readToken_eq_excl = function(e) {
	var t = this.input.charCodeAt(this.pos + 1);
	return t === 61 ? this.finishOp(j.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) : e === 61 && t === 62 && this.options.ecmaVersion >= 6 ? (this.pos += 2, this.finishToken(j.arrow)) : this.finishOp(e === 61 ? j.eq : j.prefix, 1);
}, G.readToken_question = function() {
	var e = this.options.ecmaVersion;
	if (e >= 11) {
		var t = this.input.charCodeAt(this.pos + 1);
		if (t === 46) {
			var n = this.input.charCodeAt(this.pos + 2);
			if (n < 48 || n > 57) return this.finishOp(j.questionDot, 2);
		}
		if (t === 63) return e >= 12 && this.input.charCodeAt(this.pos + 2) === 61 ? this.finishOp(j.assign, 3) : this.finishOp(j.coalesce, 2);
	}
	return this.finishOp(j.question, 1);
}, G.readToken_numberSign = function() {
	var e = this.options.ecmaVersion, t = 35;
	if (e >= 13 && (++this.pos, t = this.fullCharCodeAtPos(), T(t, !0) || t === 92)) return this.finishToken(j.privateId, this.readWord1());
	this.raise(this.pos, "Unexpected character '" + ct(t) + "'");
}, G.getTokenFromCode = function(e) {
	switch (e) {
		case 46: return this.readToken_dot();
		case 40: return ++this.pos, this.finishToken(j.parenL);
		case 41: return ++this.pos, this.finishToken(j.parenR);
		case 59: return ++this.pos, this.finishToken(j.semi);
		case 44: return ++this.pos, this.finishToken(j.comma);
		case 91: return ++this.pos, this.finishToken(j.bracketL);
		case 93: return ++this.pos, this.finishToken(j.bracketR);
		case 123: return ++this.pos, this.finishToken(j.braceL);
		case 125: return ++this.pos, this.finishToken(j.braceR);
		case 58: return ++this.pos, this.finishToken(j.colon);
		case 96:
			if (this.options.ecmaVersion < 6) break;
			return ++this.pos, this.finishToken(j.backQuote);
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
		case 126: return this.finishOp(j.prefix, 1);
		case 35: return this.readToken_numberSign();
	}
	this.raise(this.pos, "Unexpected character '" + ct(e) + "'");
}, G.finishOp = function(e, t) {
	var n = this.input.slice(this.pos, this.pos + t);
	return this.pos += t, this.finishToken(e, n);
}, G.readRegexp = function() {
	for (var e, t, n = this.pos;;) {
		this.pos >= this.input.length && this.raise(n, "Unterminated regular expression");
		var r = this.input.charAt(this.pos);
		if (M.test(r) && this.raise(n, "Unterminated regular expression"), e) e = !1;
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
	var s = this.regexpState ||= new U(this);
	s.reset(n, i, o), this.validateRegExpFlags(s), this.validateRegExpPattern(s);
	var c = null;
	try {
		c = new RegExp(i, o);
	} catch {}
	return this.finishToken(j.regexp, {
		pattern: i,
		flags: o,
		value: c
	});
}, G.readInt = function(e, t, n) {
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
function Wn(e, t) {
	return t ? parseInt(e, 8) : parseFloat(e.replace(/_/g, ""));
}
function Gn(e) {
	return typeof BigInt == "function" ? BigInt(e.replace(/_/g, "")) : null;
}
G.readRadixNumber = function(e) {
	var t = this.pos;
	this.pos += 2;
	var n = this.readInt(e);
	return n ?? this.raise(this.start + 2, "Expected number in radix " + e), this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110 ? (n = Gn(this.input.slice(t, this.pos)), ++this.pos) : T(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(j.num, n);
}, G.readNumber = function(e) {
	var t = this.pos;
	!e && this.readInt(10, void 0, !0) === null && this.raise(t, "Invalid number");
	var n = this.pos - t >= 2 && this.input.charCodeAt(t) === 48;
	n && this.strict && this.raise(t, "Invalid number");
	var r = this.input.charCodeAt(this.pos);
	if (!n && !e && this.options.ecmaVersion >= 11 && r === 110) {
		var i = Gn(this.input.slice(t, this.pos));
		return ++this.pos, T(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(j.num, i);
	}
	n && /[89]/.test(this.input.slice(t, this.pos)) && (n = !1), r === 46 && !n && (++this.pos, this.readInt(10), r = this.input.charCodeAt(this.pos)), (r === 69 || r === 101) && !n && (r = this.input.charCodeAt(++this.pos), (r === 43 || r === 45) && ++this.pos, this.readInt(10) === null && this.raise(t, "Invalid number")), T(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
	var a = Wn(this.input.slice(t, this.pos), n);
	return this.finishToken(j.num, a);
}, G.readCodePoint = function() {
	var e = this.input.charCodeAt(this.pos), t;
	if (e === 123) {
		this.options.ecmaVersion < 6 && this.unexpected();
		var n = ++this.pos;
		t = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos), ++this.pos, t > 1114111 && this.invalidStringToken(n, "Code point out of bounds");
	} else t = this.readHexChar(4);
	return t;
}, G.readString = function(e) {
	for (var t = "", n = ++this.pos;;) {
		this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
		var r = this.input.charCodeAt(this.pos);
		if (r === e) break;
		r === 92 ? (t += this.input.slice(n, this.pos), t += this.readEscapedChar(!1), n = this.pos) : r === 8232 || r === 8233 ? (this.options.ecmaVersion < 10 && this.raise(this.start, "Unterminated string constant"), ++this.pos, this.options.locations && (this.curLine++, this.lineStart = this.pos)) : (Qe(r) && this.raise(this.start, "Unterminated string constant"), ++this.pos);
	}
	return t += this.input.slice(n, this.pos++), this.finishToken(j.string, t);
};
var Kn = {};
G.tryReadTemplateToken = function() {
	this.inTemplateElement = !0;
	try {
		this.readTmplToken();
	} catch (e) {
		if (e === Kn) this.readInvalidTemplateToken();
		else throw e;
	}
	this.inTemplateElement = !1;
}, G.invalidStringToken = function(e, t) {
	if (this.inTemplateElement && this.options.ecmaVersion >= 9) throw Kn;
	this.raise(e, t);
}, G.readTmplToken = function() {
	for (var e = "", t = this.pos;;) {
		this.pos >= this.input.length && this.raise(this.start, "Unterminated template");
		var n = this.input.charCodeAt(this.pos);
		if (n === 96 || n === 36 && this.input.charCodeAt(this.pos + 1) === 123) return this.pos === this.start && (this.type === j.template || this.type === j.invalidTemplate) ? n === 36 ? (this.pos += 2, this.finishToken(j.dollarBraceL)) : (++this.pos, this.finishToken(j.backQuote)) : (e += this.input.slice(t, this.pos), this.finishToken(j.template, e));
		if (n === 92) e += this.input.slice(t, this.pos), e += this.readEscapedChar(!0), t = this.pos;
		else if (Qe(n)) {
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
}, G.readInvalidTemplateToken = function() {
	for (; this.pos < this.input.length; this.pos++) switch (this.input[this.pos]) {
		case "\\":
			++this.pos;
			break;
		case "$": if (this.input[this.pos + 1] !== "{") break;
		case "`": return this.finishToken(j.invalidTemplate, this.input.slice(this.start, this.pos));
		case "\r": this.input[this.pos + 1] === "\n" && ++this.pos;
		case "\n":
		case "\u2028":
		case "\u2029":
			++this.curLine, this.lineStart = this.pos + 1;
			break;
	}
	this.raise(this.start, "Unterminated template");
}, G.readEscapedChar = function(e) {
	var t = this.input.charCodeAt(++this.pos);
	switch (++this.pos, t) {
		case 110: return "\n";
		case 114: return "\r";
		case 120: return String.fromCharCode(this.readHexChar(2));
		case 117: return ct(this.readCodePoint());
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
			return Qe(t) ? (this.options.locations && (this.lineStart = this.pos, ++this.curLine), "") : String.fromCharCode(t);
	}
}, G.readHexChar = function(e) {
	var t = this.pos, n = this.readInt(16, e);
	return n === null && this.invalidStringToken(t, "Bad character escape sequence"), n;
}, G.readWord1 = function() {
	this.containsEsc = !1;
	for (var e = "", t = !0, n = this.pos, r = this.options.ecmaVersion >= 6; this.pos < this.input.length;) {
		var i = this.fullCharCodeAtPos();
		if (Ye(i, r)) this.pos += i <= 65535 ? 1 : 2;
		else if (i === 92) {
			this.containsEsc = !0, e += this.input.slice(n, this.pos);
			var a = this.pos;
			this.input.charCodeAt(++this.pos) !== 117 && this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"), ++this.pos;
			var o = this.readCodePoint();
			(t ? T : Ye)(o, r) || this.invalidStringToken(a, "Invalid Unicode escape"), e += ct(o), n = this.pos;
		} else break;
		t = !1;
	}
	return e + this.input.slice(n, this.pos);
}, G.readWord = function() {
	var e = this.readWord1(), t = j.name;
	return this.keywords.test(e) && (t = Xe[e]), this.finishToken(t, e);
};
var qn = "8.17.0";
P.acorn = {
	Parser: P,
	version: qn,
	defaultOptions: pt,
	Position: ut,
	SourceLocation: dt,
	getLineInfo: ft,
	Node: $t,
	TokenType: E,
	tokTypes: j,
	keywordTypes: Xe,
	TokContext: z,
	tokContexts: B,
	isIdentifierChar: Ye,
	isIdentifierStart: T,
	Token: Un,
	isNewLine: Qe,
	lineBreak: M,
	lineBreakG: Ze,
	nonASCIIwhitespace: et
};
function Jn(e, t) {
	return P.parse(e, t);
}
function Yn(e, t, n) {
	return P.parseExpressionAt(e, t, n);
}
function Xn(e, t) {
	return P.tokenizer(e, t);
}
//#endregion
//#region node_modules/acorn-typescript/lib/index.mjs
function Zn(e, t) {
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
function Qn() {
	return Qn = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, Qn.apply(this, arguments);
}
function $n(e, t) {
	e.prototype = Object.create(t.prototype), e.prototype.constructor = e, er(e, t);
}
function er(e, t) {
	return er = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e, t) {
		return e.__proto__ = t, e;
	}, er(e, t);
}
function tr(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function nr(e, t) {
	var n = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n) return (n = n.call(e)).next.bind(n);
	if (Array.isArray(e) || (n = function(e, t) {
		if (e) {
			if (typeof e == "string") return tr(e, t);
			var n = Object.prototype.toString.call(e).slice(8, -1);
			return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? tr(e, t) : void 0;
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
var K = !0;
function q(e, t) {
	return t === void 0 && (t = {}), new E("name", t);
}
var rr = /* @__PURE__ */ new WeakMap();
function ir(e) {
	var t = rr.get(e.Parser.acorn || e);
	if (!t) {
		var n = {
			assert: q(0, { startsExpr: K }),
			asserts: q(0, { startsExpr: K }),
			global: q(0, { startsExpr: K }),
			keyof: q(0, { startsExpr: K }),
			readonly: q(0, { startsExpr: K }),
			unique: q(0, { startsExpr: K }),
			abstract: q(0, { startsExpr: K }),
			declare: q(0, { startsExpr: K }),
			enum: q(0, { startsExpr: K }),
			module: q(0, { startsExpr: K }),
			namespace: q(0, { startsExpr: K }),
			interface: q(0, { startsExpr: K }),
			type: q(0, { startsExpr: K })
		}, r = {
			at: new E("@"),
			jsxName: new E("jsxName"),
			jsxText: new E("jsxText", { beforeExpr: !0 }),
			jsxTagStart: new E("jsxTagStart", { startsExpr: !0 }),
			jsxTagEnd: new E("jsxTagEnd")
		}, i = {
			tc_oTag: new z("<tag", !1, !1),
			tc_cTag: new z("</tag", !1, !1),
			tc_expr: new z("<tag>...</tag>", !0, !0)
		}, a = RegExp("^(?:" + Object.keys(n).join("|") + ")$");
		r.jsxTagStart.updateContext = function() {
			this.context.push(i.tc_expr), this.context.push(i.tc_oTag), this.exprAllowed = !1;
		}, r.jsxTagEnd.updateContext = function(e) {
			var t = this.context.pop();
			t === i.tc_oTag && e === j.slash || t === i.tc_cTag ? (this.context.pop(), this.exprAllowed = this.curContext() === i.tc_expr) : this.exprAllowed = !0;
		}, t = {
			tokTypes: Qn({}, n, r),
			tokContexts: Qn({}, i),
			keywordsRegExp: a,
			tokenIsLiteralPropertyName: function(e) {
				return [
					j.name,
					j.string,
					j.num
				].concat(Object.values(Xe), Object.values(n)).includes(e);
			},
			tokenIsKeywordOrIdentifier: function(e) {
				return [j.name].concat(Object.values(Xe), Object.values(n)).includes(e);
			},
			tokenIsIdentifier: function(e) {
				return [].concat(Object.values(n), [j.name]).includes(e);
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
				return e === j.invalidTemplate;
			}
		};
	}
	return t;
}
var ar = 1024, or = RegExp("(?=(" + (/* @__PURE__ */ RegExp("(?:[^\\S\\n\\r\\u2028\\u2029]|\\/\\/.*|\\/\\*.*?\\*\\/)*", "y")).source + "))\\1(?=[\\n\\r\\u2028\\u2029]|\\/\\*(?!.*?\\*\\/)|$)", "y"), sr = function() {
	this.shorthandAssign = void 0, this.trailingComma = void 0, this.parenthesizedAssign = void 0, this.parenthesizedBind = void 0, this.doubleProto = void 0, this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
function cr(e, t) {
	var n = t.key.name, r = e[n], i = "true";
	return t.type !== "MethodDefinition" || t.kind !== "get" && t.kind !== "set" || (i = (t.static ? "s" : "i") + t.kind), r === "iget" && i === "iset" || r === "iset" && i === "iget" || r === "sget" && i === "sset" || r === "sset" && i === "sget" ? (e[n] = "true", !1) : !!r || (e[n] = i, !1);
}
function lr(e, t) {
	var n = e.key;
	return !e.computed && (n.type === "Identifier" && n.name === t || n.type === "Literal" && n.value === t);
}
var J = {
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
}, ur = {
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
}, dr = /^[\da-fA-F]+$/, fr = /^\d+$/;
function pr(e) {
	return e && (e.type === "JSXIdentifier" ? e.name : e.type === "JSXNamespacedName" ? e.namespace.name + ":" + e.name.name : e.type === "JSXMemberExpression" ? pr(e.object) + "." + pr(e.property) : void 0);
}
var mr = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
function hr(e) {
	if (!e) throw Error("Assert fail");
}
function gr(e) {
	return e === "accessor";
}
function _r(e) {
	return e === "in" || e === "out";
}
function vr(e, t) {
	return 2 | (e ? 4 : 0) | (t ? 8 : 0);
}
function yr(e) {
	if (e.type !== "MemberExpression") return !1;
	var t = e.property;
	return (!e.computed || !(t.type !== "TemplateLiteral" || t.expressions.length > 0)) && br(e.object);
}
function br(e) {
	return e.type === "Identifier" || e.type === "MemberExpression" && !e.computed && br(e.object);
}
function xr(e) {
	return e === "private" || e === "public" || e === "protected";
}
function Sr(e) {
	var t = e || {}, n = t.dts, r = n !== void 0 && n, i = t.allowSatisfies, a = i !== void 0 && i;
	return function(t) {
		var n = t.acorn || Le, i = ir(n), o = n.tokTypes, s = n.keywordTypes, c = n.isIdentifierStart, l = n.lineBreak, u = n.isNewLine, d = n.tokContexts, f = n.isIdentifierChar, p = i.tokTypes, m = i.tokContexts, h = i.keywordsRegExp, g = i.tokenIsLiteralPropertyName, ee = i.tokenIsTemplate, _ = i.tokenIsTSDeclarationStart, v = i.tokenIsIdentifier, te = i.tokenIsKeywordOrIdentifier, ne = i.tokenIsTSTypeOperator;
		function re(e, t, n) {
			n === void 0 && (n = e.length);
			for (var r = t; r < n; r++) {
				var i = e.charCodeAt(r);
				if (u(i)) return r < n - 1 && i === 13 && e.charCodeAt(r + 1) === 10 ? r + 2 : r + 1;
			}
			return -1;
		}
		return t = function(e, t, n) {
			var r = n.tokTypes, i = t.tokTypes;
			/*#__PURE__*/ return function(e) {
				function t() {
					return e.apply(this, arguments) || this;
				}
				$n(t, e);
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
				$n(t, e);
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
							t[0] === "#" ? t[1] === "x" ? (t = t.substr(2), dr.test(t) && (e = String.fromCharCode(parseInt(t, 16)))) : (t = t.substr(1), fr.test(t) && (e = String.fromCharCode(parseInt(t, 10)))) : e = ur[t];
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
						pr(s.name) !== pr(o.name) && this.raise(s.start, "Expected corresponding JSX closing tag for <" + pr(o.name) + ">");
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
				$n(t, e);
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
					errorTemplate: J.InvalidModifierOnTypeParameterPositions
				}), i;
			}
			$n(t, e);
			var ie, y, ae, b = t.prototype;
			return b.getTokenFromCodeInType = function(t) {
				return t === 62 || t === 60 ? this.finishOp(o.relational, 1) : e.prototype.getTokenFromCode.call(this, t);
			}, b.readToken = function(t) {
				if (!this.inType) {
					var n = this.curContext();
					if (n === m.tc_expr) return this.jsx_readToken();
					if (n === m.tc_oTag || n === m.tc_cTag) {
						if (c(t)) return this.jsx_readWord();
						if (t == 62) return ++this.pos, this.finishToken(p.jsxTagEnd);
						if ((t === 34 || t === 39) && n == m.tc_oTag) return this.jsx_readString(t);
					}
					if (t === 60 && this.exprAllowed && this.input.charCodeAt(this.pos + 1) !== 33) return ++this.pos, this.finishToken(p.jsxTagStart);
				}
				return e.prototype.readToken.call(this, t);
			}, b.getTokenFromCode = function(t) {
				return this.inType ? this.getTokenFromCodeInType(t) : t === 64 ? (++this.pos, this.finishToken(p.at)) : e.prototype.getTokenFromCode.call(this, t);
			}, b.isAbstractClass = function() {
				return this.ts_isContextual(p.abstract) && this.lookahead().type === o._class;
			}, b.finishNode = function(t, n) {
				return t.type !== "" && t.end !== 0 ? t : e.prototype.finishNode.call(this, t, n);
			}, b.tryParse = function(e, t) {
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
			}, b.setOptionalParametersError = function(e, t) {
				e.optionalParametersLoc = t?.loc ?? this.startLoc;
			}, b.reScan_lt_gt = function() {
				this.type === o.relational && (--this.pos, this.readToken_lt_gt(this.fullCharCodeAtPos()));
			}, b.reScan_lt = function() {
				var e = this.type;
				return e === o.bitShift ? (this.pos -= 2, this.finishOp(o.relational, 1), o.relational) : e;
			}, b.resetEndLocation = function(e, t) {
				t === void 0 && (t = this.lastTokEndLoc), e.end = t.column, e.loc.end = t, this.options.ranges && (e.range[1] = t.column);
			}, b.startNodeAtNode = function(t) {
				return e.prototype.startNodeAt.call(this, t.start, t.loc.start);
			}, b.nextTokenStart = function() {
				return this.nextTokenStartSince(this.pos);
			}, b.tsHasSomeModifiers = function(e, t) {
				return t.some(function(t) {
					return xr(t) ? e.accessibility === t : !!e[t];
				});
			}, b.tsIsStartOfStaticBlocks = function() {
				return this.isContextual("static") && this.lookaheadCharCode() === 123;
			}, b.tsCheckForInvalidTypeCasts = function(e) {
				var t = this;
				e.forEach(function(e) {
					e?.type === "TSTypeCastExpression" && t.raise(e.typeAnnotation.start, J.UnexpectedTypeAnnotation);
				});
			}, b.atPossibleAsyncArrow = function(e) {
				return e.type === "Identifier" && e.name === "async" && this.lastTokEndLoc.column === e.end && !this.canInsertSemicolon() && e.end - e.start == 5 && e.start === this.potentialArrowAt;
			}, b.tsIsIdentifier = function() {
				return v(this.type);
			}, b.tsTryParseTypeOrTypePredicateAnnotation = function() {
				return this.match(o.colon) ? this.tsParseTypeOrTypePredicateAnnotation(o.colon) : void 0;
			}, b.tsTryParseGenericAsyncArrowFunction = function(t, n, r) {
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
			}, b.tsParseTypeArgumentsInExpression = function() {
				if (this.reScan_lt() === o.relational) return this.tsParseTypeArguments();
			}, b.tsInNoContext = function(e) {
				var t = this.context;
				this.context = [t[0]];
				try {
					return e();
				} finally {
					this.context = t;
				}
			}, b.tsTryParseTypeAnnotation = function() {
				return this.match(o.colon) ? this.tsParseTypeAnnotation() : void 0;
			}, b.isUnparsedContextual = function(e, t) {
				var n = e + t.length;
				if (this.input.slice(e, n) === t) {
					var r = this.input.charCodeAt(n);
					return !(f(r) || (64512 & r) == 55296);
				}
				return !1;
			}, b.isAbstractConstructorSignature = function() {
				return this.ts_isContextual(p.abstract) && this.lookahead().type === o._new;
			}, b.nextTokenStartSince = function(e) {
				return mr.lastIndex = e, mr.test(this.input) ? mr.lastIndex : e;
			}, b.lookaheadCharCode = function() {
				return this.input.charCodeAt(this.nextTokenStart());
			}, b.compareLookaheadState = function(e, t) {
				for (var n = 0, r = Object.keys(e); n < r.length; n++) {
					var i = r[n];
					if (e[i] !== t[i]) return !1;
				}
				return !0;
			}, b.createLookaheadState = function() {
				this.value = null, this.context = [this.curContext()];
			}, b.getCurLookaheadState = function() {
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
			}, b.cloneCurLookaheadState = function() {
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
			}, b.setLookaheadState = function(e) {
				this.pos = e.pos, this.value = e.value, this.endLoc = e.endLoc, this.lastTokEnd = e.lastTokEnd, this.lastTokStart = e.lastTokStart, this.lastTokStartLoc = e.lastTokStartLoc, this.type = e.type, this.start = e.start, this.end = e.end, this.context = e.context, this.startLoc = e.startLoc, this.lastTokEndLoc = e.lastTokEndLoc, this.curLine = e.curLine, this.lineStart = e.lineStart, this.curPosition = e.curPosition, this.containsEsc = e.containsEsc;
			}, b.tsLookAhead = function(e) {
				var t = this.getCurLookaheadState(), n = e();
				return this.setLookaheadState(t), n;
			}, b.lookahead = function(e) {
				var t = this.getCurLookaheadState();
				if (this.createLookaheadState(), this.isLookahead = !0, e !== void 0) for (var n = 0; n < e; n++) this.nextToken();
				else this.nextToken();
				this.isLookahead = !1;
				var r = this.getCurLookaheadState();
				return this.setLookaheadState(t), r;
			}, b.readWord = function() {
				var e = this.readWord1(), t = o.name;
				return this.keywords.test(e) ? t = s[e] : new RegExp(h).test(e) && (t = p[e]), this.finishToken(t, e);
			}, b.skipBlockComment = function() {
				var e;
				this.isLookahead || (e = this.options.onComment && this.curPosition());
				var t = this.pos, n = this.input.indexOf("*/", this.pos += 2);
				if (n === -1 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = n + 2, this.options.locations) for (var r, i = t; (r = re(this.input, i, this.pos)) > -1;) ++this.curLine, i = this.lineStart = r;
				this.isLookahead || this.options.onComment && this.options.onComment(!0, this.input.slice(t + 2, n), t, this.pos, e, this.curPosition());
			}, b.skipLineComment = function(e) {
				var t, n = this.pos;
				this.isLookahead || (t = this.options.onComment && this.curPosition());
				for (var r = this.input.charCodeAt(this.pos += e); this.pos < this.input.length && !u(r);) r = this.input.charCodeAt(++this.pos);
				this.isLookahead || this.options.onComment && this.options.onComment(!1, this.input.slice(n + e, this.pos), n, this.pos, t, this.curPosition());
			}, b.finishToken = function(e, t) {
				this.preValue = this.value, this.preToken = this.type, this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
				var n = this.type;
				this.type = e, this.value = t, this.isLookahead || this.updateContext(n);
			}, b.resetStartLocation = function(e, t, n) {
				e.start = t, e.loc.start = n, this.options.ranges && (e.range[0] = t);
			}, b.isLineTerminator = function() {
				return this.eat(o.semi) || e.prototype.canInsertSemicolon.call(this);
			}, b.hasFollowingLineBreak = function() {
				return or.lastIndex = this.end, or.test(this.input);
			}, b.addExtra = function(e, t, n, r) {
				if (r === void 0 && (r = !0), e) {
					var i = e.extra = e.extra || {};
					r ? i[t] = n : Object.defineProperty(i, t, {
						enumerable: r,
						value: n
					});
				}
			}, b.isLiteralPropertyName = function() {
				return g(this.type);
			}, b.hasPrecedingLineBreak = function() {
				return l.test(this.input.slice(this.lastTokEndLoc.index, this.start));
			}, b.createIdentifier = function(e, t) {
				return e.name = t, this.finishNode(e, "Identifier");
			}, b.resetStartLocationFromNode = function(e, t) {
				this.resetStartLocation(e, t.start, t.loc.start);
			}, b.isThisParam = function(e) {
				return e.type === "Identifier" && e.name === "this";
			}, b.isLookaheadContextual = function(e) {
				var t = this.nextTokenStart();
				return this.isUnparsedContextual(t, e);
			}, b.ts_type_isContextual = function(e, t) {
				return e === t && !this.containsEsc;
			}, b.ts_isContextual = function(e) {
				return this.type === e && !this.containsEsc;
			}, b.ts_isContextualWithState = function(e, t) {
				return e.type === t && !e.containsEsc;
			}, b.isContextualWithState = function(e, t) {
				return t.type === o.name && t.value === e && !t.containsEsc;
			}, b.tsIsStartOfMappedType = function() {
				return this.next(), this.eat(o.plusMin) ? this.ts_isContextual(p.readonly) : (this.ts_isContextual(p.readonly) && this.next(), !!this.match(o.bracketL) && (this.next(), !!this.tsIsIdentifier() && (this.next(), this.match(o._in))));
			}, b.tsInDisallowConditionalTypesContext = function(e) {
				var t = this.inDisallowConditionalTypesContext;
				this.inDisallowConditionalTypesContext = !0;
				try {
					return e();
				} finally {
					this.inDisallowConditionalTypesContext = t;
				}
			}, b.tsTryParseType = function() {
				return this.tsEatThenParseType(o.colon);
			}, b.match = function(e) {
				return this.type === e;
			}, b.matchJsx = function(e) {
				return this.type === i.tokTypes[e];
			}, b.ts_eatWithState = function(e, t, n) {
				if (e === n.type) {
					for (var r = 0; r < t; r++) this.next();
					return !0;
				}
				return !1;
			}, b.ts_eatContextualWithState = function(e, t, n) {
				if (h.test(e)) {
					if (this.ts_isContextualWithState(n, p[e])) {
						for (var r = 0; r < t; r++) this.next();
						return !0;
					}
					return !1;
				}
				if (!this.isContextualWithState(e, n)) return !1;
				for (var i = 0; i < t; i++) this.next();
				return !0;
			}, b.canHaveLeadingDecorator = function() {
				return this.match(o._class);
			}, b.eatContextual = function(t) {
				return h.test(t) ? !!this.ts_isContextual(p[t]) && (this.next(), !0) : e.prototype.eatContextual.call(this, t);
			}, b.tsIsExternalModuleReference = function() {
				return this.isContextual("require") && this.lookaheadCharCode() === 40;
			}, b.tsParseExternalModuleReference = function() {
				var e = this.startNode();
				return this.expectContextual("require"), this.expect(o.parenL), this.match(o.string) || this.unexpected(), e.expression = this.parseExprAtom(), this.expect(o.parenR), this.finishNode(e, "TSExternalModuleReference");
			}, b.tsParseEntityName = function(e) {
				e === void 0 && (e = !0);
				for (var t = this.parseIdent(e); this.eat(o.dot);) {
					var n = this.startNodeAtNode(t);
					n.left = t, n.right = this.parseIdent(e), t = this.finishNode(n, "TSQualifiedName");
				}
				return t;
			}, b.tsParseEnumMember = function() {
				var e = this.startNode();
				return e.id = this.match(o.string) ? this.parseLiteral(this.value) : this.parseIdent(!0), this.eat(o.eq) && (e.initializer = this.parseMaybeAssign()), this.finishNode(e, "TSEnumMember");
			}, b.tsParseEnumDeclaration = function(e, t) {
				return t === void 0 && (t = {}), t.const && (e.const = !0), t.declare && (e.declare = !0), this.expectContextual("enum"), e.id = this.parseIdent(), this.checkLValSimple(e.id), this.expect(o.braceL), e.members = this.tsParseDelimitedList("EnumMembers", this.tsParseEnumMember.bind(this)), this.expect(o.braceR), this.finishNode(e, "TSEnumDeclaration");
			}, b.tsParseModuleBlock = function() {
				var t = this.startNode();
				for (e.prototype.enterScope.call(this, 512), this.expect(o.braceL), t.body = []; this.type !== o.braceR;) {
					var n = this.parseStatement(null, !0);
					t.body.push(n);
				}
				return this.next(), e.prototype.exitScope.call(this), this.finishNode(t, "TSModuleBlock");
			}, b.tsParseAmbientExternalModuleDeclaration = function(t) {
				return this.ts_isContextual(p.global) ? (t.global = !0, t.id = this.parseIdent()) : this.match(o.string) ? t.id = this.parseLiteral(this.value) : this.unexpected(), this.match(o.braceL) ? (e.prototype.enterScope.call(this, ar), t.body = this.tsParseModuleBlock(), e.prototype.exitScope.call(this)) : e.prototype.semicolon.call(this), this.finishNode(t, "TSModuleDeclaration");
			}, b.tsTryParseDeclare = function(e) {
				var t = this;
				if (!this.isLineTerminator()) {
					var n, r = this.type;
					return this.isContextual("let") && (r = o._var, n = "let"), this.tsInAmbientContext(function() {
						if (r === o._function) return e.declare = !0, t.parseFunctionStatement(e, !1, !0);
						if (r === o._class) return e.declare = !0, t.parseClass(e, !0);
						if (r === p.enum) return t.tsParseEnumDeclaration(e, { declare: !0 });
						if (r === p.global) return t.tsParseAmbientExternalModuleDeclaration(e);
						if (r === o._const || r === o._var) return t.match(o._const) && t.isLookaheadContextual("enum") ? (t.expect(o._const), t.tsParseEnumDeclaration(e, {
							const: !0,
							declare: !0
						})) : (e.declare = !0, t.parseVarStatement(e, n || t.value, !0));
						if (r === p.interface) {
							var i = t.tsParseInterfaceDeclaration(e, { declare: !0 });
							if (i) return i;
						}
						return v(r) ? t.tsParseDeclaration(e, t.value, !0) : void 0;
					});
				}
			}, b.tsIsListTerminator = function(e) {
				switch (e) {
					case "EnumMembers":
					case "TypeMembers": return this.match(o.braceR);
					case "HeritageClauseElement": return this.match(o.braceL);
					case "TupleElementTypes": return this.match(o.bracketR);
					case "TypeParametersOrArguments": return this.tsMatchRightRelational();
				}
			}, b.tsParseDelimitedListWorker = function(e, t, n, r) {
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
			}, b.tsParseDelimitedList = function(e, t, n) {
				return function(e) {
					if (e == null) throw Error("Unexpected " + e + " value.");
					return e;
				}(this.tsParseDelimitedListWorker(e, t, !0, n));
			}, b.tsParseBracketedList = function(e, t, n, r, i) {
				r || this.expect(n ? o.bracketL : o.relational);
				var a = this.tsParseDelimitedList(e, t, i);
				return this.expect(n ? o.bracketR : o.relational), a;
			}, b.tsParseTypeParameterName = function() {
				return this.parseIdent().name;
			}, b.tsEatThenParseType = function(e) {
				return this.match(e) ? this.tsNextThenParseType() : void 0;
			}, b.tsExpectThenParseType = function(e) {
				var t = this;
				return this.tsDoThenParseType(function() {
					return t.expect(e);
				});
			}, b.tsNextThenParseType = function() {
				var e = this;
				return this.tsDoThenParseType(function() {
					return e.next();
				});
			}, b.tsDoThenParseType = function(e) {
				var t = this;
				return this.tsInType(function() {
					return e(), t.tsParseType();
				});
			}, b.tsSkipParameterStart = function() {
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
			}, b.tsIsUnambiguouslyStartOfFunctionType = function() {
				return this.next(), !!(this.match(o.parenR) || this.match(o.ellipsis) || this.tsSkipParameterStart() && (this.match(o.colon) || this.match(o.comma) || this.match(o.question) || this.match(o.eq) || this.match(o.parenR) && (this.next(), this.match(o.arrow))));
			}, b.tsIsStartOfFunctionType = function() {
				return !!this.tsMatchLeftRelational() || this.match(o.parenL) && this.tsLookAhead(this.tsIsUnambiguouslyStartOfFunctionType.bind(this));
			}, b.tsInAllowConditionalTypesContext = function(e) {
				var t = this.inDisallowConditionalTypesContext;
				this.inDisallowConditionalTypesContext = !1;
				try {
					return e();
				} finally {
					this.inDisallowConditionalTypesContext = t;
				}
			}, b.tsParseBindingListForSignature = function() {
				var t = this;
				return e.prototype.parseBindingList.call(this, o.parenR, !0, !0).map(function(e) {
					return e.type !== "Identifier" && e.type !== "RestElement" && e.type !== "ObjectPattern" && e.type !== "ArrayPattern" && t.raise(e.start, J.UnsupportedSignatureParameterKind(e.type)), e;
				});
			}, b.tsParseTypePredicateAsserts = function() {
				if (this.type !== p.asserts) return !1;
				var e = this.containsEsc;
				return this.next(), !(!v(this.type) && !this.match(o._this) || (e && this.raise(this.lastTokStart, "Escape sequence in keyword asserts"), 0));
			}, b.tsParseThisTypeNode = function() {
				var e = this.startNode();
				return this.next(), this.finishNode(e, "TSThisType");
			}, b.tsParseTypeAnnotation = function(e, t) {
				var n = this;
				return e === void 0 && (e = !0), t === void 0 && (t = this.startNode()), this.tsInType(function() {
					e && n.expect(o.colon), t.typeAnnotation = n.tsParseType();
				}), this.finishNode(t, "TSTypeAnnotation");
			}, b.tsParseThisTypePredicate = function(e) {
				this.next();
				var t = this.startNodeAtNode(e);
				return t.parameterName = e, t.typeAnnotation = this.tsParseTypeAnnotation(!1), t.asserts = !1, this.finishNode(t, "TSTypePredicate");
			}, b.tsParseThisTypeOrThisTypePredicate = function() {
				var e = this.tsParseThisTypeNode();
				return this.isContextual("is") && !this.hasPrecedingLineBreak() ? this.tsParseThisTypePredicate(e) : e;
			}, b.tsParseTypePredicatePrefix = function() {
				var e = this.parseIdent();
				if (this.isContextual("is") && !this.hasPrecedingLineBreak()) return this.next(), e;
			}, b.tsParseTypeOrTypePredicateAnnotation = function(e) {
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
			}, b.tsFillSignature = function(e, t) {
				var n = e === o.arrow;
				t.typeParameters = this.tsTryParseTypeParameters(), this.expect(o.parenL), t.parameters = this.tsParseBindingListForSignature(), (n || this.match(e)) && (t.typeAnnotation = this.tsParseTypeOrTypePredicateAnnotation(e));
			}, b.tsTryNextParseConstantContext = function() {
				if (this.lookahead().type !== o._const) return null;
				this.next();
				var e = this.tsParseTypeReference();
				return e.typeParameters && this.raise(e.typeName.start, J.CannotFindName({ name: "const" })), e;
			}, b.tsParseFunctionOrConstructorType = function(e, t) {
				var n = this, r = this.startNode();
				return e === "TSConstructorType" && (r.abstract = !!t, t && this.next(), this.next()), this.tsInAllowConditionalTypesContext(function() {
					return n.tsFillSignature(o.arrow, r);
				}), this.finishNode(r, e);
			}, b.tsParseUnionOrIntersectionType = function(e, t, n) {
				var r = this.startNode(), i = this.eat(n), a = [];
				do
					a.push(t());
				while (this.eat(n));
				return a.length !== 1 || i ? (r.types = a, this.finishNode(r, e)) : a[0];
			}, b.tsCheckTypeAnnotationForReadOnly = function(e) {
				switch (e.typeAnnotation.type) {
					case "TSTupleType":
					case "TSArrayType": return;
					default: this.raise(e.start, J.UnexpectedReadonly);
				}
			}, b.tsParseTypeOperator = function() {
				var e = this.startNode(), t = this.value;
				return this.next(), e.operator = t, e.typeAnnotation = this.tsParseTypeOperatorOrHigher(), t === "readonly" && this.tsCheckTypeAnnotationForReadOnly(e), this.finishNode(e, "TSTypeOperator");
			}, b.tsParseConstraintForInferType = function() {
				var e = this;
				if (this.eat(o._extends)) {
					var t = this.tsInDisallowConditionalTypesContext(function() {
						return e.tsParseType();
					});
					if (this.inDisallowConditionalTypesContext || !this.match(o.question)) return t;
				}
			}, b.tsParseInferType = function() {
				var e = this, t = this.startNode();
				this.expectContextual("infer");
				var n = this.startNode();
				return n.name = this.tsParseTypeParameterName(), n.constraint = this.tsTryParse(function() {
					return e.tsParseConstraintForInferType();
				}), t.typeParameter = this.finishNode(n, "TSTypeParameter"), this.finishNode(t, "TSInferType");
			}, b.tsParseLiteralTypeNode = function() {
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
			}, b.tsParseImportType = function() {
				var e = this.startNode();
				return this.expect(o._import), this.expect(o.parenL), this.match(o.string) || this.raise(this.start, J.UnsupportedImportTypeArgument), e.argument = this.parseExprAtom(), this.expect(o.parenR), this.eat(o.dot) && (e.qualifier = this.tsParseEntityName()), this.tsMatchLeftRelational() && (e.typeParameters = this.tsParseTypeArguments()), this.finishNode(e, "TSImportType");
			}, b.tsParseTypeQuery = function() {
				var e = this.startNode();
				return this.expect(o._typeof), e.exprName = this.match(o._import) ? this.tsParseImportType() : this.tsParseEntityName(), !this.hasPrecedingLineBreak() && this.tsMatchLeftRelational() && (e.typeParameters = this.tsParseTypeArguments()), this.finishNode(e, "TSTypeQuery");
			}, b.tsParseMappedTypeParameter = function() {
				var e = this.startNode();
				return e.name = this.tsParseTypeParameterName(), e.constraint = this.tsExpectThenParseType(o._in), this.finishNode(e, "TSTypeParameter");
			}, b.tsParseMappedType = function() {
				var e = this.startNode();
				return this.expect(o.braceL), this.match(o.plusMin) ? (e.readonly = this.value, this.next(), this.expectContextual("readonly")) : this.eatContextual("readonly") && (e.readonly = !0), this.expect(o.bracketL), e.typeParameter = this.tsParseMappedTypeParameter(), e.nameType = this.eatContextual("as") ? this.tsParseType() : null, this.expect(o.bracketR), this.match(o.plusMin) ? (e.optional = this.value, this.next(), this.expect(o.question)) : this.eat(o.question) && (e.optional = !0), e.typeAnnotation = this.tsTryParseType(), this.semicolon(), this.expect(o.braceR), this.finishNode(e, "TSMappedType");
			}, b.tsParseTypeLiteral = function() {
				var e = this.startNode();
				return e.members = this.tsParseObjectTypeMembers(), this.finishNode(e, "TSTypeLiteral");
			}, b.tsParseTupleElementType = function() {
				var e = this.startLoc, t = this.start, n = this.eat(o.ellipsis), r = this.tsParseType(), i = this.eat(o.question);
				if (this.eat(o.colon)) {
					var a = this.startNodeAtNode(r);
					a.optional = i, r.type !== "TSTypeReference" || r.typeParameters || r.typeName.type !== "Identifier" ? (this.raise(r.start, J.InvalidTupleMemberLabel), a.label = r) : a.label = r.typeName, a.elementType = this.tsParseType(), r = this.finishNode(a, "TSNamedTupleMember");
				} else if (i) {
					var s = this.startNodeAtNode(r);
					s.typeAnnotation = r, r = this.finishNode(s, "TSOptionalType");
				}
				if (n) {
					var c = this.startNodeAt(t, e);
					c.typeAnnotation = r, r = this.finishNode(c, "TSRestType");
				}
				return r;
			}, b.tsParseTupleType = function() {
				var e = this, t = this.startNode();
				t.elementTypes = this.tsParseBracketedList("TupleElementTypes", this.tsParseTupleElementType.bind(this), !0, !1);
				var n = !1, r = null;
				return t.elementTypes.forEach(function(t) {
					var i = t.type;
					!n || i === "TSRestType" || i === "TSOptionalType" || i === "TSNamedTupleMember" && t.optional || e.raise(t.start, J.OptionalTypeBeforeRequired), n ||= i === "TSNamedTupleMember" && t.optional || i === "TSOptionalType";
					var a = i;
					i === "TSRestType" && (a = (t = t.typeAnnotation).type);
					var o = a === "TSNamedTupleMember";
					r ??= o, r !== o && e.raise(t.start, J.MixedLabeledAndUnlabeledElements);
				}), this.finishNode(t, "TSTupleType");
			}, b.tsParseTemplateLiteralType = function() {
				var e = this.startNode();
				return e.literal = this.parseTemplate({ isTagged: !1 }), this.finishNode(e, "TSLiteralType");
			}, b.tsParseTypeReference = function() {
				var e = this.startNode();
				return e.typeName = this.tsParseEntityName(), !this.hasPrecedingLineBreak() && this.tsMatchLeftRelational() && (e.typeParameters = this.tsParseTypeArguments()), this.finishNode(e, "TSTypeReference");
			}, b.tsMatchLeftRelational = function() {
				return this.match(o.relational) && this.value === "<";
			}, b.tsMatchRightRelational = function() {
				return this.match(o.relational) && this.value === ">";
			}, b.tsParseParenthesizedType = function() {
				var e = this.startNode();
				return this.expect(o.parenL), e.typeAnnotation = this.tsParseType(), this.expect(o.parenR), this.finishNode(e, "TSParenthesizedType");
			}, b.tsParseNonArrayType = function() {
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
			}, b.tsParseArrayTypeOrHigher = function() {
				for (var e = this.tsParseNonArrayType(); !this.hasPrecedingLineBreak() && this.eat(o.bracketL);) if (this.match(o.bracketR)) {
					var t = this.startNodeAtNode(e);
					t.elementType = e, this.expect(o.bracketR), e = this.finishNode(t, "TSArrayType");
				} else {
					var n = this.startNodeAtNode(e);
					n.objectType = e, n.indexType = this.tsParseType(), this.expect(o.bracketR), e = this.finishNode(n, "TSIndexedAccessType");
				}
				return e;
			}, b.tsParseTypeOperatorOrHigher = function() {
				var e = this;
				return ne(this.type) && !this.containsEsc ? this.tsParseTypeOperator() : this.isContextual("infer") ? this.tsParseInferType() : this.tsInAllowConditionalTypesContext(function() {
					return e.tsParseArrayTypeOrHigher();
				});
			}, b.tsParseIntersectionTypeOrHigher = function() {
				return this.tsParseUnionOrIntersectionType("TSIntersectionType", this.tsParseTypeOperatorOrHigher.bind(this), o.bitwiseAND);
			}, b.tsParseUnionTypeOrHigher = function() {
				return this.tsParseUnionOrIntersectionType("TSUnionType", this.tsParseIntersectionTypeOrHigher.bind(this), o.bitwiseOR);
			}, b.tsParseNonConditionalType = function() {
				return this.tsIsStartOfFunctionType() ? this.tsParseFunctionOrConstructorType("TSFunctionType") : this.match(o._new) ? this.tsParseFunctionOrConstructorType("TSConstructorType") : this.isAbstractConstructorSignature() ? this.tsParseFunctionOrConstructorType("TSConstructorType", !0) : this.tsParseUnionTypeOrHigher();
			}, b.tsParseType = function() {
				var e = this;
				hr(this.inType);
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
			}, b.tsIsUnambiguouslyIndexSignature = function() {
				return this.next(), !!v(this.type) && (this.next(), this.match(o.colon));
			}, b.tsInType = function(e) {
				var t = this.inType;
				this.inType = !0;
				try {
					return e();
				} finally {
					this.inType = t;
				}
			}, b.tsTryParseIndexSignature = function(e) {
				if (this.match(o.bracketL) && this.tsLookAhead(this.tsIsUnambiguouslyIndexSignature.bind(this))) {
					this.expect(o.bracketL);
					var t = this.parseIdent();
					t.typeAnnotation = this.tsParseTypeAnnotation(), this.resetEndLocation(t), this.expect(o.bracketR), e.parameters = [t];
					var n = this.tsTryParseTypeAnnotation();
					return n && (e.typeAnnotation = n), this.tsParseTypeMemberSemicolon(), this.finishNode(e, "TSIndexSignature");
				}
			}, b.tsParseNoneModifiers = function(e) {
				this.tsParseModifiers({
					modified: e,
					allowedModifiers: [],
					disallowedModifiers: ["in", "out"],
					errorTemplate: J.InvalidModifierOnTypeParameterPositions
				});
			}, b.tsParseTypeParameter = function(e) {
				e === void 0 && (e = this.tsParseNoneModifiers.bind(this));
				var t = this.startNode();
				return e(t), t.name = this.tsParseTypeParameterName(), t.constraint = this.tsEatThenParseType(o._extends), t.default = this.tsEatThenParseType(o.eq), this.finishNode(t, "TSTypeParameter");
			}, b.tsParseTypeParameters = function(e) {
				var t = this.startNode();
				this.tsMatchLeftRelational() || this.matchJsx("jsxTagStart") ? this.next() : this.unexpected();
				var n = { value: -1 };
				return t.params = this.tsParseBracketedList("TypeParametersOrArguments", this.tsParseTypeParameter.bind(this, e), !1, !0, n), t.params.length === 0 && this.raise(this.start, J.EmptyTypeParameters), n.value !== -1 && this.addExtra(t, "trailingComma", n.value), this.finishNode(t, "TSTypeParameterDeclaration");
			}, b.tsTryParseTypeParameters = function(e) {
				if (this.tsMatchLeftRelational()) return this.tsParseTypeParameters(e);
			}, b.tsTryParse = function(e) {
				var t = this.getCurLookaheadState(), n = e();
				return n !== void 0 && !1 !== n ? n : void this.setLookaheadState(t);
			}, b.tsTokenCanFollowModifier = function() {
				return (this.match(o.bracketL) || this.match(o.braceL) || this.match(o.star) || this.match(o.ellipsis) || this.match(o.privateId) || this.isLiteralPropertyName()) && !this.hasPrecedingLineBreak();
			}, b.tsNextTokenCanFollowModifier = function() {
				return this.next(!0), this.tsTokenCanFollowModifier();
			}, b.tsParseModifier = function(e, t) {
				if (v(this.type) || this.type === o._in) {
					var n = this.value;
					if (e.indexOf(n) !== -1 && !this.containsEsc) {
						if (t && this.tsIsStartOfStaticBlocks()) return;
						if (this.tsTryParse(this.tsNextTokenCanFollowModifier.bind(this))) return n;
					}
				}
			}, b.tsParseModifiersByMap = function(e) {
				for (var t = e.modified, n = e.map, r = 0, i = Object.keys(n); r < i.length; r++) {
					var a = i[r];
					t[a] = n[a];
				}
			}, b.tsParseModifiers = function(e) {
				for (var t = this, n = e.modified, r = e.allowedModifiers, i = e.disallowedModifiers, a = e.stopOnStartOfClassStaticBlock, o = e.errorTemplate, s = o === void 0 ? J.InvalidModifierOnTypeMember : o, c = {}, l = function(e, r, i, a) {
					r === i && n[a] && t.raise(e.column, J.InvalidModifiersOrder({ orderedModifiers: [i, a] }));
				}, u = function(e, r, i, a) {
					(n[i] && r === a || n[a] && r === i) && t.raise(e.column, J.IncompatibleModifiers({ modifiers: [i, a] }));
				};;) {
					var d = this.startLoc, f = this.tsParseModifier(r.concat(i ?? []), a);
					if (!f) break;
					xr(f) ? n.accessibility ? this.raise(this.start, J.DuplicateAccessibilityModifier()) : (l(d, f, f, "override"), l(d, f, f, "static"), l(d, f, f, "readonly"), l(d, f, f, "accessor"), c.accessibility = f, n.accessibility = f) : _r(f) ? n[f] ? this.raise(this.start, J.DuplicateModifier({ modifier: f })) : (l(d, f, "in", "out"), c[f] = f, n[f] = !0) : gr(f) ? n[f] ? this.raise(this.start, J.DuplicateModifier({ modifier: f })) : (u(d, f, "accessor", "readonly"), u(d, f, "accessor", "static"), u(d, f, "accessor", "override"), c[f] = f, n[f] = !0) : Object.hasOwnProperty.call(n, f) ? this.raise(this.start, J.DuplicateModifier({ modifier: f })) : (l(d, f, "static", "readonly"), l(d, f, "static", "override"), l(d, f, "override", "readonly"), l(d, f, "abstract", "override"), u(d, f, "declare", "override"), u(d, f, "static", "abstract"), c[f] = f, n[f] = !0), i != null && i.includes(f) && this.raise(this.start, s);
				}
				return c;
			}, b.tsParseInOutModifiers = function(e) {
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
					errorTemplate: J.InvalidModifierOnTypeParameter
				});
			}, b.tsParseTypeArguments = function() {
				var e = this, t = this.startNode();
				return t.params = this.tsInType(function() {
					return e.tsInNoContext(function() {
						return e.expect(o.relational), e.tsParseDelimitedList("TypeParametersOrArguments", e.tsParseType.bind(e));
					});
				}), t.params.length === 0 && this.raise(this.start, J.EmptyTypeArguments), this.exprAllowed = !1, this.expect(o.relational), this.finishNode(t, "TSTypeParameterInstantiation");
			}, b.tsParseHeritageClause = function(e) {
				var t = this, n = this.start, r = this.tsParseDelimitedList("HeritageClauseElement", function() {
					var e = t.startNode();
					return e.expression = t.tsParseEntityName(), t.tsMatchLeftRelational() && (e.typeParameters = t.tsParseTypeArguments()), t.finishNode(e, "TSExpressionWithTypeArguments");
				});
				return r.length || this.raise(n, J.EmptyHeritageClauseType({ token: e })), r;
			}, b.tsParseTypeMemberSemicolon = function() {
				this.eat(o.comma) || this.isLineTerminator() || this.expect(o.semi);
			}, b.tsTryParseAndCatch = function(e) {
				var t = this.tryParse(function(t) {
					return e() || t();
				});
				if (!t.aborted && t.node) return t.error && this.setLookaheadState(t.failState), t.node;
			}, b.tsParseSignatureMember = function(e, t) {
				return this.tsFillSignature(o.colon, t), this.tsParseTypeMemberSemicolon(), this.finishNode(t, e);
			}, b.tsParsePropertyOrMethodSignature = function(e, t) {
				this.eat(o.question) && (e.optional = !0);
				var n = e;
				if (this.match(o.parenL) || this.tsMatchLeftRelational()) {
					t && this.raise(e.start, J.ReadonlyForMethodSignature);
					var r = n;
					r.kind && this.tsMatchLeftRelational() && this.raise(this.start, J.AccesorCannotHaveTypeParameters), this.tsFillSignature(o.colon, r), this.tsParseTypeMemberSemicolon();
					var i = "parameters", a = "typeAnnotation";
					if (r.kind === "get") r[i].length > 0 && (this.raise(this.start, "A 'get' accesor must not have any formal parameters."), this.isThisParam(r[i][0]) && this.raise(this.start, J.AccesorCannotDeclareThisParameter));
					else if (r.kind === "set") {
						if (r[i].length !== 1) this.raise(this.start, "A 'get' accesor must not have any formal parameters.");
						else {
							var s = r[i][0];
							this.isThisParam(s) && this.raise(this.start, J.AccesorCannotDeclareThisParameter), s.type === "Identifier" && s.optional && this.raise(this.start, J.SetAccesorCannotHaveOptionalParameter), s.type === "RestElement" && this.raise(this.start, J.SetAccesorCannotHaveRestParameter);
						}
						r[a] && this.raise(r[a].start, J.SetAccesorCannotHaveReturnType);
					} else r.kind = "method";
					return this.finishNode(r, "TSMethodSignature");
				}
				var c = n;
				t && (c.readonly = !0);
				var l = this.tsTryParseTypeAnnotation();
				return l && (c.typeAnnotation = l), this.tsParseTypeMemberSemicolon(), this.finishNode(c, "TSPropertySignature");
			}, b.tsParseTypeMember = function() {
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
			}, b.tsParseList = function(e, t) {
				for (var n = []; !this.tsIsListTerminator(e);) n.push(t());
				return n;
			}, b.tsParseObjectTypeMembers = function() {
				this.expect(o.braceL);
				var e = this.tsParseList("TypeMembers", this.tsParseTypeMember.bind(this));
				return this.expect(o.braceR), e;
			}, b.tsParseInterfaceDeclaration = function(e, t) {
				if (t === void 0 && (t = {}), this.hasFollowingLineBreak()) return null;
				this.expectContextual("interface"), t.declare && (e.declare = !0), v(this.type) ? (e.id = this.parseIdent(), this.checkLValSimple(e.id, 7)) : (e.id = null, this.raise(this.start, J.MissingInterfaceName)), e.typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutModifiers.bind(this)), this.eat(o._extends) && (e.extends = this.tsParseHeritageClause("extends"));
				var n = this.startNode();
				return n.body = this.tsInType(this.tsParseObjectTypeMembers.bind(this)), e.body = this.finishNode(n, "TSInterfaceBody"), this.finishNode(e, "TSInterfaceDeclaration");
			}, b.tsParseAbstractDeclaration = function(e) {
				if (this.match(o._class)) return e.abstract = !0, this.parseClass(e, !0);
				if (this.ts_isContextual(p.interface)) {
					if (!this.hasFollowingLineBreak()) return e.abstract = !0, this.tsParseInterfaceDeclaration(e);
				} else this.unexpected(e.start);
			}, b.tsIsDeclarationStart = function() {
				return _(this.type);
			}, b.tsParseExpressionStatement = function(t, n) {
				switch (n.name) {
					case "declare":
						var r = this.tsTryParseDeclare(t);
						if (r) return r.declare = !0, r;
						break;
					case "global":
						if (this.match(o.braceL)) {
							e.prototype.enterScope.call(this, ar);
							var i = t;
							return i.global = !0, i.id = n, i.body = this.tsParseModuleBlock(), e.prototype.exitScope.call(this), this.finishNode(i, "TSModuleDeclaration");
						}
						break;
					default: return this.tsParseDeclaration(t, n.name, !1);
				}
			}, b.tsParseModuleReference = function() {
				return this.tsIsExternalModuleReference() ? this.tsParseExternalModuleReference() : this.tsParseEntityName(!1);
			}, b.tsIsExportDefaultSpecifier = function() {
				var e = this.type, t = this.isAsyncFunction(), n = this.isLet();
				if (v(e)) {
					if (t && !this.containsEsc || n) return !1;
					if ((e === p.type || e === p.interface) && !this.containsEsc) {
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
			}, b.tsInAmbientContext = function(e) {
				var t = this.isAmbientContext;
				this.isAmbientContext = !0;
				try {
					return e();
				} finally {
					this.isAmbientContext = t;
				}
			}, b.tsCheckLineTerminator = function(e) {
				return e ? !this.hasFollowingLineBreak() && (this.next(), !0) : !this.isLineTerminator();
			}, b.tsParseModuleOrNamespaceDeclaration = function(t, n) {
				if (n === void 0 && (n = !1), t.id = this.parseIdent(), n || this.checkLValSimple(t.id, 8), this.eat(o.dot)) {
					var r = this.startNode();
					this.tsParseModuleOrNamespaceDeclaration(r, !0), t.body = r;
				} else e.prototype.enterScope.call(this, ar), t.body = this.tsParseModuleBlock(), e.prototype.exitScope.call(this);
				return this.finishNode(t, "TSModuleDeclaration");
			}, b.checkLValSimple = function(t, n, r) {
				return n === void 0 && (n = 0), e.prototype.checkLValSimple.call(this, t, n, r);
			}, b.tsParseTypeAliasDeclaration = function(e) {
				var t = this;
				return e.id = this.parseIdent(), this.checkLValSimple(e.id, 6), e.typeAnnotation = this.tsInType(function() {
					if (e.typeParameters = t.tsTryParseTypeParameters(t.tsParseInOutModifiers.bind(t)), t.expect(o.eq), t.ts_isContextual(p.interface) && t.lookahead().type !== o.dot) {
						var n = t.startNode();
						return t.next(), t.finishNode(n, "TSIntrinsicKeyword");
					}
					return t.tsParseType();
				}), this.semicolon(), this.finishNode(e, "TSTypeAliasDeclaration");
			}, b.tsParseDeclaration = function(e, t, n) {
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
			}, b.tsTryParseExportDeclaration = function() {
				return this.tsParseDeclaration(this.startNode(), this.value, !0);
			}, b.tsParseImportEqualsDeclaration = function(t, n) {
				t.isExport = n || !1, t.id = this.parseIdent(), this.checkLValSimple(t.id, 2), e.prototype.expect.call(this, o.eq);
				var r = this.tsParseModuleReference();
				return t.importKind === "type" && r.type !== "TSExternalModuleReference" && this.raise(r.start, J.ImportAliasHasImportType), t.moduleReference = r, e.prototype.semicolon.call(this), this.finishNode(t, "TSImportEqualsDeclaration");
			}, b.isExportDefaultSpecifier = function() {
				if (this.tsIsDeclarationStart()) return !1;
				var e = this.type;
				if (v(e)) {
					if (this.isContextual("async") || this.isContextual("let")) return !1;
					if ((e === p.type || e === p.interface) && !this.containsEsc) {
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
			}, b.parseTemplate = function(e) {
				var t = (e === void 0 ? {} : e).isTagged, n = t !== void 0 && t, r = this.startNode();
				this.next(), r.expressions = [];
				var i = this.parseTemplateElement({ isTagged: n });
				for (r.quasis = [i]; !i.tail;) this.type === o.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(o.dollarBraceL), r.expressions.push(this.inType ? this.tsParseType() : this.parseExpression()), this.expect(o.braceR), r.quasis.push(i = this.parseTemplateElement({ isTagged: n }));
				return this.next(), this.finishNode(r, "TemplateLiteral");
			}, b.parseFunction = function(e, t, n, r, i) {
				this.initFunction(e), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !r) && (this.type === o.star && 2 & t && this.unexpected(), e.generator = this.eat(o.star)), this.options.ecmaVersion >= 8 && (e.async = !!r), 1 & t && (e.id = 4 & t && this.type !== o.name ? null : this.parseIdent());
				var a = this.yieldPos, s = this.awaitPos, c = this.awaitIdentPos, l = this.maybeInArrowParameters;
				this.maybeInArrowParameters = !1, this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(vr(e.async, e.generator)), 1 & t || (e.id = this.type === o.name ? this.parseIdent() : null), this.parseFunctionParams(e);
				var u = 1 & t;
				return this.parseFunctionBody(e, n, !1, i, { isFunctionDeclaration: u }), this.yieldPos = a, this.awaitPos = s, this.awaitIdentPos = c, 1 & t && e.id && !(2 & t) && this.checkLValSimple(e.id, e.body ? this.strict || e.generator || e.async ? this.treatFunctionsAsVar ? 1 : 2 : 3 : 0), this.maybeInArrowParameters = l, this.finishNode(e, u ? "FunctionDeclaration" : "FunctionExpression");
			}, b.parseFunctionBody = function(t, n, r, i, a) {
				n === void 0 && (n = !1), r === void 0 && (r = !1), i === void 0 && (i = !1), this.match(o.colon) && (t.returnType = this.tsParseTypeOrTypePredicateAnnotation(o.colon));
				var s = a != null && a.isFunctionDeclaration ? "TSDeclareFunction" : a != null && a.isClassMethod ? "TSDeclareMethod" : void 0;
				return s && !this.match(o.braceL) && this.isLineTerminator() ? this.finishNode(t, s) : s === "TSDeclareFunction" && this.isAmbientContext && (this.raise(t.start, J.DeclareFunctionHasImplementation), t.declare) ? (e.prototype.parseFunctionBody.call(this, t, n, r, !1), this.finishNode(t, s)) : (e.prototype.parseFunctionBody.call(this, t, n, r, i), t);
			}, b.parseNew = function() {
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
			}, b.parseExprOp = function(t, n, r, i, s) {
				var c;
				if (o._in.binop > i && !this.hasPrecedingLineBreak() && (this.isContextual("as") && (c = "TSAsExpression"), a && this.isContextual("satisfies") && (c = "TSSatisfiesExpression"), c)) {
					var l = this.startNodeAt(n, r);
					return l.expression = t, l.typeAnnotation = this.tsTryNextParseConstantContext() || this.tsNextThenParseType(), this.finishNode(l, c), this.reScan_lt_gt(), this.parseExprOp(l, n, r, i, s);
				}
				return e.prototype.parseExprOp.call(this, t, n, r, i, s);
			}, b.parseImportSpecifiers = function() {
				var e = [], t = !0;
				if (i.tokenIsIdentifier(this.type) && (e.push(this.parseImportDefaultSpecifier()), !this.eat(o.comma))) return e;
				if (this.type === o.star) return e.push(this.parseImportNamespaceSpecifier()), e;
				for (this.expect(o.braceL); !this.eat(o.braceR);) {
					if (t) t = !1;
					else if (this.expect(o.comma), this.afterTrailingComma(o.braceR)) break;
					e.push(this.parseImportSpecifier());
				}
				return e;
			}, b.parseImport = function(e) {
				var t = this.lookahead();
				if (e.importKind = "value", this.importOrExportOuterKind = "value", v(t.type) || this.match(o.star) || this.match(o.braceL)) {
					var n = this.lookahead(2);
					if (n.type !== o.comma && !this.isContextualWithState("from", n) && n.type !== o.eq && this.ts_eatContextualWithState("type", 1, t) && (this.importOrExportOuterKind = "type", e.importKind = "type", t = this.lookahead(), n = this.lookahead(2)), v(t.type) && n.type === o.eq) {
						this.next();
						var r = this.tsParseImportEqualsDeclaration(e);
						return this.importOrExportOuterKind = "value", r;
					}
				}
				return this.next(), this.type === o.string ? (e.specifiers = [], e.source = this.parseExprAtom()) : (e.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), e.source = this.type === o.string ? this.parseExprAtom() : this.unexpected()), this.parseMaybeImportAttributes(e), this.semicolon(), this.finishNode(e, "ImportDeclaration"), this.importOrExportOuterKind = "value", e.importKind === "type" && e.specifiers.length > 1 && e.specifiers[0].type === "ImportDefaultSpecifier" && this.raise(e.start, J.TypeImportCannotSpecifyDefaultAndNamed), e;
			}, b.parseExportDefaultDeclaration = function() {
				if (this.isAbstractClass()) {
					var t = this.startNode();
					return this.next(), t.abstract = !0, this.parseClass(t, !0);
				}
				if (this.match(p.interface)) {
					var n = this.tsParseInterfaceDeclaration(this.startNode());
					if (n) return n;
				}
				return e.prototype.parseExportDefaultDeclaration.call(this);
			}, b.parseExportAllDeclaration = function(e, t) {
				return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (e.exported = this.parseModuleExportName(), this.checkExport(t, e.exported, this.lastTokStart)) : e.exported = null), this.expectContextual("from"), this.type !== o.string && this.unexpected(), e.source = this.parseExprAtom(), this.parseMaybeImportAttributes(e), this.semicolon(), this.finishNode(e, "ExportAllDeclaration");
			}, b.parseDynamicImport = function(e) {
				if (this.next(), e.source = this.parseMaybeAssign(), this.eat(o.comma) && (e.arguments = [this.parseExpression()]), !this.eat(o.parenR)) {
					var t = this.start;
					this.eat(o.comma) && this.eat(o.parenR) ? this.raiseRecoverable(t, "Trailing comma is not allowed in import()") : this.unexpected(t);
				}
				return this.finishNode(e, "ImportExpression");
			}, b.parseExport = function(e, t) {
				var n = this.lookahead();
				if (this.ts_eatWithState(o._import, 2, n)) {
					this.ts_isContextual(p.type) && this.lookaheadCharCode() !== 61 ? (e.importKind = "type", this.importOrExportOuterKind = "type", this.next()) : (e.importKind = "value", this.importOrExportOuterKind = "value");
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
				if (this.ts_isContextualWithState(n, p.type) && this.lookahead(2).type === o.braceL ? (this.next(), this.importOrExportOuterKind = "type", e.exportKind = "type") : (this.importOrExportOuterKind = "value", e.exportKind = "value"), this.next(), this.eat(o.star)) return this.parseExportAllDeclaration(e, t);
				if (this.eat(o._default)) return this.checkExport(t, "default", this.lastTokStart), e.declaration = this.parseExportDefaultDeclaration(), this.finishNode(e, "ExportDefaultDeclaration");
				if (this.shouldParseExportStatement()) e.declaration = this.parseExportDeclaration(e), e.declaration.type === "VariableDeclaration" ? this.checkVariableExport(t, e.declaration.declarations) : this.checkExport(t, e.declaration.id, e.declaration.id.start), e.specifiers = [], e.source = null;
				else {
					if (e.declaration = null, e.specifiers = this.parseExportSpecifiers(t), this.eatContextual("from")) this.type !== o.string && this.unexpected(), e.source = this.parseExprAtom(), this.parseMaybeImportAttributes(e);
					else {
						for (var s, c = nr(e.specifiers); !(s = c()).done;) {
							var l = s.value;
							this.checkUnreserved(l.local), this.checkLocalExport(l.local), l.local.type === "Literal" && this.raise(l.local.start, "A string literal cannot be used as an exported binding without `from`.");
						}
						e.source = null;
					}
					this.semicolon();
				}
				return this.finishNode(e, "ExportNamedDeclaration");
			}, b.checkExport = function(e, t, n) {
				e && (typeof t != "string" && (t = t.type === "Identifier" ? t.name : t.value), e[t] = !0);
			}, b.parseMaybeDefault = function(t, n, r) {
				var i = e.prototype.parseMaybeDefault.call(this, t, n, r);
				return i.type === "AssignmentPattern" && i.typeAnnotation && i.right.start < i.typeAnnotation.start && this.raise(i.typeAnnotation.start, J.TypeAnnotationAfterAssign), i;
			}, b.typeCastToParameter = function(e) {
				return e.expression.typeAnnotation = e.typeAnnotation, this.resetEndLocation(e.expression, e.typeAnnotation.end), e.expression;
			}, b.toAssignableList = function(t, n) {
				for (var r = 0; r < t.length; r++) {
					var i = t[r];
					i?.type === "TSTypeCastExpression" && (t[r] = this.typeCastToParameter(i));
				}
				return e.prototype.toAssignableList.call(this, t, n);
			}, b.reportReservedArrowTypeParam = function(e) {}, b.parseExprAtom = function(t, n, r) {
				if (this.type === p.jsxText) return this.jsx_parseText();
				if (this.type === p.jsxTagStart) return this.jsx_parseElement();
				if (this.type === p.at) return this.parseDecorators(), this.parseExprAtom();
				if (v(this.type)) {
					var i = this.potentialArrowAt === this.start, a = this.start, s = this.startLoc, c = this.containsEsc, l = this.parseIdent(!1);
					if (this.options.ecmaVersion >= 8 && !c && l.name === "async" && !this.canInsertSemicolon() && this.eat(o._function)) return this.overrideContext(d.f_expr), this.parseFunction(this.startNodeAt(a, s), 0, !1, !0, n);
					if (i && !this.canInsertSemicolon()) {
						if (this.eat(o.arrow)) return this.parseArrowExpression(this.startNodeAt(a, s), [l], !1, n);
						if (this.options.ecmaVersion >= 8 && l.name === "async" && this.type === o.name && !c && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) return l = this.parseIdent(!1), !this.canInsertSemicolon() && this.eat(o.arrow) || this.unexpected(), this.parseArrowExpression(this.startNodeAt(a, s), [l], !0, n);
					}
					return l;
				}
				return e.prototype.parseExprAtom.call(this, t, n, r);
			}, b.parseExprAtomDefault = function() {
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
			}, b.parseIdentNode = function() {
				var t = this.startNode();
				return te(this.type) ? (t.name = this.value, t) : e.prototype.parseIdentNode.call(this);
			}, b.parseVarStatement = function(t, n, r) {
				r === void 0 && (r = !1);
				var i = this.isAmbientContext;
				this.next(), e.prototype.parseVar.call(this, t, !1, n, r || i), this.semicolon();
				var a = this.finishNode(t, "VariableDeclaration");
				if (!i) return a;
				for (var o, s = nr(a.declarations); !(o = s()).done;) {
					var c = o.value, l = c.init;
					l && (n !== "const" || c.id.typeAnnotation ? this.raise(l.start, J.InitializerNotAllowedInAmbientContext) : l.type !== "StringLiteral" && l.type !== "BooleanLiteral" && l.type !== "NumericLiteral" && l.type !== "BigIntLiteral" && (l.type !== "TemplateLiteral" || l.expressions.length > 0) && !yr(l) && this.raise(l.start, J.ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference));
				}
				return a;
			}, b.parseStatement = function(t, n, r) {
				if (this.match(p.at) && this.parseDecorators(!0), this.match(o._const) && this.isLookaheadContextual("enum")) {
					var i = this.startNode();
					return this.expect(o._const), this.tsParseEnumDeclaration(i, { const: !0 });
				}
				if (this.ts_isContextual(p.enum)) return this.tsParseEnumDeclaration(this.startNode());
				if (this.ts_isContextual(p.interface)) {
					var a = this.tsParseInterfaceDeclaration(this.startNode());
					if (a) return a;
				}
				return e.prototype.parseStatement.call(this, t, n, r);
			}, b.parseAccessModifier = function() {
				return this.tsParseModifier([
					"public",
					"protected",
					"private"
				]);
			}, b.parsePostMemberNameModifiers = function(e) {
				this.eat(o.question) && (e.optional = !0), e.readonly && this.match(o.parenL) && this.raise(e.start, J.ClassMethodHasReadonly), e.declare && this.match(o.parenL) && this.raise(e.start, J.ClassMethodHasDeclare);
			}, b.parseExpressionStatement = function(t, n) {
				return (n.type === "Identifier" ? this.tsParseExpressionStatement(t, n) : void 0) || e.prototype.parseExpressionStatement.call(this, t, n);
			}, b.shouldParseExportStatement = function() {
				return !!this.tsIsDeclarationStart() || !!this.match(p.at) || e.prototype.shouldParseExportStatement.call(this);
			}, b.parseConditional = function(e, t, n, r, i) {
				if (this.eat(o.question)) {
					var a = this.startNodeAt(t, n);
					return a.test = e, a.consequent = this.parseMaybeAssign(), this.expect(o.colon), a.alternate = this.parseMaybeAssign(r), this.finishNode(a, "ConditionalExpression");
				}
				return e;
			}, b.parseMaybeConditional = function(e, t) {
				var n = this, r = this.start, i = this.startLoc, a = this.parseExprOps(e, t);
				if (this.checkExpressionErrors(t)) return a;
				if (!this.maybeInArrowParameters || !this.match(o.question)) return this.parseConditional(a, r, i, e, t);
				var s = this.tryParse(function() {
					return n.parseConditional(a, r, i, e, t);
				});
				return s.node ? (s.error && this.setLookaheadState(s.failState), s.node) : (s.error && this.setOptionalParametersError(t, s.error), a);
			}, b.parseParenItem = function(t) {
				var n = this.start, r = this.startLoc;
				if (t = e.prototype.parseParenItem.call(this, t), this.eat(o.question) && (t.optional = !0, this.resetEndLocation(t)), this.match(o.colon)) {
					var i = this.startNodeAt(n, r);
					return i.expression = t, i.typeAnnotation = this.tsParseTypeAnnotation(), this.finishNode(i, "TSTypeCastExpression");
				}
				return t;
			}, b.parseExportDeclaration = function(e) {
				var t = this;
				if (!this.isAmbientContext && this.ts_isContextual(p.declare)) return this.tsInAmbientContext(function() {
					return t.parseExportDeclaration(e);
				});
				var n = this.start, r = this.startLoc, i = this.eatContextual("declare");
				!i || !this.ts_isContextual(p.declare) && this.shouldParseExportStatement() || this.raise(this.start, J.ExpectedAmbientAfterExportDeclare);
				var a = v(this.type) && this.tsTryParseExportDeclaration() || this.parseStatement(null);
				return a ? ((a.type === "TSInterfaceDeclaration" || a.type === "TSTypeAliasDeclaration" || i) && (e.exportKind = "type"), i && (this.resetStartLocation(a, n, r), a.declare = !0), a) : null;
			}, b.parseClassId = function(t, n) {
				if (n || !this.isContextual("implements")) {
					e.prototype.parseClassId.call(this, t, n);
					var r = this.tsTryParseTypeParameters(this.tsParseInOutModifiers.bind(this));
					r && (t.typeParameters = r);
				}
			}, b.parseClassPropertyAnnotation = function(e) {
				e.optional || (this.value === "!" && this.eat(o.prefix) ? e.definite = !0 : this.eat(o.question) && (e.optional = !0));
				var t = this.tsTryParseTypeAnnotation();
				t && (e.typeAnnotation = t);
			}, b.parseClassField = function(t) {
				if (t.key.type === "PrivateIdentifier") t.abstract && this.raise(t.start, J.PrivateElementHasAbstract), t.accessibility && this.raise(t.start, J.PrivateElementHasAccessibility({ modifier: t.accessibility })), this.parseClassPropertyAnnotation(t);
				else if (this.parseClassPropertyAnnotation(t), this.isAmbientContext && (!t.readonly || t.typeAnnotation) && this.match(o.eq) && this.raise(this.start, J.DeclareClassFieldHasInitializer), t.abstract && this.match(o.eq)) {
					var n = t.key;
					this.raise(this.start, J.AbstractPropertyHasInitializer({ propertyName: n.type !== "Identifier" || t.computed ? "[" + this.input.slice(n.start, n.end) + "]" : n.name }));
				}
				return e.prototype.parseClassField.call(this, t);
			}, b.parseClassMethod = function(e, t, n, r) {
				var i = e.kind === "constructor", a = e.key.type === "PrivateIdentifier", o = this.tsTryParseTypeParameters();
				a ? (o && (e.typeParameters = o), e.accessibility && this.raise(e.start, J.PrivateMethodsHasAccessibility({ modifier: e.accessibility }))) : o && i && this.raise(o.start, J.ConstructorHasTypeParameters);
				var s = e.declare, c = e.kind;
				!(s !== void 0 && s) || c !== "get" && c !== "set" || this.raise(e.start, J.DeclareAccessor({ kind: c })), o && (e.typeParameters = o);
				var l = e.key;
				e.kind === "constructor" ? (t && this.raise(l.start, "Constructor can't be a generator"), n && this.raise(l.start, "Constructor can't be an async method")) : e.static && lr(e, "prototype") && this.raise(l.start, "Classes may not have a static property named prototype");
				var u = e.value = this.parseMethod(t, n, r, !0, e);
				return e.kind === "get" && u.params.length !== 0 && this.raiseRecoverable(u.start, "getter should have no params"), e.kind === "set" && u.params.length !== 1 && this.raiseRecoverable(u.start, "setter should have exactly one param"), e.kind === "set" && u.params[0].type === "RestElement" && this.raiseRecoverable(u.params[0].start, "Setter cannot use rest params"), this.finishNode(e, "MethodDefinition");
			}, b.isClassMethod = function() {
				return this.match(o.relational);
			}, b.parseClassElement = function(t) {
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
					errorTemplate: J.InvalidModifierOnTypeParameterPositions
				}).static;
				var f = function() {
					if (!n.tsIsStartOfStaticBlocks()) {
						var f = n.tsTryParseIndexSignature(a);
						if (f) return a.abstract && n.raise(a.start, J.IndexSignatureHasAbstract), a.accessibility && n.raise(a.start, J.IndexSignatureHasAccessibility({ modifier: a.accessibility })), a.declare && n.raise(a.start, J.IndexSignatureHasDeclare), a.override && n.raise(a.start, J.IndexSignatureHasOverride), f;
						if (!n.inAbstractClass && a.abstract && n.raise(a.start, J.NonAbstractClassHasAbstractMethod), a.override && t && n.raise(a.start, J.OverrideNotInSubClass), a.static = r, r && (n.isClassElementNameStart() || n.type === o.star || (s = "static")), !s && i >= 8 && n.eatContextual("async") && (!n.isClassElementNameStart() && n.type !== o.star || n.canInsertSemicolon() ? s = "async" : l = !0), !s && (i >= 9 || !l) && n.eat(o.star) && (c = !0), !s && !l && !c) {
							var p = n.value;
							(n.eatContextual("get") || n.eatContextual("set")) && (n.isClassElementNameStart() ? u = p : s = p);
						}
						if (s ? (a.computed = !1, a.key = n.startNodeAt(n.lastTokStart, n.lastTokStartLoc), a.key.name = s, n.finishNode(a.key, "Identifier")) : n.parseClassElementName(a), n.parsePostMemberNameModifiers(a), n.isClassMethod() || i < 13 || n.type === o.parenL || u !== "method" || c || l) {
							var m = !a.static && lr(a, "constructor"), h = m && t;
							m && u !== "method" && n.raise(a.key.start, "Constructor can't have get/set modifier"), a.kind = m ? "constructor" : u, n.parseClassMethod(a, c, l, h);
						} else n.parseClassField(a);
						return a;
					}
					if (n.next(), n.next(), n.tsHasSomeModifiers(a, d) && n.raise(n.start, J.StaticBlockCannotHaveModifier), i >= 13) return e.prototype.parseClassStaticBlock.call(n, a), a;
				};
				return a.declare ? this.tsInAmbientContext(f) : f(), a;
			}, b.isClassElementNameStart = function() {
				return !!this.tsIsIdentifier() || e.prototype.isClassElementNameStart.call(this);
			}, b.parseClassSuper = function(t) {
				e.prototype.parseClassSuper.call(this, t), t.superClass && (this.tsMatchLeftRelational() || this.match(o.bitShift)) && (t.superTypeParameters = this.tsParseTypeArgumentsInExpression()), this.eatContextual("implements") && (t.implements = this.tsParseHeritageClause("implements"));
			}, b.parseFunctionParams = function(t) {
				var n = this.tsTryParseTypeParameters();
				n && (t.typeParameters = n), e.prototype.parseFunctionParams.call(this, t);
			}, b.parseVarId = function(t, n) {
				e.prototype.parseVarId.call(this, t, n), t.id.type === "Identifier" && !this.hasPrecedingLineBreak() && this.value === "!" && this.eat(o.prefix) && (t.definite = !0);
				var r = this.tsTryParseTypeAnnotation();
				r && (t.id.typeAnnotation = r, this.resetEndLocation(t.id));
			}, b.parseArrowExpression = function(e, t, n, r) {
				this.match(o.colon) && (e.returnType = this.tsParseTypeAnnotation());
				var i = this.yieldPos, a = this.awaitPos, s = this.awaitIdentPos;
				this.enterScope(16 | vr(n, !1)), this.initFunction(e);
				var c = this.maybeInArrowParameters;
				return this.options.ecmaVersion >= 8 && (e.async = !!n), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.maybeInArrowParameters = !0, e.params = this.toAssignableList(t, !0), this.maybeInArrowParameters = !1, this.parseFunctionBody(e, !0, !1, r), this.yieldPos = i, this.awaitPos = a, this.awaitIdentPos = s, this.maybeInArrowParameters = c, this.finishNode(e, "ArrowFunctionExpression");
			}, b.parseMaybeAssignOrigin = function(e, t, n) {
				if (this.isContextual("yield")) {
					if (this.inGenerator) return this.parseYield(e);
					this.exprAllowed = !1;
				}
				var r = !1, i = -1, a = -1, s = -1;
				t ? (i = t.parenthesizedAssign, a = t.trailingComma, s = t.doubleProto, t.parenthesizedAssign = t.trailingComma = -1) : (t = new sr(), r = !0);
				var c = this.start, l = this.startLoc;
				(this.type === o.parenL || v(this.type)) && (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = e === "await");
				var u = this.parseMaybeConditional(e, t);
				if (n && (u = n.call(this, u, c, l)), this.type.isAssign) {
					var d = this.startNodeAt(c, l);
					return d.operator = this.value, this.type === o.eq && (u = this.toAssignable(u, !0, t)), r || (t.parenthesizedAssign = t.trailingComma = t.doubleProto = -1), t.shorthandAssign >= u.start && (t.shorthandAssign = -1), this.type === o.eq ? this.checkLValPattern(u) : this.checkLValSimple(u), d.left = u, this.next(), d.right = this.parseMaybeAssign(e), s > -1 && (t.doubleProto = s), this.finishNode(d, "AssignmentExpression");
				}
				return r && this.checkExpressionErrors(t, !0), i > -1 && (t.parenthesizedAssign = i), a > -1 && (t.trailingComma = a), u;
			}, b.parseMaybeAssign = function(e, t, n) {
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
				if (!u && (hr(!0), !(d = this.tryParse(function() {
					return p.parseMaybeAssignOrigin(e, t, n);
				}, l)).error)) return d.node;
				if ((a = u) != null && a.node) return this.setLookaheadState(u.failState), u.node;
				if (g.node) return this.setLookaheadState(g.failState), f && this.reportReservedArrowTypeParam(f), g.node;
				if ((o = d) != null && o.node) return this.setLookaheadState(d.failState), d.node;
				throw (s = u) != null && s.thrown ? u.error : g.thrown ? g.error : (c = d) != null && c.thrown ? d.error : u?.error || g.error || d?.error;
			}, b.parseAssignableListItem = function(e) {
				for (var t = []; this.match(p.at);) t.push(this.parseDecorator());
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
					}), n = s.accessibility, o = s.override, a = s.readonly, !1 === e && (n || a || o) && this.raise(i.start, J.UnexpectedParameterModifier);
				}
				var c = this.parseMaybeDefault(r, i);
				this.parseBindingListItem(c);
				var l = this.parseMaybeDefault(c.start, c.loc, c);
				if (t.length && (l.decorators = t), n || a || o) {
					var u = this.startNodeAt(r, i);
					return n && (u.accessibility = n), a && (u.readonly = a), o && (u.override = o), l.type !== "Identifier" && l.type !== "AssignmentPattern" && this.raise(u.start, J.UnsupportedParameterPropertyKind), u.parameter = l, this.finishNode(u, "TSParameterProperty");
				}
				return l;
			}, b.checkLValInnerPattern = function(t, n, r) {
				n === void 0 && (n = 0), t.type === "TSParameterProperty" ? this.checkLValInnerPattern(t.parameter, n, r) : e.prototype.checkLValInnerPattern.call(this, t, n, r);
			}, b.parseBindingListItem = function(e) {
				this.eat(o.question) && (e.type === "Identifier" || this.isAmbientContext || this.inType || this.raise(e.start, J.PatternIsOptional), e.optional = !0);
				var t = this.tsTryParseTypeAnnotation();
				return t && (e.typeAnnotation = t), this.resetEndLocation(e), e;
			}, b.isAssignable = function(e, t) {
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
			}, b.toAssignable = function(t, n, r) {
				switch (n === void 0 && (n = !1), r === void 0 && (r = new sr()), t.type) {
					case "ParenthesizedExpression": return this.toAssignableParenthesizedExpression(t, n, r);
					case "TSAsExpression":
					case "TSSatisfiesExpression":
					case "TSNonNullExpression":
					case "TSTypeAssertion": return n || this.raise(t.start, J.UnexpectedTypeCastInParameter), this.toAssignable(t.expression, n, r);
					case "MemberExpression": break;
					case "AssignmentExpression": return n || t.left.type !== "TSTypeCastExpression" || (t.left = this.typeCastToParameter(t.left)), e.prototype.toAssignable.call(this, t, n, r);
					case "TSTypeCastExpression": return this.typeCastToParameter(t);
					default: return e.prototype.toAssignable.call(this, t, n, r);
				}
				return t;
			}, b.toAssignableParenthesizedExpression = function(t, n, r) {
				switch (t.expression.type) {
					case "TSAsExpression":
					case "TSSatisfiesExpression":
					case "TSNonNullExpression":
					case "TSTypeAssertion":
					case "ParenthesizedExpression": return this.toAssignable(t.expression, n, r);
					default: return e.prototype.toAssignable.call(this, t, n, r);
				}
			}, b.curPosition = function() {
				if (this.options.locations) {
					var t = e.prototype.curPosition.call(this);
					return Object.defineProperty(t, "offset", { get: function() {
						return function(e) {
							var t = new n.Position(this.line, this.column + e);
							return t.index = this.index + e, t;
						};
					} }), t.index = this.pos, t;
				}
			}, b.parseBindingAtom = function() {
				return this.type === o._this ? this.parseIdent(!0) : e.prototype.parseBindingAtom.call(this);
			}, b.shouldParseArrow = function(e) {
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
			}, b.parseParenArrowList = function(e, t, n, r) {
				var i = this.startNodeAt(e, t);
				return i.returnType = this.shouldParseArrowReturnType, this.shouldParseArrowReturnType = void 0, this.parseArrowExpression(i, n, !1, r);
			}, b.parseParenAndDistinguishExpression = function(e, t) {
				var n, r = this.start, i = this.startLoc, a = this.options.ecmaVersion >= 8;
				if (this.options.ecmaVersion >= 6) {
					var s = this.maybeInArrowParameters;
					this.maybeInArrowParameters = !0, this.next();
					var c, l = this.start, u = this.startLoc, d = [], f = !0, p = !1, m = new sr(), h = this.yieldPos, g = this.awaitPos;
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
					var ee = this.lastTokEnd, _ = this.lastTokEndLoc;
					if (this.expect(o.parenR), this.maybeInArrowParameters = s, e && this.shouldParseArrow(d) && this.eat(o.arrow)) return this.checkPatternErrors(m, !1), this.checkYieldAwaitInDefaultParams(), this.yieldPos = h, this.awaitPos = g, this.parseParenArrowList(r, i, d, t);
					d.length && !p || this.unexpected(this.lastTokStart), c && this.unexpected(c), this.checkExpressionErrors(m, !0), this.yieldPos = h || this.yieldPos, this.awaitPos = g || this.awaitPos, d.length > 1 ? ((n = this.startNodeAt(l, u)).expressions = d, this.finishNodeAt(n, "SequenceExpression", ee, _)) : n = d[0];
				} else n = this.parseParenExpression();
				if (this.options.preserveParens) {
					var v = this.startNodeAt(r, i);
					return v.expression = n, this.finishNode(v, "ParenthesizedExpression");
				}
				return n;
			}, b.parseTaggedTemplateExpression = function(e, t, n, r) {
				var i = this.startNodeAt(t, n);
				return i.tag = e, i.quasi = this.parseTemplate({ isTagged: !0 }), r && this.raise(t, "Tagged Template Literals are not allowed in optionalChain."), this.finishNode(i, "TaggedTemplateExpression");
			}, b.shouldParseAsyncArrow = function() {
				var e = this;
				if (!this.match(o.colon)) return !this.canInsertSemicolon() && this.eat(o.arrow);
				var t = this.tryParse(function(t) {
					var n = e.tsParseTypeOrTypePredicateAnnotation(o.colon);
					return !e.canInsertSemicolon() && e.match(o.arrow) || t(), n;
				});
				return t.aborted ? (this.shouldParseAsyncArrowReturnType = void 0, !1) : t.thrown ? void 0 : (t.error && this.setLookaheadState(t.failState), this.shouldParseAsyncArrowReturnType = t.node, !this.canInsertSemicolon() && this.eat(o.arrow));
			}, b.parseSubscriptAsyncArrow = function(e, t, n, r) {
				var i = this.startNodeAt(e, t);
				return i.returnType = this.shouldParseAsyncArrowReturnType, this.shouldParseAsyncArrowReturnType = void 0, this.parseArrowExpression(i, n, !0, r);
			}, b.parseExprList = function(e, t, n, r) {
				for (var i = [], a = !0; !this.eat(e);) {
					if (a) a = !1;
					else if (this.expect(o.comma), t && this.afterTrailingComma(e)) break;
					var s = void 0;
					n && this.type === o.comma ? s = null : this.type === o.ellipsis ? (s = this.parseSpread(r), r && this.type === o.comma && r.trailingComma < 0 && (r.trailingComma = this.start)) : s = this.parseMaybeAssign(!1, r, this.parseParenItem), i.push(s);
				}
				return i;
			}, b.parseSubscript = function(e, t, n, r, i, a, s) {
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
							var p = new sr(), m = c.startNodeAt(t, n);
							return m.callee = e, m.arguments = c.parseExprList(o.parenR, c.options.ecmaVersion >= 8, !1, p), c.tsCheckForInvalidTypeCasts(m.arguments), m.typeParameters = a, l && (m.optional = d), c.checkExpressionErrors(p, !0), e = c.finishNode(m, "CallExpression");
						}
						var h = c.type;
						if (!(c.tsMatchRightRelational() || h === o.bitShift || h !== o.parenL && (g = h, g.startsExpr) && !c.hasPrecedingLineBreak())) {
							var g, _ = c.startNodeAt(t, n);
							return _.expression = e, _.typeParameters = a, c.finishNode(_, "TSInstantiationExpression");
						}
					});
					if (f && this.unexpected(f), p) return p.type === "TSInstantiationExpression" && (this.match(o.dot) || this.match(o.questionDot) && this.lookaheadCharCode() !== 40) && this.raise(this.start, J.InvalidPropertyAccessAfterInstantiationExpression), e = p;
				}
				var m = this.options.ecmaVersion >= 11, h = m && this.eat(o.questionDot);
				r && h && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
				var g = this.eat(o.bracketL);
				if (g || h && this.type !== o.parenL && this.type !== o.backQuote || this.eat(o.dot)) {
					var _ = this.startNodeAt(t, n);
					_.object = e, g ? (_.property = this.parseExpression(), this.expect(o.bracketR)) : _.property = this.type === o.privateId && e.type !== "Super" ? this.parsePrivateIdent() : this.parseIdent(this.options.allowReserved !== "never"), _.computed = !!g, m && (_.optional = h), e = this.finishNode(_, "MemberExpression");
				} else if (!r && this.eat(o.parenL)) {
					var v = this.maybeInArrowParameters;
					this.maybeInArrowParameters = !0;
					var te = new sr(), ne = this.yieldPos, re = this.awaitPos, ie = this.awaitIdentPos;
					this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
					var y = this.parseExprList(o.parenR, this.options.ecmaVersion >= 8, !1, te);
					if (i && !h && this.shouldParseAsyncArrow()) this.checkPatternErrors(te, !1), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = ne, this.awaitPos = re, this.awaitIdentPos = ie, e = this.parseSubscriptAsyncArrow(t, n, y, s);
					else {
						this.checkExpressionErrors(te, !0), this.yieldPos = ne || this.yieldPos, this.awaitPos = re || this.awaitPos, this.awaitIdentPos = ie || this.awaitIdentPos;
						var ae = this.startNodeAt(t, n);
						ae.callee = e, ae.arguments = y, m && (ae.optional = h), e = this.finishNode(ae, "CallExpression");
					}
					this.maybeInArrowParameters = v;
				} else if (this.type === o.backQuote) {
					(h || l) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
					var b = this.startNodeAt(t, n);
					b.tag = e, b.quasi = this.parseTemplate({ isTagged: !0 }), e = this.finishNode(b, "TaggedTemplateExpression");
				}
				return e;
			}, b.parseGetterSetter = function(e) {
				e.kind = e.key.name, this.parsePropertyName(e), e.value = this.parseMethod(!1);
				var t = e.kind === "get" ? 0 : 1, n = e.value.params[0], r = n && this.isThisParam(n);
				e.value.params.length === (t = r ? t + 1 : t) ? e.kind === "set" && e.value.params[0].type === "RestElement" && this.raiseRecoverable(e.value.params[0].start, "Setter cannot use rest params") : this.raiseRecoverable(e.value.start, e.kind === "get" ? "getter should have no params" : "setter should have exactly one param");
			}, b.parseProperty = function(t, n) {
				if (!t) {
					var r = [];
					if (this.match(p.at)) for (; this.match(p.at);) r.push(this.parseDecorator());
					var i = e.prototype.parseProperty.call(this, t, n);
					return i.type === "SpreadElement" && r.length && this.raise(i.start, "Decorators can't be used with SpreadElement"), r.length && (i.decorators = r, r = []), i;
				}
				return e.prototype.parseProperty.call(this, t, n);
			}, b.parseCatchClauseParam = function() {
				var e = this.parseBindingAtom(), t = e.type === "Identifier";
				this.enterScope(t ? 32 : 0), this.checkLValPattern(e, t ? 4 : 2);
				var n = this.tsTryParseTypeAnnotation();
				return n && (e.typeAnnotation = n, this.resetEndLocation(e)), this.expect(o.parenR), e;
			}, b.parseClass = function(e, t) {
				var n = this.inAbstractClass;
				this.inAbstractClass = !!e.abstract;
				try {
					this.next(), this.takeDecorators(e);
					var r = this.strict;
					this.strict = !0, this.parseClassId(e, t), this.parseClassSuper(e);
					var i = this.enterClassBody(), a = this.startNode(), s = !1;
					a.body = [];
					var c = [];
					for (this.expect(o.braceL); this.type !== o.braceR;) if (this.match(p.at)) c.push(this.parseDecorator());
					else {
						var l = this.parseClassElement(e.superClass !== null);
						c.length && (l.decorators = c, this.resetStartLocationFromNode(l, c[0]), c = []), l && (a.body.push(l), l.type === "MethodDefinition" && l.kind === "constructor" && l.value.type === "FunctionExpression" ? (s && this.raiseRecoverable(l.start, "Duplicate constructor in the same class"), s = !0, l.decorators && l.decorators.length > 0 && this.raise(l.start, "Decorators can't be used with a constructor. Did you mean '@dec class { ... }'?")) : l.key && l.key.type === "PrivateIdentifier" && cr(i, l) && this.raiseRecoverable(l.key.start, "Identifier '#" + l.key.name + "' has already been declared"));
					}
					return this.strict = r, this.next(), c.length && this.raise(this.start, "Decorators must be attached to a class element."), e.body = this.finishNode(a, "ClassBody"), this.exitClassBody(), this.finishNode(e, t ? "ClassDeclaration" : "ClassExpression");
				} finally {
					this.inAbstractClass = n;
				}
			}, b.parseClassFunctionParams = function() {
				var e = this.tsTryParseTypeParameters(this.tsParseConstModifier), t = this.parseBindingList(o.parenR, !1, this.options.ecmaVersion >= 8, !0);
				return e && (t.typeParameters = e), t;
			}, b.parseMethod = function(e, t, n, r, i) {
				var a = this.startNode(), s = this.yieldPos, c = this.awaitPos, l = this.awaitIdentPos;
				if (this.initFunction(a), this.options.ecmaVersion >= 6 && (a.generator = e), this.options.ecmaVersion >= 8 && (a.async = !!t), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(64 | vr(t, a.generator) | (n ? 128 : 0)), this.expect(o.parenL), a.params = this.parseClassFunctionParams(), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(a, !1, !0, !1, { isClassMethod: r }), this.yieldPos = s, this.awaitPos = c, this.awaitIdentPos = l, i && i.abstract && a.body) {
					var u = i.key;
					this.raise(i.start, J.AbstractMethodHasImplementation({ methodName: u.type !== "Identifier" || i.computed ? "[" + this.input.slice(u.start, u.end) + "]" : u.name }));
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
			}, b.parseImportSpecifier = function() {
				if (this.ts_isContextual(p.type)) {
					var t = this.startNode();
					return t.imported = this.parseModuleExportName(), this.parseTypeOnlyImportExportSpecifier(t, !0, this.importOrExportOuterKind === "type"), this.finishNode(t, "ImportSpecifier");
				}
				var n = e.prototype.parseImportSpecifier.call(this);
				return n.importKind = "value", n;
			}, b.parseExportSpecifier = function(t) {
				var n = this.ts_isContextual(p.type);
				if (!this.match(o.string) && n) {
					var r = this.startNode();
					return r.local = this.parseModuleExportName(), this.parseTypeOnlyImportExportSpecifier(r, !1, this.importOrExportOuterKind === "type"), this.finishNode(r, "ExportSpecifier"), this.checkExport(t, r.exported, r.exported.start), r;
				}
				var i = e.prototype.parseExportSpecifier.call(this, t);
				return i.exportKind = "value", i;
			}, b.parseTypeOnlyImportExportSpecifier = function(t, n, r) {
				var i, a = n ? "imported" : "local", o = n ? "local" : "exported", s = t[a], c = !1, l = !0, u = s.start;
				if (this.isContextual("as")) {
					var d = this.parseIdent();
					if (this.isContextual("as")) {
						var f = this.parseIdent();
						te(this.type) ? (c = !0, s = d, i = n ? this.parseIdent() : this.parseModuleExportName(), l = !1) : (i = f, l = !1);
					} else te(this.type) ? (l = !1, i = n ? this.parseIdent() : this.parseModuleExportName()) : (c = !0, s = d);
				} else te(this.type) && (c = !0, n ? (s = e.prototype.parseIdent.call(this, !0), this.isContextual("as") || this.checkUnreserved(s)) : s = this.parseModuleExportName());
				c && r && this.raise(u, n ? J.TypeModifierIsUsedInTypeImports : J.TypeModifierIsUsedInTypeExports), t[a] = s, t[o] = i, t[n ? "importKind" : "exportKind"] = c ? "type" : "value", l && this.eatContextual("as") && (t[o] = n ? this.parseIdent() : this.parseModuleExportName()), t[o] || (t[o] = this.copyNode(t[a])), n && this.checkLValSimple(t[o], 2);
			}, b.raiseCommonCheck = function(t, n, r) {
				return n === "Comma is not permitted after the rest element" ? this.isAmbientContext && this.match(o.comma) && this.lookaheadCharCode() === 41 ? void this.next() : e.prototype.raise.call(this, t, n) : r ? e.prototype.raiseRecoverable.call(this, t, n) : e.prototype.raise.call(this, t, n);
			}, b.raiseRecoverable = function(e, t) {
				return this.raiseCommonCheck(e, t, !0);
			}, b.raise = function(e, t) {
				return this.raiseCommonCheck(e, t, !0);
			}, b.updateContext = function(t) {
				var n = this.type;
				if (n == o.braceL) {
					var r = this.curContext();
					r == m.tc_oTag ? this.context.push(d.b_expr) : r == m.tc_expr ? this.context.push(d.b_tmpl) : e.prototype.updateContext.call(this, t), this.exprAllowed = !0;
				} else {
					if (n !== o.slash || t !== p.jsxTagStart) return e.prototype.updateContext.call(this, t);
					this.context.length -= 2, this.context.push(m.tc_cTag), this.exprAllowed = !1;
				}
			}, b.jsx_parseOpeningElementAt = function(e, t) {
				var n = this, r = this.startNodeAt(e, t), i = this.jsx_parseElementName();
				if (i && (r.name = i), this.match(o.relational) || this.match(o.bitShift)) {
					var a = this.tsTryParseAndCatch(function() {
						return n.tsParseTypeArgumentsInExpression();
					});
					a && (r.typeParameters = a);
				}
				for (r.attributes = []; this.type !== o.slash && this.type !== p.jsxTagEnd;) r.attributes.push(this.jsx_parseAttribute());
				return r.selfClosing = this.eat(o.slash), this.expect(p.jsxTagEnd), this.finishNode(r, i ? "JSXOpeningElement" : "JSXOpeningFragment");
			}, b.enterScope = function(t) {
				t === ar && this.importsStack.push([]), e.prototype.enterScope.call(this, t);
				var n = e.prototype.currentScope.call(this);
				n.types = [], n.enums = [], n.constEnums = [], n.classes = [], n.exportOnlyBindings = [];
			}, b.exitScope = function() {
				e.prototype.currentScope.call(this).flags === ar && this.importsStack.pop(), e.prototype.exitScope.call(this);
			}, b.hasImport = function(e, t) {
				var n = this.importsStack.length;
				if (this.importsStack[n - 1].indexOf(e) > -1) return !0;
				if (!t && n > 1) {
					for (var r = 0; r < n - 1; r++) if (this.importsStack[r].indexOf(e) > -1) return !0;
				}
				return !1;
			}, b.maybeExportDefined = function(e, t) {
				this.inModule && 1 & e.flags && this.undefinedExports.delete(t);
			}, b.isRedeclaredInScope = function(t, n, r) {
				return !!(0 & r) && (2 & r ? t.lexical.indexOf(n) > -1 || t.functions.indexOf(n) > -1 || t.var.indexOf(n) > -1 : 3 & r ? t.lexical.indexOf(n) > -1 || !e.prototype.treatFunctionsAsVarInScope.call(this, t) && t.var.indexOf(n) > -1 : t.lexical.indexOf(n) > -1 && !(32 & t.flags && t.lexical[0] === n) || !this.treatFunctionsAsVarInScope(t) && t.functions.indexOf(n) > -1);
			}, b.checkRedeclarationInScope = function(e, t, n, r) {
				this.isRedeclaredInScope(e, t, n) && this.raise(r, "Identifier '" + t + "' has already been declared.");
			}, b.declareName = function(t, n, r) {
				if (4096 & n) return this.hasImport(t, !0) && this.raise(r, "Identifier '" + t + "' has already been declared."), void this.importsStack[this.importsStack.length - 1].push(t);
				var i = this.currentScope();
				if (1024 & n) return this.maybeExportDefined(i, t), void i.exportOnlyBindings.push(t);
				e.prototype.declareName.call(this, t, n, r), 0 & n && (0 & n || (this.checkRedeclarationInScope(i, t, n, r), this.maybeExportDefined(i, t)), i.types.push(t)), 256 & n && i.enums.push(t), 512 & n && i.constEnums.push(t), 128 & n && i.classes.push(t);
			}, b.checkLocalExport = function(t) {
				var n = t.name;
				if (!this.hasImport(n)) {
					for (var r = this.scopeStack.length - 1; r >= 0; r--) {
						var i = this.scopeStack[r];
						if (i.types.indexOf(n) > -1 || i.exportOnlyBindings.indexOf(n) > -1) return;
					}
					e.prototype.checkLocalExport.call(this, t);
				}
			}, ie = t, ae = [{
				key: "acornTypeScript",
				get: function() {
					return i;
				}
			}], (y = [{
				key: "acornTypeScript",
				get: function() {
					return i;
				}
			}]) && Zn(ie.prototype, y), ae && Zn(ie, ae), Object.defineProperty(ie, "prototype", { writable: !1 }), t;
		}(t);
	};
}
//#endregion
//#region src/utilities/index.ts
var Cr = [
	{
		idPrefix: "dpuse-app",
		typeId: "app",
		isPublished: !1,
		uploadGroupName: void 0
	},
	{
		idPrefix: "dpuse-api",
		typeId: "api",
		isPublished: !1,
		uploadGroupName: void 0
	},
	{
		idPrefix: "dpuse-connector",
		typeId: "connector",
		isPublished: !0,
		uploadGroupName: "connectors"
	},
	{
		idPrefix: "dpuse-context",
		typeId: "context",
		isPublished: !0,
		uploadGroupName: "contexts"
	},
	{
		idPrefix: "dpuse-development",
		typeId: "development",
		isPublished: !0,
		uploadGroupName: void 0
	},
	{
		idPrefix: "dpuse-engine",
		typeId: "engine",
		isPublished: !1,
		uploadGroupName: "engine"
	},
	{
		idPrefix: "dpuse-presenter",
		typeId: "presenter",
		isPublished: !0,
		uploadGroupName: "presenters"
	},
	{
		idPrefix: "dpuse-resources",
		typeId: "resources",
		isPublished: !1,
		uploadGroupName: void 0
	},
	{
		idPrefix: "dpuse-shared",
		typeId: "shared",
		isPublished: !0,
		uploadGroupName: void 0
	},
	{
		idPrefix: "dpuse-tool",
		typeId: "tool",
		isPublished: !0,
		uploadGroupName: "tools"
	},
	{
		idPrefix: "eslint-config-dpuse",
		typeId: "eslint",
		isPublished: !0,
		uploadGroupName: void 0
	}
], wr = r(i);
async function Tr(e) {
	let r;
	try {
		r = await t.readdir(e, { withFileTypes: !0 });
	} catch (e) {
		if (e.code === "ENOENT") return;
		throw e;
	}
	await Promise.all(r.map(async (r) => {
		let i = n.join(e, r.name);
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
async function Er(e, n) {
	return t.readdir(e, n);
}
async function Y(e, n, r = [], i) {
	let a = `${n} ${r.join(" ")}`;
	e !== void 0 && $(`${e} - exec(${a})`);
	let { stdout: o, stderr: s } = await wr(a);
	i === void 0 ? o.trim() && console.log(o.trim()) : await t.writeFile(i, o.trim(), "utf8"), s.trim() && console.error(s.trim());
}
async function X(e, t, n = [], r = !1, i = !1) {
	return $(`${e} - spawn(${t} ${n.join(" ")})`), new Promise((e, o) => {
		a(t, n, {
			shell: i,
			stdio: "inherit"
		}).on("close", (n) => {
			n === 0 || r ? e() : o(/* @__PURE__ */ Error(`${t} exited with code ${String(n ?? "unknown")}`));
		});
	});
}
async function Z(e) {
	return JSON.parse(await t.readFile(e, "utf8"));
}
async function Dr(e) {
	return await t.readFile(e, "utf8");
}
async function Or(e) {
	try {
		await t.unlink(e);
	} catch (e) {
		if (e.code !== "ENOENT") throw e;
	}
}
async function kr(e, n) {
	await t.writeFile(e, JSON.stringify(n, void 0, 4), "utf8");
}
async function Ar(e, n) {
	await t.writeFile(e, n, "utf8");
}
function Q(e) {
	let t = "─".repeat(Math.max(e.length + 60, 60));
	console.info(`\n[36m${t}`), console.info(`▶️  ${e}`), console.info(`${t}[0m`);
}
function jr(e) {
	console.info(`\n✅ ${e}\n`);
}
function $(e) {
	console.info(`\n${e}\n`);
}
function Mr(e) {
	let t = Cr.find((t) => e.startsWith(t.idPrefix));
	if (!t) throw Error(`Failed to locate module type configuration for identifier '${e}'.`);
	return t;
}
async function Nr(e) {
	return await t.stat(e);
}
function Pr(e) {
	let t = P.extend(Sr()).parse(e, {
		ecmaVersion: "latest",
		sourceType: "module",
		locations: !0
	}), n = [];
	return Fr(t, (e) => {
		if (e.type !== "MethodDefinition") return;
		let t = e, r = t.key;
		if (r.type !== "Identifier") return;
		let i = r.name;
		i && i !== "constructor" && t.accessibility !== "private" && n.push(i);
	}), n;
}
function Fr(e, t) {
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
			e && typeof e.type == "string" && Fr(e, t);
		}
		else e && typeof e == "object" && typeof e.type == "string" && Fr(e, t);
	}
}
function Ir(e, t, n, r) {
	let i = e.indexOf(n), a = e.indexOf(r);
	if (i === -1 || a === -1) throw Error(`Markers ${n}-${r} not found in content.`);
	return `${e.slice(0, Math.max(0, i + n.length))}\n${t}\n${e.slice(Math.max(0, a))}`;
}
//#endregion
//#region src/utilities/cloudflare.ts
async function Lr() {
	let e = await Z("config.json"), t = {
		body: JSON.stringify(e),
		headers: { "Content-Type": "application/json" },
		method: "PUT"
	}, n = await fetch(`https://api.dpuse.app/configs/${e.id}`, t);
	if (!n.ok) throw Error(await n.text());
}
async function Rr(e, t) {
	async function n(e, t, r) {
		for (let i of r) {
			let r = `${e}/${i}`, a = `${t}/${i}`;
			(await Nr(r)).isDirectory() ? await n(r, a, await Er(r)) : (console.info(`⚙️ Uploading '${e}/${i}'...`), await Y(void 0, `wrangler r2 object put "dpuse-sample-data-eu/${t}/${i}" --file="${e}/${i}" --jurisdiction=eu --remote`));
		}
	}
	let r = await Er(`${e}/${t}/`);
	await n(`${e}/${t}`, t, r);
}
async function zr(e) {
	let t = e.id, n = {
		body: JSON.stringify(e),
		headers: { "Content-Type": "application/json" },
		method: "PUT"
	}, r = await fetch(`https://api.dpuse.app/configs/${t}`, n);
	if (!r.ok) throw Error(await r.text());
}
async function Br(e, t) {
	let n = `v${e.version ?? "unknown"}`;
	async function r(e, r = "") {
		let i = await Er(e, { withFileTypes: !0 });
		for (let a of i) {
			if (a.isDirectory()) continue;
			let i = `${e}/${a.name}`, o = r ? `${r}/${a.name}` : a.name, s = `${t}_${n}/${o}`.replaceAll("\\", "/"), c = a.name.endsWith(".css") ? "text/css" : "application/octet-stream", l = a.name.endsWith(".js") ? "application/javascript" : c;
			console.info(`⚙️ Uploading '${o}' → '${s}'...`), await Y(void 0, `wrangler r2 object put "${s}" --file="${i}" --content-type ${l} --jurisdiction=eu --remote`);
		}
	}
	await r("dist");
}
//#endregion
//#region src/operations/manageProject.ts
var Vr = new Set([
	"createObject",
	"dropObject",
	"removeRecords",
	"upsertRecords"
]), Hr = new Set([
	"auditObjectContent",
	"findObjectFolderPath",
	"getReadableStream",
	"getRecord",
	"listNodes",
	"previewObject",
	"retrieveChunks",
	"retrieveRecords"
]);
async function Ur() {
	try {
		Q("Build Project"), await X("1️⃣  Bundle project", "vite", ["build"]), jr("Project built.");
	} catch (e) {
		console.error("❌ Error building project.", e), process.exit(1);
	}
}
async function Wr() {
	try {
		Q("Release Project");
		let e = await Z("package.json"), t = await Z("config.json");
		await $r("1️⃣", e);
		let n = Mr(t.id);
		switch (n.typeId) {
			case "connector":
				t = await Kr("2️⃣", e);
				break;
			case "context":
				t = await qr("2️⃣", e);
				break;
			case "presenter":
				t = await Jr("2️⃣", e);
				break;
			default: t = await Gr("2️⃣", e);
		}
		if (await X("3️⃣  Bundle project", "vite", ["build"]), await Y("4️⃣  Stage changes", "git", ["add", "."]), await Y("5️⃣  Commit changes", "git", [
			"commit",
			"-m",
			`"v${e.version ?? "unknown"}"`
		]), await Y("6️⃣  Push changes", "git", [
			"push",
			"origin",
			"main:main"
		]), n.typeId === "app") $("7️⃣  Register module"), await Lr();
		else if (n.typeId === "engine") $("7️⃣  Register module"), await Br(e, `dpuse-engine-eu/${n.uploadGroupName ?? "unknown"}`), await zr(t);
		else if (n.uploadGroupName === void 0) $("7️⃣  Registration NOT required.");
		else {
			$("7️⃣  Register module");
			let r = t.id.split("-").slice(2).join("-");
			await Br(e, `dpuse-engine-eu/${n.uploadGroupName}/${r}`), await zr(t);
		}
		if (n.isPublished) {
			let e = ".npmrc";
			try {
				await Ar(e, `registry=https://registry.npmjs.org/\n//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN ?? ""}`), await X("8️⃣  Publish to npm", "npm", [
					"publish",
					"--access",
					"public"
				]);
			} finally {
				await Or(e);
			}
		} else $(`8️⃣  Publishing NOT required for package with type identifier of '${n.typeId}'.`);
		jr(`Project version '${e.version ?? "unknown"}' released.`);
	} catch (e) {
		console.error("❌ Error releasing project.", e), process.exit(1);
	}
}
async function Gr(e, t) {
	$(`${e}  Build project configuration`);
	let n = await Z("config.json");
	return t.name != null && (n.id = t.name.replace("@dpuse/", "").replace("@dpuse/", "")), t.version != null && (n.version = t.version), await kr("config.json", n), n;
}
async function Kr(e, t) {
	$(`${e}  Build connector project configuration`);
	let [n, r] = await Promise.all([Z("config.json"), Dr("src/index.ts")]), i = /* @__PURE__ */ p(je, n);
	if (!i.success) throw console.error("❌ Configuration is invalid:"), console.table(i.issues), Error("Configuration is invalid.");
	let a = Pr(r);
	return await Xr(t, n, a, Yr(a));
}
async function qr(e, t) {
	$(`${e}  Build context project configuration`);
	let [n, r] = await Promise.all([Z("config.json"), Dr("src/index.ts")]), i = /* @__PURE__ */ p(Pe, n);
	if (!i.success) throw console.error("❌ Configuration is invalid:"), console.table(i.issues), Error("Configuration is invalid.");
	return await Xr(t, n, Pr(r));
}
async function Jr(e, t) {
	$(`${e}  Build presenter project configuration`);
	let [n, r] = await Promise.all([Z("config.json"), Dr("src/index.ts")]), i = /* @__PURE__ */ p(Ie, n);
	if (!i.success) throw console.error("❌ Configuration is invalid:"), console.table(i.issues), Error("Configuration is invalid.");
	return await Xr(t, n, Pr(r));
}
function Yr(e) {
	let t = !1, n = !1;
	for (let r of e) Hr.has(r) && (t = !0), Vr.has(r) && (n = !0);
	return t && n ? "bidirectional" : t ? "source" : n ? "destination" : "unknown";
}
async function Xr(e, t, n, r) {
	return n.length > 0 ? (console.info(`ℹ️  Implements ${String(n.length)} operations:`), console.table(n)) : console.warn("⚠️  Implements no operations."), r === "unknown" ? console.warn("⚠️  No usage identified.") : console.info(`ℹ️  Supports '${r ?? "unknown"}' usage.`), e.name != null && (t.id = e.name.replace("@dpuse/", "").replace("@dpuse/", "")), e.version != null && (t.version = e.version), t.operations = n, t.usageId = r ?? "unknown", await kr("config.json", t), t;
}
async function Zr() {
	try {
		Q("Synchronise Project with GitHub");
		let e = await Z("package.json"), t = await Z("config.json");
		switch (await $r("1️⃣", e), Mr(t.id).typeId) {
			case "connector":
				await Kr("2️⃣", e);
				break;
			case "context":
				await qr("2️⃣", e);
				break;
			case "presenter":
				await Jr("2️⃣", e);
				break;
			default: await Gr("2️⃣", e);
		}
		await Y("3️⃣  Stage changes", "git", ["add", "."]), await Y("4️⃣  Commit changes", "git", [
			"commit",
			"-m",
			`"v${e.version ?? "unknown"}"`
		]), await Y("5️⃣  Push changes", "git", [
			"push",
			"origin",
			"main:main"
		]), jr(`Project version '${e.version ?? "unknown"}' synchronised with GitHub.`);
	} catch (e) {
		console.error("❌ Error synchronising project with GitHub.", e), process.exit(1);
	}
}
function Qr() {
	try {
		Q("Test Project"), console.error("\n❌ No tests implemented.\n");
	} catch (e) {
		console.error("❌ Error testing project.", e), process.exit(1);
	}
}
async function $r(e, t, n = "./") {
	if ($(`${e}  Bump project version`), t.version == null) t.version = "0.0.001", console.warn(`⚠️ Project version initialised to '${t.version}'.`), await kr(`${n}package.json`, t);
	else {
		let e = t.version, r = t.version.split(".");
		t.version = `${r[0] ?? "unknown"}.${r[1] ?? "unknown"}.${String(Number(r[2]) + 1)}`, console.info(`Project version bumped from '${e}' to '${t.version}'.`), await kr(`${n}package.json`, t);
	}
}
//#endregion
//#region src/operations/auditDependencies.ts
var ei = {
	critical: {
		color: "D32F2F",
		label: "critical"
	},
	high: {
		color: "EF6C00",
		label: "high"
	},
	moderate: {
		color: "FBC02D",
		label: "moderate"
	},
	low: {
		color: "6D8C31",
		label: "low"
	},
	unknown: {
		color: "616161",
		label: "unknown"
	}
}, ti = "<!-- OWASP_BADGES_START -->", ni = "<!-- OWASP_BADGES_END -->";
async function ri() {
	try {
		Q("Audit Dependencies");
		let e = await Z("package.json"), t = [];
		try {
			let e = (await Er("dependency-check-bin")).toSorted((e, t) => e.localeCompare(t)).at(-1);
			e != null && e !== "" && t.push("--owasp-bin", `dependency-check-bin/${e}/dependency-check/bin/dependency-check.sh`);
		} catch {}
		await X("1️⃣", "owasp-dependency-check", [
			...t,
			"--out",
			"dependency-check-reports",
			"--project",
			e.name ?? "unknown",
			"--enableRetired",
			"--nodePackageSkipDevDependencies",
			"--nvdApiKey",
			process.env.OWASP_NVD_API_KEY ?? "",
			"--ossIndexUsername",
			process.env.SONATYPE_USER_EMAIL ?? "",
			"--ossIndexPassword",
			process.env.SONATYPE_USER_TOKEN ?? ""
		]), await ii("2️⃣"), await X("3️⃣  Check using 'npm audit'", "npm", ["audit"]), jr("Dependencies audited.");
	} catch (e) {
		console.error("❌ Error auditing dependencies.", e), process.exit(1);
	}
}
async function ii(e) {
	$(`${e}  Insert OWASP Badge(s) into 'README.md'`);
	let t = await Z("dependency-check-reports/dependency-check-report.json"), n = {
		critical: 0,
		high: 0,
		moderate: 0,
		low: 0,
		unknown: 0
	};
	for (let e of t.dependencies) if (e.vulnerabilities != null) for (let t of e.vulnerabilities) {
		let e = t.severity?.toLowerCase() ?? "unknown";
		Object.hasOwn(n, e) ? n[e]++ : n.unknown++;
	}
	let r = await ai(n);
	await Ar("README.md", Ir(await Dr("./README.md"), r.join(" "), ti, ni)), console.info("OWASP audit badge(s) inserted into 'README.md'");
}
async function ai(e) {
	let t = await Z("config.json"), n = [];
	if (Object.values(e).reduce((e, t) => e + t, 0) === 0) console.info("No vulnerabilities found."), n.push(`[![OWASP](https://img.shields.io/badge/OWASP-passed-4CAF50)](https://dpuse.github.io/${t.id}/dependency-check-reports/dependency-check-report.html)`);
	else for (let [r, i] of Object.entries(e)) {
		let e = ei[r];
		if (console.warn(`⚠️  ${String(i)} ${e.label} vulnerability(ies) found.`), i === 0) continue;
		let a = `https://img.shields.io/badge/OWASP-${String(i)}%20${e.label}-${e.color}`;
		n.push(`[![OWASP](${a})](https://dpuse.github.io/${t.id}/dependency-check-reports/dependency-check-report.html)`);
	}
	return n;
}
//#endregion
//#region src/operations/checkDependencies.ts
async function oi() {
	try {
		Q("Check Dependencies"), await X("1️⃣  Check using 'npm outdated'", "npm", ["outdated"], !0), await X("2️⃣  Check using 'npm-check-updates'", "npm-check-updates", [
			"-i",
			"--dep",
			"dev,prod,peer,optional"
		]), jr("Dependencies checked.");
	} catch (e) {
		console.error("❌ Error checking dependencies.", e), process.exit(1);
	}
}
//#endregion
//#region src/operations/documentDependencies.ts
var si = "<!-- DEPENDENCY_LICENSES_START -->", ci = "<!-- DEPENDENCY_LICENSES_END -->";
async function li(e = [], t = !0) {
	try {
		Q("Document Dependencies");
		let n = e.flatMap((e) => ["--allowed", `'${e}'`]);
		await Y("1️⃣  Generate 'licenses.json' file", "license-report", [
			"--config",
			`'${s(new o(import.meta.resolve("@dpuse/dpuse-development/license-report-config")))}'`,
			"--only=prod,peer",
			"--output=json"
		], "licenses/licenses.json"), await Y("2️⃣  Check 'licenses.json' file", "license-report-check", [
			"--source",
			"licenses/licenses.json",
			"--output=table",
			...n
		]), t ? (await Y("3️⃣  Generate 'licenseTree.json' file", "license-report-recursive", [
			"--only=prod,peer",
			"--output=tree",
			"--recurse",
			"--department.value=n/a",
			"--licensePeriod.value=n/a",
			"--material.value=n/a",
			"--relatedTo.value=n/a"
		], "licenses/licenseTree.json"), await Y("4️⃣  Check 'licenseTree.json' file", "license-report-check", [
			"--source",
			"licenses/licenseTree.json",
			"--output=table",
			...n
		])) : ($("3️⃣  Skip 'licenses/licenseTree.json' file generate"), $("4️⃣  Skip 'licenses/licenseTree.json' file check"));
		let r = process.env.GITHUB_TOKEN;
		if (r == null || r === "" || r.startsWith("op://")) throw Error("GITHUB_TOKEN is not resolved. Run the script via \"npm run document\" to use 1Password resolution.");
		await Tr("licenses/downloads"), await Y("5️⃣  Download license files", "license-downloader", [
			"--source",
			"licenses/licenses.json",
			"--licDir",
			"licenses/downloads",
			"--githubToken.tokenEnvVar",
			"GITHUB_TOKEN",
			"--download"
		]), await ui("6️⃣", t), jr("Dependencies documented.");
	} catch (e) {
		console.error("❌ Error documenting dependencies.", e), process.exit(1);
	}
}
async function ui(e, t) {
	$(`${e}  Insert licenses into 'README.md'`);
	let n = await Z("licenses/licenses.json"), r = await Z("licenses/downloads/licenses.ext.json"), i = t ? await Z("licenses/licenseTree.json") : [], a = [...(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of n) e.set(t.name, { ...t });
		for (let t of r) {
			let n = e.get(t.name);
			e.set(t.name, n ? {
				...n,
				...t
			} : { ...t });
		}
		for (let t of i) {
			let n = e.get(t.name);
			n && e.set(t.name, {
				...n,
				dependencyCount: t.requires?.length ?? 0
			});
		}
		return e.values();
	})()], o = "|Name|Type|Installed|Latest|Latest Released|Deps|Document|\n|:-|:-|:-:|:-:|:-|-:|:-|\n";
	for (let e of a) {
		let t = e.installedVersion === e.remoteVersion ? e.installedVersion : `${e.installedVersion} ⚠️`, n = e.latestRemoteModified ? di(e.latestRemoteModified.split("T", 1)[0]) : "n/a", r = e.dependencyCount != null && e.dependencyCount >= 0 ? e.dependencyCount : "n/a", i;
		i = e.licenseFileLink == null || e.licenseFileLink == "" ? "⚠️ No license file" : `[${e.licenseFileLink.slice(Math.max(0, e.licenseFileLink.lastIndexOf("/") + 1))}](${e.licenseFileLink})`, o += `|${e.name}|${e.licenseType}|${t}|${e.remoteVersion}|${n}|${String(r)}|${i}|\n`;
	}
	let s = Ir(await Dr("./README.md"), o, si, ci);
	await Ar("README.md", s), console.info("OWASP audit badge(s) inserted into 'README.md'"), await Ar("README.md", s);
}
function di(e) {
	if (e == null || e === "") return "n/a";
	let t = e.split("T", 1)[0];
	if (t == null || t === "") return "n/a";
	let n = new Date(t), r = /* @__PURE__ */ new Date(), i = (r.getFullYear() - n.getFullYear()) * 12 + (r.getMonth() - n.getMonth());
	return r.getDate() < n.getDate() && --i, i === 0 ? `this month: ${t}` : i === 1 ? `1 month ago: ${t}` : i <= 6 ? `${String(i)} months ago: ${t}` : i <= 12 ? `${String(i)} months ago: ${t} ⚠️` : `${String(i)} months ago: ${t}❗`;
}
//#endregion
//#region src/operations/formatCode.ts
async function fi() {
	try {
		Q("Format Code"), await X("1️⃣  Format", "prettier", [
			"--write",
			"*.json",
			"*.md",
			"*.ts",
			...["app", "src"].filter((t) => e(t)).map((e) => `${e}/**`)
		]), jr("Code formatted.");
	} catch (e) {
		console.error("❌ Error formatting code.", e), process.exit(1);
	}
}
//#endregion
//#region src/operations/lintCode.ts
async function pi() {
	try {
		Q("Lint Code"), await X("1️⃣  Lint", "eslint", ["."]), jr("Code linted.");
	} catch (e) {
		console.error("❌ Error linting code.", e), process.exit(1);
	}
}
//#endregion
//#region src/operations/updateDPUseDependencies.ts
var mi = [
	"1️⃣",
	"2️⃣",
	"3️⃣",
	"4️⃣",
	"5️⃣",
	"6️⃣",
	"7️⃣",
	"8️⃣",
	"9️⃣"
];
async function hi(e = []) {
	try {
		Q("Update '@dpuse/dpuse' Dependencies");
		for (let [t, n] of e.entries()) {
			let e = mi.at(t) ?? "🔢";
			n === "eslint" ? await X(`${e}  Update '${n}'`, "npm", ["install", "@dpuse/eslint-config-dpuse@latest"]) : (await X(`${e}  Update '${n}'`, "npm", ["install", `@dpuse/dpuse-${n}@latest`]), n === "development" && await gi(Mr((await Z("config.json")).id)));
		}
		jr("'@dpuse/dpuse' dependencies updated.");
	} catch (e) {
		console.error("❌ Error updating '@dpuse/dpuse' dependencies.", e), process.exit(1);
	}
}
async function gi(e) {
	let t = n.dirname(s(import.meta.url));
	await _i(t, "../", ".editorconfig"), await _i(t, "../", ".gitattributes"), await _i(t, "../", e.isPublished ? ".gitignore_published" : ".gitignore_unpublished", ".gitignore2"), await _i(t, "../", ".markdownlint.json"), await _i(t, "../", "LICENSE"), await _i(t, "../", "tsconfig.json", "tsconfig2.json"), e.typeId === "eslint" || (await _i(t, "../", "eslint.config.ts", "eslint.config2.ts"), await _i(t, "../", "vite.config.ts", "vite.config2.ts"), await _i(t, "../", "vitest.config.ts", "vitest.config2.ts"));
}
async function _i(e, t, r, i) {
	let a = await Dr(n.resolve(e, `${t}${r}`)), o = n.resolve(process.cwd(), r.split("_", 1)[0] ?? r), s = n.resolve(process.cwd(), i ?? r), c;
	try {
		c = await Dr(o);
	} catch (e) {
		if (e.code !== "ENOENT") throw e;
	}
	if (c === a) {
		console.info(`ℹ️  File '${r.split("_", 1)[0] ?? r}' is already up to date.`);
		return;
	}
	await Ar(s, a), console.info(`ℹ️  File '${i ?? r}' synchronised.`);
}
//#endregion
export { ri as auditDependencies, Ur as buildProject, oi as checkDependencies, li as documentDependencies, fi as formatCode, pi as lintCode, Wr as releaseProject, Zr as syncProjectWithGitHub, Qr as testProject, hi as updateDPUseDependencies, Rr as uploadDirectoryToR2 };

//# sourceMappingURL=dpuse-development.es.js.map
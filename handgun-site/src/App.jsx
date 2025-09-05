 import React, { useMemo, useState } from "react";
import { Check, X, Search, SlidersHorizontal, ArrowUpDown, Info } from "lucide-react";

/**
 * Handgun Comparison – single-file React app
 * -------------------------------------------------
 * - Filters (caliber, type, optics-ready, comped), price slider
 * - Sort columns
 * - Compare up to 4
 * NOTE: Specs are placeholders — verify before publishing.
 */

// -------------------------------
// 1) Data (edit me)
// -------------------------------
const DATA = [
  {
    id: "bul-tactical-comp",
    brand: "BUL Armory",
    model: "SAS II Tactical Comp",
    type: "2011/Hi-Cap",
    caliber: ["9mm"],
    barrel: 4.25,
    comped: true,
    opticsReady: true,
    capacity: 17,
    weightOz: 36,
    msrp: 2999,
    notes: "Threaded/compensated configuration; rail; optics-ready (plate system).",
  },
  {
    id: "staccato-xc",
    brand: "Staccato",
    model: "XC",
    type: "2011/Hi-Cap",
    caliber: ["9mm"],
    barrel: 5.0,
    comped: builtInComp(),
    opticsReady: true,
    capacity: 17,
    weightOz: 37.5,
    msrp: 4299,
    notes: "Integrated compensator/porting; DUO optics system; premium trigger.",
  },
  {
    id: "staccato-p",
    brand: "Staccato",
    model: "P",
    type: "2011/Hi-Cap",
    caliber: ["9mm"],
    barrel: 4.4,
    comped: false,
    opticsReady: true,
    capacity: 17,
    weightOz: 33.3,
    msrp: 2499,
    notes: "Duty-oriented configuration; widely used by LE; optics-ready.",
  },
  {
    id: "cz-shadow2",
    brand: "CZ",
    model: "Shadow 2 Optics-Ready",
    type: "DA/SA",
    caliber: ["9mm"],
    barrel: 4.9,
    comped: false,
    opticsReady: true,
    capacity: 17,
    weightOz: 46.5,
    msrp: 1399,
    notes: "All-steel competition classic; heavy for recoil control.",
  },
  {
    id: "glock-34-gen5-mos",
    brand: "Glock",
    model: "34 Gen5 MOS",
    type: "Striker",
    caliber: ["9mm"],
    barrel: 5.31,
    comped: false,
    opticsReady: true,
    capacity: 17,
    weightOz: 25.95,
    msrp: 749,
    notes: "Long-slide 9mm; MOS optics cut; ubiquitous aftermarket.",
  },
  {
    id: "sig-p320-xfive",
    brand: "SIG Sauer",
    model: "P320 X-Five Legion",
    type: "Striker",
    caliber: ["9mm"],
    barrel: 5.0,
    comped: false,
    opticsReady: true,
    capacity: 17,
    weightOz: 43.5,
    msrp: 999,
    notes: "TXG tungsten-infused grip for weight; optics-ready; flat trigger.",
  },
];

function builtInComp(){ return true }

// -------------------------------
// 2) Helpers
// -------------------------------
const unique = (arr) => Array.from(new Set(arr));
const formatPrice = (n) => (n ? `$${n.toLocaleString()}` : "—");

// -------------------------------
// 3) App (single default export)
// -------------------------------
export default function App() {
  const [query, setQuery] = useState("");
  const [calibers, setCalibers] = useState([]);
  const [type, setType] = useState([]);
  const [opticOnly, setOpticOnly] = useState(false);
  const [compOnly, setCompOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0); // 0 = no cap
  const [sort, setSort] = useState({ key: "msrp", dir: "asc" });
  const [compare, setCompare] = useState([]);

  const allCalibers = useMemo(() => unique(DATA.flatMap((d) => d.caliber)), []);
  const allTypes = useMemo(() => unique(DATA.map((d) => d.type)), []);
  const maxSeenPrice = useMemo(() => Math.max(...DATA.map((d) => d.msrp || 0)), []);

  const filtered = useMemo(() => {
    let out = DATA.filter((d) =>
      `${d.brand} ${d.model}`.toLowerCase().includes(query.toLowerCase())
    );
    if (calibers.length) out = out.filter((d) => d.caliber.some((c) => calibers.includes(c)));
    if (type.length) out = out.filter((d) => type.includes(d.type));
    if (opticOnly) out = out.filter((d) => d.opticsReady);
    if (compOnly) out = out.filter((d) => d.comped);
    if (maxPrice > 0) out = out.filter((d) => (d.msrp || 0) <= maxPrice);

    out.sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      const va = a[sort.key];
      const vb = b[sort.key];
      if (typeof va === "string") return dir * va.localeCompare(vb);
      return dir * ((va ?? 0) - (vb ?? 0));
    });
    return out;
  }, [query, calibers, type, opticOnly, compOnly, maxPrice, sort]);

  const toggleCompare = (id) => {
    setCompare((prev) => (prev.includes(id)
      ? prev.filter((x) => x !== id)
      : prev.length < 4 ? [...prev, id] : prev));
  };

  const cmpModels = DATA.filter((d) => compare.includes(d.id));

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="font-bold text-xl">Handgun Comparison</span>
          <span className="ml-auto text-xs text-neutral-500 flex items-center gap-1"><Info size={14}/> Specs are placeholders—verify before publishing.</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {/* Controls */}
        <div className="grid md:grid-cols-4 gap-3 mb-4">
          <div className="col-span-2 flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
            <Search size={16} className="opacity-70"/>
            <input
              className="w-full outline-none"
              placeholder="Search brand or model…"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
            />
          </div>

          <div className="border rounded-xl px-3 py-2 bg-white">
            <label className="text-xs font-semibold">Caliber</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {allCalibers.map((c) => (
                <button key={c}
                  className={`text-xs px-2 py-1 rounded-full border ${calibers.includes(c)?"bg-black text-white":"bg-white"}`}
                  onClick={() => setCalibers((prev)=> prev.includes(c)? prev.filter(x=>x!==c): [...prev, c])}
                >{c}</button>
              ))}
            </div>
          </div>

          <div className="border rounded-xl px-3 py-2 bg-white">
            <label className="text-xs font-semibold">Type</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {allTypes.map((t) => (
                <button key={t}
                  className={`text-xs px-2 py-1 rounded-full border ${type.includes(t)?"bg-black text-white":"bg-white"}`}
                  onClick={() => setType((prev)=> prev.includes(t)? prev.filter(x=>x!==t): [...prev, t])}
                >{t}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-3 mb-5">
          <label className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
            <input type="checkbox" checked={opticOnly} onChange={(e)=>setOpticOnly(e.target.checked)} />
            <span className="text-sm">Optics-ready only</span>
          </label>
          <label className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
            <input type="checkbox" checked={compOnly} onChange={(e)=>setCompOnly(e.target.checked)} />
            <span className="text-sm">Compensated only</span>
          </label>
          <div className="md:col-span-2 border rounded-xl px-3 py-2 bg-white">
            <label className="text-xs font-semibold">Max price: {maxPrice>0? formatPrice(maxPrice): "No limit"}</label>
            <input type="range" min={0} max={maxSeenPrice} step={50}
              value={maxPrice}
              onChange={(e)=>setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                {[
                  ["brand","Brand"],
                  ["model","Model"],
                  ["type","Type"],
                  ["caliber","Caliber"],
                  ["barrel","Barrel (in)"],
                  ["capacity","Cap."],
                  ["weightOz","Weight (oz)"],
                  ["comped","Comp"],
                  ["opticsReady","Optic"],
                  ["msrp","MSRP"],
                ].map(([key,label]) => (
                  <th key={key} className="px-3 py-2 text-left whitespace-nowrap">
                    <button className="inline-flex items-center gap-1" onClick={()=>setSort((s)=>({ key, dir: s.key===key && s.dir==="asc"?"desc":"asc" }))}>
                      {label} <ArrowUpDown size={14} className="opacity-60"/>
                    </button>
                  </th>
                ))}
                <th className="px-3 py-2 text-left">Compare</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-t hover:bg-neutral-50">
                  <td className="px-3 py-2 font-medium">{d.brand}</td>
                  <td className="px-3 py-2">{d.model}</td>
                  <td className="px-3 py-2">{d.type}</td>
                  <td className="px-3 py-2">{d.caliber.join(", ")}</td>
                  <td className="px-3 py-2">{d.barrel ?? "—"}</td>
                  <td className="px-3 py-2">{d.capacity ?? "—"}</td>
                  <td className="px-3 py-2">{d.weightOz ?? "—"}</td>
                  <td className="px-3 py-2">{d.comped ? <Check size={16}/> : <X size={16}/>}</td>
                  <td className="px-3 py-2">{d.opticsReady ? <Check size={16}/> : <X size={16}/>}</td>
                  <td className="px-3 py-2">{formatPrice(d.msrp)}</td>
                  <td className="px-3 py-2">
                    <button onClick={()=>toggleCompare(d.id)} className={`text-xs px-2 py-1 rounded-full border ${compare.includes(d.id)?"bg-black text-white":"bg-white"}`}>{compare.includes(d.id)?"Selected":"Select"}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes cards */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {filtered.map((d)=> (
            <article key={d.id} className="border rounded-2xl p-4 bg-white">
              <h3 className="font-semibold">{d.brand} {d.model}</h3>
              <p className="text-sm text-neutral-700 mt-1">{d.notes}</p>
            </article>
          ))}
        </div>
      </main>

      {/* Compare drawer */}
      {compare.length>0 && (
        <div className="sticky bottom-0 bg-white border-t">
          <div className="max-w-6xl mx-auto p-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Compare ({compare.length}/4)</div>
              <button className="text-sm underline" onClick={()=>setCompare([])}>Clear</button>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-600">
                    <th className="px-3 py-2">Model</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Caliber</th>
                    <th className="px-3 py-2">Barrel (in)</th>
                    <th className="px-3 py-2">Capacity</th>
                    <th className="px-3 py-2">Weight (oz)</th>
                    <th className="px-3 py-2">Comp</th>
                    <th className="px-3 py-2">Optics</th>
                    <th className="px-3 py-2">MSRP</th>
                  </tr>
                </thead>
                <tbody>
                  {cmpModels.map((d)=> (
                    <tr key={d.id} className="border-t">
                      <td className="px-3 py-2 font-medium">{d.brand} {d.model}</td>
                      <td className="px-3 py-2">{d.type}</td>
                      <td className="px-3 py-2">{d.caliber.join(", ")}</td>
                      <td className="px-3 py-2">{d.barrel ?? "—"}</td>
                      <td className="px-3 py-2">{d.capacity ?? "—"}</td>
                      <td className="px-3 py-2">{d.weightOz ?? "—"}</td>
                      <td className="px-3 py-2">{d.comped ? <Check size={16}/> : <X size={16}/>}</td>
                      <td className="px-3 py-2">{d.opticsReady ? <Check size={16}/> : <X size={16}/>}</td>
                      <td className="px-3 py-2">{formatPrice(d.msrp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

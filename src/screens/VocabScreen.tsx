import VOCAB from "../data/vocabulary";
import { P } from "../styles/shared";
import type { Screen, WordLog, VocabEntry, SetState } from "../types/game";

interface VocabScreenProps {
  wlog: WordLog[];
  setScreen: SetState<Screen>;
}

export default function VocabScreen({ wlog, setScreen }: VocabScreenProps) {
  const grouped: Record<string, VocabEntry[]> = {};
  VOCAB.forEach(v => {
    if (!grouped[v.category]) grouped[v.category] = [];
    grouped[v.category].push(v);
  });

  return (
    <div style={{ minHeight: "100vh", ...P.bg, ...P.ft, color: "#e2e8f0", padding: 20, overflowY: "auto" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#22d3ee", margin: 0, fontSize: 18 }}>📖 Vocabulary Bank</h2>
          <button onClick={() => setScreen("menu")} style={P.bt("#94a3b8")}>← Back</button>
        </div>

        {Object.entries(grouped).map(([cat, words]) => (
          <div key={cat} style={{ ...P.pn, padding: 18, marginBottom: 14 }}>
            <h3 style={{ color: "#fbbf24", margin: "0 0 10px", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>
              {cat}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
              {words.map(v => {
                const logs = wlog.filter(l => l.word === v.word);
                const ok = logs.filter(l => l.ok).length;
                const fl = logs.filter(l => !l.ok).length;
                return (
                  <div key={v.word} style={{ background: "rgba(255,255,255,0.025)", borderRadius: 7, padding: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{v.word}</span>
                      <span style={{
                        fontSize: 9, padding: "1px 5px", borderRadius: 3,
                        background: v.difficulty === "easy" ? "#4ade8018" : v.difficulty === "medium" ? "#fbbf2418" : "#ef444418",
                        color: v.difficulty === "easy" ? "#4ade80" : v.difficulty === "medium" ? "#fbbf24" : "#ef4444",
                      }}>
                        {v.difficulty}
                      </span>
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: 10, margin: "3px 0 0" }}>{v.definition}</p>
                    <p style={{ color: "#64748b", fontSize: 9, margin: "2px 0 0", fontStyle: "italic" }}>"{v.example}"</p>
                    {logs.length > 0 && (
                      <p style={{ fontSize: 9, color: "#64748b", margin: "3px 0 0" }}>✅ {ok} &nbsp; ❌ {fl}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

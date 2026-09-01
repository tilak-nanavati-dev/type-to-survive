import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, XAxis, YAxis, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import StatBox from "../components/StatBox";
import { P } from "../styles/shared";
import type { WpmSample, CategoryDataPoint, DifficultyDistPoint, Screen, SetState } from "../types/game";

interface StatsScreenProps {
  wpmH: WpmSample[];
  difficultyDist: DifficultyDistPoint[];
  categoryData: CategoryDataPoint[];
  curWpm: number;
  acc: number;
  wc: number;
  best: number;
  surv: number;
  setScreen: SetState<Screen>;
}

export default function StatsScreen({ wpmH, difficultyDist, categoryData, curWpm, acc, wc, best, surv, setScreen }: StatsScreenProps) {
  return (
    <div style={{ minHeight: "100vh", ...P.bg, ...P.ft, color: "#e2e8f0", padding: 20, overflowY: "auto" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#f472b6", margin: 0, fontSize: 18 }}>📊 Session Analytics</h2>
          <button onClick={() => setScreen("menu")} style={P.bt("#94a3b8")}>← Back</button>
        </div>

        {wpmH.length > 2 ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ ...P.pn, padding: 18 }}>
              <h3 style={{ color: "#22d3ee", margin: "0 0 10px", fontSize: 12 }}>WPM Over Time</h3>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={wpmH}>
                  <XAxis dataKey="t" hide />
                  <YAxis stroke="#334155" fontSize={10} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 6, fontSize: 11 }} />
                  <Line type="monotone" dataKey="wpm" stroke="#22d3ee" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ ...P.pn, padding: 18 }}>
              <h3 style={{ color: "#4ade80", margin: "0 0 10px", fontSize: 12 }}>Accuracy Trend</h3>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={wpmH}>
                  <XAxis dataKey="t" hide />
                  <YAxis stroke="#334155" fontSize={10} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 6, fontSize: 11 }} />
                  <Area type="monotone" dataKey="acc" stroke="#4ade80" fill="#4ade8018" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{ ...P.pn, padding: 18 }}>
              <h3 style={{ color: "#fbbf24", margin: "0 0 10px", fontSize: 12 }}>Difficulty Distribution</h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={difficultyDist}>
                  <XAxis dataKey="d" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#334155" fontSize={10} />
                  <Bar dataKey="n" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ ...P.pn, padding: 18 }}>
              <h3 style={{ color: "#818cf8", margin: "0 0 10px", fontSize: 12 }}>Category Accuracy</h3>
              {categoryData.length > 2 ? (
                <ResponsiveContainer width="100%" height={150}>
                  <RadarChart data={categoryData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="cat" stroke="#94a3b8" fontSize={9} />
                    <Radar dataKey="acc" stroke="#818cf8" fill="#818cf818" strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ color: "#64748b", fontSize: 11, padding: 16 }}>Need more categories played</p>
              )}
            </div>
          </div>
        ) : (
          <div style={{ ...P.pn, padding: 36, textAlign: "center" }}>
            <p style={{ color: "#64748b" }}>Play a game first to see analytics!</p>
          </div>
        )}

        <div style={{ ...P.pn, padding: 18, marginTop: 14, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          <StatBox label="WPM" value={curWpm} color="#22d3ee" />
          <StatBox label="Accuracy" value={acc + "%"} color="#4ade80" />
          <StatBox label="Words" value={wc} color="#fbbf24" />
          <StatBox label="Best Streak" value={best} color="#f472b6" />
          <StatBox label="Time" value={Math.floor(surv / 60) + "m " + (surv % 60) + "s"} color="#818cf8" />
        </div>
      </div>
    </div>
  );
}

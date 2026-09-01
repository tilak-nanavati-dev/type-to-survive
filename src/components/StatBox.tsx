interface StatBoxProps {
  label: string;
  value: string | number;
  color: string;
}

export default function StatBox({ label, value, color }: StatBoxProps) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color, fontSize: 20, fontWeight: 800 }}>{value}</div>
      <div style={{ color: "#64748b", fontSize: 9, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

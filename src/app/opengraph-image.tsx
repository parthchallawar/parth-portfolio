import { ImageResponse } from "next/og";
import { profile, stats } from "@/content/profile";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const headline = profile.headline.replace(/\*/g, "");
  const chips = stats.filter((s) => ["orders", "restaurants", "leetcode", "papers"].includes(s.id));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#08090B",
          backgroundImage:
            "radial-gradient(circle at 85% 10%, rgba(125,211,252,0.14), transparent 45%), radial-gradient(circle at 10% 100%, rgba(198,244,50,0.10), transparent 40%)",
          color: "#EDEEF0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 999,
                border: "1.5px solid #2A2E36",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                letterSpacing: -1,
              }}
            >
              {profile.initials}
            </div>
            <div style={{ fontSize: 26, letterSpacing: -0.5 }}>{profile.name}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 18, color: "#8A8F98", letterSpacing: 2 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: "#C6F432" }} />
            {profile.status.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 72, lineHeight: 1.02, letterSpacing: -3, maxWidth: 1000 }}>
          {headline}
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {chips.map((s) => (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                padding: "12px 18px",
                border: "1px solid #1B1E24",
                borderRadius: 14,
                background: "#0F1114",
              }}
            >
              <span style={{ fontSize: 28, color: "#C6F432", letterSpacing: -1 }}>
                {`${s.value}${s.suffix ?? ""}`}
              </span>
              <span style={{ fontSize: 18, color: "#8A8F98" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}

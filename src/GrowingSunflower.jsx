import { useEffect, useRef, useState } from "react";
import "./GrowingSunflower.css";

/* Fractional positions (0 = bottom of stem, 1 = top) where a leaf
   pops out as the stem grows past that point. */
const LEAF_POSITIONS = [0.22, 0.42, 0.63, 0.82];
const PETAL_COUNT = 13;

function Petals({ size = 46 }) {
  return (
    <g>
      {Array.from({ length: PETAL_COUNT }).map((_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy={-size * 0.62}
          rx={size * 0.16}
          ry={size * 0.42}
          fill="var(--sunflower-petal)"
          transform={`rotate(${(360 / PETAL_COUNT) * i})`}
        />
      ))}
      <circle r={size * 0.34} fill="var(--sunflower-seed)" />
      {Array.from({ length: 20 }).map((_, i) => {
        const a = (Math.PI * 2 * i) / 20;
        const r = size * 0.34 * (i % 2 === 0 ? 0.55 : 0.32);
        return (
          <circle
            key={`seed-${i}`}
            cx={Math.cos(a) * r}
            cy={Math.sin(a) * r}
            r={size * 0.022}
            fill="var(--sunflower-seed-dark)"
          />
        );
      })}
    </g>
  );
}

function Leaf({ side = 1 }) {
  const d =
    side === 1
      ? "M0 0 C 14 -4, 26 2, 34 14 C 22 14, 8 10, 0 0 Z"
      : "M0 0 C -14 -4, -26 2, -34 14 C -22 14, -8 10, 0 0 Z";
  return <path d={d} fill="var(--sunflower-leaf)" />;
}

export default function GrowingSunflower({ side = "left" }) {
  const pathRef = useRef(null);
  const [length, setLength] = useState(0);
  const [progress, setProgress] = useState(0);

  // Measure the stem path once it's mounted.
  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, []);

  // Track scroll progress across the whole document (0 → 1).
  useEffect(() => {
    let ticking = false;

    function measure() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(p);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(measure);
        ticking = true;
      }
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const grown = length * progress;
  const dashOffset = length - grown;

  // Where the flower head sits right now, plus a rough tangent so it
  // leans gently into the curve instead of staying perfectly upright.
  let head = { x: 50, y: 1000, angle: 0 };
  if (pathRef.current && length > 0) {
    const p = pathRef.current.getPointAtLength(grown);
    const ahead = pathRef.current.getPointAtLength(Math.min(length, grown + 1));
    const angle = Math.atan2(ahead.x - p.x, -(ahead.y - p.y)) * (180 / Math.PI);
    head = { x: p.x, y: p.y, angle };
  }

  return (
    <div className={`sunflower-rail sunflower-rail--${side}`} aria-hidden="true">
      <svg
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        className={`sunflower-svg${side === "right" ? " sunflower-svg--mirror" : ""}`}
      >
        <path
          ref={pathRef}
          d="M50 1000 C 30 860, 68 760, 46 640 C 26 540, 66 460, 48 360 C 32 270, 64 190, 50 60"
          fill="none"
          stroke="var(--sunflower-stem)"
          strokeWidth="3.4"
          strokeLinecap="round"
          style={{ strokeDasharray: length, strokeDashoffset: dashOffset }}
        />

        {length > 0 &&
          LEAF_POSITIONS.map((pos, i) => {
            const pt = pathRef.current.getPointAtLength(length * pos);
            const visible = pos <= progress + 0.03;
            return (
              <g
                key={i}
                transform={`translate(${pt.x} ${pt.y})`}
                className={`sunflower-leaf${visible ? " sunflower-leaf--visible" : ""}`}
              >
                <Leaf side={i % 2 === 0 ? 1 : -1} />
              </g>
            );
          })}

        {progress > 0.02 && (
          <g
            className="sunflower-head"
            transform={`translate(${head.x} ${head.y}) rotate(${head.angle * 0.15})`}
          >
            <Petals />
          </g>
        )}
      </svg>
    </div>
  );
}

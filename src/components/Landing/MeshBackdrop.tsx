import { motion } from "framer-motion";

const blobs = [
  {
    className: "bg-accent/20 w-[42vw] h-[42vw] top-[-10%] left-[-5%]",
    animate: { x: [0, 60, 0], y: [0, 40, 0] },
    duration: 18,
  },
  {
    className: "bg-[#FFB000]/20 w-[38vw] h-[38vw] top-[5%] right-[-8%]",
    animate: { x: [0, -50, 0], y: [0, 60, 0] },
    duration: 22,
  },
  {
    className: "bg-accent/15 w-[34vw] h-[34vw] bottom-[-12%] left-[20%]",
    animate: { x: [0, 40, 0], y: [0, -40, 0] },
    duration: 26,
  },
];

export default function MeshBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[90px] ${blob.className}`}
          animate={blob.animate}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-background/30" />
    </div>
  );
}

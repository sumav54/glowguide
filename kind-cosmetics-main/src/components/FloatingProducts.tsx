import { motion } from "framer-motion";
import p4 from "@/assets/products/p4.jpg";
import p8 from "@/assets/products/p8.jpg";
import p11 from "@/assets/products/p11.jpg";
import p19 from "@/assets/products/p19.jpg";
import p6 from "@/assets/products/p6.jpg";
import p16 from "@/assets/products/p16.jpg";
import p1 from "@/assets/products/p1.jpg";

const items = [
  { src: p1, top: "10%", left: "4%", dur: 6 },
  { src: p8, top: "68%", left: "7%", dur: 7 },
  { src: p4, top: "18%", left: "84%", dur: 5 },
  { src: p19, top: "72%", left: "80%", dur: 8 },
  { src: p11, top: "44%", left: "90%", dur: 6.5 },
  { src: p6, top: "54%", left: "2%", dur: 5.5 },
  { src: p16, top: "28%", left: "44%", dur: 7.5 },
];

const FloatingProducts = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it, i) => (
        <motion.img
          key={i}
          src={it.src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover opacity-40 shadow-lg"
          style={{ top: it.top, left: it.left }}
          animate={{ y: [0, -25, 0], x: [0, 10, 0], rotate: [0, 6, -4, 0] }}
          transition={{ duration: it.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}
    </div>
  );
};

export default FloatingProducts;

import { motion } from "framer-motion";
export default function BackgroundIcons() {
  return (
    <div className=" opacity-40">
      <motion.img
        src="/assets/editor.png"
        className="absolute top-[15rem] left-10 h-24 opacity-50"
        alt="Post-it"
        initial={{ y: -20, rotate: -10 }}
        animate={{ y: 0, rotate: 10 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.img
        src="/assets/hub.png"
        className="absolute top-40 hidden md:block left-1/4 h-20 opacity-50"
        alt="Post-it"
        initial={{ y: -30, rotate: 5 }}
        animate={{ y: 0, rotate: -5 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Calendars */}
      <motion.img
        src="/assets/calendar.png"
        className="absolute bottom-20 right-10 h-24 opacity-50"
        alt="Calendar"
        initial={{ y: 20, rotate: 10 }}
        animate={{ y: 0, rotate: -10 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.img
        src="/assets/calendar.png"
        className="absolute bottom-40 hidden md:block right-1/4 h-20 opacity-50"
        alt="Calendar"
        initial={{ y: 30, rotate: -5 }}
        animate={{ y: 0, rotate: 5 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Tables */}
      <motion.img
        src="/assets/hub.png"
        className="absolute top-1/4 right-10 h-24 opacity-50"
        alt="Table"
        initial={{ y: -20, rotate: -5 }}
        animate={{ y: 0, rotate: 5 }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.img
        src="/assets/dashboard.png"
        className="absolute top-1/2 left-10 h-20 opacity-50"
        alt="Table"
        initial={{ y: 20, rotate: 10 }}
        animate={{ y: 0, rotate: -10 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Gallery Images */}
      <motion.img
        src="/assets/gallery.png"
        className="absolute bottom-10 left-1/4 h-24 opacity-50"
        alt="Gallery"
        initial={{ y: -20, rotate: -10 }}
        animate={{ y: 0, rotate: 10 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.img
        src="/assets/gallery.png"
        className="absolute bottom-[80%] hidden md:block right-1/4 h-20 opacity-50"
        alt="Gallery"
        initial={{ y: 30, rotate: 5 }}
        animate={{ y: 0, rotate: -5 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const HeroStats = () => {
  const stats = [
    { number: 500, label: 'Members Engaged', suffix: '+' },
    { number: 50, label: 'Tech Events', suffix: '+' },
    { number: 100, label: 'Innovative Projects', suffix: '+' },
    { number: 20, label: 'Learning Resources', suffix: '+' }
  ];

  return (
    <section className="relative py-36 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden">
      {/* Animated background elements with enhanced colors */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '300% 300%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'linear-gradient(45deg, transparent 20%, rgba(255,255,255,0.3) 50%, transparent 80%)',
          backgroundSize: '300% 300%'
        }}
      >
        {/* Subtle particle effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg"
              variants={{
                hidden: { y: 50, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 120,
                    damping: 12
                  }
                }
              }}
              whileHover={{
                y: -12,
                scale: 1.08,
                boxShadow: "0 15px 40px rgba(255,255,255,0.3)",
                background: "linear-gradient(145deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))",
                transition: { duration: 0.3 }
              }}
            >
              <div className="text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500">
                <CountUp
                  end={stat.number}
                  duration={3.5}
                  suffix={stat.suffix}
                />
              </div>
              <div className="text-lg font-medium text-gray-100 opacity-90 tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroStats;
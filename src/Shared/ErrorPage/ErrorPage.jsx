import { motion } from 'framer-motion';
import { Code2, Home, ArrowLeft, Terminal } from 'lucide-react';

const ErrorPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const floatingCode = {
    animate: {
      y: [-15, 15, -15],
      rotate: [0, 5, -5, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-6 overflow-hidden relative">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl w-full text-center relative z-10"
      >
        {/* Floating Code Brackets */}
        <motion.div
          variants={floatingCode}
          animate="animate"
          className="absolute -top-20 -left-20 text-blue-500/20 text-9xl select-none"
        >
          {"{"}
        </motion.div>
        <motion.div
          variants={floatingCode}
          animate="animate"
          transition={{ delay: 1 }}
          className="absolute -bottom-20 -right-20 text-blue-500/20 text-9xl select-none"
        >
          {"}"}
        </motion.div>

        {/* 404 with Terminal Style */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="inline-block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-8 py-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">Khulna University CLUSTER</span>
            </div>
            <motion.h1
              className="text-8xl md:text-9xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 tracking-wider"
              style={{ fontFeatureSettings: '"liga" off' }}
            >
              404
            </motion.h1>
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4"
        >
          Page Not Found
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Check the URL or navigate back to the dashboard.
        </motion.p>

        {/* CLUSTER Info Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-8 mb-10 shadow-2xl"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">CLUSTER</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium">Computer Club Dashboard</p>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Khulna University • Discipline of Computer Science & Engineering
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition" />
            Back to Home
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
            Go Back
          </motion.button>
        </motion.div>

        {/* Technical Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-sm text-gray-500 dark:text-gray-400 font-mono"
        >
          Error 404: Resource not found • Dashboard v1.0
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Users, Globe2, Leaf } from 'lucide-react';

const stats = [
  { icon: Award, value: '25+', label: 'Years Experience' },
  { icon: Users, value: '1000+', label: 'Team Members' },
  { icon: Globe2, value: '15', label: 'Countries' },
  { icon: Leaf, value: '100%', label: 'Sustainable' }
];

export const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="about" className="py-20 dark:bg-slate-800 bg-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold dark:text-white text-black/80 mb-6">
              Leading the Future of
              <span className="dark:text-yellow-500 text-yellow-800"> Sustainable Mining</span>
            </h2>
            <p className="dark:text-gray-400 text-gray-700 mb-6">
              Since our establishment, RiftRock Mining Services has been at the forefront of 
              innovative mining practices. We combine decades of expertise with cutting-edge 
              technology to deliver exceptional results while maintaining our commitment to 
              environmental stewardship.
            </p>
            <p className="dark:text-gray-400 text-gray-700 mb-8">
              Our team of industry experts and dedicated professionals works tirelessly to 
              ensure that every project meets the highest standards of safety, efficiency, 
              and sustainability.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="inline-flex p-3 dark:bg-yellow-500 bg-yellow-700 rounded-lg mb-3">
                    <stat.icon className="w-6 h-6 text-slate-900" />
                  </div>
                  <div className="text-2xl font-bold dark:text-white text-gray-400">{stat.value}</div>
                  <div className="text-sm dark:text-gray-400 text-gray-700">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-w-12 aspect-h-6 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1579547944212-c4f4961a8dd8?auto=format&fit=crop&q=80"
                alt="Mining operations"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 dark:bg-yellow-500 bg-yellow-700 rounded-lg -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
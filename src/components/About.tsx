import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Users, Globe2, Leaf } from 'lucide-react';
import RiftRockLogoWithText from './RiftRockLogoWithText';

const stats = [
  { icon: Award, value: '25+', label: 'Extensive aggregation of Years of Experience' },
  // { icon: Users, value: '1000+', label: 'Team Members' },
  // { icon: Globe2, value: '15', label: 'Countries' },
  { icon: Leaf, value: '100%', label: 'Sustainable and Efficient outputs' }
];

export const About = ({ isDarkMode = false }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="about" className="py-20 dark:bg-slate-800 bg-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
            initial={{ opacity: 0.5, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
          <RiftRockLogoWithText
            className='w-64 h-64 mx-auto mb-4'
            isDarkMode={isDarkMode}
          />
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold dark:text-white text-black/80 mb-6">
              <span className="dark:text-yellow-500 text-yellow-800">Empowering Mining Excellence </span>
              through Reliable Services
            </h2>
            <p className="dark:text-gray-400 text-gray-700 my-8">
            RiftRock is a leading provider of comprehensive mining services, dedicated to delivering exceptional support to the mining industry. Our expertise spans general consumables, transportation, and rental equipment, ensuring seamless operations for our clients.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
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

            <div className='relative z-10 w-fit mt-20'>
              <div className='absolute -top-4 -bottom-4 -left-2 p-2 rounded-l-md w-[50%] -z-10 rotate-12 dark:bg-yellow-500 bg-yellow-700'></div>
              <h3 className="text-2xl font-bold dark:text-white text-black/80 mb-4 z-50">Our Mission</h3>
            </div>
            <p className="dark:text-gray-400 text-gray-700 my-8">
              To provide top-notch mining services, fostering long-term partnerships with our clients, while prioritizing safety, efficiency, and sustainability.
            </p>

            <div className='relative z-10 w-fit mt-16'>
              <div className='absolute -top-4 -bottom-4 -left-2 p-2 rounded-l-md w-[50%] -z-10 rotate-12 dark:bg-yellow-500 bg-yellow-700'></div>
              <h3 className="text-2xl font-bold dark:text-white text-black/80 mb-4 z-50">Our Vision</h3>
            </div>
            <p className="dark:text-gray-400 text-gray-700 my-8">
              To become the preferred mining services partner in [Region/Industry], recognized for our commitment to excellence, innovation, and customer satisfaction.
            </p>
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
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Drill, Truck, HardHat, Factory } from 'lucide-react';

const services = [
  {
    icon: Drill,
    title: 'Exploration & Drilling',
    description: 'State-of-the-art exploration techniques and drilling services for optimal resource discovery.'
  },
  {
    icon: Truck,
    title: 'Mining Operations',
    description: 'Efficient and sustainable mining operations with advanced equipment and expert teams.'
  },
  {
    icon: HardHat,
    title: 'Safety Consulting',
    description: 'Comprehensive safety protocols and consulting services for mining operations.'
  },
  {
    icon: Factory,
    title: 'Processing Solutions',
    description: 'Modern mineral processing solutions utilizing cutting-edge technology.'
  }
];

export const Services = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="services" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Comprehensive mining solutions tailored to meet your specific needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <service.icon className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
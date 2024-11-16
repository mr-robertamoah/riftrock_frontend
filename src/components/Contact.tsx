import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import RiftRockLogo from './RiftRockLogo';
import { div, p } from 'framer-motion/client';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    details: [
      {type: 'House #', value: 'Plot 67 & 69'},
      {type: 'Street Name', value: 'Kofi Yeboah Rd'},
      {type: 'Postal Address', value: 'BS0318'},
      {type: 'Suburb', value: 'Watchman'},
      {type: 'City', value: 'Sunyani'},
    ]
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: ['+233 209 249 556']
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: ['info@riftrock.org', 'support@riftrock.org']
  },
  {
    icon: Clock,
    title: 'Working Hours',
    details: ['Monday - Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 1:00 PM']
  }
];

export const Contact = ({ isDarkMode = false }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="contact" className="py-20 dark:bg-slate-900 bg-slate-200">
      <RiftRockLogo
        className='w-20 h-20 md:w-28 mb-4 md:h-28 mx-auto'
        isDarkMode={!isDarkMode}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold dark:text-white text-black/80 mb-4">Get in Touch</h2>
          <p className="dark:text-gray-400 text-gray-700 max-w-2xl mx-auto">
            Ready to start your next mining project? Contact us today for expert consultation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="dark:bg-slate-800 bg-slate-700 p-8 rounded-lg h-fit"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send Us a Message</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium dark:text-gray-400 text-gray-200 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 dark:bg-slate-700 bg-slate-200 border border-slate-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-400 text-gray-200 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 dark:bg-slate-700 bg-slate-200 border border-slate-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-400 text-gray-200 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 dark:bg-slate-700 bg-slate-200 border border-slate-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  placeholder="Your message"
                />
              </div>
              <button
                type="submit"
                className="w-full dark:bg-yellow-500 bg-yellow-800 dark:text-slate-900 text-slate-300 py-3 px-6 rounded-lg font-semibold
                         hover:bg-yellow-400 transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-6"
          >
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="dark:bg-slate-800 bg-slate-700 p-6 rounded-lg"
              >
                <div className="w-12 mx-auto h-12 dark:bg-yellow-500 bg-yellow-800 rounded-lg flex items-center justify-center mb-4">
                  <info.icon className="w-6 h-6 dark:text-slate-900 text-slate-400" />
                </div>
                <h4 className="text-lg text-center font-semibold text-white mb-2">{info.title}</h4>
                {info.details.map((detail, i) => {
                  if (typeof detail == "string")
                    return <p key={i} className="text-gray-300 text-ellipsis w-full dark:text-gray-400">{detail}</p>

                  return (
                    <div key={i} className='mb-3'>
                      <p className="text-gray-200 text-xs text-ellipsis ml-10 w-full dark:text-gray-300">{detail.type}</p>
                      <p className="text-gray-300 text-ellipsis w-full dark:text-gray-400">{detail.value}</p>
                    </div>
                  )
                })}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
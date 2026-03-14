import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { isAuthenticated } from '../utils/auth';

const DegreeSelection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth?redirect=select-degree');
    }
  }, [navigate]);

  const degrees = [
    { category: 'Engineering', items: ['B.Tech', 'M.Tech', 'B.E', 'Diploma Engineering'] },
    { category: 'Management', items: ['MBA', 'BBA', 'PGDM'] },
    { category: 'Commerce', items: ['B.Com', 'M.Com', 'CA', 'CMA', 'CS'] },
    { category: 'Finance', items: ['Financial Analyst', 'Investment Banking', 'Accounting'] },
    { category: 'Law', items: ['LLB', 'LLM', 'Corporate Law'] },
    { category: 'Medical', items: ['MBBS', 'BDS', 'Nursing', 'Pharmacy'] },
    { category: 'Arts & Humanities', items: ['BA', 'MA', 'Journalism', 'Psychology'] },
    { category: 'IT & Computer', items: ['BCA', 'MCA', 'Data Science', 'AI & ML'] },
  ];

  const handleSelect = (degree) => {
    localStorage.setItem('selected_degree', degree);
    navigate('/select-domain');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gradient mb-4">
              Select Your Degree
            </h1>
            <p className="text-xl text-zinc-400">Choose your field of study</p>
          </motion.div>

          <div className="space-y-12">
            {degrees.map((degreeGroup, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <h2 className="text-2xl font-heading font-semibold text-white mb-6">
                  {degreeGroup.category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {degreeGroup.items.map((degree, i) => (
                    <GlassCard
                      key={i}
                      className="p-6 cursor-pointer text-center"
                      onClick={() => handleSelect(degree)}
                      data-testid={`degree-card-${degree.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      <h3 className="text-lg font-semibold text-white">{degree}</h3>
                    </GlassCard>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DegreeSelection;

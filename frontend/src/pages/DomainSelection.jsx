import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { isAuthenticated } from '../utils/auth';
import { ArrowLeft } from 'lucide-react';

const DomainSelection = () => {
  const navigate = useNavigate();
  const [selectedDegree, setSelectedDegree] = useState('');
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth?redirect=select-degree');
      return;
    }
    const degree = localStorage.getItem('selected_degree');
    if (!degree) {
      navigate('/select-degree');
      return;
    }
    setSelectedDegree(degree);
    setDomains(getDomainsForDegree(degree));
  }, [navigate]);

  const getDomainsForDegree = (degree) => {
    const domainMap = {
      'B.Tech': [
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'Data Scientist',
        'Machine Learning Engineer',
        'DevOps Engineer',
        'Cybersecurity Analyst',
        'Cloud Engineer',
        'Software Engineer',
        'Mobile App Developer',
      ],
      'MBA': [
        'Marketing Manager',
        'HR Manager',
        'Business Analyst',
        'Product Manager',
        'Operations Manager',
        'Sales Manager',
        'Strategy Consultant',
        'Finance Manager',
      ],
      'Financial Analyst': [
        'Investment Banker',
        'Financial Analyst',
        'Accountant',
        'Risk Analyst',
        'Portfolio Manager',
        'Credit Analyst',
      ],
      'LLB': [
        'Corporate Lawyer',
        'Criminal Lawyer',
        'Legal Advisor',
        'Litigation Specialist',
        'Contract Specialist',
      ],
      'MBBS': [
        'General Physician',
        'Surgeon',
        'Pediatrician',
        'Cardiologist',
        'Radiologist',
      ],
    };

    return domainMap[degree] || [
      'Software Engineer',
      'Business Analyst',
      'Project Manager',
      'Consultant',
      'Analyst',
      'Specialist',
    ];
  };

  const handleSelect = (domain) => {
    localStorage.setItem('selected_domain', domain);
    navigate('/select-difficulty');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate('/select-degree')}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              data-testid="back-btn"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm mb-4">
              {selectedDegree}
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gradient mb-4">
              Select Your Domain
            </h1>
            <p className="text-xl text-zinc-400">Choose your target job role</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard
                  className="p-6 cursor-pointer text-center"
                  onClick={() => handleSelect(domain)}
                  data-testid={`domain-card-${domain.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <h3 className="text-lg font-semibold text-white">{domain}</h3>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainSelection;

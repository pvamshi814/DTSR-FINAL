import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { isAuthenticated } from '../utils/auth';
import { ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';

const DifficultySelection = () => {
  const navigate = useNavigate();
  const [selectedDegree, setSelectedDegree] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth?redirect=select-degree');
      return;
    }
    const degree = localStorage.getItem('selected_degree');
    const domain = localStorage.getItem('selected_domain');
    if (!degree || !domain) {
      navigate('/select-degree');
      return;
    }
    setSelectedDegree(degree);
    setSelectedDomain(domain);
  }, [navigate]);

  const difficulties = [
    {
      level: 'Easy',
      emoji: '🟢',
      description: 'Beginner-friendly questions for those starting out',
      color: 'from-green-600 to-emerald-600',
    },
    {
      level: 'Medium',
      emoji: '🟡',
      description: 'Industry-level questions for intermediate learners',
      color: 'from-yellow-600 to-orange-600',
    },
    {
      level: 'Hard',
      emoji: '🔴',
      description: 'Advanced technical interviews for experts',
      color: 'from-red-600 to-pink-600',
    },
  ];

  const handleSelect = async (difficulty) => {
    setLoading(true);
    try {
      const res = await api.post('/interview/generate', {
        degree: selectedDegree,
        domain: selectedDomain,
        difficulty: difficulty,
      });
      localStorage.setItem('interview_id', res.data.interview_id);
      localStorage.setItem('selected_difficulty', difficulty);
      navigate('/interview');
      toast.success('Interview prepared! Good luck!');
    } catch (error) {
      toast.error('Failed to generate interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate('/select-domain')}
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
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <span className="px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm">
                {selectedDegree}
              </span>
              <span className="px-4 py-2 rounded-full bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 text-sm">
                {selectedDomain}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gradient mb-4">
              Select Difficulty
            </h1>
            <p className="text-xl text-zinc-400">Choose your challenge level</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {difficulties.map((diff, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard
                  className="p-8 cursor-pointer text-center"
                  onClick={() => !loading && handleSelect(diff.level)}
                  data-testid={`difficulty-card-${diff.level.toLowerCase()}`}
                >
                  <div className="text-6xl mb-4">{diff.emoji}</div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-3">
                    {diff.level}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {diff.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {loading && (
            <div className="text-center mt-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
              <p className="text-zinc-400 mt-4">Generating your interview...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DifficultySelection;

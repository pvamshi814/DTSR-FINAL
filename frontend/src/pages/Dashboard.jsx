import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Clock, Award, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { isAuthenticated } from '../utils/auth';
import api from '../utils/api';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_interviews: 0,
    completed_interviews: 0,
    average_score: 0,
    recent_interviews: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth');
      return;
    }
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getScoreBadge = (score) => {
    if (!score) return null;
    if (score >= 8) return 'bg-green-600/20 text-green-400 border-green-500/30';
    if (score >= 6) return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-600/20 text-red-400 border-red-500/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
                Your Dashboard
              </h1>
              <p className="text-zinc-400">Track your interview performance</p>
            </motion.div>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/select-degree')}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all"
              data-testid="new-interview-btn"
            >
              <Plus size={20} />
              New Interview
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-6" hover={false}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <Clock size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-heading font-bold text-white">
                      {stats.total_interviews}
                    </div>
                    <div className="text-sm text-zinc-400">Total Interviews</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6" hover={false}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-600/20 flex items-center justify-center">
                    <Award size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-heading font-bold text-white">
                      {stats.completed_interviews}
                    </div>
                    <div className="text-sm text-zinc-400">Completed</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-6" hover={false}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-600/20 flex items-center justify-center">
                    <TrendingUp size={24} className="text-pink-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-heading font-bold text-white">
                      {stats.average_score}
                      <span className="text-lg">/10</span>
                    </div>
                    <div className="text-sm text-zinc-400">Average Score</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-8" hover={false}>
              <h2 className="text-2xl font-heading font-semibold text-white mb-6">
                Recent Interviews
              </h2>
              {stats.recent_interviews.length > 0 ? (
                <div className="space-y-4">
                  {stats.recent_interviews.map((interview, idx) => (
                    <motion.div
                      key={interview.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                      onClick={() =>
                        interview.completed && navigate(`/feedback/${interview.id}`)
                      }
                      data-testid={`interview-card-${idx}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white font-heading font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-white font-semibold">
                            {interview.degree} - {interview.domain}
                          </div>
                          <div className="text-sm text-zinc-400 flex items-center gap-2 mt-1">
                            <Calendar size={14} />
                            {formatDate(interview.created_at)}
                            <span className="mx-1">•</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                interview.difficulty === 'Easy'
                                  ? 'bg-green-600/20 text-green-400'
                                  : interview.difficulty === 'Medium'
                                  ? 'bg-yellow-600/20 text-yellow-400'
                                  : 'bg-red-600/20 text-red-400'
                              }`}
                            >
                              {interview.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {interview.score && (
                          <div
                            className={`px-4 py-2 rounded-full border ${
                              getScoreBadge(interview.score)
                            } font-semibold`}
                          >
                            {interview.score}/10
                          </div>
                        )}
                        {!interview.completed && (
                          <div className="px-4 py-2 rounded-full bg-zinc-700/50 text-zinc-400 text-sm">
                            Incomplete
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-zinc-500 mb-4">No interviews yet</div>
                  <button
                    onClick={() => navigate('/select-degree')}
                    className="px-6 py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all"
                  >
                    Start Your First Interview
                  </button>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

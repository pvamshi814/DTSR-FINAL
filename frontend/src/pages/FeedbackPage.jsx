import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, MessageSquare, Lightbulb, Home } from 'lucide-react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { isAuthenticated } from '../utils/auth';
import api from '../utils/api';
import { toast } from 'sonner';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const FeedbackPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth');
      return;
    }
    fetchFeedback();
  }, [navigate]);

  const fetchFeedback = async () => {
    try {
      const res = await api.get(`/interview/${interviewId}`);
      if (res.data.feedback) {
        setFeedback(res.data.feedback);
      } else {
        toast.error('Feedback not available');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to load feedback');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  const radarData = {
    labels: ['Technical', 'Communication', 'Confidence', 'Clarity', 'Problem Solving'],
    datasets: [
      {
        label: 'Your Performance',
        data: [
          feedback.technical_knowledge || 0,
          feedback.communication || 0,
          feedback.confidence || 0,
          feedback.clarity || 0,
          feedback.problem_solving || 0,
        ],
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(124, 58, 237, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(124, 58, 237, 1)',
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
          color: '#A3A3A3',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: '#FAFAFA',
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: true,
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 8) return 'from-green-600 to-emerald-600';
    if (score >= 6) return 'from-yellow-600 to-orange-600';
    return 'from-red-600 to-pink-600';
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 mb-4 shadow-[0_0_30px_rgba(124,58,237,0.4)]">
              <Trophy size={40} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gradient mb-4">
              Interview Complete!
            </h1>
            <div className="flex flex-col items-center gap-2">
              <p className="text-xl text-zinc-400">Here's your comprehensive performance analysis</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Fair Evaluation Engine: Active
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-8 text-center" hover={false}>
                <div className="text-sm font-medium text-zinc-400 mb-3">Overall Score</div>
                <div
                  className={`text-6xl font-heading font-bold mb-2 ${getScoreColor(
                    feedback.overall_score
                  )}`}
                  data-testid="overall-score"
                >
                  {feedback.overall_score}
                  <span className="text-2xl">/10</span>
                </div>
                <div
                  className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${getScoreBg(
                    feedback.overall_score
                  )} text-white text-sm font-medium`}
                >
                  {feedback.overall_score >= 8
                    ? 'Excellent'
                    : feedback.overall_score >= 6
                    ? 'Good'
                    : 'Needs Improvement'}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-8 text-center" hover={false}>
                <div className="text-sm font-medium text-zinc-400 mb-3">Technical Knowledge</div>
                <div className="text-5xl font-heading font-bold text-purple-400 mb-2">
                  {feedback.technical_knowledge}/10
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-8 text-center" hover={false}>
                <div className="text-sm font-medium text-zinc-400 mb-3">Communication</div>
                <div className="text-5xl font-heading font-bold text-cyan-400 mb-2">
                  {feedback.communication}/10
                </div>
              </GlassCard>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard className="p-8 h-full" hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <TrendingUp size={20} className="text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-heading font-semibold text-white">
                    Skill Analysis
                  </h2>
                </div>
                <div className="h-80">
                  <Radar data={radarData} options={radarOptions} />
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              <GlassCard className="p-8 h-full" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-600/20 flex items-center justify-center">
                      <MessageSquare size={20} className="text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-heading font-semibold text-white">
                      Detailed Feedback
                    </h2>
                  </div>
                  <div className="hidden sm:block text-[10px] font-bold text-cyan-400/50 uppercase tracking-widest border border-cyan-400/20 px-2 py-1 rounded">
                    Partial Credit Awarded
                  </div>
                </div>
                <div className="space-y-6 text-zinc-300 leading-relaxed text-lg" data-testid="detailed-feedback">
                  {feedback.detailed_feedback?.split('\n').filter(p => p.trim()).map((line, i) => {
                    const trimmedLine = line.trim();
                    
                    // Handle Headers (### or **Header**)
                    if (trimmedLine.startsWith('###')) {
                      return (
                        <h3 key={i} className="text-xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">
                          {trimmedLine.replace('###', '').trim()}
                        </h3>
                      );
                    }

                    // Handle Technical Pillars (- **Pillar**: Status)
                    const pillarMatch = trimmedLine.match(/^- \*\*(.*?)\*\*: (.*)$/);
                    if (pillarMatch) {
                      const [, pillar, status] = pillarMatch;
                      const isGood = status.toLowerCase().includes('demonstrated') && !status.toLowerCase().includes('not');
                      const isPartial = status.toLowerCase().includes('partially');
                      
                      return (
                        <div key={i} className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.07] transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                            <span className="font-bold text-white tracking-wide text-base group-hover:text-purple-400 transition-colors uppercase">
                              {pillar}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                              isGood ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                              isPartial ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                              'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${isGood ? 'bg-green-400' : isPartial ? 'bg-yellow-400' : 'bg-red-400'}`} />
                              {isGood ? 'Demonstrated' : isPartial ? 'Partial' : 'Missing'}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-400 leading-snug">
                            {status.split('. ')[1] || status.replace(/.*demonstrated\.. /i, '')}
                          </p>
                        </div>
                      );
                    }

                    // Handle Bold Headers within text
                    if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                       return (
                        <p key={i} className="text-lg font-bold text-purple-400 mt-6 mb-2">
                          {trimmedLine.replace(/\*\*/g, '')}
                        </p>
                      );
                    }

                    // Default Paragraph
                    return (
                      <p key={i} className="relative pl-5 border-l-2 border-purple-500/20 py-1 hover:border-purple-500/50 transition-colors">
                        {trimmedLine.split('**').map((part, index) => 
                          index % 2 === 1 ? <strong key={index} className="text-white font-semibold">{part}</strong> : part
                        )}
                      </p>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-8" hover={false}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-600/20 flex items-center justify-center">
                    <Lightbulb size={20} className="text-pink-400" />
                  </div>
                  <h2 className="text-2xl font-heading font-semibold text-white">
                     Suggestions to Improve
                  </h2>
                </div>
                <div className="text-xs font-medium text-pink-400/70 italic">
                  Clear-cut actionable steps for growth
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <ul className="space-y-4">
                  {feedback.improvements?.slice(0, Math.ceil(feedback.improvements.length / 2)).map((improvement, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-zinc-300"
                      data-testid={`improvement-${idx}`}
                    >
                      <span className="inline-block w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        {idx + 1}
                      </span>
                      <span className="text-base leading-tight">{improvement}</span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-4">
                  {feedback.improvements?.slice(Math.ceil(feedback.improvements.length / 2)).map((improvement, idx) => {
                    const actualIdx = idx + Math.ceil(feedback.improvements.length / 2);
                    return (
                      <li
                        key={actualIdx}
                        className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-zinc-300"
                        data-testid={`improvement-${actualIdx}`}
                      >
                        <span className="inline-block w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                          {actualIdx + 1}
                        </span>
                        <span className="text-base leading-tight">{improvement}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </GlassCard>
          </motion.div>

          <div className="flex gap-4 justify-center mt-12">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-8 py-3 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all"
              data-testid="go-dashboard-btn"
            >
              <Home size={20} />
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/select-degree')}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all"
              data-testid="new-interview-btn"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;

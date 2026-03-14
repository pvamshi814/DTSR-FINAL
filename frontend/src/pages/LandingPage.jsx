import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Star, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { isAuthenticated } from '../utils/auth';

const LandingPage = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const handleStartInterview = () => {
    if (authenticated) {
      navigate('/select-degree');
    } else {
      navigate('/auth?redirect=select-degree');
    }
  };

  const careers = [
    { name: 'Engineering', icon: '⚙️' },
    { name: 'Management', icon: '💼' },
    { name: 'Finance', icon: '💰' },
    { name: 'Law', icon: '⚖️' },
    { name: 'Marketing', icon: '📢' },
    { name: 'Data Science', icon: '📊' },
    { name: 'Healthcare', icon: '🏥' },
    { name: 'Design', icon: '🎨' },
  ];

  const reviews = [
    {
      name: 'Priya Sharma',
      degree: 'B.Tech CSE',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      feedback: 'Practicing interviews here boosted my confidence massively. I cleared my placement interview in the first attempt.',
      rating: 5,
    },
    {
      name: 'Rahul Kumar',
      degree: 'MBA Marketing',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      feedback: 'The AI feedback was incredibly detailed. It helped me identify exactly what I needed to improve.',
      rating: 5,
    },
    {
      name: 'Ananya Patel',
      degree: 'B.Com Finance',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      feedback: 'Best interview preparation platform I have used. The questions are relevant and challenging.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 hero-gradient" />
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300 mb-8">
              <Sparkles size={16} />
              <span>Powered by AI</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-gradient mb-6 leading-none" data-testid="hero-headline">
              Ace Your Interviews<br />with AI.
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed" data-testid="hero-subheadline">
              Practice real interview questions powered by artificial intelligence and receive instant feedback to improve your skills.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleStartInterview}
                className="group px-8 py-4 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all duration-300 flex items-center gap-2"
                data-testid="start-interview-btn"
              >
                Start Mock Interview
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/auth?mode=demo')}
                className="px-8 py-4 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
                data-testid="try-demo-btn"
              >
                Try Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-5xl font-heading font-bold text-purple-400 mb-2">10,000+</div>
              <div className="text-zinc-400">Mock Interviews Taken</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-5xl font-heading font-bold text-cyan-400 mb-2">5,000+</div>
              <div className="text-zinc-400">Students Placed</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-5xl font-heading font-bold text-pink-400 mb-2">4.9</div>
              <div className="text-zinc-400">User Rating</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* User Reviews */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-semibold text-white mb-4">
              Loved by Students
            </h2>
            <p className="text-lg text-zinc-400">See what our users have to say</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-white">{review.name}</div>
                      <div className="text-sm text-zinc-400">{review.degree}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{review.feedback}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-semibold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-zinc-400">Get started in 3 simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Choose Degree & Domain', desc: 'Select your field of study and target job role' },
              { step: '2', title: 'AI Conducts Interview', desc: 'Answer 10 AI-generated questions via voice or text' },
              { step: '3', title: 'Get Instant Feedback', desc: 'Receive detailed performance analysis and improvement tips' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-3xl font-heading font-bold text-white mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Career Fields */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-semibold text-white mb-4">
              Supported Career Fields
            </h2>
            <p className="text-lg text-zinc-400">Practice for any domain</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {careers.map((career, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard className="p-6 text-center">
                  <div className="text-4xl mb-3">{career.icon}</div>
                  <div className="text-white font-medium">{career.name}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-gradient mb-6">
              Start Your AI Interview Now
            </h2>
            <p className="text-xl text-zinc-400 mb-10">
              Join thousands of students who have improved their interview skills
            </p>
            <button
              onClick={handleStartInterview}
              className="group px-10 py-5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-lg font-semibold hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] transition-all duration-300 flex items-center gap-3 mx-auto"
              data-testid="cta-start-btn"
            >
              Get Started Free
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-zinc-500 text-sm">
          <p>&copy; 2026 AI Mock Interview. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

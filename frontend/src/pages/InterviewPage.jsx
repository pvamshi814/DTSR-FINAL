import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send, Volume2, VolumeX, Loader } from 'lucide-react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { isAuthenticated } from '../utils/auth';
import api from '../utils/api';
import { toast } from 'sonner';

const InterviewPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [interviewId, setInterviewId] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth');
      return;
    }

    const id = localStorage.getItem('interview_id');
    if (!id) {
      navigate('/select-degree');
      return;
    }

    setInterviewId(id);
    fetchInterview(id);
  }, [navigate]);

  const fetchInterview = async (id) => {
    try {
      const res = await api.get(`/interview/${id}`);
      setQuestions(res.data.questions);
      setAnswers(new Array(res.data.questions.length).fill(''));
      setLoading(false);
      speakQuestion(res.data.questions[0]);
    } catch (error) {
      toast.error('Failed to load interview');
      navigate('/select-degree');
    }
  };

  const speakQuestion = async (questionText) => {
    try {
      setIsSpeaking(true);
      const res = await api.post('/tts/speak', { text: questionText });
      const audio = new Audio(`data:audio/mp3;base64,${res.data.audio}`);
      audioRef.current = audio;
      audio.play();
      audio.onended = () => setIsSpeaking(false);
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('file', audioBlob, 'audio.webm');

          try {
            const res = await api.post('/stt/transcribe', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAnswer(res.data.text);
          } catch (error) {
            toast.error('Failed to transcribe audio');
          }
        };

        mediaRecorder.start();
        setIsRecording(true);

        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            stream.getTracks().forEach((track) => track.stop());
            setIsRecording(false);
          }
        }, 10000);
      } catch (error) {
        toast.error('Microphone access denied');
      }
    } else {
      setIsRecording(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/interview/answer', {
        interview_id: interviewId,
        question_index: currentQuestion,
        answer: answer,
      });

      const newAnswers = [...answers];
      newAnswers[currentQuestion] = answer;
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswer('');
        speakQuestion(questions[currentQuestion + 1]);
        toast.success('Answer submitted!');
      } else {
        const res = await api.post(`/interview/complete?interview_id=${interviewId}`);
        toast.success('Interview completed!');
        navigate(`/feedback/${interviewId}`);
      }
    } catch (error) {
      toast.error('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-white mb-2">
                  AI Mock Interview
                </h1>
                <p className="text-zinc-400">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
              <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-cyan-600 transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <GlassCard className="p-8 h-full" hover={false}>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="relative mb-6">
                    <motion.div
                      animate={isSpeaking ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center"
                    >
                      <div className="w-28 h-28 rounded-full bg-zinc-900 flex items-center justify-center">
                        {isSpeaking ? (
                          <Volume2 size={48} className="text-purple-400" />
                        ) : (
                          <VolumeX size={48} className="text-zinc-600" />
                        )}
                      </div>
                    </motion.div>
                  </div>

                  <h2 className="text-center text-lg font-semibold text-white mb-4">
                    AI Interviewer
                  </h2>

                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        stopAudio();
                      } else {
                        speakQuestion(questions[currentQuestion]);
                      }
                    }}
                    className="px-6 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition-all text-sm"
                    data-testid="replay-question-btn"
                  >
                    {isSpeaking ? 'Stop' : 'Replay Question'}
                  </button>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <GlassCard className="p-8" hover={false}>
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-zinc-400 mb-3">Question:</h3>
                  <p className="text-xl text-white leading-relaxed" data-testid="question-text">
                    {questions[currentQuestion]}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-zinc-400 mb-3">Your Answer:</h3>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here or use the microphone..."
                    className="w-full h-32 px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-white resize-none"
                    data-testid="answer-textarea"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleVoiceInput}
                    disabled={isRecording}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full border transition-all ${
                      isRecording
                        ? 'bg-red-600 border-red-500 text-white'
                        : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                    }`}
                    data-testid="voice-input-btn"
                  >
                    {isRecording ? (
                      <>
                        <MicOff size={20} />
                        Recording...
                      </>
                    ) : (
                      <>
                        <Mic size={20} />
                        Voice Input
                      </>
                    )}
                  </button>

                  <button
                    onClick={submitAnswer}
                    disabled={submitting || !answer.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all disabled:opacity-50"
                    data-testid="submit-answer-btn"
                  >
                    {submitting ? (
                      <Loader className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Send size={20} />
                        {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
                      </>
                    )}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;

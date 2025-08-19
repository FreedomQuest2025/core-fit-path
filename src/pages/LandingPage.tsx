import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Clock, Target, TrendingUp, Users, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const features = [
    {
      icon: Clock,
      title: "20-30 Minute Sessions",
      description: "Perfect for busy professionals. Maximum results in minimal time.",
      color: "text-primary",
    },
    {
      icon: Target,
      title: "Personalized Programs",
      description: "Adaptive 12-week programs that evolve with your progress.",
      color: "text-secondary",
    },
    {
      icon: Zap,
      title: "Hybrid Training",
      description: "Strength, mobility, cardio, and recovery all in one program.",
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Visual progress tracking with detailed analytics and insights.",
      color: "text-strength",
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Professional workout programs designed by fitness experts.",
      color: "text-mobility",
    },
    {
      icon: Activity,
      title: "Smart Adaptation",
      description: "Programs that adjust based on your performance and feedback.",
      color: "text-speed",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">FitSphere</h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {user ? (
              <Button onClick={() => navigate('/dashboard')} className="bg-primary hover:bg-primary/90">
                Go to Dashboard
              </Button>
            ) : (
              <Button onClick={() => navigate('/auth')} variant="outline">
                Sign In
              </Button>
            )}
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Transform Your Fitness in Just 20 Minutes
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Personalized hybrid training for busy professionals. Build strength, mobility, speed, and endurance with our science-backed micro-sessions.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg animate-pulse-glow"
            >
              Start Your Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold mb-4">Why FitSphere Works</h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Designed specifically for ambitious professionals who want maximum results with minimal time investment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/20">
                <CardContent className="p-6 text-center">
                  <feature.icon className={`w-12 h-12 mx-auto mb-4 ${feature.color}`} />
                  <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 border-y border-border/50">
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h3 className="text-4xl font-bold mb-6">Ready to Transform Your Fitness?</h3>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of professionals who've revolutionized their fitness with our micro-sessions.
            </p>
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg"
            >
              Get Started Today
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 FitSphere. Transform your fitness, transform your life.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
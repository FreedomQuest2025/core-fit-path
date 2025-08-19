import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProgressRing } from '@/components/ProgressRing';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Zap, 
  Target, 
  Award,
  PlayCircle,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Workout {
  id: string;
  title: string;
  type: string;
  duration: number;
  exercises: any;
  week: number;
  day: number;
}

interface UserProgress {
  completed: boolean;
  rating?: number;
  completion_date?: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<UserProgress[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchTodayWorkout();
    fetchWeeklyProgress();
  }, [user, navigate]);

  const fetchTodayWorkout = async () => {
    try {
      const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayOfWeek = today === 0 ? 7 : today; // Convert Sunday to 7
      
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('day', dayOfWeek)
        .eq('week', 1) // Start with week 1
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching workout:', error);
        return;
      }

      setTodayWorkout(data);
    } catch (error) {
      console.error('Error fetching today workout:', error);
    }
  };

  const fetchWeeklyProgress = async () => {
    try {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user?.id)
        .gte('completion_date', startOfWeek.toISOString())
        .order('completion_date', { ascending: false });

      if (error) {
        console.error('Error fetching progress:', error);
        return;
      }

      setWeeklyProgress(data || []);
      
      // Calculate streak
      const completedDays = data?.filter(p => p.completed).length || 0;
      setCurrentStreak(completedDays);
    } catch (error) {
      console.error('Error fetching weekly progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const startWorkout = () => {
    if (todayWorkout) {
      navigate(`/workout/${todayWorkout.id}`);
    }
  };

  const getWorkoutTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      strength: 'bg-strength',
      mobility: 'bg-mobility',
      speed: 'bg-speed',
      recovery: 'bg-recovery',
      core: 'bg-core',
      plyometrics: 'bg-speed',
      functional: 'bg-core',
    };
    return colors[type] || 'bg-primary';
  };

  const weeklyCompletionRate = Math.round((weeklyProgress.filter(p => p.completed).length / 7) * 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Welcome back, {user?.user_metadata?.name || 'Athlete'}!</h1>
              <p className="text-sm text-muted-foreground">Ready for today's challenge?</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <ProgressRing 
                  progress={weeklyCompletionRate} 
                  size={80} 
                  strokeWidth={6}
                  color="hsl(var(--accent))"
                >
                  <TrendingUp className="w-6 h-6 text-accent" />
                </ProgressRing>
                <h3 className="font-semibold mt-4">Week Progress</h3>
                <p className="text-2xl font-bold text-accent">{weeklyCompletionRate}%</p>
                <p className="text-sm text-muted-foreground">
                  {weeklyProgress.filter(p => p.completed).length}/7 workouts
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">Current Streak</h3>
                <p className="text-3xl font-bold text-primary">{currentStreak}</p>
                <p className="text-sm text-muted-foreground">days in a row</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-semibold">This Week</h3>
                <p className="text-3xl font-bold text-secondary">
                  {weeklyProgress.filter(p => p.completed).length}
                </p>
                <p className="text-sm text-muted-foreground">workouts completed</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Today's Workout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="overflow-hidden">
            <div className={`h-2 ${todayWorkout ? getWorkoutTypeColor(todayWorkout.type) : 'bg-muted'}`} />
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Today's Workout</CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardDescription>
                </div>
                <Calendar className="w-6 h-6 text-muted-foreground" />
              </div>
            </CardHeader>
            
            <CardContent>
              {todayWorkout ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{todayWorkout.title}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary" className="capitalize">
                          {todayWorkout.type}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {todayWorkout.duration} min
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Target className="w-4 h-4 mr-1" />
                          {todayWorkout.exercises.length} exercises
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Today's Focus:</h4>
                    <p className="text-sm text-muted-foreground">
                      {todayWorkout.type === 'strength' && "Build muscular strength and power with compound movements."}
                      {todayWorkout.type === 'mobility' && "Improve flexibility and joint mobility for better movement quality."}
                      {todayWorkout.type === 'speed' && "Boost cardiovascular fitness and metabolic conditioning."}
                      {todayWorkout.type === 'recovery' && "Active recovery to promote healing and reduce stress."}
                      {todayWorkout.type === 'core' && "Strengthen your core for better stability and performance."}
                      {todayWorkout.type === 'plyometrics' && "Explosive power training for athletic performance."}
                      {todayWorkout.type === 'functional' && "Real-world movement patterns for daily life."}
                    </p>
                  </div>

                  <Button 
                    onClick={startWorkout}
                    size="lg" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Start Workout ({todayWorkout.duration} min)
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Rest Day</h3>
                  <p className="text-muted-foreground">
                    Take a well-deserved break today. Recovery is just as important as training!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => navigate('/workouts')}
          >
            <Target className="w-6 h-6" />
            <span className="text-sm">Browse Workouts</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => navigate('/progress')}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-sm">View Progress</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => navigate('/profile')}
          >
            <User className="w-6 h-6" />
            <span className="text-sm">Profile</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => navigate('/subscription')}
          >
            <Award className="w-6 h-6" />
            <span className="text-sm">Subscription</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
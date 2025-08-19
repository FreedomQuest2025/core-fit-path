import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { ProgressRing } from './ProgressRing';

interface ExerciseTimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  autoStart?: boolean;
  title?: string;
}

export const ExerciseTimer = ({ 
  duration, 
  onComplete, 
  autoStart = false,
  title = "Exercise Timer"
}: ExerciseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            onComplete?.();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center space-y-6 p-6 bg-card rounded-lg border border-border"
    >
      <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      
      <ProgressRing
        progress={progress}
        size={160}
        strokeWidth={12}
        color={isCompleted ? "hsl(var(--accent))" : "hsl(var(--primary))"}
      >
        <div className="text-center">
          <motion.div
            key={timeLeft}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className={`text-3xl font-bold ${isCompleted ? 'text-accent' : 'text-foreground'}`}
          >
            {formatTime(timeLeft)}
          </motion.div>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-accent font-medium"
            >
              Complete!
            </motion.div>
          )}
        </div>
      </ProgressRing>

      <div className="flex space-x-3">
        {!isCompleted && (
          <Button
            onClick={toggleTimer}
            size="lg"
            className={`
              ${isRunning 
                ? 'bg-destructive hover:bg-destructive/90' 
                : 'bg-primary hover:bg-primary/90'
              }
            `}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start
              </>
            )}
          </Button>
        )}
        
        <Button
          onClick={resetTimer}
          variant="outline"
          size="lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </div>

      {isRunning && (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-sm text-muted-foreground"
        >
          Keep going! 💪
        </motion.div>
      )}
    </motion.div>
  );
};
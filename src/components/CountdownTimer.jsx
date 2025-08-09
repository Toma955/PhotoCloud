import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set end date to 30 days from now
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-timer">
      <div className="timer-header">
        <span className="timer-icon">⏰</span>
        <span className="timer-label">Dostupno još</span>
      </div>
      
      <div className="timer-display">
        <div className="time-unit">
          <span className="time-value">{timeLeft.days.toString().padStart(2, '0')}</span>
          <span className="time-label">Dana</span>
        </div>
        
        <div className="time-separator">:</div>
        
        <div className="time-unit">
          <span className="time-value">{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className="time-label">Sati</span>
        </div>
        
        <div className="time-separator">:</div>
        
        <div className="time-unit">
          <span className="time-value">{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className="time-label">Min</span>
        </div>
        
        <div className="time-separator">:</div>
        
        <div className="time-unit">
          <span className="time-value">{timeLeft.seconds.toString().padStart(2, '0')}</span>
          <span className="time-label">Sec</span>
        </div>
      </div>
      

    </div>
  );
};

export default CountdownTimer; 
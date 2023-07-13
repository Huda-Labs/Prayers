import {Text, View} from 'native-base';
import React, {useEffect, useState, useCallback, useMemo, memo} from 'react';

interface CountDownProps {
  date: string | undefined;
}

const getTimeComponents = (timeRemaining: number) => {
  const seconds = Math.floor((timeRemaining / 1000) % 60);
  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
  const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  return {seconds, minutes, hours, days};
};

const CountDown: React.FC<CountDownProps> = ({date}) => {
  const calculateTimeRemaining = useCallback((): number => {
    if (date) {
      const now = new Date();
      const eventDate = new Date(date);
      return Math.max(eventDate.getTime() - now.getTime(), 0);
    }
    // Return 0 if date is undefined
    return 0;
  }, [date]);

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    if (date) {
      const timer = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [calculateTimeRemaining, date]);

  const {seconds, minutes, hours, days} = getTimeComponents(timeRemaining);

  const displayMessage = useMemo(() => {
    if (timeRemaining === 0) return "It's time";

    const timeComponents = [
      {value: days, label: 'day'},
      {value: hours, label: 'hr'},
      {value: minutes, label: 'min'},
      {value: seconds, label: 'sec'},
    ];

    // Filter out zero-valued time components and take the first two
    const [first, second] = timeComponents
      .filter(comp => comp.value > 0)
      .slice(0, 2);

    return (
      [
        `${first.value} ${first.label}${first.value > 1 ? 's' : ''}`,
        second &&
          `${second.value} ${second.label}${second.value > 1 ? 's' : ''}`,
      ]
        .filter(Boolean)
        .join(' ') + ' left'
    );
  }, [days, hours, minutes, seconds, timeRemaining]);

  if (!date) return <View></View>;

  return (
    <View>
      <Text>{displayMessage}</Text>
    </View>
  );
};

export default memo(CountDown);

import {t} from '@lingui/macro';
import {difference} from 'lodash';
import {
  Box,
  Button,
  ChevronLeftIcon,
  ChevronRightIcon,
  Flex,
  HStack,
  ScrollView,
  Text,
  ThreeDotsIcon,
} from 'native-base';
import {useCallback, useEffect, useState} from 'react';
import {RefreshControl} from 'react-native';
import {useStore} from 'zustand';
import {shallow} from 'zustand/shallow';
import {PrayersInOrder, getNextPrayer, getPrayerTimes} from '@/adhan';
import {AddCircleIcon} from '@/assets/icons/material_icons/add_circle';
import {ExploreIcon} from '@/assets/icons/material_icons/explore';
import PrayerTimesBox from '@/components/PrayerTimesBox';
import CountDown from '@/components/countdown_timer';
import {isRTL} from '@/i18n';

import {navigate} from '@/navigation/root_navigation';

import {CachedPrayerTimes} from '@/store/adhan_calc_cache';
import {homeStore} from '@/store/home';
import {settings} from '@/store/settings';

import {getArabicDateInEng, getDayName, getFormattedDate} from '@/utils/date';
import {askForLocationService} from '@/utils/dialogs';
import {askPermissions} from '@/utils/permission';

type DayDetails = {
  dateString: string;
  dayName: string;
  arabicDate: string;
  isToday: boolean;
};

function getDayDetails(date: Date): DayDetails {
  return {
    dayName: getDayName(date),
    dateString: getFormattedDate(date),
    arabicDate: getArabicDate(date),
    isToday: date.toDateString() === new Date().toDateString(),
  };
}

export function Home() {
  const [
    currentDate,
    increaseCurrentDateByOne,
    decreaseCurrentDateByOne,
    updateCurrentDate,
    resetCurrentDate,
  ] = useStore(homeStore, state => [
    state.date,
    state.increaseCurrentDateByOne,
    state.decreaseCurrentDateByOne,
    state.updateCurrentDate,
    state.resetCurrentDate,
  ]);

  const impactfulSettings = useStore(
    settings,
    s => ({
      NUMBERING_SYSTEM: s.NUMBERING_SYSTEM,
      SELECTED_ARABIC_CALENDAR: s.SELECTED_ARABIC_CALENDAR,
      SELECTED_SECONDARY_CALENDAR: s.SELECTED_SECONDARY_CALENDAR,
      CALC_SETTINGS_HASH: s.CALC_SETTINGS_HASH,
      HIDDEN_PRAYERS: s.HIDDEN_PRAYERS,
      DELIVERED_ALARM_TIMESTAMPS: s.DELIVERED_ALARM_TIMESTAMPS,
      HIGHLIGHT_CURRENT_PRAYER: s.HIGHLIGHT_CURRENT_PRAYER,
    }),
    shallow,
  );

  const [prayerTimes, setPrayerTimes] = useState<CachedPrayerTimes | undefined>(
    getPrayerTimes(currentDate),
  );

  const [day, setDay] = useState<DayDetails>(getDayDetails(currentDate));

  useEffect(() => {
    setDay(getDayDetails(currentDate));
    setPrayerTimes(getPrayerTimes(currentDate));
  }, [currentDate]);

  useEffect(() => {
    void askPermissions();
  }, []);

  useEffect(() => {
    updateCurrentDate();
  }, [impactfulSettings, updateCurrentDate]);

  const askForGps = useCallback(async () => {
    await askForLocationService(
      t`Qibla finder needs location service. If not enabled, location from app settings will be used.`,
    );
  }, []);

  const navigateToQiblaCompass = useCallback(async () => {
    await askForGps();
    navigate('QiblaCompass');
  }, [askForGps]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    updateCurrentDate();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [updateCurrentDate]);

  const {HIDDEN_WIDGET_PRAYERS: hiddenPrayers} = settings.getState();

  const visiblePrayerTimes = difference(PrayersInOrder, hiddenPrayers);
  const nextPrayerTime = getNextPrayer({
    prayers: visiblePrayerTimes,
  });
  const mosqueName = 'Masjid E Bilal';
  const mosqueLocation = 'Manchester';

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <HStack
        px="2"
        mt="-3"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        zIndex={100}>
        <HStack alignItems="center">
          <Box p={4}>
            <Text fontSize="xl" bold>
              {nextPrayerTime?.prayer.capitalizeFirstLetter()}
            </Text>
            <CountDown date={nextPrayerTime?.date.toISOString()} />
          </Box>
        </HStack>

        <HStack alignItems="center">
          <Button
            p="2"
            variant="ghost"
            onPress={() => {
              navigateToQiblaCompass();
            }}>
            <ExploreIcon color="white" size="2xl" />
          </Button>
          <Button
            p="2"
            marginRight="1"
            variant="ghost"
            onPress={() => {
              navigate('Settings');
            }}>
            <ThreeDotsIcon size="xl" color="white" />
          </Button>
        </HStack>
      </HStack>
      <Box safeArea flex={1} alignItems="center">
        <Box w="100%">
          <Box flex="1" alignItems="flex-end" p={4}>
            <Text fontSize="xs" bold>
              {mosqueName}
            </Text>
            <Text fontSize="xxs">{mosqueLocation}</Text>
          </Box>
        </Box>
        <HStack
          mt="2"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          direction={isRTL ? 'row-reverse' : 'row'}>
          <Button variant="ghost" onPress={decreaseCurrentDateByOne}>
            <Flex direction={isRTL ? 'row' : 'row-reverse'} alignItems="center">
              <ChevronLeftIcon size="xl" />
            </Flex>
          </Button>

          <Button onPress={resetCurrentDate} variant="ghost" py="2" px="1">
            <Flex
              alignItems="center"
              flexShrink={1}
              _text={{
                adjustsFontSizeToFit: true,
                fontSize: 'sm',
                noOfLines: 1,
                _light: {
                  color: 'yellow.600',
                },
                _dark: {
                  color: 'yellow.300',
                },
              }}>
              {day.arabicDate}
              <Text fontSize="xxs">{day.dateString}</Text>
            </Flex>
          </Button>

          <Button variant="ghost" onPress={increaseCurrentDateByOne}>
            <Flex direction={isRTL ? 'row' : 'row-reverse'} alignItems="center">
              <ChevronRightIcon size="xl" />
            </Flex>
          </Button>
        </HStack>
        <PrayerTimesBox
          prayerTimes={prayerTimes}
          settings={impactfulSettings}
        />
        <HStack space={3} justifyContent="center" mb="5" mt="5">
          <Button
            h="40"
            w="45%"
            bg="gray.200"
            rounded="md"
            shadow="1"
            onPress={() => {
              return navigate('QadaCounter');
            }}>
            <AddCircleIcon size="5xl" />
            <Text color="grey.400" fontSize="md">
              Quza
            </Text>
          </Button>
          <Button
            h="40"
            w="45%"
            bg="gray.200"
            rounded="md"
            shadow="1"
            onPress={() => {
              return navigate('QadaCounter');
            }}>
            <AddCircleIcon size="5xl" />
            <Text color="grey.400" fontSize="md">
              Tasbi
            </Text>
          </Button>
        </HStack>
      </Box>
    </ScrollView>
  );
}

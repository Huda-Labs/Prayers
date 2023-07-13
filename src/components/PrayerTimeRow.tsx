import {Flex, Text, Stack, Center, View} from 'native-base';
import {memo} from 'react';
import {NonPrayer, Prayer, translatePrayer} from '@/adhan';
import {MutedIcon} from '@/assets/icons/material_icons/muted';
import {getTime} from '@/utils/date';

type TimeRowProps = {
  date?: Date;
  prayer: Prayer;
  active?: boolean;
  isActiveDismissed?: boolean;
};

function PrayerTimeRow({
  date,
  prayer,
  active,
  isActiveDismissed,
}: TimeRowProps) {
  return (
    <Flex
      direction="row"
      width="100%"
      py="3"
      align="center"
      borderColor={active ? 'yellow.300' : 'red.100'}
      borderRadius="md"
      borderWidth="0"
      borderStyle={NonPrayer.includes(prayer) ? 'dotted' : 'solid'}
      marginBottom="0"
      marginTop="0"
      _light={{
        bg: active ? 'yellow.300' : null,
      }}
      _dark={{
        bg: active ? '#FFDC75' : null,
      }}
      padding="4">
      <Stack direction="row" justifyContent="space-between" width="100%">
        <View width="1/3" alignSelf="flex-start">
          {active && isActiveDismissed && <MutedIcon mx="2"></MutedIcon>}
          <Text
            _dark={{
              fontWeight: active ? 'bold' : 'normal',
              color: active ? 'black' : 'grey',
            }}>
            {translatePrayer(prayer)}
          </Text>
        </View>
        <Center width="1/4">
          {
            <Text
              fontSize="xs"
              _dark={{
                fontWeight: active ? 'bold' : 'normal',
                color: active ? 'black' : 'grey',
              }}>
              {date ? getTime(date) : '--:--'}
            </Text>
          }
        </Center>
        <Center width="1/4">
          {
            <Text
              fontSize="xs"
              _dark={{
                fontWeight: active ? 'bold' : 'normal',
                color: active ? 'black' : 'grey',
              }}>
              {date ? getTime(date) : '--:--'}
            </Text>
          }
        </Center>
      </Stack>
    </Flex>
  );
}

export default memo(PrayerTimeRow);

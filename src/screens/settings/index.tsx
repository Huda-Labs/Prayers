import {Box, FlatList} from 'native-base';
import {memo, useCallback, useEffect} from 'react';
import {useStore} from 'zustand';
import {shallow} from 'zustand/shallow';
import SettingsListItem from './settings_list_item';
import {AlarmIcon} from '@/assets/icons/material_icons/alarm';
import {BatteryChargingIcon} from '@/assets/icons/material_icons/battery_charging';
import {BrightnessMediumIcon} from '@/assets/icons/material_icons/brightness_medium';
import {CalculateIcon} from '@/assets/icons/material_icons/calculate';
import {DevModeIcon} from '@/assets/icons/material_icons/dev_mode';
import {ExploreIcon} from '@/assets/icons/material_icons/explore';
import {InfoIcon} from '@/assets/icons/material_icons/info';
import {NotificationsActiveIcon} from '@/assets/icons/material_icons/notifications_active';
import {SaveIcon} from '@/assets/icons/material_icons/save';
import {VolumeUpIcon} from '@/assets/icons/material_icons/volume_up';
import {WidgetIcon} from '@/assets/icons/material_icons/widget';
import {RootStackParamList} from '@/navigation/types';
import {clearCache} from '@/store/adhan_calc_cache';
import {alarmSettings} from '@/store/alarm';
import {calcSettings} from '@/store/calculation';
import {reminderSettings} from '@/store/reminder';
import {settings, useSettings} from '@/store/settings';
import {setNextAdhan} from '@/tasks/set_next_adhan';
import {setReminders} from '@/tasks/set_reminder';
import {updateWidgets} from '@/tasks/update_widgets';
import {sha256} from '@/utils/hash';
import useNoInitialEffect from '@/utils/hooks/use_update_effect';
import {askPermissions} from '@/utils/permission';

type ScreenListItem = {
  name: keyof RootStackParamList;
  icon: typeof BrightnessMediumIcon;
};

const settingsScreenList: ScreenListItem[] = [
  {
    name: 'BackupSettings',
    icon: SaveIcon,
  },
  {
    name: 'DisplaySettings',
    icon: BrightnessMediumIcon,
  },
  {
    name: 'LocationSettings',
    icon: ExploreIcon,
  },
  {
    name: 'NotificationSettings',
    icon: NotificationsActiveIcon,
  },
  {
    name: 'AdhanSettings',
    icon: VolumeUpIcon,
  },
  {
    name: 'CalculationSettings',
    icon: CalculateIcon,
  },
  {
    name: 'FixCommonProblemsSettings',
    icon: BatteryChargingIcon,
  },
  {
    name: 'WidgetSettings',
    icon: WidgetIcon,
  },
  {
    name: 'RemindersSettings',
    icon: AlarmIcon,
  },
  {
    name: 'AboutSettings',
    icon: InfoIcon,
  },
];

if (settings.getState().DEV_MODE) {
  settingsScreenList.push({
    name: 'DevSettings',
    icon: DevModeIcon,
  });
}

function Settings() {
  const {calendarType, selectedAdhans, HIGHLIGHT_CURRENT_PRAYER, BYPASS_DND} =
    useStore(
      settings,
      s => ({
        calendarType: s.SELECTED_ARABIC_CALENDAR,
        selectedAdhans: s.SELECTED_ADHAN_ENTRIES,
        HIGHLIGHT_CURRENT_PRAYER: s.HIGHLIGHT_CURRENT_PRAYER,
        BYPASS_DND: s.BYPASS_DND,
      }),
      shallow,
    );
  const calcSettingsState = useStore(calcSettings, state => state);
  const alarmSettingsState = useStore(alarmSettings, state => state);
  const reminderSettingsState = useStore(reminderSettings, state => state);
  const [calcSettingsHash, setCalcSettingsHash] =
    useSettings('CALC_SETTINGS_HASH');
  const [alarmSettingsHash, setAlarmSettingsHash] = useSettings(
    'ALARM_SETTINGS_HASH',
  );
  const [reminderSettingsHash, setReminderSettingsHash] = useSettings(
    'REMINDER_SETTINGS_HASH',
  );

  useEffect(() => {
    const stateHash = sha256(
      JSON.stringify(calcSettingsState) +
        calendarType +
        BYPASS_DND +
        JSON.stringify(selectedAdhans),
    );
    if (calcSettingsHash !== stateHash) {
      setCalcSettingsHash(stateHash);
    }
  }, [
    calcSettingsState,
    calcSettingsHash,
    setCalcSettingsHash,
    calendarType,
    selectedAdhans,
    BYPASS_DND,
  ]);

  useEffect(() => {
    const stateHash = sha256(JSON.stringify(alarmSettingsState));
    if (alarmSettingsHash !== stateHash) {
      askPermissions().then(() => {
        setAlarmSettingsHash(stateHash);
      });
    }
  }, [alarmSettingsState, alarmSettingsHash, setAlarmSettingsHash]);

  useEffect(() => {
    const stateHash = sha256(JSON.stringify(reminderSettingsState));
    if (reminderSettingsHash !== stateHash) {
      setReminderSettingsHash(stateHash);
    }
  }, [reminderSettingsHash, reminderSettingsState, setReminderSettingsHash]);

  useNoInitialEffect(() => {
    settings.setState({DELIVERED_ALARM_TIMESTAMPS: {}});
    clearCache();
    setNextAdhan();
    setReminders({noToast: true, force: true});
    updateWidgets();
  }, [calcSettingsHash, alarmSettingsHash]);

  useNoInitialEffect(() => {
    updateWidgets();
  }, [HIGHLIGHT_CURRENT_PRAYER]);

  const renderItem = useCallback(
    ({item}: {item: ScreenListItem}) => <SettingsListItem item={item} />,
    [],
  );

  return (
    <Box safeArea py="3">
      <FlatList data={settingsScreenList} renderItem={renderItem}></FlatList>
    </Box>
  );
}

export default memo(Settings);

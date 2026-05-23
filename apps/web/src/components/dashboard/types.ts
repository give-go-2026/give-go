export type OrgData = {
  orgName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  orgWeb: string;
  orgNum: string;
};

export type EventData = {
  id: string;
  eventName: string;
  eventAddress: string;
  eventTheme: string;
  eventType: string;
  eventTags: string[];
  helpFrequency: string;
  helpMode: string;
  eventStartDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventEndDate: string;
  eventCloseTime: string;
  seriesStartDate: string;
  seriesEndDate: string;
  selectedDays: number[];
  startTime: string;
  endTime: string;
  desc: string;
  eventImages: string[];
};

export const DAYS = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];

export const ALL_TAGS = [
  'Idősek',
  'Gyerekek',
  'Fiatalok',
  'Hajléktalanok',
  'Fogyatékossággal élők',
  'Szegregátumok',
  'Iskolák',
  'Kutyák',
  'Macskák',
  'Madarak',
  'Kacsák',
  'Fajtamentés',
];

export const EMPTY_ORG: OrgData = {
  orgName: '',
  userName: '',
  userEmail: '',
  userPhone: '',
  orgWeb: '',
  orgNum: '',
};

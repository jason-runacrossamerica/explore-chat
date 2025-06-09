export interface Activity {
  id: string;
  name: string;
  minutesPerMile: number;
}

export interface ConversionResult {
  miles: number;
  kilometers: number;
}

export interface ActivityConverterProps {
  activities: Activity[];
}

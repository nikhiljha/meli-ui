import Chart, {
  ChartDataSets, GridLineOptions, TickOptions,
} from 'chart.js';

Chart.defaults.global.legend.labels.usePointStyle = true;
Chart.defaults.global.defaultFontFamily = 'Graphik, sans-serif';
Chart.defaults.global.defaultFontStyle = 'normal';
Chart.defaults.global.defaultFontColor = '#1b0449';

export const lineStyles = color => (({
  pointBorderColor: undefined,
  borderColor: color,
  pointBackgroundColor: color,
  backgroundColor: color,
  borderWidth: 4,
  pointRadius: 4,
  pointHoverRadius: 4,
  pointBorderWidth: 0,
  barThickness: 5,
  fill: false,
  cubicInterpolationMode: 'monotone',
}) as Partial<ChartDataSets>);

export const gridStyles: GridLineOptions = {
  lineWidth: 3,
  color: '#eeecf9',
  zeroLineWidth: 3,
  zeroLineColor: '#eeecf9',
};

export const ticks: TickOptions = {
  maxRotation: 0,
  minRotation: 0,
  autoSkipPadding: 30,
};

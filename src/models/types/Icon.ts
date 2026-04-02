export interface Icon {
  fill?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
  className?: string; // En React Native, className no aplica, usa style
}
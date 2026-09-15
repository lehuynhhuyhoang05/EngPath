import type { ReactNode } from 'react';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

export type IconName =
  | 'home'
  | 'book'
  | 'mic'
  | 'chart'
  | 'user'
  | 'arrow-right'
  | 'arrow-left'
  | 'check'
  | 'clock'
  | 'headphones'
  | 'target'
  | 'alert'
  | 'rotate'
  | 'lock'
  | 'play'
  | 'flag';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

const common = { fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeWidth: 1.8 };

function Drawing({ name, color }: { name: IconName; color: string }): ReactNode {
  switch (name) {
    case 'home':
      return <><Path {...common} stroke={color} d="M3 11.2 12 4l9 7.2" /><Path {...common} stroke={color} d="M5.5 10.3V20h13v-9.7M9.5 20v-5.5h5V20" /></>;
    case 'book':
      return <><Path {...common} stroke={color} d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v17H7.5A3.5 3.5 0 0 0 4 22Z" /><Path {...common} stroke={color} d="M20 5.5A3.5 3.5 0 0 0 16.5 2H12v17h4.5A3.5 3.5 0 0 1 20 22Z" /></>;
    case 'mic':
      return <><Rect {...common} stroke={color} x="8" y="3" width="8" height="13" rx="4" /><Path {...common} stroke={color} d="M5 12a7 7 0 0 0 14 0M12 19v3M8.5 22h7" /></>;
    case 'chart':
      return <><Line {...common} stroke={color} x1="4" y1="21" x2="4" y2="12" /><Line {...common} stroke={color} x1="10" y1="21" x2="10" y2="7" /><Line {...common} stroke={color} x1="16" y1="21" x2="16" y2="10" /><Line {...common} stroke={color} x1="22" y1="21" x2="22" y2="3" /></>;
    case 'user':
      return <><Circle {...common} stroke={color} cx="12" cy="8" r="4" /><Path {...common} stroke={color} d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>;
    case 'arrow-right':
      return <><Line {...common} stroke={color} x1="4" y1="12" x2="20" y2="12" /><Polyline {...common} stroke={color} points="14 6 20 12 14 18" /></>;
    case 'arrow-left':
      return <><Line {...common} stroke={color} x1="20" y1="12" x2="4" y2="12" /><Polyline {...common} stroke={color} points="10 6 4 12 10 18" /></>;
    case 'check':
      return <Polyline {...common} stroke={color} points="4 12.5 9.5 18 20 6" />;
    case 'clock':
      return <><Circle {...common} stroke={color} cx="12" cy="12" r="9" /><Path {...common} stroke={color} d="M12 7v5l3.5 2" /></>;
    case 'headphones':
      return <><Path {...common} stroke={color} d="M4 13v-2a8 8 0 0 1 16 0v2" /><Rect {...common} stroke={color} x="3" y="13" width="4" height="7" rx="2" /><Rect {...common} stroke={color} x="17" y="13" width="4" height="7" rx="2" /></>;
    case 'target':
      return <><Circle {...common} stroke={color} cx="12" cy="12" r="9" /><Circle {...common} stroke={color} cx="12" cy="12" r="4" /><Circle fill={color} cx="12" cy="12" r="1.2" /></>;
    case 'alert':
      return <><Path {...common} stroke={color} d="M12 3 2.8 20h18.4Z" /><Line {...common} stroke={color} x1="12" y1="9" x2="12" y2="14" /><Circle fill={color} cx="12" cy="17" r="1" /></>;
    case 'rotate':
      return <><Path {...common} stroke={color} d="M20 8a8 8 0 1 0 .2 7" /><Polyline {...common} stroke={color} points="20 3 20 8 15 8" /></>;
    case 'lock':
      return <><Rect {...common} stroke={color} x="5" y="10" width="14" height="11" rx="2" /><Path {...common} stroke={color} d="M8 10V7a4 4 0 0 1 8 0v3" /></>;
    case 'play':
      return <><Circle {...common} stroke={color} cx="12" cy="12" r="9" /><Path fill={color} d="m10 8 6 4-6 4Z" /></>;
    case 'flag':
      return <><Line {...common} stroke={color} x1="5" y1="22" x2="5" y2="3" /><Path {...common} stroke={color} d="M5 4h12l-2 4 2 4H5" /></>;
  }
}

export function Icon({ name, size = 24, color = '#172033' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={{ pointerEvents: 'none' }}>
      <Drawing name={name} color={color} />
    </Svg>
  );
}

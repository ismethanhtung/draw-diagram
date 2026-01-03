import { AwsIconType } from './data/aws-icons';

export type Tool = 'selection' | 'hand' | 'rectangle' | 'diamond' | 'circle' | 'arrow' | 'line' | 'draw' | 'eraser' | 'text' | 'aws-icon';

export type StrokeStyle = 'solid' | 'dashed' | 'dotted';
export type FillStyle = 'hachure' | 'solid' | 'zigzag' | 'cross-hatch';
export type EdgeStyle = 'sharp' | 'round';

export interface Element {
  id: string;
  type: Tool;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  points?: { x: number; y: number }[];
  text?: string;
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  roughness: number;
  opacity: number;
  fillStyle: FillStyle;
  strokeStyle: StrokeStyle;
  edgeStyle: EdgeStyle;
  seed: number;
  iconKey?: AwsIconType;
  iconName?: string;
}

export interface Point {
  x: number;
  y: number;
}

/// <reference types="vite/client" />

declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';
declare module '*.styl';

declare module '*.svg' {
  import type { ComponentType, SVGProps } from 'react';
  const src: string;
  export default src;
  export const ReactComponent: ComponentType<SVGProps<SVGSVGElement>>;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
declare module '*.ico';
declare module '*.bmp';

import type { LitScrollComponentParams } from '../types';
export declare type LitScrollParallaxData = {
    start: number;
    end: number;
    speed: number;
    media?: string;
};
export default function Parallax({ on, getCurrentLerpValue, viewport }: LitScrollComponentParams): void;

import type { LitScrollComponentParams } from '../types';
import { getOffsetTop } from '../utils';

export type LitScrollParallaxData = {
    start: number;
    end: number;
    speed: number;
    media?: string;
};

export default function Parallax({ on }: LitScrollComponentParams) {
    const parallaxElements = Array.from(document.querySelectorAll('[data-scroll-parallax]')) as HTMLElement[];

    const map = new Map<Element, LitScrollParallaxData>();

    parallaxElements.forEach((el) => {
        const { dataset } = el;
        const speed = dataset.scrollParallaxSpeed ? parseFloat(dataset.scrollParallaxSpeed) : 1;
        const media = dataset.scrollParallaxMedia;
        const start = getOffsetTop(el);
        const end = 10000;

        map.set(el, {
            start,
            end,
            speed,
            media,
        });
    });

    on('scroll', ({ scrollValue }) => {
        for (let i = 0; i < parallaxElements.length; i++) {
            const element = parallaxElements[i];
            const parallaxData = map.get(element);

            if (parallaxData) {
                element.style.transform = `translate3d(0,${scrollValue - parallaxData.start}px,0)`;
            }
        }
    });
}

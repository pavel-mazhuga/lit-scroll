import type { LitScrollComponentParams } from '../types';
import { getOffsetTop } from '../utils';

export type LitScrollParallaxData = {
    start: number;
    end: number;
    speed: number;
    media?: string;
};

export default function Parallax({ on, getCurrentLerpValue, viewport }: LitScrollComponentParams) {
    const parallaxElements = Array.from(document.querySelectorAll('[data-scroll-parallax]')) as HTMLElement[];

    const map = new WeakMap<Element, LitScrollParallaxData>();

    parallaxElements.forEach((el) => {
        const { dataset } = el;
        const speed = dataset.scrollParallaxSpeed ? parseFloat(dataset.scrollParallaxSpeed) : 1;
        const media = dataset.scrollParallaxMedia;
        const start = dataset.scrollParallaxStart
            ? parseFloat(dataset.scrollParallaxStart)
            : getOffsetTop(el, getCurrentLerpValue()) - viewport.height;
        const end = dataset.scrollParallaxEnd
            ? parseFloat(dataset.scrollParallaxEnd)
            : getOffsetTop(el, getCurrentLerpValue()) + viewport.height;

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
                const { speed, start, end } = parallaxData;
                // sticky
                // element.style.transform = `translate3d(0,${scrollValue - parallaxData.start}px,0)`;
                if (scrollValue > start && scrollValue < end + viewport.height) {
                    element.style.transform = `translate3d(0,${
                        -(scrollValue - start - viewport.height / 2) * speed
                    }px,0)`;
                }
            }
        }
    });
}

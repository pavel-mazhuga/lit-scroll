import {
    LitScrollOptions,
    LitScrollInstance,
    ScrollToOptions,
    EventName,
    LitScrollListenerEvent,
    ListenerFunction,
    ScrollTo,
} from './types';
import { lerp } from './utils';

const NAME = 'lit-scroll';
const INITIALIZED_CLASS = 'lit-scroll-initialized';

const defaultOptions: LitScrollOptions = {
    ease: 0.1,
};

export default function createLitScroll(_options: Partial<LitScrollOptions> = {}): LitScrollInstance {
    const html = document.documentElement;
    const { body } = document;
    const wrapper = body.querySelector('[data-lit-scroll="wrapper"]') as HTMLElement;
    const scrollableContainer = body.querySelector('[data-lit-scroll="container"]') as HTMLElement;
    const defaultScrollToOptions: ScrollToOptions = { native: false };

    if (!wrapper) {
        throw new Error(`[${NAME}] Wrapper element not found.`);
    }

    if (!scrollableContainer) {
        throw new Error(`[${NAME}] Container element not found.`);
    }

    let rAF = 0;
    const listeners = new Set<[EventName, (event: LitScrollListenerEvent) => void]>();
    const options = { ...defaultOptions, ..._options } as LitScrollOptions;

    let docScroll = 0;
    let scrollToValue: number | null = 0;

    let previous = 0;
    let current = 0;
    let ro: ResizeObserver | null;

    function getPageYScroll() {
        docScroll = window.pageYOffset || html.scrollTop;
    }

    function translateScrollableElement() {
        scrollableContainer.style.transform = `translate3d(0,${-1 * previous}px,0)`;
    }

    function update() {
        current = docScroll;
        previous = docScroll;
        translateScrollableElement();
    }

    function setBodyHeight() {
        const { top, height } = scrollableContainer.getBoundingClientRect();
        body.style.height = `${height + top + docScroll}px`;
    }

    function unsetBodyHeight() {
        body.style.height = '';
    }

    function styleHtmlElement() {
        html.classList.add(INITIALIZED_CLASS);
    }

    function removeHtmlElementStyles() {
        html.classList.remove(INITIALIZED_CLASS);
    }

    function styleWrapper() {
        wrapper.style.position = 'fixed';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.top = '0';
        wrapper.style.left = '0';
        wrapper.style.overflow = 'hidden';
    }

    function removeWrapperStyles() {
        wrapper.style.position = '';
        wrapper.style.width = '';
        wrapper.style.height = '';
        wrapper.style.top = '';
        wrapper.style.left = '';
        wrapper.style.overflow = '';
    }

    function onResize() {
        getPageYScroll();
        update();
        setBodyHeight();
    }

    function initEvents() {
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', getPageYScroll);
    }

    function destroyEvents() {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', getPageYScroll);
    }

    function initResizeObserver() {
        if (window.ResizeObserver) {
            ro = new ResizeObserver(entries => {
                entries.forEach(setBodyHeight);
            });

            ro.observe(scrollableContainer);
        }
    }

    function destroyResizeObserver() {
        if (ro) {
            ro.disconnect();
        }
    }

    const on: ListenerFunction = (eventName, fn) => {
        listeners.add([eventName, fn]);
    };

    const off: ListenerFunction = (eventName, fn) => {
        listeners.delete([eventName, fn]);
    };

    function render() {
        if (scrollToValue) {
            current = scrollToValue;
            const interpolatedPrev = lerp(previous, current, options.ease);
            previous = interpolatedPrev;
            window.scrollTo(0, interpolatedPrev);
        } else {
            current = docScroll;
            const interpolatedPrev = lerp(previous, current, options.ease);
            previous = interpolatedPrev > 1 ? interpolatedPrev : current;
        }

        if (Math.abs(previous - current) > 1) {
            listeners.forEach(([eventName, fn]) => {
                if (eventName === 'scroll') {
                    fn({
                        docScrollValue: docScroll,
                        scrollValue: previous,
                        maxHeight: scrollableContainer.scrollHeight,
                    });
                }
            });
        } else {
            scrollToValue = null;
        }

        translateScrollableElement();
        requestAnimationFrame(render);
    }

    function getCurrentValue() {
        return docScroll;
    }

    const scrollTo: ScrollTo = (target, opts: Partial<ScrollToOptions> = {}) => {
        const options: ScrollToOptions = { ...defaultScrollToOptions, ...opts };
        let offsetY: number | null = null;

        if (typeof target === 'number') {
            offsetY = target;
        }

        if (typeof target === 'string') {
            const element = document.querySelector(target);

            if (element) {
                offsetY = window.scrollY + element.getBoundingClientRect().top;
            }
        }

        if (target instanceof Element) {
            offsetY = window.scrollY + target.getBoundingClientRect().top;
        }

        if (offsetY) {
            if (options.native && window.CSS?.supports?.('scroll-behavior', 'smooth')) {
                window.scrollTo({ top: offsetY, behavior: 'smooth' });
            } else {
                scrollToValue = offsetY;
            }
        }

        return offsetY;
    };

    function init() {
        getPageYScroll();
        setBodyHeight();
        styleHtmlElement();
        styleWrapper();
        initEvents();
        initResizeObserver();
        update();
        rAF = requestAnimationFrame(render);
    }

    function destroy() {
        cancelAnimationFrame(rAF);
        destroyResizeObserver();
        destroyEvents();
        listeners.clear();
        unsetBodyHeight();
        removeWrapperStyles();
        removeHtmlElementStyles();
    }

    init();

    return {
        destroy,
        getCurrentValue,
        on,
        off,
        scrollTo,
    };
}

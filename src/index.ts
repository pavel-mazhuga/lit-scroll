import { lerp } from './utils';

type EventName = 'scroll';

type LitScrollListenerEvent = {
    docScrollValue: number;
    scrollValue: number;
    maxHeight: number;
};

type ListenerFunction = (eventName: EventName, fn: (event: LitScrollListenerEvent) => void) => void;

type ScrollTo = (target: number | string | Element, options?: { native: boolean }) => number | null;

type LitScrollInstance = {
    getCurrentValue: () => number;
    on: ListenerFunction;
    off: ListenerFunction;
    scrollTo: ScrollTo;
    destroy: () => void;
};

type State = {
    docScroll: number;
    scrollToValue: number | null;
    windowWidth: number;
    windowHeight: number;
};

type LitScrollOptions = {
    ease: number;
};

const defaultOptions: LitScrollOptions = {
    ease: 0.1,
};

export default function createLitScroll(_options: Partial<LitScrollOptions> = defaultOptions): LitScrollInstance {
    const html = document.documentElement;
    const { body } = document;
    const wrapper = body.querySelector('[data-lit-scroll="wrapper"]') as HTMLElement;
    const scrollableContainer = body.querySelector('[data-lit-scroll="container"]') as HTMLElement;

    if (!wrapper) {
        throw new Error('[lit-scroll] Wrapper element not found.');
    }

    if (!scrollableContainer) {
        throw new Error('[lit-scroll] Container element not found.');
    }

    let rAF = 0;
    const listeners = new Set<[EventName, (event: LitScrollListenerEvent) => void]>();
    const options = { ...defaultOptions, ..._options } as LitScrollOptions;

    const state: State = {
        docScroll: 0,
        scrollToValue: null,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
    };

    let previous = 0;
    let current = 0;
    let ro: ResizeObserver | null;

    function getWindowSize() {
        state.windowWidth = window.innerWidth;
        state.windowHeight = window.innerHeight;
    }

    function getPageYScroll() {
        state.docScroll = window.pageYOffset || html.scrollTop;
    }

    function translateScrollableElement() {
        scrollableContainer.style.transform = `translate3d(0,${-1 * previous}px,0)`;
    }

    function update() {
        current = state.docScroll;
        previous = state.docScroll;
        translateScrollableElement();
    }

    function setBodyHeight() {
        body.style.height = `${scrollableContainer.scrollHeight}px`;
    }

    function unsetBodyHeight() {
        body.style.height = '';
    }

    function styleHtmlElement() {
        html.classList.add('lit-scroll-initialized');
    }

    function removeHtmlElementStyles() {
        html.classList.remove('lit-scroll-initialized');
    }

    function styleMainElement() {
        wrapper.style.position = 'fixed';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.top = '0';
        wrapper.style.left = '0';
        wrapper.style.overflow = 'hidden';
    }

    function removeMainElementStyles() {
        wrapper.style.position = '';
        wrapper.style.width = '';
        wrapper.style.height = '';
        wrapper.style.top = '';
        wrapper.style.left = '';
        wrapper.style.overflow = '';
    }

    function onResize() {
        getWindowSize();
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
                entries.forEach(() => {
                    setBodyHeight();
                });
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
        // update the current and interpolated values
        if (state.scrollToValue) {
            current = state.scrollToValue;
            const interpolatedPrev = lerp(previous, current, options.ease);
            previous = interpolatedPrev;
            window.scrollTo(0, interpolatedPrev);
        } else {
            current = state.docScroll;
            previous = lerp(previous, current, options.ease);
        }

        if (Math.abs(previous - current) > 0.9) {
            listeners.forEach(([eventName, fn]) => {
                if (eventName === 'scroll') {
                    fn({
                        docScrollValue: state.docScroll,
                        scrollValue: previous,
                        maxHeight: scrollableContainer.scrollHeight,
                    });
                }
            });
        } else {
            state.scrollToValue = null;
        }

        translateScrollableElement();
        requestAnimationFrame(render);
    }

    function getCurrentValue() {
        return state.docScroll;
    }

    const scrollTo: ScrollTo = (target, opts = { native: false }) => {
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
            if (opts.native && window.CSS?.supports?.('scroll-behavior', 'smooth')) {
                window.scrollTo({ top: offsetY, behavior: 'smooth' });
            } else {
                state.scrollToValue = offsetY;
            }
        }

        return offsetY;
    };

    function init() {
        getPageYScroll();
        getWindowSize();
        setBodyHeight();
        update();
        styleMainElement();
        initEvents();
        initResizeObserver();
        rAF = requestAnimationFrame(render);
        styleHtmlElement();
    }

    function destroy() {
        cancelAnimationFrame(rAF);
        destroyResizeObserver();
        destroyEvents();
        listeners.clear();
        unsetBodyHeight();
        removeMainElementStyles();
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

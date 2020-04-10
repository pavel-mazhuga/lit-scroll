import {
    LitScrollOptions,
    LitScrollInstance,
    ScrollToOptions,
    EventName,
    LitScrollListenerEvent,
    State,
    ListenerFunction,
    ScrollTo,
} from './types';
import { lerp, getOffsetTop } from './utils';

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

    function getInitialPageYScroll() {
        state.docScroll = (window.pageYOffset || html.scrollTop) + getOffsetTop(scrollableContainer);
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
        body.style.height = `${scrollableContainer.scrollHeight + getOffsetTop(scrollableContainer)}px`;
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
        if (state.scrollToValue && Math.abs(previous - current) > 1) {
            current = state.scrollToValue;
            const interpolatedPrev = lerp(previous, current, options.ease);
            previous = interpolatedPrev;
            window.scrollTo(0, interpolatedPrev);
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
            current = state.docScroll;
            const interpolatedPrev = lerp(previous, current, options.ease);
            previous = interpolatedPrev > 1 ? interpolatedPrev : current;
        }

        translateScrollableElement();
        requestAnimationFrame(render);
    }

    function getCurrentValue() {
        return state.docScroll;
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
                state.scrollToValue = offsetY;
            }
        }

        return offsetY;
    };

    function init() {
        getInitialPageYScroll();
        getWindowSize();
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

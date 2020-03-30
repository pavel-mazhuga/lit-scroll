import { lerp } from './utils';

type EventName = 'scroll';

type LitScrollListenerEvent = {
    docScrollValue: number;
    scrollValue: number;
    maxHeight: number;
};

type LitScrollListener = (event: LitScrollListenerEvent) => void;

type ListenerFunction = (eventName: EventName, fn: LitScrollListener) => void;

type ScrollTo = (target: number | string | Element, options?: { native: boolean }) => number | null;

type LitScrollInstance = {
    getCurrentValue: () => number;
    on: ListenerFunction;
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
    const wrapper = document.body.querySelector('[data-lit-scroll-wrapper]') as HTMLElement;
    const scrollableContainer = document.body.querySelector('[data-lit-scroll-container]') as HTMLElement;

    if (!wrapper) {
        throw new Error('[lit-scroll] Wrapper element not found.');
    }

    if (!scrollableContainer) {
        throw new Error('[lit-scroll] Container element not found.');
    }

    let rAF = 0;
    const listeners = new Set<[EventName, LitScrollListener]>();
    const options = { ...defaultOptions, ..._options } as LitScrollOptions;

    const state: State = {
        docScroll: 0,
        scrollToValue: null,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
    };

    const translationY = {
        // interpolated value
        previous: 0,
        // current value
        current: 0,
        // amount to interpolate
        ease: options.ease,
        // current value setter
        // in this case the value of the translation will be the same as the document scroll
        setValue: () => state.docScroll,
    };

    function getWindowSize() {
        state.windowWidth = window.innerWidth;
        state.windowHeight = window.innerHeight;
    }

    function getPageYScroll() {
        state.docScroll = window.pageYOffset || document.documentElement.scrollTop;
    }

    function translateScrollableElement() {
        scrollableContainer.style.transform = `translate3d(0,${-1 * translationY.previous}px,0)`;
    }

    function update() {
        // sets the initial value (no interpolation) - translate the scroll value
        translationY.current = translationY.setValue();
        translationY.previous = translationY.setValue();
        translateScrollableElement();
    }

    function setBodyHeight() {
        // set the height of the body in order to keep the scrollbar on the page
        document.body.style.height = `${scrollableContainer.scrollHeight}px`;
    }

    function unsetBodyHeight() {
        document.body.style.height = '';
    }

    function styleHtmlElement() {
        document.documentElement.classList.add('lit-scroll-initialized');
    }

    function removeHtmlElementStyles() {
        document.documentElement.classList.remove('lit-scroll-initialized');
    }

    function styleMainElement() {
        // the wrapper needs to "stick" to the screen and not scroll
        // for that we set it to position fixed and overflow hidden
        wrapper.style.position = 'fixed';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.top = '0';
        wrapper.style.left = '0';
        wrapper.style.overflow = 'hidden';
    }

    function removeMainElementStyles() {
        // the wrapper needs to "stick" to the screen and not scroll
        // for that we set it to position fixed and overflow hidden
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

    const on: ListenerFunction = (eventName, fn) => {
        listeners.add([eventName, fn]);
    };

    function render() {
        // update the current and interpolated values
        if (state.scrollToValue) {
            translationY.current = state.scrollToValue;
            const interpolatedPrev = lerp(translationY.previous, translationY.current, translationY.ease);
            translationY.previous = interpolatedPrev;
            window.scrollTo(0, interpolatedPrev);
        } else {
            translationY.current = translationY.setValue();
            translationY.previous = lerp(translationY.previous, translationY.current, translationY.ease);
        }

        if (Math.abs(translationY.previous - translationY.current) > 0.9) {
            listeners.forEach(([eventName, fn]) => {
                if (eventName === 'scroll') {
                    fn({
                        docScrollValue: state.docScroll,
                        scrollValue: translationY.previous,
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
        rAF = requestAnimationFrame(render);
        styleHtmlElement();
    }

    function destroy() {
        cancelAnimationFrame(rAF);
        destroyEvents();
        listeners.clear();
        unsetBodyHeight();
        removeMainElementStyles();
        removeHtmlElementStyles();
    }

    init();

    return {
        getCurrentValue,
        on,
        scrollTo,
        destroy,
    };
}

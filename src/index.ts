interface LitScrollOptions {
    ease?: number;
}

type LitScrollInnerOptions = {
    ease: number;
};

type EventName = 'scroll';

interface LitScrollListenerEvent {
    docScrollValue: number;
    scrollValue: number;
    maxHeight: number;
}

type LitScrollListener = (event: LitScrollListenerEvent) => void;

type ListenerFunction = (eventName: EventName, fn: LitScrollListener) => void;

type ScrollTo = (target: number | string | Element, options?: { native: boolean }) => number | null;

interface LitScrollInstance {
    getCurrentValue: () => number;
    on: ListenerFunction;
    scrollTo: ScrollTo;
    destroy: () => void;
}

interface State {
    docScroll: number;
    scrollToValue: number | null;
    windowWidth: number;
    windowHeight: number;
}

// linear interpolation
function lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
}

// map number x from range [a, b] to [c, d]
// function map(x, a, b, c, d) {
//     return ((x - a) * (d - c)) / (b - a) + c;
// }

const defaultOptions: LitScrollOptions = {
    ease: 0.1,
};

export default function createLitScroll(_options: LitScrollOptions = defaultOptions): LitScrollInstance {
    const wrapper = document.body.querySelector('[data-lit-scroll-wrapper]') as HTMLElement | null;
    const container = document.body.querySelector('[data-lit-scroll-container]') as HTMLElement | null;

    if (!wrapper) {
        throw new Error('[lit-scroll] Wrapper element not found.');
    }

    if (!container) {
        throw new Error('[lit-scroll] Container element not found.');
    }

    let rAF = 0;
    const listeners = new Set<[EventName, LitScrollListener]>();
    const options = { ...defaultOptions, ..._options } as LitScrollInnerOptions;
    const DOM = {
        main: wrapper,
        scrollable: container,
    };

    const state: State = {
        docScroll: 0,
        scrollToValue: null,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
    };

    const renderedStyles = {
        translationY: {
            // interpolated value
            previous: 0,
            // current value
            current: 0,
            // amount to interpolate
            ease: options.ease,
            // current value setter
            // in this case the value of the translation will be the same as the document scroll
            setValue: () => state.docScroll,
        },
    };

    function getWindowSize() {
        state.windowWidth = window.innerWidth;
        state.windowHeight = window.innerHeight;
    }

    function getPageYScroll() {
        state.docScroll = window.pageYOffset || document.documentElement.scrollTop;
    }

    function translateScrollableElement() {
        DOM.scrollable.style.transform = `translate3d(0,${-1 * renderedStyles.translationY.previous}px,0)`;
    }

    function update() {
        // sets the initial value (no interpolation) - translate the scroll value
        renderedStyles.translationY.current = renderedStyles.translationY.setValue();
        renderedStyles.translationY.previous = renderedStyles.translationY.setValue();
        translateScrollableElement();
    }

    function setBodyHeight() {
        // set the height of the body in order to keep the scrollbar on the page
        document.body.style.height = `${DOM.scrollable.scrollHeight}px`;
    }

    function unsetBodyHeight() {
        document.body.style.height = '';
    }

    function styleMainElement() {
        // the DOM.main needs to "stick" to the screen and not scroll
        // for that we set it to position fixed and overflow hidden
        DOM.main.style.position = 'fixed';
        DOM.main.style.width = '100%';
        DOM.main.style.height = '100%';
        DOM.main.style.top = '0';
        DOM.main.style.left = '0';
        DOM.main.style.overflow = 'hidden';
    }

    function removeMainElementStyles() {
        // the DOM.main needs to "stick" to the screen and not scroll
        // for that we set it to position fixed and overflow hidden
        DOM.main.style.position = '';
        DOM.main.style.width = '';
        DOM.main.style.height = '';
        DOM.main.style.top = '';
        DOM.main.style.left = '';
        DOM.main.style.overflow = '';
    }

    function initEvents() {
        window.addEventListener('resize', getWindowSize);
        window.addEventListener('resize', setBodyHeight);
        window.addEventListener('scroll', getPageYScroll);
    }

    function destroyEvents() {
        window.removeEventListener('resize', getWindowSize);
        window.removeEventListener('resize', setBodyHeight);
        window.removeEventListener('scroll', getPageYScroll);
    }

    const on: ListenerFunction = (eventName, fn) => {
        listeners.add([eventName, fn]);
    };

    function render() {
        // update the current and interpolated values
        if (state.scrollToValue) {
            renderedStyles.translationY.current = state.scrollToValue;
            const interpolatedPrev = lerp(
                renderedStyles.translationY.previous,
                renderedStyles.translationY.current,
                renderedStyles.translationY.ease,
            );
            renderedStyles.translationY.previous = interpolatedPrev;
            window.scrollTo(0, interpolatedPrev);
        } else {
            renderedStyles.translationY.current = renderedStyles.translationY.setValue();
            renderedStyles.translationY.previous = lerp(
                renderedStyles.translationY.previous,
                renderedStyles.translationY.current,
                renderedStyles.translationY.ease,
            );
        }

        if (Math.abs(renderedStyles.translationY.previous - renderedStyles.translationY.current) > 0.9) {
            listeners.forEach(([eventName, fn]) => {
                if (eventName === 'scroll') {
                    fn({
                        docScrollValue: state.docScroll,
                        scrollValue: renderedStyles.translationY.previous,
                        maxHeight: DOM.scrollable.scrollHeight,
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
        getWindowSize();
        setBodyHeight();
        update();
        styleMainElement();
        initEvents();
        rAF = requestAnimationFrame(render);
    }

    function destroy() {
        cancelAnimationFrame(rAF);
        destroyEvents();
        listeners.clear();
        unsetBodyHeight();
        removeMainElementStyles();
    }

    init();

    return {
        getCurrentValue,
        on,
        scrollTo,
        destroy,
    };
}

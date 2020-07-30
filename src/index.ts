/* eslint-disable max-lines */
import {
    LitScrollOptions,
    LitScrollInstance,
    ScrollToOptions,
    EventName,
    LitScrollListenerEvent,
    ListenerFunction,
    ScrollTo,
} from './types';
import { lerp, isMobileDevice } from './utils';

const NAME = 'lit-scroll';
const INITIALIZED_CLASS = 'lit-scroll-initialized';

const defaultOptions: LitScrollOptions = {
    ease: 0.1,
    mobile: true,
};

const defaultScrollToOptions: ScrollToOptions = {
    native: false,
};

let isMobile = isMobileDevice();

/**
 * Scroll factory function.
 *
 * @param  {Partial<LitScrollOptions>} options User options
 * @returns {LitScrollInstance} instance
 */
export default function createLitScroll(_options: Partial<LitScrollOptions> = {}): LitScrollInstance {
    const html = document.documentElement;
    const { body } = document;

    /**
     * Wrapper element, which will become fixed after initialization.
     */
    const wrapper = body.querySelector('[data-lit-scroll="wrapper"]') as HTMLElement;

    if (!wrapper) {
        throw new Error(`[${NAME}] Wrapper element not found.`);
    }

    /**
     * Scrollable element.
     */
    const scrollableContainer = body.querySelector('[data-lit-scroll="container"]') as HTMLElement;

    if (!scrollableContainer) {
        throw new Error(`[${NAME}] Container element not found.`);
    }

    /**
     * Indicates whether this instance is initialized.
     */
    let isInitialized = false;

    /**
     * Indicates whether scrolling is blocked.
     */
    let enabled = true;

    let rAF = 0;

    /**
     * User defined scroll event listeners.
     */
    const listeners = new Set<[EventName, (event: LitScrollListenerEvent) => void]>();

    const options = { ...defaultOptions, ..._options } as LitScrollOptions;

    /**
     * Current document scroll.
     */
    let docScroll = 0;

    /**
     * If equals to some number - 'scrollTo' scrolling is in progress.
     */
    let scrollToValue: number | null = null;

    let scrollHeight = 0;

    /**
     * Current lerped document scroll.
     */
    let previous = docScroll;

    let ro: ResizeObserver | null;

    const scrollableSections = Array.from(
        scrollableContainer.querySelectorAll('[data-lit-scroll="section"]'),
    ) as HTMLElement[];

    const sectionObserver =
        'IntersectionObserver' in window
            ? new IntersectionObserver(
                  (entries) => {
                      entries.forEach((entry) => {
                          const target = entry.target as HTMLElement;
                          target.style.visibility = entry.isIntersecting ? '' : 'hidden';
                      });
                  },
                  { rootMargin: '100px 0px' },
              )
            : null;

    function preventScrolling(event: any) {
        event.preventDefault();
    }

    function getPageYScroll() {
        docScroll = window.pageYOffset || html.scrollTop;
    }

    function translateScrollableElement() {
        scrollableContainer.style.transform = `translate3d(0,${-previous}px,0)`;
    }

    function update() {
        if (enabled) {
            previous = docScroll;
        }

        if (!isMobile || (isMobile && options.mobile)) {
            translateScrollableElement();
        }
    }

    function setScrollHeight() {
        scrollHeight = scrollableContainer.scrollHeight;
    }

    function setBodyHeight() {
        body.style.height = `${scrollHeight}px`;
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

    function removeContainerStyles() {
        scrollableContainer.style.transform = '';
        window.scrollTo({ top: docScroll, behavior: 'auto' });
    }

    function onResize() {
        isMobile = isMobileDevice();

        attemptToInit();

        getPageYScroll();
        update();
        setScrollHeight();

        if (!isMobile || (isMobile && options.mobile)) {
            setBodyHeight();
        }
    }

    function initEvents() {
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', getPageYScroll);
    }

    function destroyEvents() {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', getPageYScroll);
    }

    function onResizeObserverTrigger() {
        setScrollHeight();

        if (!isMobile || (isMobile && options.mobile)) {
            setBodyHeight();
        }
    }

    function initResizeObserver() {
        if (window.ResizeObserver) {
            ro = new ResizeObserver((entries) => {
                entries.forEach(onResizeObserverTrigger);
            });

            ro.observe(scrollableContainer);
        }
    }

    function destroyResizeObserver() {
        if (ro) {
            ro.disconnect();
        }
    }

    function initSections() {
        if (sectionObserver) {
            scrollableSections.forEach((section) => sectionObserver.observe(section));
        }
    }

    function destroySections() {
        if (sectionObserver) {
            sectionObserver.disconnect();
        }
    }

    const on: ListenerFunction = (eventName, fn) => {
        listeners.add([eventName, fn]);
    };

    const off: ListenerFunction = (eventName, fn) => {
        listeners.delete([eventName, fn]);
    };

    function render() {
        if (typeof scrollToValue === 'number') {
            // 'scrollTo' scrolling is in progress
            const interpolatedPrev = lerp(previous, scrollToValue, options.ease);
            previous = interpolatedPrev;
            window.scrollTo({ top: previous });
        } else {
            // default scrolling
            const interpolatedPrev = lerp(previous, docScroll, options.ease);
            previous = interpolatedPrev > 0.5 ? interpolatedPrev : docScroll;
        }

        if (Math.abs(previous - docScroll) > 0.5) {
            // Trigger all registered listeners on scroll change
            listeners.forEach(([eventName, fn]) => {
                if (eventName === 'scroll') {
                    fn({
                        docScrollValue: docScroll,
                        scrollValue: previous,
                        maxHeight: scrollHeight,
                    });
                }
            });
        } else {
            // Reset this value if scrolling stopped
            scrollToValue = null;
        }

        if (!isMobile || (isMobile && options.mobile)) {
            translateScrollableElement();
        }

        rAF = requestAnimationFrame(render);
    }

    /**
     * Get current document scroll value.
     *
     * @returns {Number}
     */
    function getCurrentValue() {
        return docScroll;
    }

    /**
     * Get current lerped scroll value.
     *
     * @returns {Number}
     */
    function getCurrentLerpValue() {
        return previous;
    }

    /**
     * @param  {String | Number | Element} target Scrolling target.
     * @param  {Partial<ScrollToOptions>} options ScrollTo options.
     * @returns {Number} offsetY
     */
    const scrollTo: ScrollTo = (target, opts: Partial<ScrollToOptions> = {}) => {
        const scrollOptions: ScrollToOptions = { ...defaultScrollToOptions, ...opts };
        let offsetY: number | null = null;

        if (typeof target === 'number') {
            offsetY = target;
        }

        if (typeof target === 'string') {
            const element = document.querySelector(target);

            if (element) {
                offsetY = previous + element.getBoundingClientRect().top;
            }
        }

        if (target instanceof Element) {
            offsetY = previous + target.getBoundingClientRect().top;
        }

        if (typeof offsetY === 'number') {
            if (scrollOptions.native && window.CSS?.supports?.('scroll-behavior', 'smooth')) {
                window.scrollTo({ top: offsetY, behavior: 'smooth' });
            } else {
                if (isMobile && !options.mobile) {
                    window.scrollTo({ top: offsetY, behavior: 'smooth' });
                } else {
                    scrollToValue = offsetY;
                }
            }
        }

        return offsetY;
    };

    /**
     * Disable scrolling.
     */
    function disable() {
        enabled = false;
        scrollableContainer.addEventListener('wheel', preventScrolling, { passive: false });
        scrollableContainer.addEventListener('touchmove', preventScrolling, { passive: false });
    }

    /**
     * Enable scrolling.
     */
    function enable() {
        enabled = true;
        scrollableContainer.removeEventListener('wheel', preventScrolling);
        scrollableContainer.removeEventListener('touchmove', preventScrolling);
    }

    /**
     * Returns boolean value indicating whether scrolling is enabled.
     *
     * @returns {Boolean} boolean
     */
    function isEnabled() {
        return enabled;
    }

    function onNativeScroll() {
        listeners.forEach(([, fn]) => {
            fn({
                docScrollValue: docScroll,
                scrollValue: docScroll,
                maxHeight: scrollHeight,
            });
        });

        previous = docScroll;
    }

    function attemptToInit() {
        if (!isMobile || (isMobile && options.mobile)) {
            if (!isInitialized) {
                rAF = requestAnimationFrame(render);
                setBodyHeight();
                styleHtmlElement();
                styleWrapper();
                document.removeEventListener('scroll', onNativeScroll);
                isInitialized = true;
            }
        } else if (isInitialized) {
            cancelAnimationFrame(rAF);
            unsetBodyHeight();
            removeWrapperStyles();
            removeHtmlElementStyles();
            removeContainerStyles();
            isInitialized = false;

            document.addEventListener('scroll', onNativeScroll);
        }
    }

    function init() {
        getPageYScroll();
        setScrollHeight();
        initEvents();
        initResizeObserver();
        initSections();
        update();
        attemptToInit();
    }

    function destroy() {
        cancelAnimationFrame(rAF);
        destroyResizeObserver();
        destroyEvents();
        destroySections();
        listeners.clear();
        unsetBodyHeight();
        removeWrapperStyles();
        removeHtmlElementStyles();
        removeContainerStyles();
        document.removeEventListener('scroll', onNativeScroll);
        isInitialized = false;
    }

    init();

    return {
        destroy,
        getCurrentValue,
        getCurrentLerpValue,
        on,
        off,
        scrollTo,
        enable,
        disable,
        isEnabled,
    } as const;
}

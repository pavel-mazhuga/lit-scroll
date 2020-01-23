var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// linear interpolation
function lerp(a, b, n) {
    return (1 - n) * a + n * b;
}
// map number x from range [a, b] to [c, d]
// function map(x, a, b, c, d) {
//     return ((x - a) * (d - c)) / (b - a) + c;
// }
var defaultOptions = {
    ease: 0.1,
};
export default function createLitScroll(_options) {
    if (_options === void 0) { _options = defaultOptions; }
    var wrapper = document.body.querySelector('[data-scroll-wrapper]');
    var container = document.body.querySelector('[data-scroll-container]');
    if (!wrapper) {
        throw new Error('[lit-scroll] Wrapper element not found.');
    }
    if (!container) {
        throw new Error('[lit-scroll] Container element not found.');
    }
    var rAF;
    var listeners = new Set();
    var options = __assign(__assign({}, defaultOptions), _options);
    var DOM = {
        main: wrapper,
        scrollable: container,
    };
    var state = {
        docScroll: 0,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
    };
    var renderedStyles = {
        translationY: {
            // interpolated value
            previous: 0,
            // current value
            current: 0,
            // amount to interpolate
            ease: options.ease,
            // current value setter
            // in this case the value of the translation will be the same like the document scroll
            setValue: function () { return state.docScroll; },
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
        DOM.scrollable.style.transform = "translate3d(0," + -1 * renderedStyles.translationY.previous + "px,0)";
    }
    function update() {
        // sets the initial value (no interpolation) - translate the scroll value
        Object.keys(renderedStyles).forEach(function (prop) {
            renderedStyles[prop].current = renderedStyles[prop].setValue();
            renderedStyles[prop].previous = renderedStyles[prop].setValue();
        });
        translateScrollableElement();
    }
    function setBodyHeight() {
        // set the height of the body in order to keep the scrollbar on the page
        document.body.style.height = DOM.scrollable.scrollHeight + "px";
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
        DOM.main.style.top = 0;
        DOM.main.style.left = 0;
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
    var on = function (eventName, fn) {
        listeners.add([eventName, fn]);
    };
    function render() {
        // update the current and interpolated values
        Object.keys(renderedStyles).forEach(function (prop) {
            renderedStyles[prop].current = renderedStyles[prop].setValue();
            renderedStyles[prop].previous = lerp(renderedStyles[prop].previous, renderedStyles[prop].current, renderedStyles[prop].ease);
        });
        if (Math.abs(renderedStyles.translationY.previous - renderedStyles.translationY.current) > 0.9) {
            listeners.forEach(function (_a) {
                var eventName = _a[0], fn = _a[1];
                if (eventName === 'scroll') {
                    fn({ docScrollValue: state.docScroll, scrollValue: renderedStyles.translationY.previous });
                }
            });
        }
        translateScrollableElement();
        requestAnimationFrame(render);
    }
    function getCurrentValue() {
        return state.docScroll;
    }
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
        getCurrentValue: getCurrentValue,
        on: on,
        destroy: destroy,
    };
}

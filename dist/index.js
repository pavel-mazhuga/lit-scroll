!(function(e, o) {
    'object' == typeof exports && 'undefined' != typeof module
        ? (module.exports = o())
        : 'function' == typeof define && define.amd
        ? define(o)
        : ((e = e || self).LitScroll = o());
})(this, function() {
    'use strict';
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */ var e = function() {
        return (e =
            Object.assign ||
            function(e) {
                for (var o, t = 1, n = arguments.length; t < n; t++)
                    for (var r in (o = arguments[t])) Object.prototype.hasOwnProperty.call(o, r) && (e[r] = o[r]);
                return e;
            }).apply(this, arguments);
    };
    function o(e, o, t) {
        return (1 - t) * e + t * o;
    }
    var t = { ease: 0.1 };
    return function(n) {
        void 0 === n && (n = t);
        var r = document.documentElement,
            l = document.body,
            i = l.querySelector('[data-lit-scroll="wrapper"]'),
            s = l.querySelector('[data-lit-scroll="container"]');
        if (!i) throw new Error('[lit-scroll] Wrapper element not found.');
        if (!s) throw new Error('[lit-scroll] Container element not found.');
        var c = 0,
            u = new Set(),
            a = e(e({}, t), n),
            d = { docScroll: 0, scrollToValue: null, windowWidth: window.innerWidth, windowHeight: window.innerHeight },
            f = {
                previous: 0,
                current: 0,
                ease: a.ease,
                setValue: function() {
                    return d.docScroll;
                },
            };
        function w() {
            (d.windowWidth = window.innerWidth), (d.windowHeight = window.innerHeight);
        }
        function v() {
            d.docScroll = window.pageYOffset || r.scrollTop;
        }
        function p() {
            s.style.transform = 'translate3d(0,' + -1 * f.previous + 'px,0)';
        }
        function h() {
            l.style.height = s.scrollHeight + 'px';
        }
        function y() {
            w(), h();
        }
        function m() {
            if (d.scrollToValue) {
                f.current = d.scrollToValue;
                var e = o(f.previous, f.current, f.ease);
                (f.previous = e), window.scrollTo(0, e);
            } else (f.current = f.setValue()), (f.previous = o(f.previous, f.current, f.ease));
            Math.abs(f.previous - f.current) > 0.9
                ? u.forEach(function(e) {
                      var o = e[0],
                          t = e[1];
                      'scroll' === o &&
                          t({ docScrollValue: d.docScroll, scrollValue: f.previous, maxHeight: s.scrollHeight });
                  })
                : (d.scrollToValue = null),
                p(),
                requestAnimationFrame(m);
        }
        return (
            v(),
            w(),
            h(),
            (f.current = f.setValue()),
            (f.previous = f.setValue()),
            p(),
            (i.style.position = 'fixed'),
            (i.style.width = '100%'),
            (i.style.height = '100%'),
            (i.style.top = '0'),
            (i.style.left = '0'),
            (i.style.overflow = 'hidden'),
            window.addEventListener('resize', y),
            window.addEventListener('scroll', v),
            (c = requestAnimationFrame(m)),
            r.classList.add('lit-scroll-initialized'),
            {
                destroy: function() {
                    cancelAnimationFrame(c),
                        window.removeEventListener('resize', y),
                        window.removeEventListener('scroll', v),
                        u.clear(),
                        (l.style.height = ''),
                        (i.style.position = ''),
                        (i.style.width = ''),
                        (i.style.height = ''),
                        (i.style.top = ''),
                        (i.style.left = ''),
                        (i.style.overflow = ''),
                        r.classList.remove('lit-scroll-initialized');
                },
                getCurrentValue: function() {
                    return d.docScroll;
                },
                on: function(e, o) {
                    u.add([e, o]);
                },
                off: function(e, o) {
                    u.delete([e, o]);
                },
                scrollTo: function(e, o) {
                    var t, n, r;
                    void 0 === o && (o = { native: !1 });
                    var l = null;
                    if (('number' == typeof e && (l = e), 'string' == typeof e)) {
                        var i = document.querySelector(e);
                        i && (l = window.scrollY + i.getBoundingClientRect().top);
                    }
                    return (
                        e instanceof Element && (l = window.scrollY + e.getBoundingClientRect().top),
                        l &&
                            (o.native &&
                            (null === (r = null === (t = window.CSS) || void 0 === t ? void 0 : (n = t).supports) ||
                            void 0 === r
                                ? void 0
                                : r.call(n, 'scroll-behavior', 'smooth'))
                                ? window.scrollTo({ top: l, behavior: 'smooth' })
                                : (d.scrollToValue = l)),
                        l
                    );
                },
            }
        );
    };
});

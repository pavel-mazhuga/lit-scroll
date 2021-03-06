export type EventName = 'scroll';

export type LitScrollListenerEvent = {
    docScrollValue: number;
    scrollValue: number;
    maxHeight: number;
    speed: number;
};

export type ListenerFunction = (eventName: EventName, fn: (event: LitScrollListenerEvent) => void) => void;

export type ScrollTo = (target: number | string | Element, options?: { native: boolean }) => number | null;

export type LitScrollInstance = {
    getCurrentValue: () => number;
    getCurrentLerpValue: () => number;
    getSpeed: () => number;
    on: ListenerFunction;
    off: ListenerFunction;
    enable: () => void;
    disable: () => void;
    isEnabled: () => boolean;
    scrollTo: ScrollTo;
    destroy: () => void;
};

export type LitScrollOptions = {
    ease: number;
    mobile: boolean;
};

export type ScrollToOptions = {
    native: boolean;
};

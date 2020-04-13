export type EventName = 'scroll';

export type LitScrollListenerEvent = {
    docScrollValue: number;
    scrollValue: number;
    maxHeight: number;
};

export type ListenerFunction = (eventName: EventName, fn: (event: LitScrollListenerEvent) => void) => void;

export type ScrollTo = (target: number | string | Element, options?: { native: boolean }) => number | null;

export type LitScrollInstance = {
    getCurrentValue: () => number;
    on: ListenerFunction;
    off: ListenerFunction;
    scrollTo: ScrollTo;
    destroy: () => void;
};

export type LitScrollOptions = {
    ease: number;
};

export type ScrollToOptions = {
    native: boolean;
};

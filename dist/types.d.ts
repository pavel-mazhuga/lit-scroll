export declare type EventName = 'scroll';
export declare type LitScrollListenerEvent = {
    docScrollValue: number;
    scrollValue: number;
    maxHeight: number;
};
export declare type ListenerFunction = (eventName: EventName, fn: (event: LitScrollListenerEvent) => void) => void;
export declare type ScrollTo = (target: number | string | Element, options?: {
    native: boolean;
}) => number | null;
export declare type LitScrollInstance = {
    getCurrentValue: () => number;
    on: ListenerFunction;
    off: ListenerFunction;
    enable: () => void;
    disable: () => void;
    isEnabled: () => boolean;
    scrollTo: ScrollTo;
    destroy: () => void;
};
export declare type LitScrollOptions = {
    ease: number;
    mobile: boolean;
};
export declare type ScrollToOptions = {
    native: boolean;
};

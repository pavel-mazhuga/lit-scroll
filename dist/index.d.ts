declare type EventName = 'scroll';
declare type LitScrollListenerEvent = {
    docScrollValue: number;
    scrollValue: number;
    maxHeight: number;
};
declare type LitScrollListener = (event: LitScrollListenerEvent) => void;
declare type ListenerFunction = (eventName: EventName, fn: LitScrollListener) => void;
declare type ScrollTo = (target: number | string | Element, options?: {
    native: boolean;
}) => number | null;
declare type LitScrollInstance = {
    getCurrentValue: () => number;
    on: ListenerFunction;
    scrollTo: ScrollTo;
    destroy: () => void;
};
declare type LitScrollOptions = {
    ease: number;
};
export default function createLitScroll(_options?: Partial<LitScrollOptions>): LitScrollInstance;
export {};

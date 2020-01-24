interface LitScrollOptions {
    ease?: number;
}
declare type EventName = 'scroll';
interface LitScrollListenerEvent {
    docScrollValue: number;
    scrollValue: number;
}
declare type LitScrollListener = (event: LitScrollListenerEvent) => void;
declare type ListenerFunction = (eventName: EventName, fn: LitScrollListener) => void;
interface LitScrollInstance {
    getCurrentValue: () => number;
    on: ListenerFunction;
    destroy: () => void;
}
export default function createLitScroll(_options?: LitScrollOptions): LitScrollInstance;
export {};

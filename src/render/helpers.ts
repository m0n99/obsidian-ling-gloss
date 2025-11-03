import { IGlossOptionStyles } from "src/data/gloss";
import { sanitizeCssClasses } from "src/utils";


export const getStyleKind = (kind: string) =>
    kind.length > 0 ? `ling-gloss-${kind}` : "ling-gloss";

export const getStyleClasses = (classes: string[]) =>
    sanitizeCssClasses(classes).map(cls => `ling-style-${cls}`);

export const getLevelMetadata = (level: number): [string, keyof IGlossOptionStyles] => {
    switch (level) {
        case 0: return ["level-a", "levelA"];
        case 1: return ["level-b", "levelB"];
        case 2: return ["level-c", "levelC"];
        default: return ["level-x", "levelX"];
    }
}


interface IBlockOptions {
    kind: string;
    text: string;
    cls?: string[];
    always?: boolean;
    render?: (element: HTMLElement, text: string) => void | Promise<void>;
}

export const formatWhitespace = (text: string, nbsp = false): string =>
    text.replace(/\s+/g, nbsp ? "\u00A0" : " ");

export const renderBlock = (target: HTMLElement, options: IBlockOptions) => {
    if (options.text.length < 1 && !options.always) return;

    const element = target.createDiv({
        cls: [getStyleKind(options.kind), ...getStyleClasses(options.cls ?? [])],
    });

    if (options.render) {
        const result = options.render(element, options.text);
        if (result instanceof Promise) void result;
        return;
    }

    setElementText(element, formatWhitespace(options.text));
};

export function setElementText(element: HTMLElement, value: string) {
    const maybeSetText = (element as HTMLElement & { setText?: (text: string) => void }).setText;
    if (typeof maybeSetText === "function") {
        maybeSetText.call(element, value);
    } else {
        element.textContent = value;
    }
}

import { MarkdownPostProcessorContext, Plugin } from "obsidian";

import { GlossParser } from "src/parser/main";
import { GlossRenderer } from "src/render/main";
import { PluginSettingsTab } from "src/settings/main";
import { PluginSettingsWrapper } from "src/settings/wrapper";


export default class LingGlossPlugin extends Plugin {
    settings = new PluginSettingsWrapper(this);
    parser = new GlossParser(this.settings);
    renderer = new GlossRenderer(this.settings, this);

    async onload() {
        await this.settings.load();

        this.addSettingTab(new PluginSettingsTab(this, this.settings));

        this.registerMarkdownCodeBlockProcessor("gloss", (src, el, ctx) => this.processGlossMarkdown(src, el, ctx, false));
        this.registerMarkdownCodeBlockProcessor("ngloss", (src, el, ctx) => this.processGlossMarkdown(src, el, ctx, true));
    }

    private processGlossMarkdown(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext, nlevel: boolean) {
        const glossData = this.parser.parse(source, nlevel);

        if (glossData.success) {
            this.renderer.renderGloss(
                el,
                glossData.data,
                ctx.sourcePath ?? this.app.workspace.getActiveFile()?.path ?? "",
            );
        } else {
            this.renderer.renderErrors(el, glossData.errors);
        }
    }
}

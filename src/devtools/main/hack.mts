/// <reference path="../types.d.ts" />
import { InspectorFrontendHostInstance } from 'chrome-devtools-frontend/front_end/core/host/InspectorFrontendHost.ts'
import { FormatterWorkerPool } from 'chrome-devtools-frontend/front_end/models/formatter/FormatterWorkerPool.ts'
import * as UI from 'chrome-devtools-frontend/front_end/ui/legacy/legacy.ts'

export function fixDOM() {
    ShadowRoot.prototype.getSelection = ShadowRoot.prototype.getComponentSelection

    ShadowRoot.prototype.getBoundingClientRect = function () {
        return this.host.getBoundingClientRect()
    }

    Element.prototype.scrollIntoViewIfNeeded = Element.prototype.scrollIntoView

    // Some Chrome-only CSS feature are used and causes some UI strange
    const insertRule = CSSStyleSheet.prototype.insertRule
    CSSStyleSheet.prototype.insertRule = function (rule: string, index: number) {
        rule = String(rule)
        try {
            if (rule.includes(':host-context')) {
                if (rule.includes(':host-context(.breakpoints-deactivated)')) {
                    // fixed
                } else {
                    console.warn('Replaced :host-context with :host in CSS rule:', rule)
                }
                rule = rule.replaceAll(':host-context', ':host')
            }
            return insertRule.call(this, rule, index)
        } catch (error) {
            console.error(rule, error)
            return insertRule.call(this, '.never {}', index)
        }
    }
}

export function fixCSSHostContext(
    Sources: typeof import('chrome-devtools-frontend/front_end/panels/sources/sources.ts'),
) {
    // workaround of --host-context
    Sources.SourcesView.SourcesView.prototype.toggleBreakpointsActiveState = function (active: boolean) {
        this.editorContainer.view.element
            .querySelector('devtools-text-editor')!
            .classList.toggle('breakpoints-deactivated', !active)
    }
    const editor = customElements.get('devtools-text-editor')!
    const old = editor.prototype.dispatch
    // the breakpoint highlight style on firefox does not work.
    const seen = new WeakSet()
    editor.prototype.dispatch = function () {
        if (!(this.shadowRoot as ShadowRoot).adoptedStyleSheets.some((sheet) => seen.has(sheet))) {
            const style = new CSSStyleSheet()
            seen.add(style)
            style.replace(`
        .cm-gutterElement.cm-breakpoint {
          background: #4285f4;
          border-color: transparent;
          border-image: unset !important;
          -webkit-border-image: unset !important;
          :host(.breakpoints-deactivated) & {
            background: #d9e7fd;
          }
          :host(.breakpoints-deactivated) .ͼ3 & {
            background: #2e3b51;
          }
        }
      `)
            this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, style]
        }
        return old.apply(this, arguments)
    }
}

export function fixChromeDevtoolsFrontend() {
    InspectorFrontendHostInstance.reattach = (f) => f()
    InspectorFrontendHostInstance.getHostConfig = (f) => {
        f({
            devToolsVeLogging: { enabled: true },
            devToolsFlexibleLayout: { verticalDrawerEnabled: true },
            devToolsProtocolMonitor: { enabled: true },
            devToolsGlobalAiButton: { enabled: false },
        });
    }
    // Remove not implemented panels
    UI.ViewManager.maybeRemoveViewExtension('heap-profiler')
}

export function fixWorker() {
    FormatterWorkerPool.instance({
        forceNew: true,
        entrypointURL: new URL('/lib/devtools/formatter_worker.js', import.meta.url).toString(),
    })
}

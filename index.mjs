// !! Sync imports with package.json !!
import { createStarryNight, common } from 'https://esm.sh/@wooorm/starry-night@1?bundle'
import cson from "https://esm.sh/cson2json@2?bundle"
import { toHtml } from "https://esm.sh/hast-util-to-html@8?bundle"
import yaml from "https://esm.sh/js-yaml@4?bundle"
import plist from "https://esm.sh/plist@3?bundle"

const PARSERS = {
    'json': JSON.parse,
    'cson': cson,
    'yaml': yaml.load,
    'plist': plist.parse,
};

export const $ = elem => document.querySelector(elem);

const OPTIONS = ['grammar-type', 'grammar', 'sample-type', 'sample'];

function getUrlParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

/**
 * Applies highlighting from a grammar to a sample.
 * @returns {Promise<string>} A HAST tree of HTML elements.
 */
async function applyHighlighting(type, grammar, sample, includeCommonGrammars) {
    const grammarJson = PARSERS[type](grammar);
    // Set defaults if values are unset
    grammarJson.extensions ??= [];
    grammarJson.names ??= [];
    grammarJson.scopeName ??= grammarJson.scope; // Set scope if it is under different key in source

    const grammars = includeCommonGrammars ? [...common, grammarJson] : [grammarJson];

    const starryNight = await createStarryNight(grammars);
    const tree = starryNight.highlight(sample, grammarJson.scopeName);
    return tree;
}

/**
 * Runs highlighting process from the webpage.
 */
export async function run() {
    load()
        .then(data => {
            $('output').innerHTML = toHtml(data);
        })
        .catch(err => {
            console.error(err);
            $('output').innerHTML = `<details><summary>An error occurred</summary>${err}</details>`;
        });
}

/**
 * Loads the grammar and sample from input and creates a highlighting tree.
 */
export async function load() {
    const grammarInput = $('#grammar').value;
    const sampleInput = $('#sample').value;
    const grammarType = $('#grammar-type').value;
    const sampleType = $('#sample-type').value;
    const includeCommonGrammars = $('#include-common').checked;
    const grammar = grammarType.includes('text') ? grammarInput : await fetch(grammarInput).then(data => data.text());
    const sample = sampleType.includes('text') ? sampleInput : await fetch(sampleInput).then(data => data.text());
    let fileType = 'json';
    if (grammarType === 'url') {
        if (/\.(json|json-tmlanguage)$/i.test(grammarInput))
            fileType = 'json';
        if (/\.(cson|cson-tmlanguage)$/i.test(grammarInput))
            fileType = 'cson';
        else if (/\.(yaml|yaml-tmlanguage)$/i.test(grammarInput))
            fileType = 'yaml';
        else if (/\.(xml|tmlanguage)$/i.test(grammarInput))
            fileType = 'plist';
    }
    else {
        if (/<!doctype\s*plist/i.test(grammar))
            fileType = 'plist';
        if (/^\s*\{/i.test(grammar))
            fileType = 'json';
        else if (/^\w+:\s*\[\s*$/m.test(grammar))
            fileType = 'cson';
        else if (/^\w+:\s*$/m.test(grammar))
            fileType = 'yaml';
    }
    $('#autodetected').innerText = `Detected format: ${fileType.toUpperCase()}.`;
    const highlightTree = await applyHighlighting(fileType, grammar, sample, includeCommonGrammars);
    return highlightTree;
}

/**
 * Grab from URL on first load if applicable.
 */
export function initLoad() {
    if (!window.location.search) return;

    OPTIONS.forEach(opt => {
        $(`#${opt}`).value = getUrlParam(opt);
    });
    run();
    adjustTextareaSize();
    window.history.pushState(null, null, window.location.pathname);
    $('#loading').innerText = '';
}

/**
 * Save the form data into the URL.
 */
export function saveToUrl() {
    const newUrl = new URL(window.location.href);
    OPTIONS.forEach(opt => {
        newUrl.searchParams.set(opt, $(`#${opt}`).value);
    });
    window.history.pushState(null, null, newUrl.search);
    navigator.clipboard.writeText(window.location.href);
    alert('URL copied to clipboard');
}

/**
 * Change size of textarea to fit the expected content.
 */
export function adjustTextareaSize() {
    $('#grammar').className = $('#grammar-type').value.split('-')[0];
    $('#sample').className = $('#sample-type').value;
}

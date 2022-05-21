import { createStarryNight, common } from 'https://esm.sh/@wooorm/starry-night@1?bundle'
import { toHtml } from "https://esm.sh/hast-util-to-html@8?bundle"
import yaml from "https://esm.sh/js-yaml@4?bundle"

const $ = elem => document.querySelector(elem);

function getUrlParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

/**
 * Applies highlighting from a grammar to a sample.
 * @returns {Promise<string>} A tree of HTML elements.
 */
async function applyHighlighting(grammar, sample) {
    const grammarJson = yaml.load(grammar);
    grammarJson.extensions ??= [];
    grammarJson.names ??= [];

    const starryNight = await createStarryNight([grammarJson]);
    const tree = starryNight.highlight(sample, grammarJson.scopeName);
    return tree;
}

/**
 * Runs highlighting process from the webpage.
 */
export async function run() {
    const grammarInput = $('#grammar').value;
    const sampleInput = $('#sample').value;
    const grammarType = $('#grammar-type').value;
    const sampleType = $('#sample-type').value;
    const grammar = grammarType == 'text' ? grammarInput : await fetch(grammarInput).then(data => data.text());
    const sample = sampleType == 'text' ? sampleInput : await fetch(sampleInput).then(data => data.text());
    const highlightTree = await applyHighlighting(grammar, sample);
    $('output').innerHTML = toHtml(highlightTree);
}

/**
 * Save the form data into the URL.
 */
export function saveToUrl() {
    window.history.pushState(null, null, `?grammar=${$('#grammar').value}&sample=${$('#sample').value}`);
    navigator.clipboard.writeText(window.location.href);
    alert('URL copied to clipboard');
}

/**
 * Grab from URL on first load if applicable.
 */
export function initLoad() {
    if (!window.location.search) return;

    $('#grammar').value = getUrlParam('grammar');
    $('#sample').value = getUrlParam('sample');
    run();
    window.history.pushState(null, null, window.location.pathname);
}

/**
 * Change size of textarea to fit the expected content.
 */
export function adjustTextareaSize() {
    $('#grammar').className = $('#grammar-type').value;
    $('#sample').className = $('#sample-type').value;
}


import { createStarryNight, common } from 'https://esm.sh/@wooorm/starry-night@1?bundle'
import { toHtml } from "https://esm.sh/hast-util-to-html@8?bundle"
import yaml from "https://esm.sh/js-yaml@4?bundle"

const $ = elem => document.querySelector(elem);

export async function run() {
    const grammar = $('#grammar').value;
    const sample = $('#sample').value;
    
    const grammarJson = yaml.load(grammar);
    grammarJson.extensions ??= [];
    grammarJson.names ??= [];
    console.debug(grammarJson)

    const starryNight = await createStarryNight([grammarJson]);
    const tree = starryNight.highlight(sample, grammarJson.scopeName);

    $('output').innerHTML = toHtml(tree);
}


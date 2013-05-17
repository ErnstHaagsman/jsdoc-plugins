/**
 * JSdoc plugin that allows categorization of classes
 */

exports.defineTags = function(dictionary) {
    dictionary.defineTag('category', {
        mustHaveValue: true,
        onTagged: function(doclet, tag) {
            if(env.conf.categoryList.indexOf(tag.value) !== -1)
            {
                doclet.category = tag.value.split('/');
                doclet.categoryNestingLevel = doclet.category.length - 1;
            }
            else
            {
                console.error('ERROR  Undefined category "' + tag.value + '"');
                throw 'Undefined category';
            }
        }
    });
};

exports.handlers = {
    parseBegin: function() {
        loadConfiguration();
    }
};

function loadConfiguration () {
    try
    {
        var fs = require('jsdoc/fs');
        var confFileContents = fs.readFileSync(env.conf.categoryfile, 'utf8');
        env.conf.categories = JSON.parse( (confFileContents || "{}" ) );
        env.conf.categoryList = Object.keys(env.conf.categories);
    }
    catch (e)
    {
        throw 'Could not load category file';
    }
}
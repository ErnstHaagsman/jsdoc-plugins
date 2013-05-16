describe("Categories tag", function() {
    var parser = new (require("jsdoc/src/parser")).Parser(),
        docSet;

    env.conf.categoryfile = 'addons/test/fixtures/categories.json';
    require('jsdoc/plugins').installPlugins(['addons/categories'], parser);
    docSet = jasmine.getDocSetFromFile("addons/test/fixtures/categories.js", parser);
    var model = docSet.getByLongname('Model')[0];

    it("should have correctly interpreted categories found in the JSON file", function() {
        expect(model.category).toEqual(['util','helpers']);
        expect(model.categoryNestingLevel).toEqual(1);
    });

    it('should throw an exception when a non-existing category is found', function() {
        var exception = 'Undefined category';
        var dictionary = require('jsdoc/tag/dictionary');
        var onTagged = dictionary.lookUp('category').onTagged;
        var Tag = {value: 'clearly/not/existing/category/for/testing/purposes'};

        expect(onTagged.bind(null,null,Tag)).toThrow(exception);
    });
});

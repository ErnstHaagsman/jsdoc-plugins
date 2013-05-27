describe("Categories tag", function() {
    var parser = new (require("jsdoc/src/parser")).Parser(),
        categoryAddon = require('addons/categories'),
        docSet;

    env.conf.categoryfile = 'addons/test/fixtures/categories.json';
    require('jsdoc/plugins').installPlugins(['addons/categories'], parser);
    docSet = jasmine.getDocSetFromFile("addons/test/fixtures/categories.js", parser);
    var model = docSet.getByLongname('Model')[0];

    it("should have correctly interpreted categories found in the JSON file", function() {
        expect(model.category).toEqual(['util','helpers']);
        expect(model.categoryNestingLevel).toEqual(1);
    });

    it('should be able to generate a nested category object', function() {
        var expected = {
            util : {
                displayName : 'Utilities',
                description : 'Description',
                children : {
                    helpers : {
                        displayName : 'Helper Classes',
                        description : ''
                    }
                }
            }
        };

        var actual = categoryAddon.processCategories(env.conf.categories);

        expect(actual).toEqual(expected);
    });

    it('should also copy any fields into the nested object', function() {
        var expected = {
            util : {
                displayName : 'Utilities',
                description : 'Description',
                url: 'http://any.com',
                children : {
                    helpers : {
                        displayName : 'Helper Classes',
                        description : ''
                    }
                }
            }
        };

        var clonedCategories = JSON.parse(JSON.stringify(env.conf.categories));

        clonedCategories['util'].url = 'http://any.com';

        var actual = categoryAddon.processCategories(clonedCategories);

        expect(actual).toEqual(expected);
    });

    it('should throw an exception when a non-existing category is found', function() {
        var exception = 'Undefined category';
        var dictionary = require('jsdoc/tag/dictionary');
        var onTagged = dictionary.lookUp('category').onTagged;
        var Tag = {value: 'clearly/not/existing/category/for/testing/purposes'};

        spyOn(console,'error');
        expect(onTagged.bind(null,null,Tag)).toThrow(exception);
        expect(console.error).toHaveBeenCalledWith('ERROR  Undefined category "' + Tag.value + '"')
    });
});

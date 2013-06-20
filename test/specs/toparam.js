describe ("@toparam tag", function(){
    var parser = new (require("jsdoc/src/parser")).Parser();
    var dumper = require("jsdoc/util/dumper");
    require('jsdoc/plugins').installPlugins(['addons/toparam'], parser);

    var docSet = jasmine.getDocSetFromFile('addons/test/fixtures/toparam.js', parser);

    var SomeClass = docSet.getByLongname('Something.SomeClass')[1],
        fill = docSet.getByLongname('Something.SomeClass#fill')[0];

    it('should have added the parameter', function(){
        var fill_param = SomeClass.params.filter(function(param){
            if (param.name == 'config.fill') return true;
        });

        expect(fill_param.length).toBe(1);
    });

    it('should have copied the member\'s properties', function(){
        var fill_param = SomeClass.params.filter(function(param){
            if (param.name == 'config.fill') return true;
        });

        expect(fill_param.length).toBe(1);
        // If this fails, the previous unit test also failed

        if(fill_param.length)
        {
            var param = fill_param[0];
            expect(param.type).toEqual(fill.type);
            expect(param.defaultvalue).toEqual(fill.defaultvalue);
            expect(param.optional).toEqual(false);
            expect(param.description).toEqual(fill.description);
        }
    });

    it('should be able to create optional parameters', function(){
        var param = SomeClass.params.filter(function(param){
            if (param.name == 'border') return true;
        });

        expect(param.length).toBe(1);
        // If this fails, the previous unit test also failed

        if(param.length)
        {
            expect(param[0].optional).toEqual(true);
        }
    });
});

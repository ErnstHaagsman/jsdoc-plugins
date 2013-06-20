/**
 * Property-to-param tag. For when initial values of properties may be supplied as parameters.
 *
 * @author Ernst Haagsman (Solpeo) <ernsthaagsman@gmail.com>
 */

exports.defineTags = function(dictionary){
    dictionary.defineTag('toparam', {
        // May have a value
        onTagged: function(doclet, tag){
            if(tag.value)
            {
                doclet.toparam = tag.value;
            }
            else
            {
                if(!doclet.toparam) doclet.toparam = true;
            }
        }
    });
};

exports.handlers = {
    beforeParse : function(e) {
        e.source = e.source.replace('@toparam',"@default \n  @toparam",'g');
    },
    parseComplete : function(args){
        docs = args.doclets;

        var i = docs.length;
        while (--i >= 0)
        {
            if(docs[i] && docs[i].toparam)
            {
                var doclet = docs[i];
                var param = {};

                // Determine if the parameter should be optional
                if (doclet.toparam.length)
                {
                    var regex = /\[([\w\.]*)\]/;
                    if(regex.test(doclet.toparam))
                    {
                        var matches = doclet.toparam.match(regex);
                        doclet.toparam = matches[1];
                        param.optional = true;
                    }
                    else
                    {
                        param.optional = false;
                    }
                }

                param.type = doclet.type;
                param.description = doclet.description;
                param.name = doclet.toparam + doclet.name;
                param.defaultvalue = doclet.defaultvalue;

                // Param is now ready, let's add it to the constructor
                var j = docs.length;
                while (--j >= 0)
                {
                    if(docs[j] && docs[j].longname && docs[j].longname == doclet.memberof && docs[j].kind == 'class')
                    {
                        if(!docs[j].params) docs[j].params = [];
                        docs[j].params.push(param);
                    }
                }
            }
        }
    }
};

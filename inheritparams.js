exports.defineTags = function(dictionary){
    dictionary.defineTag('inheritparams', {
        mustHaveValue: true,
        onTagged: function(doclet, tag) {
            if (!doclet.inheritparams) {doclet.inheritparams = [];}
            doclet.inheritparams.push(tag.value);
        }
    });
};

exports.handlers = {
    processingComplete: function(doclets) {
        var docs = doclets.doclets;
        var dependencies = mapDependencies(docs.index);
        var sorted = sort(dependencies);
        var longnames = [];

        // only build the list of longnames if we'll actually need it
        if (sorted.length) {
            longnames = docs.map(function(doc) {
                if (doc.longname) {
                    return doc.longname;
                }
            });
        }

        sorted.forEach(function(name) {
            // Copy inherited constructor parameters
            var inheritedparams = {};
            var doclets = docs.index[name];
            var doc, parents, parent, candidates;
            var doop = require("jsdoc/util/doop").doop;
            if(!doclets) { return; }
            for (var i = 0, ii = doclets.length; i < ii; i++) {
                doc = doclets[i];
                if (!doc.inheritparams) { continue; }
                parents = doc.augments;
                candidates = [];

                if (parents && doc.kind === "class") {
                    for (var j = 0, jj = parents.length; j < jj; j++) {
                        parent = docs.index[parents[j]];
                        if(!parent[0].params) {continue;}
                        candidates = candidates.concat(doop(parent[0].params));
                    }
                }

                candidates = candidates.filter(function(param){
                    for (var h = 0, hh = doc.inheritparams.length; h < hh; h++)
                    {
                        if (param.name.indexOf(doc.inheritparams[h]) !== -1)
                        {
                            param.inherited = true;
                            return true;
                        }
                    }
                    return false;
                });
                inheritedparams[doc.longname] = candidates;
            }

            if(Object.keys(inheritedparams).length)
            {
                for (var k = 0, kk = docs.length; k < kk; k++)
                {
                    if(inheritedparams[docs[k].longname])
                    {
                        if(docs[k].params)
                        {
                            var existing_param_names = docs[k].params.map(function(param){
                                return param.name;
                            });
                            inheritedparams[docs[k].longname].forEach(function(param){
                                if(existing_param_names.indexOf(param.name) === -1)
                                {
                                    docs[k].params.push(param);
                                }
                            });
                        }
                        else
                        {
                            docs[k].params = inheritedparams[docs[k].longname];
                        }
                    }
                }
            }
        });
    }
};

function mapDependencies(index) {
    var doclets, doc, len, dependencies = {};

    Object.keys(index).forEach(function(name) {
        doclets = index[name];
        for (var i = 0, ii = doclets.length; i < ii; ++i) {
            doc = doclets[i];
            if (doc.kind === "class" || doc.kind === "external") {
                dependencies[name] = {};
                len = doc.augments && doc.augments.length || 0;
                for (var j = 0; j < len; ++j) {
                    dependencies[name][doc.augments[j]] = true;
                }
            }
        }
    });

    return dependencies;
}

function sort(dependencies) {
    var sorter = new Sorter(dependencies);
    return sorter.sort();
}

function Sorter(dependencies) {
    this.dependencies = dependencies;
    this.visited = {};
    this.sorted = [];
}

Sorter.prototype.visit = function(key) {
    var self = this;

    if (!(key in this.visited)) {
        this.visited[key] = true;

        if (this.dependencies[key]) {
            Object.keys(this.dependencies[key]).forEach(function(path) {
                self.visit(path);
            });
        }

        this.sorted.push(key);
    }
};

Sorter.prototype.sort = function() {
    var self = this;

    Object.keys(this.dependencies).forEach(function(key) {
        self.visit(key);
    });

    return this.sorted;
};
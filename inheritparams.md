@inheritparams tag
==================

Overview
--------

The inheritparams tag allows you to automatically copy parameters from the parent object to children. It takes one
parameter: a filter to determine which parameters are copied.

```javascript

/**
 * @param config Configuration object
 * @param config.parentValue Value set on the parent object
 * @constructor
 */
function ParentClass(config) {
	this.parentValue = config.parentValue;
}

/**
 * @param config Configuration object
 * @param config.childValue Value set on the child object
 * @augments ParentClass
 * @inheritparams config.
 * @constructor
 */
function ChildClass(config) {
	ParentClass.call(this, config);
	this.childValue = config.childValue;
}

```

In the above example, `config.parentValue` would also be listed in the parameters for the child object.

`@inheritparams` can propagate through several levels of implementation, `GrandChildClass` would receive
`config.parentValue` if it specifies `@augments ChildClass` and `@inheritparams config.`.

Syntax
------

    @inheritparams [filter]

inheritparams requires a single parameter: the filter. In the above example `config.` (with dot) was used, to copy
all properties of the config object. inheritparams will copy any parameter which contains the filter string.
Wildcards or regexes are not currently supported. If you have a need for these, please open an issue or pull request on
this github page.
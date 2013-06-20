@toparam tag
============

Overview
--------

The toparam tag allows you to automatically generate constructor parameter documentation for properties.

This is useful when your classes can set their properties from parameters.

```javascript

    /**
     *
     * @param {Object} config Description
     * @memberOf Something
     * @constructor
     */
    function SomeClass(config)
    {
        /**
         * The fill color of some class.
         *
         * @type string
         * @toparam [config.]
         */
        this.fill = 'black';
    }
```

The above code will also document an optional 'config.fill' parameter.

Syntax
------

    @toparam [prefix]

toparam may be used with, or without, a tag value. If a tag value is provided it is used as prefix for the name of the
parameter. For example, in the example above 'config.' is used as prefix, to indicate that the fill parameter is part
of a configuration object supplied as parameter to the constructor. The name of the property is used as name of the
parameter.

To indicate an optional parameter, put the prefix between blocky brackets ("[]"). A set of empty blocky brackets will
make an optional parameter without a prefix.

Something.SomeClass = (function(){

    /**
     *
     * @param {Object} config Description
     * @memberOf Something
     * @constructor
     */
    function SomeClass(config)
    {

    }

    SomeClass.property(/** @lends Something.SomeClass.prototype */{
        /**
         * The fill color of some class.
         *
         * @type string
         * @toparam config.
         */
        fill: 'black',
        /**
         * The border color of some class.
         *
         * @type string
         * @toparam []
         */
        border: '1px black solid'
                       });

    return SomeClass;
})();

/**
 *
 */
function FileLoader(configuration) {

    // ---------------------------------------------------------------------------------------- Preferences & Properties

    var defaultConfiguration = {
            files         : [],
            onFileLoaded  : function (){},
            onFilesLoaded : function (){},
            onError       : function (){}
        },
        config = defaultConfiguration;

    // ----------------------------------------------------------------------------------------- Internal module methods

   /*
    * Returns the public api.
    *
    * @private
    * @returns {Object}
    */
    function getPublicApi() {
        return {};
    }


    /**
     *
     */
    function init() {
        setConfiguration();
    }

    // -------------------------------------------------------------------------------------------------- Helper methods

    /**
     * Checks if the type of the given parameter is an array.
     *
     * @param  {*} value
     * @return {boolean}
     */
    function isArray(value) {
        return Object.prototype.toString.call(value) == "[object Array]";
    }


    /**
     * Checks if the type of the given parameter is a function.
     *
     * @param  {*} value
     * @return {boolean}
     */
    function isFunction(value) {
        return Object.prototype.toString.call(value) == "[object Function]";
    }


    /**
     * Checks if the type of the given parameter is an object.
     *
     * @param  {*} value
     * @return {boolean}
     */
    function isObject(value) {
        return Object.prototype.toString.call(value) == "[object Object]";
    }


    /**
     * Checks if the type of the given parameter is a string.
     *
     * @param  {*} value
     * @return {boolean}
     */
    function isString(value) {
        return Object.prototype.toString.call(value) == "[object String]";
    }


    /**
     * Checks if the type of the given parameter is undefined.
     *
     * @param  {*} value
     * @return {boolean}
     */
    function isUndefined(value) {
        return Object.prototype.toString.call(value) == "[object Undefined]";
    }


    /**
     * Checks if the given configuration is valid.
     *
     * @param  {Object} configuration
     * @return {boolean}
     */
    function isValidConfiguration(configuration) {
        var i, amount;

        if (!isObject(configuration)) { return false; }
        if (!isArray(configuration.files)) { return false; }

        amount = configuration.files.length;

        for (i = 0; i < amount; i++) {
            if (isObject(configuration.files[i])) {
                if (isString(configuration.files[i].file)) {
                    config.files.push(configuration.files[i]);
                }
                else {
                    console.warn('Parameter: configuration.files[' + i + '] is not a valid string!');
                }
            }
        }

        if (isFunction(configuration.onFileLoaded)) {
            config.onFileLoaded = configuration.onFileLoaded;
        }
        else if (!isUndefined(configuration.onFileLoaded)) { return false; }

        if (isFunction(configuration.onFilesLoaded)) {
            config.onFilesLoaded = configuration.onFilesLoaded;
        }
        else if (!isUndefined(configuration.onFileLoaded)) { return false; }

        if (isFunction(configuration.onError)) {
            config.onError = configuration.onError;
        }
        else if (!isUndefined(configuration.onError)) { return false; }

        return true;
    }

    // --------------------------------------------------------------------------------------------------------- Methods

    function setConfiguration() {
        if (!isValidConfiguration(configuration)) {
            console.warn('The given configuration parameter is not valid!');
        }

        console.log(config);
    }

    // -------------------------------------------------------------------------------------------------------- Initials

    (init)();

    // --------------------------------------------------------------------------------------------------------- Returns

    return getPublicApi();
}

angular.module('ServiceRequestModule', ['ObjectConverterModule'])
    .service('ServiceRequest', [ '$http', 'ObjectConverter', function( $http, ObjectConverter ) {

        var ServiceRequest = { };

        /**
         * param function created by http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
         * Makes $http behave like $.ajax
         *
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function(obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj) {
                value = obj[name];

                if(value instanceof Array) {
                    for(i=0; i<value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value instanceof Object) {
                    for(subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        ServiceRequest.callXmlService = function(url, data) {
            return $http({
                url : url,
                method : 'POST',
                data : data,
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8'
                },
                transformRequest: function(data) {
                    var xml = ObjectConverter.jsonToXml(data);
                    return xml;
                },
                transformResponse : function(data) {
                    var json = ObjectConverter.xmlToJson( ObjectConverter.stringToXML(data) );
                    if(getType(json) === "string")
                    {
                        try{ data = JSON.parse(json); }
                        catch(e) { console.log("WARNING: There was an error parsing response JSON:"); return json; }
                    }
                    return json;
                }
            });
        };

        ServiceRequest.callJsonService = function(url, method, data)
        {
            return $http({
                url : url,
                method : 'POST',
                data : data,
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8'
                },
                transformRequest : function(data) {
                    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
                },
                transformResponse : function(data) {
                    if(getType(data) === "string")
                    {
                        try{ data = JSON.parse(data); }
                        catch(e) { console.log("WARNING: There was an error parsing response JSON:"); return data; }
                    }
                    return data;
                }
            })
        };

        // Helper to get the real type of an object
        function getType(obj)
        {
            if(obj instanceof String)      { return "string"; }
            else if(obj instanceof Array)  { return "array"; }
            else if(obj instanceof Object) { return "object"; }
            else                           { return typeof(obj); }
        };

        return ServiceRequest;
    }]);
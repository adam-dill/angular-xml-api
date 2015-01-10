angular.module('ObjectConverterModule', [])
    .service('ObjectConverter', [function() {
        var objectConverter = { };

        objectConverter.jsonToXml = function(json)
        {
            var returnValue = "";
            for(var propertyName in json) {
                // don't execute on attributes, those are handle as the tags are built
                if(propertyName == "_attributes") {
                    continue;
                }

                // this is the current positions value
                var value = json[propertyName];

                if(gettype(value) == "string")
                {
                    returnValue += value;
                }
                // check for children first
                else if(gettype(value) == "array") {
                    for(var i = 0; i < value.length; i++) {
                        var o = {};
                        o[propertyName] = value[i];
                        returnValue += objectConverter.jsonToXml(o);
                    }
                } else {
                    // OPENING TAG
                    returnValue += "<" + propertyName;
                    // Handle the attributes
                    if (value["_attributes"]) {
                        for (var attribute in value["_attributes"]) {
                            returnValue += " " + attribute + "='" + value["_attributes"][attribute] + "'";
                        }
                    }
                    returnValue += ">";

                    // CHILDREN
                    for (var child in value) {
                        var o = {};
                        o[child] = value[child];
                        returnValue += objectConverter.jsonToXml(o);
                    }

                    // CLOSING TAG
                    returnValue += "</" + propertyName + ">";
                }
            }
            return returnValue;
        }

        // http://davidwalsh.name/convert-xml-json with modification to @attributes, changed to _attributes to prevent javascript errors.
        objectConverter.xmlToJson = function(xml) {

            // Create the return object
            var obj = {};

            if (xml.nodeType == 1) { // element
                // do attributes
                if (xml.attributes.length > 0) {
                    obj["_attributes"] = {};
                    for (var j = 0; j < xml.attributes.length; j++) {
                        var attribute = xml.attributes.item(j);
                        obj["_attributes"][attribute.nodeName] = attribute.value;
                    }
                }
            } else if (xml.nodeType == 3) { // text
                obj = xml.nodeValue;
            }

            // do children
            if (xml.hasChildNodes()) {
                for(var i = 0; i < xml.childNodes.length; i++) {
                    var item = xml.childNodes.item(i);
                    var nodeName = item.nodeName;
                    if (typeof(obj[nodeName]) == "undefined") {
                        obj[nodeName] = objectConverter.xmlToJson(item);
                    } else {
                        if (typeof(obj[nodeName].push) == "undefined") {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(objectConverter.xmlToJson(item));
                    }
                }
            }
            return obj;
        };

        objectConverter.stringToXML = function(oString)
        {
            //code for IE
            if (window.ActiveXObject) {
                var oXML = new ActiveXObject("Microsoft.XMLDOM"); oXML.loadXML(oString);
                return oXML;
            }
            // code for Chrome, Safari, Firefox, Opera, etc.
            else {
                return (new DOMParser()).parseFromString(oString, "text/xml");
            }
        };

        objectConverter.xmlToString = function(xml)
        {
            return new XMLSerializer().serializeToString(xml);
        };

        /**
         * Internal method used to determine the true type of an object
         * @param obj
         * @returns {string}
         */
        function gettype(obj) {
            if(obj instanceof String)      { return "string"; }
            else if(obj instanceof Array)  { return "array"; }
            else if(obj instanceof Object) { return "object"; }
            else                           { return typeof(obj); }
        }

        return objectConverter;
    }]);
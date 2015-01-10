/**
 * Created by adamdill on 1/9/15.
 */
angular.module('app', ['ServiceRequestModule'])
    .controller('AppController', ['$scope', 'ServiceRequest', function($scope, ServiceRequest) {

        var serviceUrl = 'mock-service.php';

        var createRequest = function(method, values) {
            var returnValue = {};
            returnValue.SERVICE = {};
            returnValue.SERVICE._attributes = {};
            returnValue.SERVICE._attributes.method = method;
            returnValue.SERVICE.VALUES = {};
            returnValue.SERVICE.VALUES.VALUE = [];

            values.forEach(function(value) {
                returnValue.SERVICE.VALUES.VALUE.push({
                    _attributes: {
                        'value':value
                    }
                });
            });

            return returnValue;
        };

        // The JSON for the getMethods request
        var getMethodsRequest = {
            SERVICE: {
                _attributes: {
                    'method':'getMethods'
                }
            }
        };

        /**
         * Get available methods
         */
        ServiceRequest.callXmlService(serviceUrl, getMethodsRequest)
            .then(function(data) {
                var methods = [];
                var methodList = data.data["SERVICE"]["METHOD"];
                methodList.forEach(function(value) {
                    methods.push(value["_attributes"]["value"]);
                });
                $scope.availableMethods = methods.toString();
            });


        // hard-coded values for testing
        var method = 'add';
        var values = [10, 20, 30];

        /**
         * Make the service request
         */
        var request = createRequest(method, values);

        // call the service
        ServiceRequest.callXmlService(serviceUrl, request)
            .then(function(data) {
                console.log(data.data);
                $scope.response = data.data;
            });



    }]);
app.controller("LoginModalController", function ($scope, $route) {
    $scope.actions = {};
    $scope.formData = {
        signIn: {},
        signUp: {}
    };

    $scope.actions.signIn = function () {
        var data = $scope.formData.signIn;
        $scope.signIn({
            data: {
                username: data.username,
                password: data.password
            }
        }).then(function (response) {
            if (typeof response.data.UserID !== "undefined") {
                M.toast({
                    html: 'Logged in',
                    displayLength: '2000'
                });

                $scope.instances[0].close();
            }
            else {
                M.toast({
                    html: 'Error on login',
                    classes: 'red darken-4',
                    displayLength: '2000'
                });

                console.log(response);
            }
        }, function (errResponse) {
            M.toast({
                html: 'Error on login',
                classes: 'red darken-4',
                displayLength: '2000'
            });

            console.log(errResponse);
        });
    };

    $scope.actions.signUp = function () {
        var data = $scope.formData.signUp;
        
        if (!/\s/.test(data.username)) { // username validate
            $scope.signUp({
                data: {
                    username: data.username,
                    password: data.password,
                    email: data.email
                }
            }).then(function (response) {
                if (typeof response.data.UserID !== "undefined") {
                    M.toast({
                        html: 'User created',
                        displayLength: '2000'
                    });

                    $scope.instances[0].close();
                } else {
                    M.toast({
                        html: 'Error on user creation',
                        classes: 'red darken-4',
                        displayLength: '2000'
                    });

                    console.log(response);
                }
            }, function (errResponse) {
                M.toast({
                    html: 'Error on user creation',
                    classes: 'red darken-4',
                    displayLength: '2000'
                });

                console.log(errResponse);
            });
        }
        else {
            M.toast({
                html: 'Error on user creation',
                classes: 'red darken-4',
                displayLength: '2000'
            });
        }
    };
});
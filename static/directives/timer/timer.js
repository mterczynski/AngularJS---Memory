gameController.directive('timer', function() {
    return { 
        templateUrl: 'directives/timer/timer.html',
        restricts: 'A',
        css: 'directives/timer/timer.css'
    };
});
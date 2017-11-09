gameController.directive('timer', function() {
    return { 
        templateUrl: 'directives/timer/timer.html',
        restricts: 'EA',
        css: 'directives/timer/timer.css'
    };
});
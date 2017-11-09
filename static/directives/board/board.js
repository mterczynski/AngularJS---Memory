gameController.directive('board', function() {
    return { 
        templateUrl: 'directives/board/board.html',
        restricts: 'A',
        css: 'directives/board/board.css'
    };
});
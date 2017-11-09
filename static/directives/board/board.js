gameController.directive('board', function() {
    return { 
        templateUrl: 'directives/board/board.html',
        restricts: 'EA',
        css: 'directives/board/board.css'
    };
});
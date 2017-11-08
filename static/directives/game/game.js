let gameController = app.controller("gameController", function($scope, $location, $interval){

    $scope.backToMenu = ()=>{
        $location.path("/");
    }

    function start(){
        $scope.timeLeftString = "00:30:000";
        $scope.isTimeLeft = true;

        $scope.progressBarStyle = {
            width: $scope.barPercentage  + "%"
        }

        $scope.barPercentage = 100;

        const startDate = new Date().getTime() + 1000 * $scope.gameModeTime; // add 30 seconds
        const gameInterval = $interval(()=>{
            let newDate = new Date(startDate - new Date().getTime());

            let seconds = newDate.getSeconds() + "";
            let milliseconds = newDate.getMilliseconds() + "";
            let minutes = newDate.getMinutes() + "";
            if(seconds.length == 1){
                seconds = "0" + seconds;
            }
            if(milliseconds.length == 1){
                milliseconds = "00" + milliseconds;
            } 
            else if(milliseconds.length == 2){
                milliseconds = "0" + milliseconds;
            }
            if(minutes.length == 1){
                minutes = "0" + minutes;
            }

            $scope.timeLeftString = `${minutes}:${seconds}:${milliseconds}`;
            $scope.barPercentage = (newDate.getTime()/(1000 * $scope.gameModeTime) * 100).toFixed(2);
            $scope.progressBarStyle = {
                width: $scope.barPercentage  + "%"
            }

            if($scope.barPercentage <= 20){
                $scope.progressBarStyle.backgroundColor = "rgb(255, 102, 102)";
            }

            console.log($scope.barPercentage)
            if(newDate.getTime() <= 0){
                $interval.cancel(gameInterval);
                $scope.isTimeLeft = false;
                //alert('Time is up!');
            }
        },100);
    }

    let holder = generateField();
    $scope.field = generateField();


    let time = $location.$$url.split("/tryb/")[1];

    if(time == undefined){
        console.warn("Warn: No game time provided");
    } else {
        $scope.gameModeTime = time;
        start();
    }  
});

gameController.directive('game', function() {
    return { 
        templateUrl: 'directives/game/game.html',
        restricts: 'A'
    };
});
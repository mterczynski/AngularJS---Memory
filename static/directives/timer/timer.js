let timeController = app.controller("timeController", function($scope, $location, $interval, $timeout){
    $scope.progressBarStyle;        // {width: "100%", backgroundColor:"rgb(192,192,192)" }
    $scope.timeLeftString;          // "00:30:000"  

    console.log($scope.gameModeTime);

    const startDate = new Date().getTime() + 1000 * $scope.gameModeTime;

    $scope.interval = $interval(()=>{
        let newDate = new Date(startDate - new Date().getTime());

        let seconds = ("0" + newDate.getSeconds()).slice(-2);
        let milliseconds =  ("00" + newDate.getMilliseconds()).slice(-3);
        let minutes = ("0" + newDate.getMinutes()).slice(-2);

        $scope.timeLeftString = `${minutes}:${seconds}:${milliseconds}`;
        $scope.barPercentage = (newDate.getTime()/(1000 * $scope.gameModeTime) * 100).toFixed(2);
        $scope.progressBarStyle.width = $scope.barPercentage  + "%";

        if($scope.barPercentage <= 80){
            $scope.progressBarStyle.backgroundColor = "rgb(240, 130, 130)";
        }

        if(newDate.getTime() <= 0){
            // $interval.cancel(gameInterval);
            //clearGameVariables();
            $scope.isTimeLeft = false;
            $scope.isAlertVisible = true;
            $scope.alertContent = "Czas upłynął :(";
        }
    },1);

    
});
    
timeController.directive('timer', function() {
    return { 
        templateUrl: 'directives/timer/timer.html',
        restricts: 'ACE',
        css: 'directives/timer/timer.css',
    };
});

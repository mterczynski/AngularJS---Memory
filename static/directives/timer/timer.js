gameController.directive('timer', function($rootScope, $interval) {
    return { 
        templateUrl: 'directives/timer/timer.html',
        restricts: 'EA',
        link(scope, element, attrs){
            $rootScope.start = () =>{
               // clearGameVariables();
               const startDate = new Date().getTime() + 1000 * $rootScope.gameModeTime;
               $rootScope.hasGameStarted = true;
               $rootScope.gameInterval = $interval(()=>{
                   let newDate = new Date(startDate - new Date().getTime());
       
                   let seconds = ("0" + newDate.getSeconds()).slice(-2);
                   let milliseconds =  ("00" + newDate.getMilliseconds()).slice(-3);
                   let minutes = ("0" + newDate.getMinutes()).slice(-2);
       
                   $rootScope.timeLeftString = `${minutes}:${seconds}:${milliseconds}`;
                   $rootScope.barPercentage = (newDate.getTime()/(1000 * $rootScope.gameModeTime) * 100).toFixed(2);
                   $rootScope.progressBarStyle.width = $rootScope.barPercentage  + "%";
       
                   if($rootScope.barPercentage <= 80){
                       $rootScope.progressBarStyle.backgroundColor = "rgb(240, 130, 130)";
                   }
       
                   //  console.log(newDate.getTime() <= 15000);
                   if(newDate.getTime() <= 0){
                       // $interval.cancel(gameInterval);
                       $rootScope.clearGameVariables();
                       $rootScope.isTimeLeft = false;
                       $rootScope.isAlertVisible = true;
                       $rootScope.alertContent = "Czas upłynął :(";
                   }
               },1);
           }
       },
        css: 'directives/timer/timer.css'
    };
});
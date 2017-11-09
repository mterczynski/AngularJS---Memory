let gameController = app.controller("gameController", function($scope, $location, $interval, $timeout){

    $scope.alertContent;            // string
    $scope.areUserActionsBlocked;   // :boolean
    $scope.barPercentage;           // from 0 to 100
    $scope.field;                   // array 4x4 of image IDs
    $scope.firstSelection;          // {posX, posY, image, imageId} || null
    $scope.gameModeTime;            // 30 or 60 or 90
    $scope.gameInterval;            // interval for timer
    $scope.hasGameStarted;          // :boolean
    $scope.isAlertVisible;          // :boolean
    $scope.isTimeLeft;              // true or false
    $scope.lockedImagesPositions;   // array of {posX, posY}
    $scope.progressBarStyle;        // {width: "100%", backgroundColor:"rgb(192,192,192)" }
    $scope.timeLeftString;          // "00:30:000"  
    
    $scope.backToMenu = ()=>{
        $interval.cancel($scope.gameInterval);
        $location.path("/");
    }

    $scope.hideAlert = () =>{
        $scope.isAlertVisible = false;
    }
    $scope.onImageClicked = (posX, posY, imageId, event)=>{
        console.log("posX: " + posX);
        console.log("posY: " + posY);
        console.log("imageId: " + imageId);
        console.log(event.target);

        // start game if not started:
        if(!$scope.hasGameStarted){
            start();            
        }
        if($scope.areUserActionsBlocked){
            return;
        }
        // check if user clicked on non-revealed image:
        let isClickedImageRevealed = false;
        $scope.lockedImagesPositions.forEach((lockedPosition)=>{
            if(lockedPosition.posX == posX && lockedPosition.posY == posY){
                isClickedImageRevealed = true;
                return;
            }
        });
        if(isClickedImageRevealed){
            return;
        } // <<< end of check

        if($scope.firstSelection){ 
            // console.log("user clicked for the second time");
            if(!($scope.firstSelection.posX == posX && $scope.firstSelection.posY == posY)){
                // console.log("user clicked on different image than first selection");
                event.target.src = `img/${imageId}.jpg`;
                // console.log(event.target);
                if($scope.firstSelection.imageId == imageId){        
                    // console.log("image IDs are the same");
                    $scope.lockedImagesPositions.push({posX, posY});
                    $scope.lockedImagesPositions.push({posX: $scope.firstSelection.posX, posY: $scope.firstSelection.posY});
                    $scope.firstSelection = null;
                    if($scope.lockedImagesPositions.length == 16){ // user won
                        const userTime = $scope.timeLeftString;
                        clearGameVariables();
                        $scope.isAlertVisible = true;
                        $scope.alertContent = `Wygrałeś! Pozostały czas to: ${userTime}.`;
                    }
                } else {
                    // block user actions for 500ms, then unreveal both images
                    $scope.areUserActionsBlocked = true;
                    $timeout(()=>{
                        try{
                            $scope.areUserActionsBlocked = false;
                            event.target.src = `img/0.jpg`;
                            $scope.firstSelection.image.src = `img/0.jpg`;
                            $scope.firstSelection = null;
                        } catch(error) {}
                    }, 500);
                }
            } else {
                console.log("user clicked on the same image");
            }
        } else {
            $scope.firstSelection = {
                posX,
                posY,
                imageId,
                image: event.target
            }
            event.target.src = `img/${imageId}.jpg`;
        }   
    }

    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
    }
    function generateField(){
        let unusedValues = [];
        for(let i=1; i<=8; i++){
            unusedValues.push(i);
            unusedValues.push(i);
        }
        shuffle(unusedValues);

        let field = [];
        for(let i=0; i<4; i++){
            let row = [];
            for(let j=0; j<4; j++){
                row.push(unusedValues[i*4 + j]);
            }
            field.push(row);
        }
        return field;
    }
    function clearGameVariables(){
        $interval.cancel($scope.gameInterval);

        $scope.alertContent = "";
        $scope.areUserActionsBlocked = false;
        $scope.barPercentage = 100;
        $scope.field = generateField();
        $scope.firstSelection = null;
        $scope.gameModeTime = $location.$$url.split("/tryb/")[1];
        $scope.gameInterval = null;
        $scope.hasGameStarted = false;
        $scope.isAlertVisible = false;
        $scope.isTimeLeft = true;
        $scope.lockedImagesPositions = []; 
        $scope.progressBarStyle = {
            width: $scope.barPercentage  + "%",
            backgroundColor: "rgb(192,192,192)"
        }
        $scope.timeLeftString = `00:${$scope.gameModeTime}:000`;
    }
    function start(){
        // clearGameVariables();
        const startDate = new Date().getTime() + 1000 * $scope.gameModeTime;
        $scope.hasGameStarted = true;
        $scope.gameInterval = $interval(()=>{
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

            //  console.log(newDate.getTime() <= 15000);
            if(newDate.getTime() <= 0){
                // $interval.cancel(gameInterval);
                clearGameVariables();
                $scope.isTimeLeft = false;
                $scope.isAlertVisible = true;
                $scope.alertContent = "Czas upłynął :(";
            }
        },1);
    }

    clearGameVariables();

    if(!$scope.gameModeTime){
        console.warn("Warn: No game time provided");
    }
});

gameController.directive('game', function() {
    return { 
        templateUrl: 'directives/game/game.html',
        restricts: 'EA',
        css: 'directives/game/game.css'
    };
});
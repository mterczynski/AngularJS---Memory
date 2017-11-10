let gameController = app.controller("gameController", function($scope, $location, $interval, $timeout, $rootScope){

    $scope.alertContent;            // string
    $scope.areUserActionsBlocked;   // :boolean
    $rootScope.barPercentage;           // from 0 to 100
    $scope.field;                   // array 4x4 of image IDs
    $scope.firstSelection;          // {posX, posY, image, imageId} || null
    $rootScope.gameModeTime;            // 30 or 60 or 90
    $rootScope.gameInterval;            // interval for timer
    $rootScope.hasGameStarted;          // :boolean
    $scope.isAlertVisible;          // :boolean
    $rootScope.isTimeLeft;              // true or false
    $scope.lockedImagesPositions;   // array of {posX, posY}
    $rootScope.progressBarStyle;        // {width: "100%", backgroundColor:"rgb(192,192,192)" }
    $rootScope.timeLeftString;          // "00:30:000"  
    
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
        if(!$rootScope.hasGameStarted){
            $rootScope.start();            
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
                        $rootScope.clearGameVariables();
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
    $rootScope.clearGameVariables = ()=>{
        $interval.cancel($rootScope.gameInterval);

        $scope.alertContent = "";
        $scope.areUserActionsBlocked = false;
        $rootScope.barPercentage = 100;
        $scope.field = generateField();
        $scope.firstSelection = null;
        $rootScope.gameModeTime = $location.$$url.split("/tryb/")[1];
        $rootScope.gameInterval = null;
        $rootScope.hasGameStarted = false;
        $scope.isAlertVisible = false;
        $rootScope.isTimeLeft = true;
        $scope.lockedImagesPositions = []; 
        $rootScope.progressBarStyle = {
            width: $rootScope.barPercentage  + "%",
            backgroundColor: "rgb(192,192,192)"
        }
        $rootScope.timeLeftString = `00:${$rootScope.gameModeTime}:000`;
    }

    $rootScope.clearGameVariables();

    if(!$rootScope.gameModeTime){
        console.warn("Warn: No game time provided");
    }
});

gameController.directive('game', function($rootScope, $interval) {
    return { 
        templateUrl: 'directives/game/game.html',
        restricts: 'EA',
        css: 'directives/game/game.css'
    };
});
//
// The Game
//

if (Modernizr.canvas) {

    //
    // Settings
    //

    // Cards
    var cardAmount = 10; // Needs to be even
    var cardSVG = "M370.8,46.2c-66.3,0-120.1,53.8-120.1,120.1\nc0-66.3-53.8-120.1-120.1-120.1S10.6,100,10.6,166.3c0,204.3,240.2,288,240.2,288s240.2-97.5,240.2-288\nC490.9,100,437.2,46.2,370.8,46.2z";
    var cardScale = 0.15;
    var cardStrokeColor = 'black';
    var cardStrokeWidth = 2;
    var cardBackColor = 'pink';

    var cardTimeout = 500;

    // General
    var pageMargin = 10; 
    var hitOptions = {
        stroke: true,
        fill: true,
        tolerance: 5
    };

    // Global
    var card = [];
    var save = [];
    var result = [];
    var counter = 0;


    //
    // Let's play!
    //

    createCards();
    
    // On Click
    function onMouseDown(event) {
        segment = path = null;
        var hitResult = project.hitTest(event.point, hitOptions);

        if (hitResult) {
            var selected = hitResult.item;
            var selectedID = selected.id;
            selected.fillColor = save[selectedID].color;
            card[selectedID].scale(1.5);

            // If there is no item clicked yet
            if (result[0] == null) {
                addToJsonWithSave(result, 0, selectedID);
            } else {
                addToJsonWithSave(result, 1, selectedID);

                // If the user clicked on the same card twice
                if (result[0].saveid === result[1].saveid) {
                    pressedTwice(result[0].saveid);
                    result = []; 
                // If the results have the same color
                } else if (save[result[0].saveid].color === save[result[1].saveid].color) {
                    setTimeout( function() {
                        card[result[0].saveid].remove();
                        card[result[1].saveid].remove();
                        counter += 2;
                        if (counter === cardAmount) {
                            showCredits();
                        } 
                        result = [];
                    }, cardTimeout * 0.75);
                // If the results have different colors
                } else {
                    setTimeout( function(){
                        resetCard(result[0].saveid); 
                        resetCard(result[1].saveid);
                        result = [];
                    }, cardTimeout);
                }
            }

            
        }
    }
    

    //
    // Animation
    //
    function onFrame(event) {

    }

    // Hover State
    function onMouseMove(event) {
        var hitResult = project.hitTest(event.point, hitOptions);
        project.activeLayer.strokeColor = 'black';
        if (hitResult && hitResult.item)
            hitResult.item.strokeColor = '#5c5c5c';
    }

    //
    // Functions
    //

    // Create cardAmount of cards using the cardSVG, fill every two of them with a random color and save the colors in a JSON Object
    function createCards() {

        for (var i = 0; i < cardAmount; i++) {
            var randomC = randomColor(); //randomColor.js Library

            card[i] = new Path(cardSVG);
            card[i].scale(cardScale);
            card[i].fillColor = cardBackColor;
            card[i]._id = i;
            if (i % 2 === 1) {
                addToJSON(save, i - 1, randomC);
                addToJSON(save, i, randomC);
            }
            card[i].strokeColor = cardStrokeColor;
            card[i].strokeWidth = cardStrokeWidth;
            card[i].position = new Point(window.innerWidth/2 + getRandomInt((-(window.innerWidth/2)) + (pageMargin + card[i].bounds.width), (window.innerWidth/2) - (pageMargin + card[i].bounds.width)), window.innerHeight/2 + getRandomInt((-(window.innerHeight/2)) + (pageMargin + card[i].bounds.height), (window.innerHeight/2) - (pageMargin + card[i].bounds.height)));
        }
    }

    // Resets a card
    function resetCard(id) {
        card[id].fillColor = cardBackColor;
        card[id].scale(0.6666666666666666);
    }

    // Reset a card correctly if the same card is pressed twice
    function pressedTwice(id) {
        card[id].fillColor = cardBackColor;
        card[id].scale(0.44444444444444444);
    }

    // Get a random int between min and max
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // Add id and color to JSON Object
    function addToJSON(obj, id, color) {
        item = {};
        item.id = id;
        item["color"] = color;

        obj.push(item);
    }

    // Same as above function, but with an number instead of a color
    function addToJsonWithSave(obj, id, saveid) {
        item = {};
        item.id = id;
        item["saveid"] = saveid;

        obj.push(item);
    }

    // Show the credits
    function showCredits() {
        $('.credits').transit({
        'opacity': 1
        }, 0, function() {
        $('.credits').css({
          'display': 'table'
        });
        });
    }

} else {
    document.getElementsByClassName('notice').style.display = "block";
}
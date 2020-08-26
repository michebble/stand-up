var stage = new createjs.Stage("canvas");
createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.on("tick", tick);

var container = new createjs.Container();
var	wheel = new createjs.Shape();

var people = ['A','Ja','E','Ra','H','Jos','V','Ju','L','Rh','T','Jon'];
var colors = ['#F00','#FF7F00','#FF0','#7FFF00','#0F0','#00FF7F','#0FF','#007FFF','#00F','#7F00FF','#F0F','#FF007F'];

var segments = people.length;
var	diameter = 250;
var	angle = Math.PI * 2 / segments;

// Draw a wheel
for (var index = 0, limit = segments; index < limit; index ++) {
  wheel.graphics.beginFill(colors[index])
    .moveTo(0, 0)
    .lineTo(Math.cos(angle * index) * diameter, Math.sin(angle * index ) * diameter)
		.arc(0, 0, diameter, index * angle, index * angle + angle)
    .lineTo(0, 0);

  // Add text child
  var person = new createjs.Text(people[index], (diameter / 8)+"px Arial Black", "#000")
		.set({
      textAlign: "center",
      regY: diameter - 10,
      rotation: angle * 180/Math.PI * (index+0.5),
    });
  container.addChild(person);
}

container.addChildAt(wheel, 0);
container.x = container.y = diameter + 20;
container.cache(-diameter, -diameter, diameter*2, diameter*2);

container.rotation = -360/segments/2; // Rotate by 1/2 segment to align at 0

// Red Notch
var notch = new createjs.Shape();
notch.x = container.x;
notch.y = container.y - diameter;
notch.graphics.beginFill("red").drawPolyStar(0, 0, 12, 3, 2, 90);

// Where the wheel should land
// var nextPerson = new createjs.Text("Stand-up Picker", "50px Arial", "#000")
// 	.set({
//     x: container.x,
//     y: container.y + diameter+10,
//     textAlign: "center"
//   });

stage.addChild(container, notch); // and , nextPerson

// Mode. 0=stopped, 1=moving, 2=stopping
container.mode = 0;

// When clicked, cycle mode.
container.on("click", function(e) {
	if (container.mode == 0) {
    container.mode = 1;
  } else if (container.mode == 1) {
    container.mode = 2;

    // Slow down. Find the end angle, and tween to it
    var num = Math.random() * segments | 0; // Choose a number,
    var	angleR = angle * 180/Math.PI; // Angle in degrees
    var adjusted = (container.rotation - 360);	// Add to the current rotation
    var numRotations = Math.ceil(adjusted / 360)*360 - num*angleR - angleR/2; // Find the final number.

    // nextPerson.text = people[num]; // Show the end number

    createjs.Tween.get(container)
      .to({ rotation: numRotations }, 3000, createjs.Ease.cubicOut)
      .call(function() { container.mode = 0; });
  }
});


function tick(event) {
	if (container.mode == 1) {
    container.rotation -= 10; // Rotate if mode 1
  }
	stage.update(event);
}

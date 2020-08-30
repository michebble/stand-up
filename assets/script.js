const stage = new createjs.Stage("canvas");
createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.on("tick", tick);

const people = ['A','Ja','E','Ra','H','Jos','V','Ju','L','Rh','T','Jon'];
const	diameter = 250;
const STOPPED = 'STOPPED';
const MOVING = 'MOVING';
const STOPPING = 'STOPPING';

const generateHexString = function (string) {
  const foo = parseInt(people[index], 34);
  const bar = Math.abs(Math.sin(foo));
  return `#${Math.floor(bar * 16777215).toString(16)}`
}

// drawWheel(people, diameter)
const wheel = new createjs.Container();
const	wheelShape = new createjs.Shape();
const segments = people.length;
const	angle = Math.PI * 2 / segments;

for (var index = 0, limit = segments; index < limit; index ++) {
  wheelShape.graphics.beginFill(generateHexString(people[index]))
    .moveTo(0, 0)
    .lineTo(Math.cos(angle * index) * diameter, Math.sin(angle * index ) * diameter)
		.arc(0, 0, diameter, index * angle, index * angle + angle)
    .lineTo(0, 0);

  // Add text child
  const person = new createjs.Text(people[index], (diameter / 8)+"px Arial Black", "#000")
		.set({
      textAlign: "center",
      regY: diameter - 10,
      rotation: angle * 180/Math.PI * (index+0.5),
    });
  wheel.addChild(person);
}

wheel.addChildAt(wheelShape, 0);
wheel.x = wheel.y = diameter + 20;
wheel.cache(-diameter, -diameter, diameter*2, diameter*2);

wheel.rotation = -360/segments/2; // Rotate by 1/2 segment to align at 0
// return wheel

// drawNotch(notchX(wheel.x), notchY(wheel.y - diameter))
const notch = new createjs.Shape();
notch.x = wheel.x;
notch.y = wheel.y - diameter;
notch.graphics.beginFill("linen").drawPolyStar(0, 0, 12, 3, 2, 90);
//return notch

// Where the wheel should land
// var nextPerson = new createjs.Text("Stand-up Picker", "50px Arial", "#000")
// 	.set({
//     x: wheel.x,
//     y: wheel.y + diameter+10,
//     textAlign: "center"
//   });

stage.addChild(wheel, notch); // and , nextPerson

wheel.mode = STOPPED;

// When clicked, cycle mode.
wheel.on("click", function() {
	if (wheel.mode == STOPPED) {
    wheel.mode = MOVING;
  } else if (wheel.mode == MOVING) {
    wheel.mode = STOPPING;

    // Slow down. Find the end angle, and tween to it
    const num = Math.random() * segments | 0; // Choose a number,
    const	angleR = angle * 180/Math.PI; // Angle in degrees
    const adjusted = (wheel.rotation - 360);	// Add to the current rotation
    const numRotations = Math.ceil(adjusted / 360)*360 - num*angleR - angleR/2; // Find the final number.

    // nextPerson.text = people[num]; // Show the end number

    createjs.Tween.get(wheel)
      .to({ rotation: numRotations }, 3000, createjs.Ease.cubicOut)
      .call(function() { wheel.mode = STOPPED; });
  }
});

function tick(event) {
	if (wheel.mode == MOVING) {
    wheel.rotation -= 10;
    wheel.rotation %= 360;
  }
	stage.update(event);
}

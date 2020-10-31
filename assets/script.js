const chooseColors = function (index) {
  const colors = ['#005DFF', '#A200FF', '#FFA200', '#5DFF00'];
  const colorIndex = index % colors.length;
  return colors[colorIndex];
}

function findOffset(angle, sectors) {
  const remainder = sectors%4;
  let offset;
  switch(remainder) {
    case 1:
      offset = angle/1.3333;
      break;
    case 2:
      offset = angle/remainder;
      break;
    case 3:
      offset = angle/4;
      break;
    default:
      offset = remainder;
  }
  return offset;
}

function startGame(people) {
  const stage = new createjs.Stage("canvas");
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.on("tick", tick);

  const	diameter = 250;
  const STOPPED = 'STOPPED';
  const MOVING = 'MOVING';
  const STOPPING = 'STOPPING';

  // drawWheel(people, diameter)
  const wheel = new createjs.Container();
  const	wheelShape = new createjs.Shape();
  const sectors = people.length;
  const	angle = Math.PI * 2 / sectors;
  for (var index = 0, limit = sectors; index < limit; index ++) {
    const color = chooseColors(index);
    const offset = findOffset(angle, sectors);

    wheelShape.graphics.beginFill(color)
      .moveTo(0, 0)
      .arc(0, 0, diameter, (index * angle + offset), (index * angle + angle + offset))
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

  wheel.rotation = -360/sectors/2; // Rotate by 1/2 sector to align at 0
  // return wheel

  // drawNotch(notchX(wheel.x), notchY(wheel.y - diameter))
  const notch = new createjs.Shape();
  notch.x = wheel.x;
  notch.y = wheel.y - diameter;
  notch.graphics.beginFill("linen").drawPolyStar(0, 0, 12, 3, 2, 90);
  //return notch

  stage.addChild(wheel, notch); // and , nextPerson

  wheel.mode = STOPPED;

  // When clicked, cycle mode.
  wheel.on("click", function() {
    if (wheel.mode == STOPPED) {
      wheel.mode = MOVING;
    } else if (wheel.mode == MOVING) {
      wheel.mode = STOPPING;

      // Slow down. Find the end angle, and tween to it
      const num = Math.random() * sectors | 0; // Choose a number,
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
}

function tryGetNamesFromParams() {
  const params = window.location.search;
  if (!params) { return; }
  const urlParams = new URLSearchParams(params);
  let names = urlParams.getAll("ns[]")
  if (names.length === 0) { return; }
  const namesInput = document.getElementById("namesInput");
  namesInput.value = names.join(' ')
}

function hideSetup() {
  document.getElementById("namesInput").style.visibility = "hidden";
  document.getElementById("startButton").style.visibility = "hidden";
}

function setUpGame() {
  const namesInput = document.getElementById("namesInput");
  const people = namesInput.value.split(' ');
  hideSetup();
  startGame(people);
}

tryGetNamesFromParams();

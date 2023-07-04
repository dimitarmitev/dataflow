// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    World = Matter.World,
    Composites = Matter.Composites,
    Events = Matter.Events,
    Composite = Matter.Composite;


///////////////////////////////////////////////// Describe Key Constants
// The key constants below allow for easier "tweaking"
// Where possible, consants are set relative to more fundamental constants
// Set key defaults for the applet
// Key dimensions
const width = 1920;
const height = 1080;

const xStart = width / 2;
const yStart = 100;

const rows = 18;

const ballRadius = 20;
const pegGap = 4 * ballRadius;
const pegRadius = 0.2 * ballRadius;
let xGap = pegGap;
// Isometric
//let yGap = Math.sin(Math.PI / 3) * xGap;
// Quincunx
let yGap = 0.5 * xGap;

const maxBalls = 150;

// Physics Constants
const restitution = 0.6;
const friction = 0.05;
const frictionAir = 0.06;
const frictionStatic = 0;
const slop = 0;
const gravity = 1;
const gravitySF = 0.0018;
const timeScale = 1;

///////////////////////////////////////////////// Setup MatterJS
// 1. setup engine
let engine = Engine.create();
engine.timing.timeScale = timeScale;
Engine.run(engine);

// 2. setup render
let render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width,
        height,
        wireframes: false,
        showAngleIndicator: false,
        background: 'transparent'
    }
});
Render.run(render);

// 3. get world from engine
let world = engine.world;
world.gravity.scale = gravitySF;

///////////////////////////////////////////////// Top (above start point): Bucket
// Create bucket
const buckettoStartGap = 20;
const bucketwallLength = 600;
const bucketwallAngle = Math.PI / 3;
const bucketOpening = 5 * ballRadius;
let leftBumper_xpos = xStart - (bucketwallLength * Math.cos(bucketwallAngle) + bucketOpening) / 2;
let bumpers_ypos = yStart - ((bucketwallLength * Math.sin(bucketwallAngle)) / 2 + buckettoStartGap);
let rightBumper_xpos = xStart + (bucketwallLength * Math.cos(bucketwallAngle) + bucketOpening) / 2;
let bumperFloor;

let createTopBucket = () => {
    //let leftBumper = Bodies.rectangle(leftBumper_xpos, bumpers_ypos, bucketwallLength, 5, {
    //    restitution,
    //    friction: 0,
    //    frictionStatic: 0,
    //    isStatic: true
    //});
    //Body.rotate(leftBumper, bucketwallAngle);

    //let rightBumper = Bodies.rectangle(rightBumper_xpos, bumpers_ypos, bucketwallLength, 5, {
    //    restitution,
    //    friction: 0,
    //    isStatic: true
    //});
    //Body.rotate(rightBumper, -bucketwallAngle);

    bumperFloor = Bodies.rectangle(418, 930, 570, 20, {
        restitution,
        friction: 0,
        isStatic: true,
        render: {
            fillStyle: 'transparent'
        }
    });
    World.add(world, [/*leftBumper, rightBumper,*/ bumperFloor]);
};
createTopBucket();


///////////////////////////////////////////////// Base: Floor and Partitions
const pegstoBaseGap = yGap;
const floorHeight = 10;
//height - floorHeight / 2
let rightWall = Bodies.rectangle(1780, 700, floorHeight, 200, {
    restitution: 0,
    isStatic: true,
    render: {
        fillStyle: 'transparent'
    }
});
let leftWall = Bodies.rectangle(1040, 700, floorHeight, 200, {
    restitution: 0,
    isStatic: true,
    render: {
        fillStyle: 'transparent'
    }
});
let floor = Bodies.rectangle(1410, 808, 740, floorHeight, {
    restitution: 0,
    isStatic: true,
    render: {
        fillStyle: 'transparent'
    }
});
World.add(world, [leftWall, floor, rightWall]);

///////////////////////////////////////////////// Balls...
// Generate randomness
let randomPosNeg = () => {
    let random = Math.sin(2 * Math.PI * Math.random());
    // Add some skey for better bell curve
    return Math.pow(random, 3);
};
let vx = () => {
    return 0.3 * randomPosNeg();
};
// let vx = 1

// Define Balls
let addBall = (x, y, color) => {
    let ball = Bodies.circle(x, y, ballRadius, {
        restitution,
        friction,
        frictionAir,
        slop,
        render: {
            fillStyle: color,
            strokeStyle: "#ffffff",
            lineWidth: 2
        },
        isStatic: false,
        label: "ball"
    });
    Body.setVelocity(ball, { x: vx(), y: 0 });
    Body.setAngularVelocity(ball, randomPosNeg() / 8);
    World.add(world, ball);
};

// Define Square
let addSquare = (x, y, color) => {
    let square = Bodies.rectangle(x, y, 40, 40, {
        restitution,
        friction,
        frictionAir,
        slop,
        render: {
            fillStyle: color,
            strokeStyle: "#ffffff",
            lineWidth: 2 },
        isStatic: false,
        label: "square"
    });
    Body.setVelocity(square, { x: vx(), y: 0 });
    Body.setAngularVelocity(square, randomPosNeg() / 8);
    World.add(world, square);
};

///////////////////////////////////////////////// Time controlled functions

// const Interval = setInterval(() => {
//   addBall(xStart, yStart);
//   // as a precaution remove plinkos from world.bodies if the array surpasses a certain threshold
//   const existingBalls = world.bodies.filter(body => body.label === "ball");
//   if (existingBalls.length > 200) {
//     World.remove(world, existingBalls[0]);
//   }
// }, 1200);

let existingBalls = () => {
    return world.bodies.filter((body) => body.label === "ball");
};

// Balls suffer compression.
// As a temporary workaround make balls in buckets static
// This will also have benefit of reducing engine load
const makeStaticInterval = setInterval(() => {
    // let existingBalls = world.bodies.filter((body) => body.label === "ball");
    existingBalls().forEach(function (ball) {
        let ballHeight = ball.position.y;
        let ballSpeed = ball.speed;
        let minHeight = height - (floorHeight + wallHeight);
        if (ballHeight > minHeight && ballSpeed < 1) {
            Body.set(ball, { isStatic: true });
        }
    });
}, 1200);

// Temporary Mopup as above
const makeStaticMopUp = setTimeout(() => {
    existingBalls().forEach(function (ball) {
        let ballHeight = ball.position.y;
        let ballSpeed = ball.speed;
        let minHeight = height - (floorHeight + wallHeight);
        if (ballHeight > minHeight && ballSpeed < 1) {
            Body.set(ball, { isStatic: true });
        }
    });
}, 20000);

// Recyclcle Balls
const recycleBallsInterval = setInterval(() => {
    if (existingBalls().length > 200) {
        World.remove(world, existingBalls[0]);
    }
}, 1200);

///////////////////////////////////////////////// Mouse Control
var mouse = Mouse.create(render.canvas);
var mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    render: { visible: false }
});
World.add(world, mouseConstraint);
// keep the mouse in sync with rendering
render.mouse = mouse;

Events.on(mouseConstraint, "mousedown", (event) => {
    addBall(mouse.position.x, mouse.position.y);
});



var connection = new signalR.HubConnectionBuilder().withUrl("/dataflowHub").build();

connection.on("ReceiveShape", function (shape) {
    if (shape.type === 'body') {
        addBall(1400, 190, shape.color);
    } else if (shape.type === 'rectangle') {
        addSquare(1400, 190, shape.color);
    }
});

connection.start().then(function () {

}).catch(function (err) {
    return console.error(err.toString());
});

Events.on(engine, 'collisionEnd', _ => {
    _.pairs.forEach(_ => {
        var e = document.getElementById("pipes");
        var selectedPipe = e.value;
        if (_.bodyA === bumperFloor) {
            connection.invoke(selectedPipe,
                {
                    type: _.bodyB.type,
                    color: _.bodyB.render.fillStyle
                }
                ).catch(function (err) {
                return console.error(err.toString());
            });
            World.remove(engine.world, _.bodyB);
        }
        if (_.bodyB === bumperFloor) {
            connection.invoke(selectedPipe,
                {
                    type: _.bodyA.type,
                    color: _.bodyA.render.fillStyle
                }).catch(function (err) {
                return console.error(err.toString());
            });
            World.remove(engine.world, _.bodyA);
        }
    });
});

const loadImage = (url) => {
    const img = new Image();
    img.onload = () => {
        if (spr != null) {
            World.remove(world, [spr]);
        }
        spr = Bodies.rectangle(img.naturalWidth / 2 + 20, img.naturalHeight / 2 + 20, img.naturalWidth, img.naturalHeight, {
            restitution,
            friction: 0,
            isStatic: true,
            render: {
                sprite: {
                    texture: url
                }
            },
            collisionFilter: {
                'group': -1,
                'category': 2,
                'mask': 0,
            }
        });
        World.add(world, [spr]);
    };
    img.src = url;
};

var spr = null;

document.addEventListener("keypress", function (event) {
    switch (event.key) {
        case "1": {
            document.getElementById("pipes").value = 'BasePipe';
            loadImage("./BasePipe.png");
            break;
        }
        case "2": {
            document.getElementById("pipes").value = 'StraightPipe';
            loadImage("./StraightPipe.png");
            break;
        }
        case "3": {
            document.getElementById("pipes").value = 'StraightPipeParallel';
            loadImage("./StraightPipeParallel.png");
            break;
        }
        case "4": {
            document.getElementById("pipes").value = 'TransformPipe';
            loadImage("./TransformPipe.png");
            break;
        }
        case "5": {
            document.getElementById("pipes").value = 'BatchPipe';
            loadImage("./BatchPipe.png");
            break;
        }
        case "6": {
            document.getElementById("pipes").value = 'BatchPipeWithTrigger';
            loadImage("./BatchPipeWithTrigger.png");
            break;
        }
        case " ": {
            connection.invoke('TriggerBatch').catch(function (err) {
                return console.error(err.toString());
            });
            const url = './plunger.png'
            const img = new Image();
            img.onload = () => {
                const plunger = Bodies.rectangle(img.naturalWidth / 2 + 400, img.naturalHeight / 2 + 916, img.naturalWidth, img.naturalHeight, {
                    restitution,
                    friction: 0,
                    isStatic: true,
                    render: {
                        sprite: {
                            texture: url
                        }
                    },
                    collisionFilter: {
                        'group': -1,
                        'category': 2,
                        'mask': 0,
                    }
                });
                setTimeout(() => {
                    World.remove(world, [plunger]);
                }, 750);
                World.add(world, [plunger]);
        };
        img.src = url;
            break;
        }
    }
});

var pipes = [
    "None",
    "BasePipe",
    "StraightPipe",
    "StraightPipeParallel",
    "TransformPipe",
    "BatchPipe",
    "BatchPipeWithTrigger"
];


const setNextPipe = (nextPipe) => {
    document.getElementById("pipes").value = nextPipe;
    if (nextPipe !== 'None') {
        loadImage("./" + nextPipe + ".png");
    } else {
        if (spr != null) {
            World.remove(world, [spr]);
            spr = null;
        }
    }
}


document.addEventListener("keydown", function (event) {
    const currentPipe = document.getElementById("pipes").value;
    var pipeIndex = pipes.findIndex((v) => v === currentPipe);
    var nextPipeIndex = -2;
    switch (event.key) {
        case "ArrowLeft": {
            nextPipeIndex = (pipeIndex - 1) % pipes.length;
            break;
        }
        case "ArrowRight": {
            nextPipeIndex = (pipeIndex + 1) % pipes.length;
            break;
        }
    }
    if (nextPipeIndex != -2) {
        if (nextPipeIndex === -1) {
            setNextPipe(pipes[pipes.length - 1]);
        } else {
            setNextPipe(pipes[nextPipeIndex]);
        }
    }
});

document.addEventListener("load", function () {

    var touchsurface = document.getElementById('touchsurface'),
        startX,
        startY,
        dist,
        threshold = 150, //required min distance traveled to be considered swipe
        allowedTime = 200, // maximum time allowed to travel that distance
        elapsedTime,
        startTime

    function handleswipe(isrightswipe) {
        if (isrightswipe)
            touchsurface.innerHTML = 'Congrats, you\'ve made a <span style="color:red">right swipe!</span>'
        else {
            touchsurface.innerHTML = 'Condition for right swipe not met yet'
        }
    }

    touchsurface.addEventListener('touchstart', function (e) {
        touchsurface.innerHTML = ''
        var touchobj = e.changedTouches[0]
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
    }, false)

    touchsurface.addEventListener('touchmove', function (e) {
        e.preventDefault() // prevent scrolling when inside DIV
    }, false)

    touchsurface.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0]
        dist = touchobj.pageX - startX // get total dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
        var swiperightBol = (elapsedTime <= allowedTime && dist >= threshold && Math.abs(touchobj.pageY - startY) <= 100)
        handleswipe(swiperightBol)
        e.preventDefault()
    }, false)

})
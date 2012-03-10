var DEMO = {

    world        : null,
    bodies       : [],
    DOMbodies    : [],
    up           : false,
    timeStep     : 1.0/60,
    iterations   : 1,
    refreshSpeed : 10,
    mouseX       : 0,
    moyseY       : 0,
    canvas       : 0,
    ball         : null,
    keys         : {up : false, down: false, left: false, right: false},
    canvasX      : 0,
    canvasY      : 0,
    ballWeight   : 0.5,
    power        : 2.5,
    moving       : false,

    start : function() {

        var that = this;

        this.canvas = jQuery('canvas')[0].getContext('2d');

        var canvasPos = jQuery('canvas').position();
        this.canvasX = canvasPos.left;
        this.canvasY = canvasPos.top;

        jQuery(document).click(function(){
            var x1 = that.mouseX - that.canvasX - that.ball.m_position0.x;
            var y1 = that.mouseY - that.canvasY - that.ball.m_position0.y;

            var vel = that.ball.GetLinearVelocity();
            vel.x = x1;
            vel.y = y1;
            that.ball.SetLinearVelocity(vel);

        });

        this.initWorld();
        this.initScene();
        this.refreshWorld(); //loops

    },

    refreshWorld : function () {

        this.handleKeys();
        this.world.Step(this.timeStep, this.iterations);
        this.canvas.clearRect(0,0,500,500);

        // Stroked triangle
        this.canvas.beginPath();

        this.canvas.moveTo(this.ball.m_position0.x,this.ball.m_position0.y);
        this.canvas.lineTo(this.mouseX - this.canvasX, this.mouseY - this.canvasY);

        this.canvas.closePath();
        this.canvas.stroke();

        drawWorld(this.world, this.canvas);
        setTimeout('DEMO.refreshWorld()', this.refreshSpeed);

    },

    handleKeys : function () {

        var keys = this.keys;

        var vel = DEMO.ball.GetLinearVelocity();

        if(keys['up']) {
            vel.y -= this.power;
        }

        if(keys['down']) {
            vel.y += this.power;
        }

        if(keys['left']) {
            vel.x -= this.power;
        }

        if(keys['right']) {
            vel.x += this.power;
        }

        if(this.moving) {

            console.log('x: ' + vel.x  + ' y: ' + vel.y);

            if(vel.x > 0) { // moving right
                if(vel.x > this.ballWeight) {
                    vel.x -= this.ballWeight;
                } else {
                    //vel.x = 0;
                }
            } else if ( vel.x < 0) { // moving left
                if(vel.x < this.ballWeight) {
                    vel.x += this.ballWeight;
                } else {
                    //vel.x = 0;
                }
            }
            
            if(vel.y > 0) { // moving right
                if(vel.y > this.ballWeight) {
                    vel.y -= this.ballWeight;
                } else {
                   // vel.y = 0;
                }
            } else if ( vel.y < 0) { // moving up
                if(vel.y < this.ballWeight) {
                    vel.y += this.ballWeight;
                } else {
                    //vel.y = 0;
                }
            }
            
        }

        if(vel.x == 0 && vel.y == 0) {
            this.moving = false;
        } else {
            this.moving = true;
        }

        this.ball.SetLinearVelocity(vel);
    },

    initScene : function() {

        var that = this;

        jQuery('div').each(function() {

            var pos = jQuery(this).position();

            var prop = new Object();
            prop.top    = pos.top;
            prop.left   = pos.left;
            prop.width  = jQuery(this).width();
            prop.height = jQuery(this).height();

            var type = jQuery(this).hasClass('st');

            that.bodies.push( createBox(
                that.world,
                pos.left,
                pos.top,
                prop.width / 2,
                prop.height / 2,
                type
            ));



            that.DOMbodies.push(this);

        });

        this.createPoly(this.world, 370, 0, [[0, 0], [30, 0], [30, 400], [0, 400]], true);
        this.createPoly(this.world, 0, 0, [[0, 0], [30, 0], [30, 400], [0, 400]], true);
        this.createPoly(this.world, 0, 0, [[0, 0], [400, 0], [400, 30], [0, 30]], true);
        this.createPoly(this.world, 0, 370, [[0, 0], [400, 0], [400, 30], [0, 30]], true);

        var ballSd = new b2CircleDef();
        ballSd.density = 1.0;
        ballSd.radius = 15;
        ballSd.restitution = 0.5;
        ballSd.friction = 0;
        var ballBd = new b2BodyDef();
        ballBd.AddShape(ballSd);
        ballBd.position.Set(50,50);
        ballBd.allowSleep = false;
        this.ball = this.world.CreateBody(ballBd);

    },

    initWorld : function() {

        var worldAABB = new b2AABB();
        worldAABB.minVertex.Set(-10000, -10000);
        worldAABB.maxVertex.Set(10000, 10000);
        var gravity = new b2Vec2(0, 0);
        var doSleep = true;
        this.world = new b2World(worldAABB, gravity, doSleep);

    },

    createPoly : function(world, x, y, points, fixed) {

        var polySd = new b2PolyDef();
        if (!fixed) polySd.density = 1.0;
        polySd.vertexCount = points.length;
        for (var i = 0; i < points.length; i++) {
            polySd.vertices[i].Set(points[i][0], points[i][1]);
        }
        var polyBd = new b2BodyDef();
        polyBd.AddShape(polySd);
        polyBd.position.Set(x,y);
        this.world.CreateBody(polyBd)
        
    }
}

jQuery(document).ready(function() {
    DEMO.start();

    jQuery(document).keydown(function(e) {

        switch(e.keyCode) {

            case 38: //up
                DEMO.keys['up'] = true;
            break;

            case 40: //down
                DEMO.keys['down'] = true;
            break;

            case 37: //left
                DEMO.keys['left'] = true;
            break;

            case 39: //right
                DEMO.keys['right'] = true;
            break;
        }

    });
    jQuery(document).keyup(function(e) {
        switch(e.keyCode) {

            case 38: //up
                DEMO.keys['up'] = false;
            break;

            case 40: //down
                DEMO.keys['down'] = false;
            break;

            case 37: //left
                DEMO.keys['left'] = false;
            break;

            case 39: //right
                DEMO.keys['right'] = false;
            break;
        }
    });

        jQuery(document).mousemove(function(e){
            DEMO.mouseX = e.pageX;
            DEMO.mouseY = e.pageY;
        });


});





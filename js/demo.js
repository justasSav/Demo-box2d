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

    start : function() {

        this.initWorld();
        this.initScene();
        this.refreshWorld(); //loops

    },

    refreshWorld : function () {

        if(this.up) {
            var vel = this.bodies[this.bodies.length-1].GetLinearVelocity();
            vel.y -= 50;
            this.bodies[this.bodies.length-1].SetLinearVelocity(vel);
        }

        this.world.Step(this.timeStep, this.iterations);

        var that = this;
        jQuery(this.bodies).each(function(key){

            var style = 'rotate(' + (this.m_rotation0 * 57.2957795) + 'deg)';
            jQuery(that.DOMbodies[key]).css({
                left            : this.m_position0.x,
                top             : this.m_position0.y,
                transform       : style,
                WebkitTransform : style + ' translateZ(0)',
                MozTransform    : style,
                OTransform      : style,
                msTransform     : style
            });

        });

        setTimeout('DEMO.refreshWorld()', this.refreshSpeed);

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

        jQuery(document).keypress(function() {
            that.up = true;
        });
        jQuery(document).keyup(function() {
            that.up = false;
        });

        jQuery(document).click(function() {

            that.bodies.push( createBox(
                that.world,
                that.mouseX - (25/2),
                that.mouseY - (25/2),
                25,
                25,
                false
            ));

            var newBox = jQuery('<div class="cube"></div>');
            jQuery(newBox).css({
                'left' : that.mouseX - (25/2),
                'top' : that.mouseY - (25/2)
            })
            that.DOMbodies.push(newBox);
            jQuery('body').append(newBox);

        });

        jQuery(document).mousemove(function(e){
            that.mouseX = e.pageX;
            that.mouseY = e.pageY;
        });

    },

    initWorld : function() {

        var worldAABB = new b2AABB();
        worldAABB.minVertex.Set(-10000, -10000);
        worldAABB.maxVertex.Set(10000, 10000);
        var gravity = new b2Vec2(0, 100);
        var doSleep = true;
        this.world = new b2World(worldAABB, gravity, doSleep);

    }
}

jQuery(document).ready(function() {
    DEMO.start();
});





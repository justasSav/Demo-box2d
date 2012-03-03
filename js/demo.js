var player = function(){
	this.object = null;
	this.canJump = false;
};
var world = null;
var bodies = [];
var DOMbodies = [];

var DEMO = {}

function step() {
	
	var timeStep = 1.0/60;
	var iteration = 4;
	world.Step(timeStep, iteration);

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

	setTimeout('step()', 10);
}

function initGame(){
	
	player.object = createBox(world, 0, 0, 5, 5, false, 'player');

    var that = this;

    jQuery('#view div').each(function() {

        var pos = jQuery(this).position();

        var prop = new Object();
        prop.top    = pos.top;
        prop.left   = pos.left;
        prop.width  = jQuery(this).width();
        prop.height = jQuery(this).height();

        var type = jQuery(this).hasClass('st');

        that.bodies.push( createBox(
            world,
            pos.left,
            pos.top,
            prop.width / 2,
            prop.height / 2,
            type
        ));

        that.DOMbodies.push(this);

    });

}

jQuery(document).ready(function() {
    world = createWorld();

	initGame();
	step();

});





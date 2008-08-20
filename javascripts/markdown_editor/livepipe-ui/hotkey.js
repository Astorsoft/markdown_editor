/**
 * @author Ryan Johnson <http://saucytiger.com/>
 * @copyright 2008 PersonalGrid Corporation <http://personalgrid.com/>
 * @package LivePipe UI
 * @license MIT
 * @url http://livepipe.net/extra/hotkey
 * @require prototype.js, livepipe.js
 */

/*
	letter		Preferred hotkey. Can be a letter or a key like 'left', 'return', 'backspace'. See prototype docs for all keys
	callback	function( event )
	options		simple object:
				- element: element to observe for hotkey action
				- shiftKey: true/false, whether modifier key is pressed
				- altKey: idem
				- ctrlKey: idem
				- bubbleEvent: let events bubble down to their defaults, or stop after custom callback
				- fireOnce: make the event only happen once, even if the key stays pressed, or let it fire as long as the key is pressed.
*/



if(typeof(Prototype) == "undefined")
	throw "HotKey requires Prototype to be loaded.";
if(typeof(Object.Event) == "undefined")
	throw "HotKey requires Object.Event to be loaded.";

var HotKey = Class.create({
	initialize: function(letter,callback,options){
		letter = letter.toUpperCase();
		HotKey.hotkeys.push(this);
		this.options = Object.extend({
			element: false,
			shiftKey: false,
			altKey: false,
			ctrlKey: false, // TJOEK: ctrlKey not turned on by default anymore
			bubbleEvent: false,
			fireOnce: true // TJOEK: Keep repeating event while the key is pressed?
		},options || {});
		this.letter = letter;
		this.fired = false;
		this.callback = function( event ) // TJOEK: I want all custom hotkey events to stop after their custom actions
		{
			if( !(this.options.fireOnce && this.fired) )
				callback( event );
			this.fired = true;

			if( !this.options.bubbleEvent )
			{
				event.stop(  );
				if (event.preventDefault) event.preventDefault();
			}
		};
		this.element = $(this.options.element || document);
		this.handler = function(event){
			if(!event || (
				(Event['KEY_' + this.letter] || this.letter.charCodeAt(0)) == event.keyCode &&
				((!this.options.shiftKey || (this.options.shiftKey && event.shiftKey)) &&
					(!this.options.altKey || (this.options.altKey && event.altKey)) &&
					(!this.options.ctrlKey || (this.options.ctrlKey && event.ctrlKey))
				)
			)){
				if(this.notify('beforeCallback',event) === false)
					return;
				this.callback(event);
				this.notify('afterCallback',event);
			}
		}.bind(this);
		this.reset = function(  )
		{
			this.fired = false;
		}.bind( this );
		this.enable();
	},
	trigger: function(){
		this.handler();
	},
	enable: function(){
		if( window.opera || Prototype.Browser.Gecko )
			this.element.observe('keypress',this.handler);
		else
			this.element.observe('keydown',this.handler);

		this.element.observe( 'keyup', this.reset );
	},
	disable: function(){
		if( window.opera || Prototype.Browser.Gecko )
			this.element.stopObserving('keypress',this.handler);
		else
			this.element.stopObserving('keydown',this.handler);

		this.element.stopObserving( 'keyup', this.reset );
	},
	destroy: function(){
		this.disable();
		HotKey.hotkeys = Control.HotKey.hotkeys.without(this);
	}
});
Object.extend(HotKey,{
	hotkeys: []
});
Object.Event.extend(HotKey);

document.observe('dom:loaded',function(){
	// extending livepipe textarea api
	Control.TextArea.addMethods({
		// wrap selection but put the carret inside the wrapper
		wrapSelectionStayInside: function(before,after){ 
		text = before + this.getSelection() + after
		var scroll_top = this.element.scrollTop;
		if(!!document.selection){
			this.element.focus();
			var range = (this.range) ? this.range : document.selection.createRange();
			range.text = text;
			range.select();
		}else if(!!this.element.setSelectionRange){
			var selection_start = this.element.selectionStart;
			this.element.value = this.element.value.substring(0,selection_start) + text + this.element.value.substring(this.element.selectionEnd);
			this.element.setSelectionRange(selection_start + text.length,selection_start + text.length - after.length);
		}
		this.doOnChange();
		this.element.focus();
		this.element.scrollTop = scroll_top;
	  },
			stripLastNewLines: function(s)
			{
					while ((s.substring(s.length - 1, s.length) == "\n") || (s.substring(s.length - 1, s.length) == "\r"))
						s = s.substring(0, s.length - 1);
					return s;
			},			
			// Some hacks to handle caret position in Safari, Firefox and IE6/7
			getCaretInfo: function(textarea)
		{
			var result = {start: 0, end: 0, caret: 0};

			if (navigator.appVersion.indexOf("MSIE")!=-1)
			{
				if (textarea.tagName.toLowerCase() == "textarea")
				{
					var range1 = document.selection.createRange();
					var range2 = range1.duplicate();
					var offset = textarea.value.length - (stripLastNewLines(textarea.value)).length;

					range2.moveToElementText(textarea);
					range2.setEndPoint('StartToEnd', range1);
					result.end = textarea.value.length - range2.text.length - offset;

					range2.setEndPoint('StartToStart', range1);
					result.start = textarea.value.length - range2.text.length - offset; 
					result.caret = result.end;
				}
				else
				{
					var range1 = document.selection.createRange();
					var range2 = range1.duplicate();			
					result.start = 0 - range2.moveStart('character', -100000);
					result.end = result.start + range1.text.length;	
					result.caret = result.end;
				}			
			}
			else
			{
				result.start = textarea.selectionStart;
				result.end = textarea.selectionEnd;
				result.caret = result.end;
			}
			if (result.start < 0)
			 result = {start: 0, end: 0, caret: 0};
			return result;
		},
		// Some hacks to handle caret position in Safari, Firefox and IE6/7
		setCaretInfo: function(textarea, caretInfo)
		{
			if (textarea.setSelectionRange)
			{
				textarea.focus();
				textarea.setSelectionRange(caretInfo.start, caretInfo.end);
			}
			if (textarea.createTextRange)
			{
				var range = textarea.createTextRange();
				range.collapse(true);
				range.moveEnd('character', caretInfo.end);
				range.moveStart('character', caretInfo.start);
				range.select();
			}
		},
		// if text selected, wrap him, else put the wrapper around the caret
		smartWrap: function(before,after){
			if(this.getSelection() == "") {
				this.wrapSelectionStayInside(before,after);
			}
			else {
				this.wrapSelection(before,after);
			}
		}
	});
});

// Set the toolbar and hotkeys to the associated textarea_id
function setMarkdownTextarea(textarea_id){
//setup
var textarea = new Control.TextArea(textarea_id);
var toolbar = new Control.TextArea.ToolBar(textarea);
var nb_footnotes = 0;
var caretInfo = {start:0, end:0, caret:0};
toolbar.container.id = 'markdown_toolbar'; //for css styles

//buttons


toolbar.addButton('Italics', function(){this.smartWrap('_', '_')},{
	className: 'markdown_italics_button'
});

toolbar.addButton('Bold',function(){this.smartWrap('**', '**')},{
	className: 'markdown_bold_button'
});

toolbar.addButton('Code',function(){this.smartWrap('`', '`')},{
	className: 'markdown_code_button'
});

toolbar.addButton('Link',function(){
	var selection = this.getSelection();
	selection = (selection == '' ? prompt('Link Text', '') : selection);
	
	// if selection already link or mail, put autolink syntaxe
	var mail = /^[a-z0-9._-]+@[a-z0-9.-]{2,}[.][a-z]{2,3}$/;
  var url = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	if(mail.test(selection) || url.test(selection)){
		this.wrapSelection('<', '>');
		return;
	}
	
	if(selection == null)
		return;
	
	if(selection == '')
		selection = 'Link Text Here';
		
	var response = prompt('Enter Link URL','');
	if(response == null)
		return;
	
	// relative links handling
	if(response[0] != "/") // not relative link
		response = (response == '' ? 'http://link_url/' : response).replace(/^(?!(f|ht)tps?:\/\/)/,'http://');

	// try to set a link with ID method, if the user cancels, create inline type link instead
	var response_id = prompt('Enter Link ID, if you cancel it will make an inline type link', '');
	if(response_id == null)
	{
		this.replaceSelection('[' + selection + '](' + response + ')');
	}
	else
	{
		var link_label = prompt('Enter a Link title (optionnal, will be shown in tooltip)', '');
		this.replaceSelection('[' + selection + ']'+'['+response_id+']');
		if(link_label != null && link_label != '')
		{
	  	link_label = '"' + link_label +'"';
		}
		else
		{
			link_label = null;
		}
		caretInfo = this.getCaretInfo($(textarea_id));	 
		$(textarea_id).value += '\n'+'['+(response_id == '' ? selection : response_id)+']: '+ response + ' ' + (link_label == null ? '' : link_label);
		this.setCaretInfo($(textarea_id), caretInfo);
	}
},{
	className: 'markdown_link_button'
});

toolbar.addButton('Footnote',function(){
	var selection = (this.getSelection() == '' ? prompt('Footnote for ?', '') : this.getSelection());
	if(selection == null || selection == '')
		return;
		
	var response = prompt('Enter the corresponding footnote','');
	if(response == null || response == '')
		return;
		
	nb_footnotes += 1;
	this.replaceSelection(selection + '[^'+ nb_footnotes +']');
	caretInfo = this.getCaretInfo($(textarea_id));
	$(textarea_id).value += '\n[^' + nb_footnotes + ']: '+ response;
	this.setCaretInfo($(textarea_id), caretInfo);
	
},{
id: 'markdown_footnote_button'
});

toolbar.addButton('Image',function(){
	var selection = this.getSelection();
	selection = (selection == '' ? prompt('Image Alt text :', ''): selection);
	
	if(selection == null)
		return;
		
	if(selection == '')
		selection = 'Image Alt Text Here';
		 
	var response = prompt('Enter Image URL','');
	if(response == null)
		return;
	
	// relative links handling
	if(response[0] != "/") // not relative link
		response = (response == '' ? 'http://image_url/' : response).replace(/^(?!(f|ht)tps?:\/\/)/,'http://');

	// try to setup the pic with the ID method, if the user cancels it makes an inline type picture instead
	var response_id = prompt('Enter Image ID, if you cancel it will make an inline type image tag', '');
	if(response_id == null)
	{
		this.replaceSelection('![' + selection + '](' + response + ')');
	}
	else
	{
		this.replaceSelection('![' + selection + ']'+'['+response_id+']');
		caretInfo = this.getCaretInfo($(textarea_id));
		$(textarea_id).value += '\n'+'['+(response_id == '' ? selection : response_id)+']: '+ response;
		this.setCaretInfo($(textarea_id), caretInfo);
	}
},{
	className: 'markdown_image_button'
});


toolbar.addButton('H1',function(){
	var selection = (this.getSelection() == '' ? prompt('Heading text', '') : this.getSelection());
	if(selection == null)
 		return;

	selection = (selection == '' ? 'Heading' : selection);
	
	this.replaceSelection("\n" + selection + "\n" + $R(0,Math.max(5,selection.length)).collect(function(){}).join('=') + "\n\n");
},{
	className: 'markdown_h1_button'
});


toolbar.addButton('H2',function(){
	var selection = (this.getSelection() == '' ? prompt('Heading text', '') : this.getSelection());
 if(selection == null)
 	return;

	selection = (selection == '' ? 'Sub heading' : selection);
	this.replaceSelection("\n" + selection + "\n" + $R(0,Math.max(5,selection.length)).collect(function(){}).join('-') + "\n\n");
},{
	className: 'markdown_h2_button'
});

toolbar.addButton('H3',function(){
	var selection = (this.getSelection() == '' ? prompt('Heading text', '') : this.getSelection());
 if(selection == null)
 	return;

	selection = (selection == '' ? 'Sub sub heading' : selection);
	this.replaceSelection('\n### '+ selection + '\n');
},{
	className: 'markdown_h3_button'
});

toolbar.addButton('HR', function(){
	this.insertAfterSelection('\n\n---\n\n');
},{
	className: 'markdown_hr_button'
});

toolbar.addButton('TOC', function(){
	
	
	this.insertAfterSelection('\n* toc\n{:toc}\n');
	
	if(confirm("Press ok to use automatically numbered headers.")) {
		caretInfo = this.getCaretInfo($(textarea_id));
		$(textarea_id).value = 'Use numbered headers: true\n\n' + $(textarea_id).value
		// some hacks to put the carret just after the TOC adding.
		var caretLeap = 'Use numbered headers: true\n\n'.length;
		caretInfo = {start:caretInfo.start+caretLeap, 
								 end:caretInfo.end+caretLeap, 
								 caret:caretInfo.caret + caretLeap};
		this.setCaretInfo($(textarea_id), caretInfo);
	}
},{
	className: 'markdown_toc_button'
});

toolbar.addButton('def', function(){
	var selection = (this.getSelection() == '' ? prompt('Term to define', '') : this.getSelection());

	if(selection == null)
		return;
		
	if(selection == '')
		selection = 'Definition Term here';
	
	var definition = prompt('Definition of \''+ selection + '\' ?', '' );
	
	if(definition == null)
		return;
		
  if(definition == '')
		definition = 'Definition goes here...';
	
	
	this.replaceSelection('\n'+ selection + '\n :  ' + definition+'\n');
},{
	className: 'markdown_def_button'
});


toolbar.addButton('abbrev', function(){
	var selection = (this.getSelection() == '' ? prompt('Term to define abbreviation for', '') : this.getSelection());

	if(selection == null)
		return;
		
	if(selection == '')
		selection = 'ABBREV';
	
	var definition = prompt('Abbreviation of \''+ selection + '\' ?', '' );
	
	if(definition == null)
		return;
		
  if(definition == '')
		definition = 'Abbreviation goes here...';
	
	caretInfo = this.getCaretInfo($(textarea_id));
	$(textarea_id).value += '\n*['+ selection +']: ' + definition;
	this.setCaretInfo($(textarea_id), caretInfo);
},{
	className: 'markdown_abbrev_button'
});

toolbar.addButton('table', function(){
	var cols = parseInt(prompt('Number of columns',''));
	if(isNaN(cols) || cols < 1)
		return;
	else{
		var rows = parseInt(prompt('Number of rows',''));
		if(isNaN(rows) || rows < 1)
			return;
		else{
			caretInfo = this.getCaretInfo($(textarea_id));
			var buff = '|';
			
			for(var i=1; i <= cols; i++){
				buff += '  |';
			}
			
			buff += '\n|';
			
			for(var i=1; i <= cols; i++){
				buff +='--|';
			}
			buff += '\n';
			
			for(var j= 1; j <= rows; j++){
				buff += '|';
				for(var i=1; i <= cols; i++){
					buff += '  |';
				}
				buff += '\n'
			}
		}
		this.insertAfterSelection(buff);
		caretInfo = {start:caretInfo.start+2, 
								 end:caretInfo.end+2, 
								 caret:caretInfo.caret+2};
		this.setCaretInfo($(textarea_id), caretInfo);
	}
},{
	className: 'markdown_heading_button'
});


toolbar.addButton('Unordered List',function(event){
	this.collectFromEachSelectedLine(function(line){
		return event.shiftKey ? (line.match(/^\-{2,}/) ? line.replace(/^\-/,'') : line.replace(/^\-\s/,'')) : (line.match(/\-+\s/) ? '*' : '- ') + line;
	});
},{
	className: 'markdown_unordered_list_button'
});

toolbar.addButton('Ordered List',function(event){
	var i = 0;
	this.collectFromEachSelectedLine(function(line){
		if(!line.match(/^\s+$/)){
			++i;
			return event.shiftKey ? line.replace(/^\d+\.\s/,'') : (line.match(/\d+\.\s/) ? '' : i + '. ') + line;
		}
	});
},{
	className: 'markdown_ordered_list_button'
});

toolbar.addButton('Block Quote',function(event){
	this.collectFromEachSelectedLine(function(line){
		return event.shiftKey ? line.replace(/^\> /,'') : '> ' + line;
	});
},{
	className: 'markdown_quote_button'
});

toolbar.addButton('Code Block',function(event){
	this.collectFromEachSelectedLine(function(line){
		return event.shiftKey ? line.replace(/    /,'') : '    ' + line;
	});
},{
	className: 'markdown_code_block_button'
});

toolbar.addButton('Help',function(){
	window.open('http://daringfireball.net/projects/markdown/dingus');
},{
	className: 'markdown_help_button'
});



// hotkey functions

function tab_forward(){
	caretInfo = textarea.getCaretInfo($(textarea_id));
	var whole_text = textarea.getValue();
	var following_text = whole_text.slice(caretInfo.caret, whole_text.length);
	var next_pos_start = following_text.search(/\|[^\n\-]/) + 1;
	following_text = following_text.slice(next_pos_start, following_text.length);
	var next_pos_end = next_pos_start + following_text.search(/\|/);
	if(next_pos_end == -1)
		return;
	var diff = caretInfo.end - caretInfo.start;
	var caretInfo_next = {start:caretInfo.start+next_pos_start+diff, 
												end:caretInfo.start+next_pos_end+diff, 
												caret:caretInfo.start+next_pos_end+diff};
		
	textarea.setCaretInfo($(textarea_id), caretInfo_next);
}

function tab_backward(){
	caretInfo = textarea.getCaretInfo($(textarea_id));
	var whole_text = textarea.getValue();
	var following_text = whole_text.slice(0, caretInfo.caret).split('').reverse().join('');
	var next_pos_start = following_text.search(/\|/) + 1;
	following_text = following_text.slice(next_pos_start, following_text.length);
	var next_pos_end = next_pos_start + following_text.search(/[^\n\-]\|/);
	if(next_pos_end == -1)
		return;
	var diff = caretInfo.end - caretInfo.start;
	var caretInfo_next = {start:caretInfo.start-next_pos_start+diff, 
												end:caretInfo.start-next_pos_end+diff, 
												caret:caretInfo.start-next_pos_end+diff};
	textarea.setCaretInfo($(textarea_id), caretInfo_next);
												
	var before_cell = whole_text.slice(0, caretInfo_next.caret).split('').reverse().join('');
	var after_cell = whole_text.slice(caretInfo_next.caret, whole_text.length);
	var word_begin = before_cell.search(/\|/);
	var word_end = after_cell.search(/\|/);
	var caretInfo_final = {start:caretInfo_next.caret - word_begin,
		 										 end:caretInfo_next.caret + word_end,
												 caret:caretInfo_next.caret + word_end}

	textarea.setCaretInfo($(textarea_id), caretInfo_final);
}


function text_emphasize(){
	textarea.smartWrap('_', '_'); return false;
}

function text_bold(){
	textarea.smartWrap('**', '**'); return false;
}


// hotkeys

new HotKey('i',text_emphasize, // ctrl + i
{ element: $('textarea_id'), ctrlKey: true });


new HotKey('b', text_bold, // ctrl + b
{ element: $('textarea_id'), ctrlKey: true });


new HotKey('tab',tab_forward, // tab
{ element: $('textarea_id') });


new HotKey('tab',tab_backward, // shift-tab
{ element: $('textarea_id'), shiftKey: true });



}
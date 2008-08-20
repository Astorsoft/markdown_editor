MarkdownEditor
==========

Markdown Editor is a lightweight markdown...editor! It consists in a toolbar and a set of hotkeys that will be bound to the corresponding textarea, therefore you can put multiple editors on the same pages and it will (normally) work like a charm. MarkdownEditor is written in javascript thanks to the prototype and [Ryan Johnson's][livepipe_author_github] [Livepipe-UI][livepipe_github] API.


Installation
============

    ./script/plugin install git://github.com/Astorz/markdown_editor.git


Example usage
==============

First of all you'll have to include the `markdown_editor.css`, the prototype API and the set of javascript files needed for the editor (which are ``, `` and `` but you can set all of them with the symbol **:markdown_editor**).

    <%= javascript_include_tag :defaults %>
    <%= javascript_include_tag :markdown_editor %>
    <%= stylesheet_link_tag 'markdown_editor' %>
    
    
For the case 2 and 3 of this example I will act as if I have to put an editor on the textarea body of my model post

This plugin offer 3 way to use the helper :

1. Using it like a tag from FormTagHelper.

        <%= markdown_editor_tag "my_markdown_textarea" %>

2. Using it as a FormHelper

        <%= markdown_editor :post, :body %>

3. Using it in the Formbuilder

        <% form_for(@post) do |f| %>
          <%= f.markdown_editor :body %>
        <% end %>

It is of course possible to add any html option in addition to theseæ parameters as a Hash as last parameter of the methods. For example to override default class (which is "markdown_editor") and set it to "foo" :

        <%= markdown_editor_tag "my_markdown_textarea",nil, :class => "foo" %>
    
      

Authors and credits
===================

Author of the plugin : Morgan Hotonnier
Author of [LivePipe-UI][livepipe_website] ([here][livepipe_github] the github repos) : [Ryan Johnson][livepipe_author_github]



[livepipe_author_github]: http://github.com/saucytiger
[livepipe_github]: http://github.com/saucytiger/livepipe-ui/tree/master
[livepipe_website]: http://livepipe.net/






Copyright (c) 2008 Morgan Hotonnier <astorsoft@gmail.com>, released under the MIT license


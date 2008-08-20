MarkdownEditor
==========

Markdown Editor is a lightweight markdown...editor! It consists in a toolbar and a set of hotkeys that will be bound to the corresponding textarea, therefore you can put multiple editors on the same pages and it will (normally) work like a charm. MarkdownEditor is written in javascript thanks to the prototype and [Ryan Johnson's][livepipe_author_github] [Livepipe-UI][livepipe_github] API.

**Important**: Even if it's not needed for the plugin to work, I recommend to install and use the [Maruku][maruku_website] gem and not Bluecloth, indeed Maruku implements the **markdown extras** features such as tables, footnotes, table of contents, definition lists... and MarkdownEditor handles all these feature by default. If you don`t want to use the markdown extras you should put off the corresponding button (take a look at `markdown_editor.js`, don't worry, removing/adding a button or a hotkey is very easy, thanks to Livepipe-ui)


Installation
============

    ./script/plugin install git://github.com/Astorz/markdown_editor.git
    
If you don't have Maruku Gem and you want use the markdown extras

    sudo gem install maruku


Example usage
==============

First of all you'll have to include the `markdown_editor.css`, the prototype API and the set of javascript files needed for the editor (which are ``, `` and `` but you can set all of them with the symbol **:markdown_editor**).

    <%= javascript_include_tag :defaults %>
    <%= javascript_include_tag :markdown_editor %>
    <%= stylesheet_link_tag 'markdown_editor' %>
    
    
For the case 2 and 3 of this example I will act as if I have to put an editor on the textarea body of my model post

This plugin offer 3 way to use the helper :

1. Using it like a tag from FormTagHelper.

        <%= markdown_editor_tag "markdown_textarea" %>

2. Using it as a FormHelper

        <%= markdown_editor :post, :body %>

3. Using it in the Formbuilder

        <% form_for(@post) do |f| %>
          <%= f.markdown_editor :body %>
        <% end %>

It is of course possible to add any html option in addition to these parameters as a Hash as last parameter of the methods. For example if we want to add the id "foo" for the first tag, we can write :

        <%= markdown_editor_tag "markdown_textarea", nil, :id => foo %>
    
      

Authors and credits
===================

Author of the plugin : Morgan Hotonnier
Author of [LivePipe-UI][livepipe_website] ([here][livepipe_github] the github repos) : [Ryan Johnson][livepipe_author_github]



[livepipe_author_github]: http://github.com/saucytiger
[livepipe_github]: http://github.com/saucytiger/livepipe-ui/tree/master
[livepipe_website]: http://livepipe.net/
[maruku_website]: http://maruku.rubyforge.org/






Copyright (c) 2008 Morgan Hotonnier <astorsoft@gmail.com>, released under the MIT license


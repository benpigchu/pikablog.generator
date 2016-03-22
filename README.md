#pikablog.generator
The data generator for pikablog. It will be used on benpigchu.com/blog

##another NODE!
Yes, JS is good!

##how to use
just like this

	main.js [input folder] [output folder]

##input folder
Input folder should include all your blog articles in html like below

```html
<!--@title:test article-->
<!--@tag:test box art-->
<p>this is a test</p>
<!--@more-->
<div id="left" class="left">left</div>
<style>.right{align:right}</style>
<script>document.getElementById("left").className="right"</script>
```

Title should in the @title comment ,all tags should include in the @tag comment, and only the content before the @more comment should be shown in list view.

Style and Script should only work when you entered the article, and should not work in list view.

But all the behaviors depend on how do you use the data.

notice:include @comments, style and script in each others may make an unexpected prase result appear.

##output folder

###the list files and the article files
TODO

###the article folder
TODO

###the list folder
TODO

###the tag folder
TODO

###the time folder
TODO
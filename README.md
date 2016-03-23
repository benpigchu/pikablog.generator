#pikablog.generator
The data generator for pikablog. It will be used on benpigchu.com/blog .

##another NODE!
Yes, JS is good!

##how to use
just like this:

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
article files is json files like below:

```json
{
	"title": "test",
	"time": "2016-03-23T05:26:07.964Z",
	"content": "<p>just a test</p>\r\n",
	"tag": [
		"test",
		"testing",
		"example",
		"instance"
	],
	"style": [
		"p{color:#ff7f00}"
	],
	"script": [
		"alert(\"test\")"
	]
}
```
list files is json files include array of articles sorted by time like below:

```json
{
	"name": "test2",
	"time": "2016-03-23T06:17:37.285Z",
	"tag": [
		"test",
		"tag",
		"try"
	],
	"preview": "<p>this is preview</p>\r\n",
	"title": "another test"
}
```

###the article folder
include all article files.

###the list folder
include list file of all articles(10 in every slices) and a meta.json with number of slices.

###the tag folder
include a data.json with number of articles in tags like below:

```json
{
	"test": 2,
	"try": 2,
	"tag": 1,
	"example": 1,
	"instance": 1
}
```

and folders named by tags inlude list file of all articles with this tag(10 in every slices) and a meta.json with number of slices.

###the time folder
include a data.json with number of articles in monthes like below:

```json
{
	"2016-3": 2,
	"2016-2": 2
}
```

and folders named by monthes inlude list file of all articles in this monthes(10 in every slices) and a meta.json with number of slices.


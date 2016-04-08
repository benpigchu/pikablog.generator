const fs=require("fs")
const path=require("path")
const util=require("util")

var input
var output

const sourceParser=(text)=>{
	var result={}
	result.style=[]
	result.script=[]
	result.tag=[]
	result.title=""
	result.preview=""
	result.full=""
	var preview=true
	while(text.indexOf("<")!=-1){
		var start=text.indexOf("<")
		result.full=result.full+text.slice(0,start)
		if(preview){
			result.preview=result.preview+text.slice(0,start)
		}
		text=text.slice(start)
		if(text.slice(0,7)=="<style>"){
			text=text.slice(7)
			var end=text.indexOf("</style>")
			if(end!=-1){
				result.style.push(text.slice(0,end))
				text=text.slice(end+8)
			}else{
				result.style.push(text)
				text=""
			}
		}else if(text.slice(0,8)=="<script>"){
			text=text.slice(8)
			var end=text.indexOf("</script>")
			if(end!=-1){
				result.script.push(text.slice(0,end))
				text=text.slice(end+9)
			}else{
				result.script.push(text)
				text=""
			}
		}else if(text.slice(0,5)=="<!--@"){
			var end=text.indexOf("-->")
			if(end==-1){
				result.full=result.full+text.slice(0,5)
				if(preview){
					result.preview=result.preview+text.slice(0,5)
				}
				text=text.slice(5)
			}else{
				var meta=text.slice(5,end)
				if(meta=="more"){
					preview=false
				}
				if(meta.length>=6){
					if(meta.slice(0,6)=="title:"){
						result.title=meta.slice(6)
					}
				}
				if(meta.length>=4){
					if(meta.slice(0,4)=="tag:"){
						result.tag=meta.slice(4).split(",")
					}
				}
				console.log(meta)
				text=text.slice(end+3)
			}
		}else{
			result.full=result.full+text.slice(0,1)
			if(preview){
				result.preview=result.preview+text.slice(0,1)
			}
			text=text.slice(1)
		}
	}
	result.full=result.full+text
	if(preview){
		result.preview=result.preview+text
	}
	result.full=result.full.replace(/[\r\n]+/g,"\n")
	result.preview=result.preview.replace(/[\r\n]+/g,"\n")
	result.full=result.full.replace(/^[\r\n]+/g,"")
	result.preview=result.preview.replace(/^[\r\n]+/g,"")
	result.full=result.full.replace(/[\r\n]+$/g,"")
	result.preview=result.preview.replace(/[\r\n]+$/g,"")
	text=""
	console.log(result)
	return result
}

function Article(name,time,text){
	this.name=name.slice(0,name.length-5)
	this.time=time
	var result=sourceParser(text)
	console.log(`${name} parsed`)
	this.tag=result.tag
	this.preview=result.preview
	this.title=result.title
	doc={}
	doc.title=result.title
	doc.time=time
	doc.content=result.full
	doc.tag=result.tag
	doc.style=result.style
	doc.script=result.script
	fs.appendFile(path.normalize(output+path.sep+"article"+path.sep+this.name+".json"),JSON.stringify(doc))
}

const outputList=(list,folder)=>{
	for(var i=0;i*10<=list.length;i++){
		fs.appendFile(path.normalize(folder+path.sep+(i+1)+".json"),JSON.stringify(list.slice(10*i,10*(i+1))))
	}
	fs.appendFile(path.normalize(folder+path.sep+"meta.json"),JSON.stringify(Math.ceil(list.length/10)))
}

input=process.argv[2]
output=process.argv[3]
if(input==undefined||output==undefined){
	console.log(`please show me the folders!`)
	process.exit(0)
}
console.log(`from "${input}" to "${output}"`)
var fileList
try{
	fileList=fs.readdirSync(input)
	var clearFolder=(folderPath)=>{
		fs.readdirSync(folderPath).forEach((name)=>{
			var fullPath=path.normalize(folderPath+path.sep+name)
			if(fs.statSync(fullPath).isDirectory()){
				clearFolder(fullPath)
				fs.rmdirSync(fullPath)
			}else{
				fs.unlinkSync(fullPath)
			}
		})
	}
	clearFolder(output)
	fs.mkdirSync(path.normalize(output+path.sep+"article"))
	fs.mkdirSync(path.normalize(output+path.sep+"tag"))
	fs.mkdirSync(path.normalize(output+path.sep+"list"))
	fs.mkdirSync(path.normalize(output+path.sep+"time"))
}catch(e){
	console.log(`please make sure they are folders!`)
	process.exit(0)
}
var articleList=[]
fileList.forEach((name)=>{
	if(name.slice(name.length-5,name.length)!=".html"){
		return
	}
	try{
		var text=fs.readFileSync(path.normalize(input+path.sep+name),'utf8')
		var time=fs.statSync(path.normalize(input+path.sep+name)).mtime
		articleList.push(new Article(name,time,text))
	}catch(e){}
})

articleList.sort((a,b)=>a.time.getTime()<b.time.getTime())
outputList(articleList,path.normalize(output+path.sep+"list"))

var tags={}
articleList.forEach((article)=>{
	article.tag.forEach((tag)=>{
		if(!(tag in tags)){
			tags[tag]=[]
		}
		tags[tag].push(article)
	})
})
var tagData={}
for(tag in tags){
	tagData[tag]=tags[tag].length
	fs.mkdirSync(path.normalize(output+path.sep+"tag"+path.sep+tag))
	outputList(tags[tag],path.normalize(output+path.sep+"tag"+path.sep+tag))
}
fs.appendFile(path.normalize(output+path.sep+"tag"+path.sep+"data.json"),JSON.stringify(tagData))

var times={}
articleList.forEach((article)=>{
	var timeRange=article.time.getFullYear()+"-"+(1+article.time.getMonth())
	if(!(timeRange in times)){
		times[timeRange]=[]
	}
	times[timeRange].push(article)
})
var timeData={}
for(timeRange in times){
	timeData[timeRange]=times[timeRange].length
	fs.mkdirSync(path.normalize(output+path.sep+"time"+path.sep+timeRange))
	outputList(times[timeRange],path.normalize(output+path.sep+"time"+path.sep+timeRange))
}
fs.appendFile(path.normalize(output+path.sep+"time"+path.sep+"data.json"),JSON.stringify(timeData))

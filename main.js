const fs=require("fs")
const path=require("path")
const util=require("util")

var input
var output

var sourceParser=(text)=>{
	var result={}
	result.style=[]
	result.script=[]
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
	console.log(result)
	return result
}

function Article(name,time,text){
	this.name=name.slice(0,name.length-6)
	this.time=time
	result=sourceParser(text)
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


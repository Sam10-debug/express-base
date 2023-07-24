const express= require('express')
const app= express()
const Joi=require('joi') //for input validation and schema
const config=require('config')
const log= require('log')
const helmet=require('helmet')
const morgan=require('morgan')
const auth= require('auth')
const port= process.env.PORT||8000
const staticFilesDirectory = 'public';


//Built in middleware
app.use(express.json()) //parses the JSON
app.use(express.urlencoded({extended:true}))
app.use(express.static(staticFilesDirectory)) //serve up static files

//Third Party middleware
//check it up on the node website, cos some of them arent needed

app.use(helmet())

//Custom made middleware
app.use(log)
app.use(auth)

app.use((err, req, res, next) => {
    res.locals.error = err;
    const status = err.status || 500;
    res.status(status);
    res.render('error');
  }); //handling status error


console.log(process.env.NODE_ENV)
console.log(app.get('env'))
//the two above are used to get environment that you are working on but you have to set the former, while the latter gives you development enviroment by default,you can set the second too but it gives dev by default,
if(app.get('env')==='development'){
    app.use(morgan('tiny')) //means to use morgan only in development environment
    console.log('Morgan enabled')
}

//COMFIGURATION
console.log(config.get('name')) //value of this one will depend on the environemnet youre on, yu have a dev and prod config,
console.log(config.get('mail.host'))
//note to store passwords or secretive info as env variable, then access them with the config file


const courses=[
    {name:"sam",id:1},
    {name:"bay",id:2},
    {name:"lol",id:3},
]

//using a reusable function to handle schema since it is needed both in Put and Create 
function validateCourse(course){
    const schema=Joi.object({
        name:Joi.string().min(3).required()
    })

    const result = schema.validate({ name: course.name });
    return result;
}

app.get('/',(req,res)=>{
    // res.send('Hello World')
    res.send(process.env.NODE_ENV)
})

app.get('/api/courses',(req,res)=>{
    res.send(courses)
})

//route parameters  
app.get("/api/courses/:id",(req,res)=>{
    const userId= parseInt(req.params.id)
    const course=courses.find(c=>c.id===userId)
    if(!course){
        res.status(404).send("The course with the given ID was not found")
        return
    }
    res.send(course)
})
//query parameter are the one with question mark, they are optional

//POST

app.post('/api/courses',(req,res)=>{
    // const schema=Joi.object({
    //     name:Joi.string().min(3).required()
    // })

    // const { error, value } = schema.validate({ name: req.body.name });
    const {error,value}= validateCourse(req.body)
    if (error) {
        //should send a status code actually
        console.log('Validation error:', error.details);
        return
      } else {
        console.log('Validated data:', value);
      }

    // const result=schema.validate(req.body,schema)
    // console.log(result)
    // if(!req.body.name||req.body.name.length<3){
    //     res.status(400).send("baka")
    //     return
    // }
    const course={
        id:courses.length+1,
        name:req.body.name
    }
    courses.push(course)
    res.send(course)
})
//UPDATE
app.put('/api/courses/:id',(req,res)=>{
    //look up the course
    //if it doesnt exist return 404
    const course=courses.find(c=>c.id===parseInt(req.params.id))
    if(!course){
        res.status(404).send("the course doesnt exist")
        return //means the rest of the function wnt work
    }

    //validation
    //if invalid return 400

    // const schema=Joi.object({
    //     name:Joi.string().min(3).required()
    // })

    // const { error, value } = schema.validate({ name: req.body.name });
    const {error,value}= validateCourse(req.body)
    if (error) {
        res.status(400).send(error.details)
        console.log('Validation error:', error.details);
        return
      } else {
        console.log('Validated data:', value);
      }

      //update the course
      course.name=req.body.name

      //return the updated course
      res.send(course)

})

//DELETE
app.delete('/api/courses/:id',(req,res)=>{
    //look up the course
    //if it doesnt exist, return 404
    const course=courses.find(c=>c.id===parseInt(req.params.id)) //returns the first object that matches the condition
    if(!course){
        res.status(404).send("course does not exist")
        return // this means the rest of the function will not run
    }

    //Delete
    //get the index of the object to be deleted
    const index= courses.indexOf(course)
    courses.splice(index,1)
    
    //finlly we send a respnse to the client
    res.send(course)

})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

// discord grinding, send ade mail check bookmark on burner job application whatsap starred venom arkham Tobi nft build with react native build with rtk the two above are for portfolio build portflio tech writing course typescript build online presence redo those sui and all wallets, check yoour browser hstorty


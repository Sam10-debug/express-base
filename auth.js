const auth=(req,res,next)=>{
    console.log('authenticating...')
    next()
}
module.export=auth
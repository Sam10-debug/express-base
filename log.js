const log=(req,res,next)=>{
    console.log('logging...')
    next()
}
module.export=log
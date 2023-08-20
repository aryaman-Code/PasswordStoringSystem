if(process.env.NODE_ENV=='production'){
    module.exports=require("./prod")
    console.log("i am in production")
}
else{
    module.exports=require("./dev")
    console.log("i am in development")
}
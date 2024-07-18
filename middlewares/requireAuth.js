

const requireAuth = (req,res,next) => {

    try {
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({message:"unauthorized"});
    }
}
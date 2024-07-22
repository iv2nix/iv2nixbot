function validateRegex(str) {
    try{
        new RegExp(str);
        return true;
    }catch (e){
        return false;
    }

}

module.exports = {validateRegex};

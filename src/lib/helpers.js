import bcrypt from 'bcryptjs';

const helpers = {};

helpers.encriptar = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.comparePass = async(password, savedPassword)=>{
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        
    }
}
export default helpers;
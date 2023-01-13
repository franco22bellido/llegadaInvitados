import { toString } from 'qrcode';


export default async (url)=>{

    try {
        const qr = await toString(url, {type:'svg'});
        let position = qr.indexOf(`d="M4`) + 3;
        let positionEnd = qr.indexOf(`"/></svg>`);
        let qrElement = `${qr.substring(position, positionEnd)}`;
        return qrElement
    } catch (error) {
        console.log(error);        
    }

}

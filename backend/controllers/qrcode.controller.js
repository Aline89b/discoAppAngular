const fs = require('fs');
const path = require('path');
const QRcode = require('qrcode')
const qrcode = require('../models/qrcode.model')
//const twilio = require('twilio')
const accountSid = process.env.SID_ACCOUNT
const authToken = process.env.TWILIO_TOKEN



const client = require('twilio')(accountSid, authToken);


const sendQRcode = async (req,res) => {
    
    const{ listId, guestId, status, phone } = req.body
    console.log(req.body)
    console.log(phone)
    const expirationDate = new Date();
    try {
        const qrData = JSON.stringify({ listId, guestId, status });
        
        
        const filePath = path.join(__dirname, '..', 'qrcodes', `${guestId}.png`)
    
         await QRcode.toFile(filePath, qrData,{
            errorCorrectionLevel: 'H',
            width: 500,
        });
         
        const qrcodeUrl  = `${process.env.QRCODE_URL}/api/qrcodes/${listId}/${guestId}.png`;
      
        expirationDate.setMonth(expirationDate.getMonth() + 1);

        
     try {
      
        const message = `Hello , please keep this QR code to show at the entrance.
       ${qrcodeUrl}`;
            await client.messages.create({
              body: message,
              from: '+16467592855', 
              to:  `'${phone}' `,
              
            });

            
     } catch (error) {
        console.log(error.message, error.code)
     }
          
        const qrcodeNew = new qrcode({
            guestId,
            listId,
            qrCodePath: filePath, 
            status,
            expiresAt: expirationDate,  
        });

        await qrcodeNew.save();
        
        res.json({ message:'qrcode has been sent to the number', phone });
    } catch (error) {
        console.log(error)
    }
   
}

const getQRcode = async(req, res) =>{
    const { listId, guestId } = req.params;
    const filePath = path.join(__dirname, '..', 'qrcodes', `${guestId}.png`);
    
   
    try {
       
        await fs.promises.access(filePath, fs.constants.F_OK);

      
        res.sendFile(filePath);
    } catch (error) {
       
        res.status(404).send('QR code not found');
    }
}



module.exports = {sendQRcode, getQRcode}
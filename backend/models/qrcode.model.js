const mongoose = require("mongoose");

const qrcodeSchema = new mongoose.Schema({
    guestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest',
        required: true,
    },
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true,
    },
    qrCodePath: {
        type: String,
        required: true,  // Path to the QR code file on the server
    },
    status: {
        type: String,
        enum: ['invited', 'accepted'],
        default: 'invited',
    },
    expiresAt: {
        type: Date,
        required: true,  
    }
});

const qrcode = mongoose.model('qrcode', qrcodeSchema);

module.exports = qrcode
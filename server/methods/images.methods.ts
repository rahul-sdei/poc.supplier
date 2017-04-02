import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Images, Thumbs } from "../../both/collections/images.collection";
import { Image, Thumb } from "../../both/models/image.model";

Meteor.methods({
  /* delete image by id */
    "images.delete": (imageId) => {
        let fs = require('fs');
        /* remove original image */
        let image = Images.collection.findOne({_id: imageId});
        if (typeof image == "undefined" || !image._id) {
            throw new Meteor.Error(`Invalid image-id "${imageId}"`);
        }
        let imagePath = process.env.PWD + '/uploads/images/' + image._id + '.' + image.extension;
        fs.unlink(imagePath, (res) => {
            //console.log("unlink.img:", res);
        });
        /* reset data in collections */
        Images.collection.remove({_id: image._id});
        
        /* remove thumb */
        let thumb = Thumbs.collection.findOne({originalId: image._id});
        if (typeof thumb == "undefined" || !thumb._id) {
            return true;
        }

        let thumbPath = process.env.PWD + '/uploads/thumbs/' + thumb._id + '.' + thumb.extension;
        fs.unlink(thumbPath, (res) => {
            //console.log("unlink.thumb:", res);
        });
        Thumbs.collection.remove({_id: thumb._id});

        return true;
    }
})

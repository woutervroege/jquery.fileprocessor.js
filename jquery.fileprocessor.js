/*
    * @package jquery.fileprocessor.js
    * @copyright (©) 2013 Wouter Vroege <wouter AT woutervroege DOT nl>
    * @author Wouter Vroege <wouter AT woutervroege DOT nl>
*/

(function($) {
    "use strict";

    /*
  glocal vars
  */
    var fileReader = new FileReader(),
        canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");


    $.fn.fileprocessor = function(options) {

        var defaults = {
            maxImageSize: 9999,
            onItem: function(item, numProcessed, total) {
                return item;
            },
            onEnd: function(data) {
                return data;
            }
        };

        var options = $.extend({}, defaults, options);

        var inputElement = this;
        $(inputElement).on("change", function(e) {
            var images = e.target.files;
            imageProcessor.start(images);
        });

        /*
    process a batch of images, synchrounously
    */

        var imageProcessor = {
            data: [],
            processedData: [],
            numItems: 0,
            numProcessed: 0,
            start: function(images) {
                imageProcessor.data = images;
                imageProcessor.numItems = images.length;
                processImage(imageProcessor.data[imageProcessor.numProcessed]);
            },
            add: function(imageData) {
                imageProcessor.numProcessed++;
                imageProcessor.processedData.push(imageData);
                options.onItem(imageData, imageProcessor.numProcessed, imageProcessor.numItems);
                if (imageProcessor.numProcessed === imageProcessor.numItems) {
                    options.onEnd(imageProcessor.processedData);
                }
                processImage(imageProcessor.data[imageProcessor.numProcessed]);
            }
        }

            function processImage(el) {
                fileReader.onload = function(e) {
                    var item = {
                        name: el.name,
                        type: el.type,
                        data: e.target.result
                    }
                    if(!item.type.match(/^image\/[a-z]+$/i)) {
                        return imageProcessor.add(item);
                    }
                    resizeImage(e.target.result, el.type, function(resizedImage) {
                        item.data = resizedImage;
                        return imageProcessor.add(item);
                    })
                }
                fileReader.readAsDataURL(el);
            }

            function resizeImage(data, mimeType, callback) {
                var tempImage = new Image();
                tempImage.onload = function() {
                    var newSize = getResizedImageSize(tempImage.width, tempImage.height);
                    tempImage.width = newSize.width;
                    tempImage.height = newSize.height;

                    canvas.width = newSize.width;
                    canvas.height = newSize.height;
                    ctx.drawImage(tempImage, 0, 0, tempImage.width, tempImage.height);

                    callback(canvas.toDataURL(mimeType));
                }
                tempImage.src = data;
            }

            function getResizedImageSize(imageWidth, imageHeight) {
                var newSize = {
                    width: imageWidth,
                    height: imageHeight
                }
                return getFixedImageSize(options.maxImageSize, imageWidth, imageHeight);
            }

            function getFixedImageSize(maxImageSize, imageWidth, imageHeight) {

                var size = {
                    width: imageWidth,
                    height: imageHeight
                }

                if (maxImageSize >= imageWidth && maxImageSize >= imageHeight) {
                    return size;
                } else if (imageHeight > imageWidth) {
                    var scalefactor = maxImageSize / imageHeight;
                    size.height = maxImageSize;
                    size.width = imageWidth * scalefactor;
                    return size;
                } else {
                    var scalefactor = maxImageSize / imageWidth;
                    size.height = imageHeight * scalefactor;
                    size.width = maxImageSize;
                    return size;
                }

            }

    }

}(jQuery));
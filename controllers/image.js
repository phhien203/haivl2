var sidebar = require('../helpers/sidebar'),
    Models = require('../models'),
    fs = require('fs'),
    formidable = require('formidable'),
    path = require('path'),
    util = require('util');

module.exports = {
	index: function(req, res) {
		var viewModel = {
		    image: {},
		    comments: []
		};

		Models.Image.findOne({ filename: { $regex: req.params.image_id } },
		    function(err, image) {
		        if (err) { throw err; }

		        if (image) {
		            image.views = image.views + 1;
					viewModel.image = image;
					image.save();

					Models.Comment.find({ image_id: image._id}, {}, { sort: { 'timestamp': 1 }}, 
					    function(err, comments) {
					        if (err) { throw err; }

					        viewModel.comments = comments;

					        sidebar(viewModel, function(err, viewModel) {
					            res.render('image', viewModel);
					        });
					    }
					);
		        } else {
		            res.redirect('/');
		        } 
		    });
	},
	create: function(req, res) {
		var saveImage = function() {
		    var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
		        imgUrl = '';
		    for(var i=0; i < 6; i+=1) {
		        imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
		    }
		    /* Start new code: */
		    // search for an image with the same filename by performing a find:
		    Models.Image.find({ filename: imgUrl }, function(err, images) {
		        if (images.length > 0) {
		            // if a matching image was found, try again (start over):
		            saveImage();
		        } else {
		    /* end new code:   */
		    // ********************************************************************
		    		var form = new formidable.IncomingForm();
		    		form.uploadDir = './public/upload/temp';
		    		form.parse(req, function(err, fields, files) {
		    			var tempPath = files.file.path,
		    				fileName = files.file.name,
		    				tempName = tempPath + '/' + fileName,
			                ext = path.extname(files.file.name).toLowerCase(),
			                targetPath = path.resolve('./public/upload/' + imgUrl + ext);
			            console.log(util.inspect({fields: fields, files: files}));
			            console.log('tempPath ' + tempPath);
			            console.log('targetPath ' + targetPath);

			            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
			                fs.rename(tempPath, targetPath, function(err) {
			                    if (err) { throw err; }

			                    /* Start new code: */
			                  // create a new Image model, populate its details:
			                    var newImg = new Models.Image({
			                       title: fields.title,
			                       filename: imgUrl + ext,
			                       description: fields.description
			                   });
			                   // and save the new Image
			                   newImg.save(function(err, image) {
			                       res.redirect('/images/' + image.uniqueId);
			                   });
			                   /* End new code:   */
			                });
			            } else {
			                fs.unlink(tempPath, function () {
			                    if (err) { throw err; }

			                    res.json(500, {error: 'Only image files are allowed.'});
			                });
			            }
		    		});
		    // ********************************************************************
		            
		/* Start new code: */
		        }
		    });
		/* End new code:   */
		};

		saveImage();
	},
	like: function(req, res) {
		// res.send('The image:like POST controller');
		res.json({likes: 1});
	},
	comment: function(req, res) {
		res.send('The image:comment POST controller');
	}
};
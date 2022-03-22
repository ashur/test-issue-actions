const markdownIt = require("markdown-it");
const yaml = require("js-yaml");
const {Feed} = require("feed");

module.exports = (eleventyConfig) =>
{
	/* Markdown */
	let mdOptions = {
		html: true,
		typographer: true,
	};

	let md = markdownIt( mdOptions )
		.disable( "code" );

	eleventyConfig.setLibrary( "md", md );

	/* Custom Data */
	eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));

	/* Filters */
	eleventyConfig.addFilter("feed", (posts, format) => {
		const feed = new Feed({
		  title: "Feed Title",
		  description: "This is my personal feed!",
		  id: "http://example.com/",
		  link: "http://example.com/",
		  language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
		  image: "http://example.com/image.png",
		  favicon: "http://example.com/favicon.ico",
		  copyright: "All rights reserved 2013, John Doe",
		  updated: new Date(2013, 6, 14), // optional, default = today
		  generator: "awesome", // optional, default = 'Feed for Node.js'
		  feedLinks: {
		    json: "https://example.com/json",
		    atom: "https://example.com/atom"
		  },
		  author: {
		    name: "John Doe",
		    email: "johndoe@example.com",
		    link: "https://example.com/johndoe"
		  }
		});

		posts.forEach(post => {
			console.log( {post} )
			feed.addItem({
			    title: post.title,
			    id: post.url,
			    link: post.url,
			    description: md.render(post.description),
			    content: md.render(post.description),
			    date: new Date(
				    post['createdAt'] ||
				    post['timestamp'] ||
				    Date.now()
			    ),
			});
		});

		return feed[format]();
	});

	eleventyConfig.addFilter("flatten", require('./src/_eleventy/filters/flatten'));
	eleventyConfig.addFilter("markdown", string => md.render(string));
	eleventyConfig.addFilter("values", object => Object.values(object));

	/* Plugins */

	return {
		dir: {
			input: "src",
			output: "dist",
		},

		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",

		templateFormats: ["md", "njk"],
	};
};

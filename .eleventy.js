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
	eleventyConfig.addFilter("feed", (posts, metadata, format) => {
		const feed = new Feed({
		  title: metadata.title,
		  description: metadata.description,
		  id: metadata.url,
		  link: metadata.url,
		  language: "en",
		  feedLinks: {
		    json: `${metadata.url}/feed.json`,
		    rss: `${metadata.url}/feed.xml`,
		  },
		  author: metadata.author
		});

		posts.forEach(post => {
			const feedItem = {
				title: post.title,
				id: post.url,
				link: post.url,
				description: md.render(post.description),
				content: md.render(post.description),
				date: new Date(post['createdAt']),
			};

			if (post._metadata?.images) {
				feedItem.image = post._metadata.images[0].src;
			}

			feed.addItem(feedItem);
		});

		return feed[format]();
	});

	eleventyConfig.addFilter("flatten", require('./src/_eleventy/filters/flatten'));
	eleventyConfig.addFilter("markdown", string => md.render(string));
	eleventyConfig.addFilter("split", (string, separator) => string.split(separator) );
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

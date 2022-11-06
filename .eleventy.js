const fs = require('fs')
const yaml = require('js-yaml')
const externalLinks = require('eleventy-plugin-external-links')
const htmlMinifier = require('html-minifier')
const beautify = require('js-beautify')

const OUTPUT_DIRECTORY = 'public'

module.exports = function (eleventyConfig) {
  // Ignore
  eleventyConfig.ignores.add('_pages/_')

  // Extensions
  eleventyConfig.addDataExtension('yaml', (contents) => yaml.load(contents))
  eleventyConfig.addPlugin(externalLinks)

  // Copy files
  eleventyConfig.addPassthroughCopy({
    './node_modules/alpinejs/dist/cdn.min.js': 'alpine.js',
    './static': 'static',
  })

  // Conditional eleventyConfigs
  const isProduction = process.env.NODE_ENV === 'production'
  if (isProduction) {
    eleventyConfig.addTransform('minifyHTML', minifyHTML)
  } else {
    eleventyConfig.addTransform('prettifyHTML', prettifyHTML)
    eleventyConfig.setBrowserSyncConfig(support404())
  }

  return {
    // Directory structure
    dir: {
      input: '_pages',
      output: OUTPUT_DIRECTORY,
      layouts: '../_layouts',
      includes: '../_includes',
      data: '../_data'
    },
  }
}

// Transformers
function minifyHTML(content, outputPath) {
  if (outputPath && outputPath.endsWith('.html')) {
    const options = {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    }
    return htmlMinifier.minify(content, options)
  }
  return content
}

function prettifyHTML(content, outputPath) {
  if (outputPath && outputPath.endsWith('.html')) {
    return beautify.html(content, { 'indent_size': '2' })
  }
  return content
}

// eleventyConfigs
function support404() {
  return {
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware('*', (req, res) => {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' })
          res.write(fs.readFileSync(`${OUTPUT_DIRECTORY}/404.html`))
          res.end()
        })
      },
    },
  }
}
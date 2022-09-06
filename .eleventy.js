const fs = require('fs')
const yaml = require('js-yaml')
const htmlMinifier = require('html-minifier')
const htmlPrettify = require('html-prettify')
const { DateTime } = require('luxon')
const externalLinks = require('eleventy-plugin-external-links')

const OUTPUT_DIRECTORY = '_site'

// Filters
function readableDate(dateObj) {
  return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLL yyyy')
}

// Transformers
function minifyHTML(content, outputPath) {
  // https://www.11ty.dev/docs/config/#transforms-example-minify-html-output
  if (outputPath && outputPath.endsWith('.html')) {
    let minified = htmlMinifier.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    })
    return minified
  }
  return content
}

function prettifyHTML(content, outputPath) {
  if (outputPath && outputPath.endsWith('.html')) {
    return htmlPrettify(content)
  }
  return content
}

// Configs
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

module.exports = function (eleventyConfig) {
  // Copy
  eleventyConfig.addPassthroughCopy({
    'node_modules/alpinejs/dist/cdn.min.js': 'main.js',
    'netlifycms.yaml': 'admin/config.yml',
    '_static': 'static'
  })

  // Plugins
  eleventyConfig.addDataExtension('yaml', contents => yaml.load(contents))
  eleventyConfig.addPlugin(externalLinks)

  // Filters
  eleventyConfig.addFilter('readableDate', readableDate)

  // Conditional configs
  const isProduction = process.env.NODE_ENV === 'production'
  if (isProduction) {
    eleventyConfig.addTransform('minifyHTML', minifyHTML)
  } else {
    eleventyConfig.addTransform('prettifyHTML', prettifyHTML)
    eleventyConfig.setBrowserSyncConfig(support404())
  }

  return {
    dir: {
      input: '_pages',
      output: OUTPUT_DIRECTORY,
      includes: '../_includes',
      data: '../_data',
    },
  }
}

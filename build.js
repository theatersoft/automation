'use strict'
require('shelljs/make')
process.on('unhandledRejection', e => console.log(e))

const
    pkg = require('./package.json'),
    name = pkg.name.startsWith('@theatersoft') && pkg.name.slice(13),
    DIST = process.env.DIST === 'true',
    DEBUG = process.env.DEBUG === 'true',
    deleteKey = (o, k) => (k && delete o[k], o),
    dependencies = deleteKey(pkg.dist.dependencies, DIST && 'remote-redux-devtools'),
    path = require('path'),
    fs = require('fs'),
    writeJson = (file, json) => fs.writeFileSync(file, JSON.stringify(json, null, '  '), 'utf-8'),
    copyright = `/*\n${fs.readFileSync('COPYRIGHT', 'utf8')}\n */`,
    {rollup} = require('rollup'),
    babel = require('rollup-plugin-babel'),
    ignore = require('rollup-plugin-ignore'),
    nodeResolve = require('rollup-plugin-node-resolve'),
    sourcemaps = require('rollup-plugin-sourcemaps'),
    postcss = require('rollup-plugin-postcss'),
    stylus = require('stylus'),
    postcssModules = require('postcss-modules'),
    cssExportMap = {},
    alias = require('rollup-plugin-alias'),
    strip = !DEBUG && require('rollup-plugin-strip')({
        functions: DIST ? ['log', 'debug', 'composeWithDevTools'] : ['debug']
    })

const targets = {
    node () {
        console.log('target node')
        exec('mkdir -p dist')
        return rollup({
            input: 'src/index.js',
            external: [
                'child_process',
                'redux',
                'redux-thunk',
                !DIST && 'remote-redux-devtools',
                ...Object.keys(dependencies)
            ],
            plugins: [
                babel({
                    babelrc: false,
                    comments: !DIST,
                    minified: DIST,
                    //presets: [babili],
                    plugins: [
                        require("babel-plugin-transform-class-properties"),
                        [require("babel-plugin-transform-object-rest-spread"), {useBuiltIns: true}]
                    ].concat(DIST ? [
                        require("babel-plugin-minify-constant-folding"),
                        //require("babel-plugin-minify-dead-code-elimination"), // FAIL NodePath has been removed so is read-only
                        require("babel-plugin-minify-flip-comparisons"),
                        require("babel-plugin-minify-guarded-expressions"),
                        require("babel-plugin-minify-infinity"),
                        require("babel-plugin-minify-mangle-names"),
                        require("babel-plugin-minify-replace"),
                        //FAIL require("babel-plugin-minify-simplify"),
                        require("babel-plugin-minify-type-constructors"),
                        require("babel-plugin-transform-member-expression-literals"),
                        require("babel-plugin-transform-merge-sibling-variables"),
                        require("babel-plugin-transform-minify-booleans"),
                        require("babel-plugin-transform-property-literals"),
                        require("babel-plugin-transform-simplify-comparison-operators"),
                        require("babel-plugin-transform-undefined-to-void")
                    ] : [])
                }),
                DIST && ignore(['remote-redux-devtools']),
                strip,
                alias({'@theatersoft/automation': 'src/index.js'}),
                nodeResolve({jsnext: true})
            ]
        })
            .then(bundle => {
                bundle.write({
                    file: `dist/${name}.js`,
                    format: 'cjs',
                    name,
                    banner: copyright,
                    sourcemap: DIST ? false : 'inline'
                })
                    .then(() => console.log(`wrote dist/${name}.js`))
            })
    },

    async client () {
        console.log('target client')
        const bundle = await rollup({
            input: 'src/components/index.js',
            external: [
                'preact',
                'preact-redux',
                '@theatersoft/bus',
                '@theatersoft/components'
            ],
            plugins: [
                postcss({
                    preprocessor: (content, id) => new Promise((resolve, reject) => {
                        const renderer = stylus(content, {
                            filename: id,
                            sourcemap: {inline: true},
                            compress: false,
                            paths: ['styl']
                        })
                        renderer.render((err, code) =>
                            err ? reject(err) : resolve({code, map: renderer.sourcemap})
                        )
                    }),
                    extensions: ['.styl'],
                    sourceMap: true, // true, "inline" or false
                    extract: `dist/${name}.css`,
                    plugins: [
                        postcssModules({
                            getJSON (id, exportTokens) {cssExportMap[id] = exportTokens},
                            generateScopedName: '_[name]_[local]', // _[hash:2]
                        })
                    ],
                    getExport: id => cssExportMap[id]
                }),
                nodeResolve({
                    module: true
                }),
                sourcemaps(),
                babel({
                    babelrc: false,
                    comments: !DIST,
                    minified: DIST,
                    //presets: [babili],
                    plugins: [
                        [require("babel-plugin-transform-object-rest-spread"), {useBuiltIns: true}],
                        require("babel-plugin-transform-class-properties"),
                        [require("babel-plugin-transform-react-jsx"), {pragma: 'h'}],
                        //require("babel-plugin-transform-decorators-legacy"),
                        // babel-plugin-transform-decorators-legacy provided an invalid property of "default"
                        require("babel-plugin-external-helpers"),
                    ].concat(DIST ? [
                        require("babel-plugin-minify-constant-folding"),
                        //FAIL require("babel-plugin-minify-dead-code-elimination"), // es build unusable
                        require("babel-plugin-minify-flip-comparisons"),
                        require("babel-plugin-minify-guarded-expressions"),
                        require("babel-plugin-minify-infinity"),
                        require("babel-plugin-minify-mangle-names"),
                        require("babel-plugin-minify-replace"),
                        //FAIL require("babel-plugin-minify-simplify"),
                        require("babel-plugin-minify-type-constructors"),
                        require("babel-plugin-transform-member-expression-literals"),
                        require("babel-plugin-transform-merge-sibling-variables"),
                        require("babel-plugin-transform-minify-booleans"),
                        require("babel-plugin-transform-property-literals"),
                        require("babel-plugin-transform-simplify-comparison-operators"),
                        require("babel-plugin-transform-undefined-to-void")
                    ] : [])
                })
            ]
        })
        await bundle.write({
            file: `dist/${name}.es.js`,
            format: 'es',
            name,
            banner: copyright,
            sourcemap: !DIST // bus sourcemap must be file to passthrough rollup consumers
        })
        console.log('... target client')
    },

    package () {
        writeJson('dist/package.json', Object.assign({}, pkg, {private: !DIST, dist: undefined}, pkg.dist))
        exec('cp LICENSE README.md start.js dist')
    },

    publish () {
        console.log('target publish')
        exec('npm publish --access=public dist')
    },

    watch () {
        require('chokidar').watch(['src', '*.js'])
            .on('change', async path => {
                console.log(path)
                await targets.node()
                await targets.client()
                await targets.package()
            })
    },

    async all () {
        targets.node()
        await targets.client()
        targets.package()
    }
}

Object.assign(target, targets)
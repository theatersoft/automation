'use strict'
require('shelljs/make')

const
    pkg = require('./package.json'),
    name = pkg.name.startsWith('@theatersoft') && pkg.name.slice(13),
    DIST = process.env.DIST === 'true',
    path = require('path'),
    fs = require('fs'),
    copyright = `/*\n${fs.readFileSync('COPYRIGHT', 'utf8')}\n */`,
    rollup = require('rollup'),
    babel = require('rollup-plugin-babel'),
    ignore = require('rollup-plugin-ignore'),
    nodeResolve = require('rollup-plugin-node-resolve'),
    strip = require('rollup-plugin-strip'),
    pluginAsync = require('rollup-plugin-async')

const targets = {
    node () {
        console.log('target node')
        exec('mkdir -p dist')
        return rollup.rollup({
                entry: 'src/index.js',
                external: [
                    'os',
                    'child_process',
                    'redux',
                    'redux-thunk',
                    !DIST && 'remote-redux-devtools',
                    ...Object.keys(pkg.dependencies)
                ],
                plugins: [
                    babel({
                        babelrc: false,
                        comments: !DIST,
                        minified: DIST,
                        //presets: [babili],
                        plugins: [
                            //require("babel-plugin-transform-class-properties"),
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
                    DIST && pluginAsync(), // workaround Unexpected token in rollup-plugin-strip
                    DIST && strip({functions: ['composeWithDevTools']}),
                    nodeResolve({
                        jsnext: true
                    })
                ]
            })
            .then(bundle => {
                bundle.write({
                        dest: `dist/${name}.js`,
                        format: 'cjs',
                        moduleName: name,
                        banner: copyright,
                        sourceMap: DIST ? false : 'inline'
                    })
                    .then(() => console.log(`wrote dist/${name}.js`))
            })
    },

    package () {
        const p = Object.assign({}, pkg, {
            private: !DIST,
            devDependencies: undefined,
            distScripts: undefined,
            scripts: pkg.distScripts
        })
        fs.writeFileSync('dist/package.json', JSON.stringify(p, null, '  '), 'utf-8')
        exec('sed -i "s|dist/||g" dist/package.json ')
        exec('cp LICENSE README.md start.js dist')
    },

    publish () {
        console.log('target publish')
        exec('npm publish --access=public dist')
    },

    watch () {
        require('chokidar').watch([`${__dirname}/src`, `${__dirname}/*.js`])
            .on('change', path => {
                console.log(path)
                targets.node().then(() => {
                    targets.package()
                    //exec('npm run start')
                })
            })
    },

    all () {
        target.node()
        target.package()
    }
}

Object.assign(target, targets)
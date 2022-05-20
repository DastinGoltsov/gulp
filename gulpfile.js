const { src, dest, watch, parallel, series } = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoPrefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const pug = require('gulp-pug');
const gcmq = require('gulp-group-css-media-queries');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const webp = require('gulp-webp');
const svg2png = require('gulp-svg2png');
const webpHTML = require('gulp-webp-html');
const webpcss = require("gulp-webpcss");
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const iconfont = require('gulp-iconfont');
const iconfontcss = require('gulp-iconfont-css');
const fontName = 'somename';
const jshint = require('gulp-jshint');
const rename = require("gulp-rename");
const legacyIeCssLint = require('gulp-legacy-ie-css-lint');




//////////////////////////////////////////////////////
function iconFontCss() {
	return src(['app/images/icon/*.svg'])
		.pipe(iconfontcss({
			fontName: fontName,
			path: 'app/css/templates/_icons.scss',
			targetPath: '../scss/_icons.scss',
			fontPath: '../fonts/icons/',
		}))
		.pipe(iconfont({
			fontName: fontName,
			normalize: true,
			fontHeight: 1000,
			formats: ['svg', 'ttf', 'eot', 'woff', 'woff2']
		}))
		.pipe(dest('app/fonts/icons/'));
}


//////////////////////////////////////////
function Fonts() {
	return src('app/fonts/*')
		.pipe(fonter({
			subset: [66, 67, 68, 69, 70, 71],
			formats: ['woff', 'ttf', 'otf', 'eot']
		}))
		.pipe(dest('app/fonts/build'))
		.pipe(ttf2woff2())
		.pipe(dest('app/fonts/build'))
}


/////////////////////////////////////////
function html() {
	return src('app/pages_pug/**/*.pug')
		.pipe(sourcemaps.init())
		.pipe(pug({
			pretty: true
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('app'))
		.pipe(browserSync.stream())
}


function webpHtml() {
	return src('app/**/*.html')
		.pipe(webpHTML())
		.pipe(dest('app'))
}

///////////////////////////////////////////////


function styles() {
	return src('app/scss/main.scss')
		.pipe(sourcemaps.init())

		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(autoPrefixer({
			overrideBrowserslist: ['last 10 version'],
			grid: true
		}))
		.pipe(legacyIeCssLint({
			throw: true,
			log: true
		}))
		.pipe(concat('style.min.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function StyleWebp() {
	return src('app/css/style.min.css')
		.pipe(gcmq())
		.pipe(webpcss({}))
		.pipe(dest('app/css'))
}

function concatCss() {
	return src('app/css/**/*.min.css')
		.pipe(concat('style.min.css'))
		.pipe(dest('app/css'))
}

/////////////////////////////////////////////

function watching() {
	watch(['app/scss/**/*.scss'], styles);
	watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
	watch('app/*html').on('change', browserSync.reload);
	watch(['app/pages_pug/**/*.pug'], html)
}

function browsersync() {
	browserSync.init({
		server: {
			baseDir: './app'
		}
	});
}

function scripts() {
	return src([
		'node_modules/jquery/dist/jquery.js',
		'app/js/main.js'
	])
		.pipe(sourcemaps.init())
		.pipe(jshint())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('app/js'))
		.pipe(browserSync.stream());
}

function scriptBuild() {
	return src('app/js/main.js')
		.pipe(jshint())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(dest('app/js'))
}

function build() {
	return src([
		'app/css/style.min.css',
		'app/fonts/build/**/*',
		'app/js/main.min.js',
		'app/**/*.html',
	], { base: 'app' })

		.pipe(dest('dist'))
}

function cleanDist() {
	return del('dist')
}

function cleanApp() {
	return del(['app/fonts/build', 'app/images/all_images'])
}

function images() {
	return src('app/images/**/*')
		.pipe(webp({
			quality: 70
		}))
		.pipe(imagemin(
			[
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 75, progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
				imagemin.svgo({
					plugins: [
						{ removeViewBox: true },
						{ cleanupIDs: false }
					]
				})
			]))
		.pipe(dest('dist/images'))
}

function IconToConvert() {
	return src('app/images/icon/*.svg')
		.pipe(svg2png())
		.pipe(dest('app/images/all_images/icon_convert/'));
}


////////////////////////////////////////////////////////
function workCleanProcces() {
	return src('app/fonts/scss/*.scss')
		.pipe(rename('_icons.scss'))
		.pipe(dest('app/scss/'))

}

function workCleanProccesDell() {
	return del('app/fonts/scss', '!app/fonts/')
}

function workCleanProccesDell2() {
	return del('app/fonts/icons', '!app/fonts/')
}
///////////////////////////////////////////////////////////
function MaketDef() {
	return del('app/fonts/*', '!app/fonts/')
}
function MaketDef2() {
	return del('app/images/icon/*', '!app/fonts/')
}




exports.workCleanProccesDell = workCleanProccesDell;
exports.workCleanProcces = workCleanProcces;
exports.scriptBuild = scriptBuild;
exports.iconFontCss = iconFontCss;
exports.cleanApp = cleanApp;
exports.Fonts = Fonts;
exports.webpHtml = webpHtml;
exports.concatCss = concatCss;
exports.IconToConvert = IconToConvert;
exports.styles = styles;
exports.StyleWebp = StyleWebp;
exports.watching = watching;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;
exports.html = html;

//! wkp - workCleanProcces1
// Очистить рабочее пространство после конвертации иконок 
exports.wkp = series(workCleanProcces, workCleanProccesDell, workCleanProccesDell2);
//! MaketDefault
// Сбросить макет к дефолтным настройкам
exports.Md = series(MaketDef, MaketDef2);
// !production
// Сбилдить готовый проект
exports.build = series(cleanDist, Fonts, webpHtml, scriptBuild, IconToConvert, images, StyleWebp, concatCss, build, cleanApp);
// !development
// Стандартный запуск галп
exports.default = parallel(html, styles, scripts, browsersync, watching);
// Сгенерировать иконочный шрифт
exports.icon = parallel(iconFontCss)


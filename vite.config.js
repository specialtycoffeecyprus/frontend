import {resolve} from 'path'
import {defineConfig, loadEnv} from 'vite';
import replace from '@rollup/plugin-replace';
import {createHtmlPlugin} from "vite-plugin-html";
import ViteRadar from 'vite-plugin-radar'
import htmlPurge from 'vite-plugin-html-purgecss'
import minify from "vite-plugin-minify";

export default mode => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    return defineConfig({
        build: {
            reportCompressedSize: false,
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html'),
                    about: resolve(__dirname, 'about/index.html')
                }
            }
        },
        esbuild: {
            legalComments: "none"
        },
        plugins: [
            replace({
                __SENTRY_DEBUG__: false,
                __SENTRY_TRACING__: false,
                preventAssignment: true,
            }),
            htmlPurge(['marker-label']),
            createHtmlPlugin({minify: false}),
            minify({
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                decodeEntities: true,
                keepClosingSlash: false,
                noNewlinesBeforeTagClose: true,
                processConditionalComments: false,
                removeComments: true,
                removeEmptyAttributes: true,
                removeEmptyElements: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
            }),
            ViteRadar({
                analytics: {
                    id: process.env.VITE_GOOGLE_ANALYTICS_ID,
                },
            }),
        ],
    });
}

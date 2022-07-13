import {resolve} from 'path'
import {defineConfig, loadEnv} from 'vite';
import ViteRadar from 'vite-plugin-radar'

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
        plugins: [
            ViteRadar({
                analytics: {
                    id: process.env.VITE_GOOGLE_ANALYTICS_ID,
                },
            }),
        ],
    });
}

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
                enableDev: true,
                analytics: {
                    id: process.env.VITE_GA_ID,
                    config: {
                        debug_mode: true,
                    }
                },
            }),
        ],
    });
}

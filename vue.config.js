// vue.config.js
module.exports = {
    chainWebpack: config => {
        config.resolve.alias.set("vue$", "vue/dist/vue.esm.js");
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://10.10.10.22:9600',
                ws: true,
                changeOrigin: true
            },
        }
    }
};

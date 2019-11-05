module.exports = { // css 兼容配置 
    plugins: [
        require('autoprefixer')({
            overrideBrowserslist: ['defaults', 'not ie < 9', 'last 2 versions', '> 1%', 'iOS 7', 'last 3 iOS versions'],
        }),
    ],
};

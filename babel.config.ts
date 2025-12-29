module.exports = function (api: any) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: ['react-native-reanimated/plugin'],
        env: {
            production: {
                plugins: ['react-native-paper/babel', 'react-native-reanimated/plugin'],
            },
        },
    };
};
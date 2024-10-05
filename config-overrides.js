const webpack = require('webpack'); // Import webpack

module.exports = function override(config) {
    // Adding fallbacks for Node.js modules to browser-compatible versions
    config.resolve.fallback = {
      process: require.resolve("process/browser"), // Ensure process is defined
      url: require.resolve("url/"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      zlib: require.resolve("browserify-zlib"),
      stream: require.resolve("stream-browserify"),
      os: require.resolve("os-browserify/browser"),
      util: require.resolve("util/"),
      crypto: require.resolve("crypto-browserify"),
      assert: require.resolve("assert/"),
      vm: require.resolve("vm-browserify"),
      dns: false,
      fs: false,
      net: false,
    };

    // Include ProvidePlugin to define process globally
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser', // Makes process available in your application
            Buffer: ['buffer', 'Buffer'], // Add Buffer as well if you need it
        })
    );

    // Include the DefinePlugin to define process.env
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env.CUSTOM_VARIABLE': JSON.stringify(process.env.CUSTOM_VARIABLE), // Replace with actual variables you need
            // Add other necessary environment variables here
        })
    );

    return config;
};
